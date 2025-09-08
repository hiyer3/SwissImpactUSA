// SIMapControl.jsx — Single fetch + heatmap overlay + consulate choropleth
// + map-filter-aware popup tabs + tab persistence rules + back-to-map reset
// + legend switching + robust popup-close reset to current map filter
// + US companies aggregation for EconomicImpact

import { h } from "preact";
import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "preact/hooks";
import inlineSVG from "./inlineSVG";
import ScienceAcademia from "./map-popup-template/ScienceAcademia";
import ApprenticeshipCompanies from "./map-popup-template/apprenticeshipCompanies";
import IndustryClusters from "./map-popup-template/industryClusters";
import SwissRepresentations from "./map-popup-template/SwissRepresentations";
import SwissImpact from "./map-popup-template/SwissImpact";
import EconomicImpact from "./map-popup-template/EconomicImpact";

const FILTERS = {
  SEE_ALL: "si-popup-filter-see-all",
  SCIENCE: "si-popup-filter-science-academia",
  ECON: "si-popup-filter-economic-impact",
  APPRENTICESHIP: "si-popup-filter-apprenticeship-companies",
  INDUSTRY: "si-popup-filter-industry-clusters",
  SWISS_REPRESENTATIVES: "si-popup-filter-swiss-representatives",
};

const DATA_TYPE_TO_FILTER = {
  scienceAcademia: FILTERS.SCIENCE,
  apprenticeshipCompanies: FILTERS.APPRENTICESHIP,
  industryClusters: FILTERS.INDUSTRY,
  swissRepresentations: FILTERS.SWISS_REPRESENTATIVES,
  swissImpact: FILTERS.ECON,
  economicImpact: FILTERS.ECON,
};

// Map (left-panel) filter id -> Popup tab id
const MAP_FILTER_TO_POPUP = {
  "si-filter-see-all": FILTERS.SEE_ALL,
  "si-filter-economic-impact": FILTERS.ECON,
  "si-filter-science-academia": FILTERS.SCIENCE,
  "si-filter-apprenticeship-companies": FILTERS.APPRENTICESHIP,
  "si-filter-industry-clusters": FILTERS.INDUSTRY,
  "si-filter-swiss-representatives": FILTERS.SWISS_REPRESENTATIVES,
};

const normId = (id) =>
  String(id || "")
    .toLowerCase()
    .replace(/\s+/g, "-");

// ---------- Consulate-based fill colors (by state slug) ----------
const CONSULATE_STATE_COLOR = (() => {
  const group = (names, color) =>
    names.reduce((acc, n) => {
      acc[n.toLowerCase().replace(/\s+/g, "-")] = color;
      return acc;
    }, {});

  return {
    // Consulate General of Switzerland in Chicago - #FFE8E8
    ...group(
      [
        "Washington",
        "Montana",
        "Oregon",
        "Idaho",
        "Wyoming",
        "California",
        "Nevada",
        "Utah",
        "Colorado",
        "Arizona",
        "New Mexico",
        "Hawaii",
        "Alaska",
      ],
      "#FFE8E8"
    ),

    // Consulate General of Switzerland in San Francisco - #FFD9D9
    ...group(
      [
        "North Dakota",
        "South Dakota",
        "Minnesota",
        "Nebraska",
        "Kansas",
        "Missouri",
        "Illinois",
        "Indiana",
        "Iowa",
        "Wisconsin",
        "Michigan",
      ],
      "#FFD9D9"
    ),

    // Consulate General of Switzerland in Atlanta - #FFBEBE
    ...group(
      [
        "Texas",
        "Oklahoma",
        "Arkansas",
        "Tennessee",
        "North Carolina",
        "South Carolina",
        "Louisiana",
        "Mississippi",
        "Alabama",
        "Georgia",
        "Florida",
      ],
      "#FFBEBE"
    ),

    // Consulate General of Switzerland in New York - #FF4E4E
    ...group(
      [
        "Puerto Rico",
        "Kentucky",
        "Virginia",
        "West Virginia",
        "Delaware",
        "Maryland",
        "District of Columbia",
      ],
      "#FF4E4E"
    ),

    // Embassy of Switzerland in the United States of America - #FF7E7E
    ...group(
      [
        "Ohio",
        "Pennsylvania",
        "New Jersey",
        "Connecticut",
        "Massachusetts",
        "Rhode Island",
        "New York",
        "New Hampshire",
        "Vermont",
        "Maine",
      ],
      "#FF7E7E"
    ),
  };
})();

// ---------- derive specific slices from ACF ----------
const deriveFromAcf = (acf, dataType) => {
  if (!acf) return [];
  switch (dataType) {
    case "scienceAcademia":
      return acf["science_&_academia_fields"] || [];

    case "apprenticeshipCompanies":
      return acf.apprenticeship_companies || [];

    case "industryClusters":
      return acf.industry_clusters || [];

    case "swissRepresentations": {
      const reps = acf.swiss_representations || [];
      const statecodeDefault = acf.state_short_code || "";
      return reps.length
        ? reps.map((rep) => ({
            ...rep,
            statecode: rep?.statecode ?? statecodeDefault,
          }))
        : [];
    }

    case "swissImpact": {
      const econ = acf.economic_impact || {};
      const sciArr = Array.isArray(acf["science_&_academia_fields"])
        ? acf["science_&_academia_fields"]
        : [];
      const apprArr = Array.isArray(acf.apprenticeship_companies)
        ? acf.apprenticeship_companies
        : [];
      const clustersArr = Array.isArray(acf.industry_clusters)
        ? acf.industry_clusters
        : [];
      const repsArr = Array.isArray(acf.swiss_representations)
        ? acf.swiss_representations
        : [];

      let firstClusterLabel = null;
      if (clustersArr.length) {
        const c0 = clustersArr[0];
        if (typeof c0 === "string") firstClusterLabel = c0;
        else if (c0 && typeof c0 === "object") {
          firstClusterLabel =
            c0.cluster_1 ||
            c0.name ||
            c0.cluster_name ||
            c0.title ||
            c0.label ||
            c0.value ||
            c0.post_title ||
            null;
        }
      }

      const payload = {
        ...(econ.esbfa_total_jobs > 0 && { total_jobs: econ.esbfa_total_jobs }),
        ...(econ.resident_of_swiss_descent > 0 && {
          swiss_residents: econ.resident_of_swiss_descent,
        }),
        ...(sciArr.length > 0 && { science_academia: sciArr.length }),
        ...(apprArr.length > 0 && { apprenticeship_companies: apprArr.length }),
        ...(firstClusterLabel && { industry_clusters: [firstClusterLabel] }),
        ...(repsArr.length > 0 && { swiss_representations: repsArr }),
        statecode: acf.state_short_code || "",
      };

      return Object.keys(payload).length > 1 ? [payload] : [];
    }

    case "economicImpact": {
      const econ = acf.economic_impact;
      if (!econ) return [];
      const hasMeaningful =
        (econ.esbfa_total_jobs || 0) > 0 ||
        (econ.resident_of_swiss_descent || 0) > 0 ||
        Object.keys(econ).some((k) => econ[k] && econ[k] !== 0);

      if (!hasMeaningful) return [];
      console.log("econ", acf.economic_impact);
      // ✅ Attach companies list if present on ACF (for U.S. aggregated case)
      const payload = { ...econ };
      if (Array.isArray(acf.economic_impact.companies_located_in_state)) {
        payload.companies_located_in_state =
          acf.economic_impact.companies_located_in_state;
      }
      return [payload];
    }

    default:
      return [];
  }
};

const computeActiveTabsForAcf = (acf) => {
  const result = {
    [FILTERS.SEE_ALL]: true,
    [FILTERS.ECON]: false,
    [FILTERS.SCIENCE]: false,
    [FILTERS.APPRENTICESHIP]: false,
    [FILTERS.INDUSTRY]: false,
    [FILTERS.SWISS_REPRESENTATIVES]: false,
  };
  if (!acf) return result;
  Object.entries(DATA_TYPE_TO_FILTER).forEach(([dataType, filterId]) => {
    const d = deriveFromAcf(acf, dataType);
    if (Array.isArray(d) && d.length > 0) result[filterId] = true;
  });
  return result;
};

const pickSelectedFilter = (preferredTab, lastTab, activeTabs) => {
  if (preferredTab && activeTabs[preferredTab]) return preferredTab;
  if (lastTab && activeTabs[lastTab]) return lastTab;
  const PRIORITY = [
    FILTERS.SEE_ALL,
    FILTERS.ECON,
    FILTERS.SCIENCE,
    FILTERS.APPRENTICESHIP,
    FILTERS.INDUSTRY,
    FILTERS.SWISS_REPRESENTATIVES,
  ];
  return PRIORITY.find((id) => activeTabs[id]) || FILTERS.SEE_ALL;
};

export default function SIMapControl() {
  const [singleStateData, setSingleStateData] = useState({
    name: "",
    description: "",
    stateId: "",
    selectedFilter: FILTERS.SEE_ALL,
    activeTabs: {
      "si-popup-filter-see-all": true,
      "si-popup-filter-economic-impact": true,
      "si-popup-filter-science-academia": true,
      "si-popup-filter-apprenticeship-companies": true,
      "si-popup-filter-industry-clusters": true,
      "si-popup-filter-swiss-representatives": true,
    },
    isLoadingTabs: false,
  });

  // ---- global cache (slug -> acf) and loading/errors
  const rawStateCacheRef = useRef({});
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const [prefetchError, setPrefetchError] = useState(null);
  const [, forceUpdate] = useState(0);

  // ---- persist last popup tab
  const lastSelectedFilterRef = useRef(FILTERS.SEE_ALL);
  useEffect(() => {
    lastSelectedFilterRef.current = singleStateData.selectedFilter;
  }, [singleStateData.selectedFilter]);

  // ---- map filter + popup state
  const currentMapFilterRef = useRef("si-filter-see-all");
  const popupOpenRef = useRef(false);
  const userTabOverrideRef = useRef(null);

  // ---- heatmap data
  const [heatmapArray, setHeatmapArray] = useState([]);
  const heatmapByStateRef = useRef({});
  const [heatmapStats, setHeatmapStats] = useState({
    maxApprenticeship: 0,
    maxScience: 0,
    maxTotal: 0,
  });

  // ===== Legend switcher =====
  const updateLegendsForFilter = (filterId) => {
    const sciAppr = document.getElementById(
      "science-academia-apprenticeship-legends"
    );
    const swiss = document.getElementById("swiss-representation-legends");
    if (!sciAppr || !swiss) return;

    const show = (el) => {
      el.classList.remove("hidden");
      el.classList.add("grid");
    };
    const hide = (el) => {
      el.classList.add("hidden");
      el.classList.remove("grid");
    };

    if (
      filterId === "si-filter-science-academia" ||
      filterId === "si-filter-apprenticeship-companies"
    ) {
      show(sciAppr);
      hide(swiss);
    } else if (filterId === "si-filter-swiss-representatives") {
      hide(sciAppr);
      show(swiss);
    } else {
      hide(sciAppr);
      hide(swiss);
    }
  };

  // ===== Heatmap painters =====
  const paintHeatmap = useCallback(
    (svgRoot, category /* "science" | "apprenticeship" */) => {
      if (!svgRoot) return;
      const byState = heatmapByStateRef.current || {};
      const max =
        category === "science"
          ? heatmapStats.maxScience || 1
          : heatmapStats.maxApprenticeship || 1;

      svgRoot.querySelectorAll(".single-state").forEach((group) => {
        const first = group.firstElementChild;
        const slug =
          first?.classList?.[0]?.toLowerCase()?.replace(/\s+/g, "-") || "";

        const row = byState[slug];
        const value = row
          ? category === "science"
            ? row.scienceAcademia
            : row.apprenticeshipCompanies
          : 0;

        const t = Math.max(0, Math.min(1, value / max)); // 0..1
        const fill = `rgba(255, 92, 92, ${0.12 + 0.88 * t})`;

        group.querySelectorAll("path, polygon, rect").forEach((shape) => {
          if (!shape.dataset.origFill) {
            const orig = shape.getAttribute("fill");
            shape.dataset.origFill = orig !== null ? orig : "none";
          }
          shape.setAttribute("fill", fill);
        });
      });
    },
    [heatmapStats.maxApprenticeship, heatmapStats.maxScience]
  );

  const clearHeatmap = useCallback((svgRoot) => {
    if (!svgRoot) return;
    svgRoot
      .querySelectorAll(
        ".single-state path, .single-state polygon, .single-state rect"
      )
      .forEach((shape) => {
        const orig = shape.dataset.origFill;
        if (orig !== undefined) {
          if (orig === "none") shape.removeAttribute("fill");
          else shape.setAttribute("fill", orig);
        }
      });
  }, []);

  // ===== Consulate painter (Swiss Representatives choropleth) =====
  const paintConsulateMap = useCallback((svgRoot) => {
    if (!svgRoot) return;

    svgRoot.querySelectorAll(".single-state").forEach((group) => {
      const first = group.firstElementChild;
      const slug =
        first?.classList?.[0]?.toLowerCase()?.replace(/\s+/g, "-") || "";

      const fill = CONSULATE_STATE_COLOR[slug] || null;

      group.querySelectorAll("path, polygon, rect").forEach((shape) => {
        if (!shape.dataset.origFill) {
          const orig = shape.getAttribute("fill");
          shape.dataset.origFill = orig !== null ? orig : "none";
        }

        if (fill) {
          shape.setAttribute("fill", fill);
        } else {
          const orig = shape.dataset.origFill;
          if (orig !== undefined) {
            if (orig === "none") shape.removeAttribute("fill");
            else shape.setAttribute("fill", orig);
          }
        }
      });
    });
  }, []);

  // -------- one API call on mount + build US aggregate --------
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const url = "/wp-json/wp/v2/mapstate?per_page=100&_fields=slug,acf";
        const r = await fetch(url, { signal: ac.signal });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const arr = await r.json();

        // Build base cache
        const cache = {};
        for (const post of arr) {
          cache[normId(post.slug)] = post?.acf || {};
        }

        // ---- Aggregate into united-states (except economic_impact) ----
        const nonUsEntries = Object.entries(cache).filter(
          ([slug]) => slug !== "united-states"
        );

        const aggSci = [];
        const aggAppr = [];
        // (You can replace the hardcoded clusters with your unique-union later if needed)
        const aggClusters = [
          {
            cluster_1: "Mining",
            cluster_2: "Real Estate and Rental and Leasing",
            cluster_3: "Manufacturing",
            cluster_4: "Transportation and Warehousing",
            cluster_5: "Retail Trade",
            cluster_6: "Healthcare and Social Assistance",
            cluster_7: "Construction",
          },
        ];
        const aggReps = [];
        const aggCompanies = []; // ✅ collect all companies across states

        nonUsEntries.forEach(([slug, acf]) => {
          if (Array.isArray(acf?.["science_&_academia_fields"])) {
            aggSci.push(...acf["science_&_academia_fields"]);
          }
          if (Array.isArray(acf?.apprenticeship_companies)) {
            aggAppr.push(...acf.apprenticeship_companies);
          }
          if (Array.isArray(acf?.swiss_representations)) {
            const sc = acf?.state_short_code || "";
            aggReps.push(
              ...acf.swiss_representations.map((rep) => ({
                ...rep,
                statecode: rep?.statecode ?? sc,
              }))
            );
          }
          // ✅ aggregate companies list (keep original objects; optionally tag statecode)
          if (Array.isArray(acf?.economic_impact.companies_located_in_state)) {
            const sc = acf?.state_short_code || "";
            aggCompanies.push(
              ...acf.economic_impact.companies_located_in_state.map((c) => ({
                ...c,
                statecode: c?.statecode ?? sc,
              }))
            );
          }
        });

        // Merge into existing US ACF, preserving economic_impact if present
        const usACF = {
          ...(cache["united-states"] || {}),
          ["science_&_academia_fields"]: aggSci,
          apprenticeship_companies: aggAppr,
          industry_clusters: aggClusters,
          swiss_representations: aggReps,
          // keep existing economic_impact as-is
        };
        usACF.economic_impact.companies_located_in_state = aggCompanies;

        console.log(usACF);
        cache["united-states"] = usACF;

        rawStateCacheRef.current = cache;

        // ---- build heatmap array (skip united-states) ----
        const rows = Object.entries(cache)
          .filter(([slug]) => slug !== "united-states")
          .map(([slug, acf]) => {
            const apprenticeship = Array.isArray(acf?.apprenticeship_companies)
              ? acf.apprenticeship_companies.length
              : 0;
            const science = Array.isArray(acf?.["science_&_academia_fields"])
              ? acf["science_&_academia_fields"].length
              : 0;
            return {
              stateId: slug,
              statecode: acf?.state_short_code || "",
              apprenticeshipCompanies: apprenticeship,
              scienceAcademia: science,
              total: apprenticeship + science,
            };
          });

        setHeatmapArray(rows);
        const byState = {};
        rows.forEach((r) => (byState[r.stateId] = r));
        heatmapByStateRef.current = byState;

        const maxApprenticeship = rows.reduce(
          (m, r) => Math.max(m, r.apprenticeshipCompanies),
          0
        );
        const maxScience = rows.reduce(
          (m, r) => Math.max(m, r.scienceAcademia),
          0
        );
        const maxTotal = rows.reduce((m, r) => Math.max(m, r.total), 0);
        setHeatmapStats({ maxApprenticeship, maxScience, maxTotal });

        // Ready
        setIsAllLoaded(true);
        forceUpdate((n) => n + 1);
      } catch (e) {
        if (e.name !== "AbortError") {
          setPrefetchError(String(e?.message || e));
          setIsAllLoaded(true);
        }
      }
    })();
    return () => ac.abort();
  }, []);

  // -------- recompute active tabs when state changes or data loaded --------
  const updateActiveTabs = useCallback((stateId, preferredFilter) => {
    if (!stateId) return;

    if (stateId === "united-states") {
      const allTrue = {
        [FILTERS.SEE_ALL]: true,
        [FILTERS.ECON]: true,
        [FILTERS.SCIENCE]: true,
        [FILTERS.APPRENTICESHIP]: true,
        [FILTERS.INDUSTRY]: true,
        [FILTERS.SWISS_REPRESENTATIVES]: true,
      };
      const nextSel = pickSelectedFilter(
        preferredFilter,
        lastSelectedFilterRef.current,
        allTrue
      );
      setSingleStateData((prev) => ({
        ...prev,
        activeTabs: allTrue,
        selectedFilter: nextSel,
      }));
      return;
    }

    const acf = rawStateCacheRef.current[normId(stateId)];
    const newActiveTabs = computeActiveTabsForAcf(acf);
    const nextSel = pickSelectedFilter(
      preferredFilter,
      lastSelectedFilterRef.current,
      newActiveTabs
    );

    setSingleStateData((prev) => ({
      ...prev,
      activeTabs: newActiveTabs,
      selectedFilter: nextSel,
    }));
  }, []);

  useEffect(() => {
    if (!singleStateData.stateId || !isAllLoaded) return;
    updateActiveTabs(singleStateData.stateId, lastSelectedFilterRef.current);
    setSingleStateData((prev) => ({ ...prev, isLoadingTabs: false }));
  }, [singleStateData.stateId, isAllLoaded, updateActiveTabs]);

  // -------- provide preloadedData to child components --------
  const getCurrentData = useCallback(
    (dataType) => {
      if (!singleStateData.stateId) {
        return { data: [], loading: false, error: null };
      }
      if (!isAllLoaded) {
        return { data: [], loading: true, error: null };
      }
      const acf = rawStateCacheRef.current[normId(singleStateData.stateId)];
      if (!acf) {
        return { data: [], loading: false, error: prefetchError || null };
      }
      const derived = deriveFromAcf(acf, dataType);
      return { data: derived, loading: false, error: null };
    },
    [singleStateData.stateId, isAllLoaded, prefetchError]
  );

  const memoizedComponents = useMemo(() => {
    const commonProps = {
      name: singleStateData.name,
      stateId: singleStateData.stateId,
    };
    return {
      swissImpact: (
        <SwissImpact
          {...commonProps}
          preloadedData={getCurrentData("swissImpact")}
        />
      ),
      scienceAcademia: (
        <ScienceAcademia
          {...commonProps}
          preloadedData={getCurrentData("scienceAcademia")}
        />
      ),
      apprenticeshipCompanies: (
        <ApprenticeshipCompanies
          {...commonProps}
          preloadedData={getCurrentData("apprenticeshipCompanies")}
        />
      ),
      industryClusters: (
        <IndustryClusters
          {...commonProps}
          preloadedData={getCurrentData("industryClusters")}
        />
      ),
      swissRepresentations: (
        <SwissRepresentations
          {...commonProps}
          preloadedData={getCurrentData("swissRepresentations")}
        />
      ),
      economicImpact: (
        <EconomicImpact
          {...commonProps}
          preloadedData={getCurrentData("economicImpact")}
        />
      ),
    };
  }, [singleStateData.name, singleStateData.stateId, getCurrentData]);

  const selectedComponent = useMemo(() => {
    switch (singleStateData.selectedFilter) {
      case FILTERS.SEE_ALL:
        return memoizedComponents.swissImpact;
      case FILTERS.ECON:
        return memoizedComponents.economicImpact;
      case FILTERS.SCIENCE:
        return memoizedComponents.scienceAcademia;
      case FILTERS.APPRENTICESHIP:
        return memoizedComponents.apprenticeshipCompanies;
      case FILTERS.INDUSTRY:
        return memoizedComponents.industryClusters;
      case FILTERS.SWISS_REPRESENTATIVES:
        return memoizedComponents.swissRepresentations;
      default:
        return null;
    }
  }, [singleStateData.selectedFilter, memoizedComponents]);

  // ===== Reset helper to map filter tab & overlay =====
  const resetToMapFilterTab = useCallback(() => {
    const fallbackActive =
      document.querySelector("#si-map-filter .single-filter-item.active")?.id ||
      "si-filter-see-all";
    const mapFilterId = currentMapFilterRef.current || fallbackActive;
    const mappedTab = MAP_FILTER_TO_POPUP[mapFilterId] || FILTERS.SEE_ALL;

    setSingleStateData((prev) => ({ ...prev, selectedFilter: mappedTab }));
    lastSelectedFilterRef.current = mappedTab;
    userTabOverrideRef.current = null;
    popupOpenRef.current = false;

    updateLegendsForFilter(mapFilterId);

    const svgRoot =
      document.querySelector("#si-map svg") ||
      document.querySelector("#si-map");
    if (!svgRoot) return;

    if (mapFilterId === "si-filter-science-academia") {
      clearHeatmap(svgRoot);
      paintHeatmap(svgRoot, "science");
    } else if (mapFilterId === "si-filter-apprenticeship-companies") {
      clearHeatmap(svgRoot);
      paintHeatmap(svgRoot, "apprenticeship");
    } else if (mapFilterId === "si-filter-swiss-representatives") {
      clearHeatmap(svgRoot);
      paintConsulateMap(svgRoot);
    } else {
      clearHeatmap(svgRoot);
    }
  }, [clearHeatmap, paintHeatmap, paintConsulateMap]);

  // -------- wiring: SVG, map filters, state list, popup tabs --------
  useEffect(() => {
    let svgEl;
    const ac = new AbortController();
    const { signal } = ac;

    const holder = document.getElementById("si-map");

    inlineSVG(
      "/wp-content/themes/swissimpact_vite/assets/img/si-number-map/map.svg?ver=1.61",
      holder
    ).then((el) => {
      svgEl = el;
      if (!svgEl) return;

      const holderEl = document.getElementById("si-map");

      // Ensure the container can anchor an absolutely-positioned child
      if (holderEl && getComputedStyle(holderEl).position === "static") {
        holderEl.style.position = "relative";
      }

      // Create tooltip once
      const tip = document.createElement("div");
      tip.className = "si-map-tooltip";
      Object.assign(tip.style, {
        position: "absolute",
        pointerEvents: "none",
        zIndex: "50",
        transform: "translate(-50%, -120%)",
        background: "rgba(17,17,17,0.92)",
        color: "#fff",
        padding: "6px 10px",
        borderRadius: "6px",
        fontSize: "12px",
        lineHeight: "1",
        whiteSpace: "nowrap",
        boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
        opacity: "0",
        transition: "opacity 120ms ease",
      });
      holderEl.appendChild(tip);

      const showTip = (text, clientX, clientY) => {
        tip.textContent = text;
        const rect = holderEl.getBoundingClientRect();
        const x = clientX - rect.left + 14;
        const y = clientY - rect.top - 14;
        tip.style.left = `${x}px`;
        tip.style.top = `${y}px`;
        tip.style.opacity = "1";
      };
      const hideTip = () => (tip.style.opacity = "0");

      const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;

      const onMove = (e) => {
        if (isTouch) return;
        const stateGroup =
          e.target.closest(".single-state") || e.target.closest(".singe-state");
        if (!stateGroup) {
          hideTip();
          return;
        }
        const first = stateGroup.firstElementChild;
        const stateName =
          first?.getAttribute?.("data-name") ||
          first?.classList?.[0] ||
          "State";
        showTip(stateName, e.clientX, e.clientY);
      };

      const onLeave = () => hideTip();

      svgEl.addEventListener("mousemove", onMove, { signal });
      svgEl.addEventListener("mouseleave", onLeave, { signal });

      // Optional: avoid default browser <title> popups overlapping your tooltip
      svgEl.querySelectorAll("title").forEach((n) => n.remove());

      const openState = (name, id) => {
        const mapFilterId = currentMapFilterRef.current;
        const preferredFromMap =
          MAP_FILTER_TO_POPUP[mapFilterId] || FILTERS.SEE_ALL;

        // RULES (respect user tab while popup open)
        let requestedTab;
        if (popupOpenRef.current && userTabOverrideRef.current) {
          requestedTab = userTabOverrideRef.current;
        } else {
          requestedTab =
            mapFilterId === "si-filter-see-all"
              ? lastSelectedFilterRef.current
              : preferredFromMap;
        }

        const activeTabs =
          normId(id) === "united-states"
            ? {
                [FILTERS.SEE_ALL]: true,
                [FILTERS.ECON]: true,
                [FILTERS.SCIENCE]: true,
                [FILTERS.APPRENTICESHIP]: true,
                [FILTERS.INDUSTRY]: true,
                [FILTERS.SWISS_REPRESENTATIVES]: true,
              }
            : computeActiveTabsForAcf(rawStateCacheRef.current[normId(id)]);

        const nextSelected = pickSelectedFilter(
          requestedTab,
          lastSelectedFilterRef.current,
          activeTabs
        );

        setSingleStateData((prev) => ({
          ...prev,
          name,
          stateId: normId(id),
          isLoadingTabs: true,
          selectedFilter: nextSelected,
        }));

        lastSelectedFilterRef.current = nextSelected;
        popupOpenRef.current = true;

        document.querySelector(".data-popup")?.classList.remove("hidden");
      };

      const onSvgClick = (e) => {
        const stateGroup =
          e.target.closest(".single-state") || e.target.closest(".singe-state");
        if (!stateGroup) return;

        const firstChild = stateGroup.firstElementChild;
        const stateName = firstChild?.getAttribute("data-name");
        const stateId = firstChild?.classList[0];
        if (stateId && stateName) {
          openState(stateName, stateId);
        }
      };

      svgEl.addEventListener("click", onSvgClick, { signal });

      // Map filter buttons
      const mapFilters = document.querySelectorAll(
        "#si-map-filter .single-filter-item"
      );
      mapFilters.forEach((item) => {
        item.addEventListener(
          "click",
          (e) => {
            const filterId = e.currentTarget.getAttribute("id");
            currentMapFilterRef.current = filterId;

            updateLegendsForFilter(filterId);

            // marker visibility
            for (const child of svgEl.querySelectorAll("[class*='si-']")) {
              if (filterId === "si-filter-see-all") {
                child.style.opacity = "1";
                continue;
              }
              const imageFilterId = child.classList.contains(filterId);
              child.style.opacity = imageFilterId ? "1" : "0";
            }
            mapFilters.forEach((f) => f.classList.remove("active"));
            e.currentTarget.classList.add("active");

            const legend = document.getElementById("KEY");
            if (
              filterId !== "si-filter-see-all" &&
              filterId !== "si-filter-swiss-representatives"
            ) {
              legend?.classList.add("hidden");
            } else {
              legend?.classList.remove("hidden");
            }

            // overlays
            if (filterId === "si-filter-science-academia") {
              clearHeatmap(svgEl);
              paintHeatmap(svgEl, "science");
            } else if (filterId === "si-filter-apprenticeship-companies") {
              clearHeatmap(svgEl);
              paintHeatmap(svgEl, "apprenticeship");
            } else if (filterId === "si-filter-swiss-representatives") {
              clearHeatmap(svgEl);
              paintConsulateMap(svgEl);
            } else {
              clearHeatmap(svgEl);
            }
          },
          { signal }
        );
      });
    });

    // State list build & interactions
    const states = [
      "United States",
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
    ];

    const stateList = document.getElementById("state-list");
    if (stateList) {
      stateList.innerHTML = "";
      for (const state of states) {
        const li = document.createElement("li");
        li.className = "state-item";
        const a = document.createElement("a");
        a.href = `#${state.toLowerCase().replace(/\s+/g, "-")}`;
        a.textContent = state;
        a.className = "state-link";
        li.appendChild(a);
        stateList.appendChild(li);
      }
    }

    const btn = document.querySelector(".si-map-wrapper .state-selector");
    const listC = document.querySelector(
      ".si-map-wrapper .state-list-container"
    );
    const mapWrapper = document.querySelector(".si-map-wrapper");
    const popupWidthWrapper = document.querySelector(
      ".data-popup .popup-width-wrapper"
    );
    const popupFilterWrapper = document.querySelector(
      ".data-popup .data-popup-filter-wrapper"
    );
    const onToggle = () => {
      btn?.classList.toggle("active");
      listC?.classList.toggle("active");
      mapWrapper?.classList.toggle("active");
      popupWidthWrapper?.classList.toggle("active");
      popupFilterWrapper?.classList.toggle("active");
    };
    btn?.addEventListener("click", onToggle, { signal });

    const search = document.querySelector("#state-search");
    const onSearch = (e) => {
      const q = String(e.target.value)
        .replace(/[^a-z]/gi, "")
        .toLowerCase();
      document.querySelectorAll(".state-item").forEach((item) => {
        const nm = (item.textContent || "").toLowerCase();
        item.style.display = nm.includes(q) ? "block" : "none";
      });
    };
    search?.addEventListener("input", onSearch, { signal });

    const onStateClick = (e) => {
      e.preventDefault();
      const a = e.currentTarget;
      const id = a.getAttribute("href")?.substring(1) || "";
      const name = a.textContent || "";

      const mapFilterId = currentMapFilterRef.current;
      const preferredFromMap =
        MAP_FILTER_TO_POPUP[mapFilterId] || FILTERS.SEE_ALL;

      let requestedTab;
      if (popupOpenRef.current && userTabOverrideRef.current) {
        requestedTab = userTabOverrideRef.current;
      } else {
        requestedTab =
          mapFilterId === "si-filter-see-all"
            ? lastSelectedFilterRef.current
            : preferredFromMap;
      }

      const activeTabs =
        normId(id) === "united-states"
          ? {
              [FILTERS.SEE_ALL]: true,
              [FILTERS.ECON]: true,
              [FILTERS.SCIENCE]: true,
              [FILTERS.APPRENTICESHIP]: true,
              [FILTERS.INDUSTRY]: true,
              [FILTERS.SWISS_REPRESENTATIVES]: true,
            }
          : computeActiveTabsForAcf(rawStateCacheRef.current[normId(id)]);

      const nextSelected = pickSelectedFilter(
        requestedTab,
        lastSelectedFilterRef.current,
        activeTabs
      );

      setSingleStateData((prev) => ({
        ...prev,
        stateId: normId(id),
        name,
        isLoadingTabs: true,
        selectedFilter: nextSelected,
      }));
      lastSelectedFilterRef.current = nextSelected;

      document.querySelector(".data-popup")?.classList.remove("hidden");
      document.querySelector(".state-selector")?.classList.remove("active");
      document
        .querySelector(".state-list-container")
        ?.classList.remove("active");
      mapWrapper?.classList.remove("active");
      popupWidthWrapper?.classList.remove("active");
      popupFilterWrapper?.classList.remove("active");

      popupOpenRef.current = true;
    };

    const links = document.querySelectorAll(".state-link");
    links.forEach((a) => a.addEventListener("click", onStateClick, { signal }));

    const popupFilterRoot = document.querySelector("#si-map-popup-filter");
    const onFilter = (e) => {
      const el = e.target.closest?.(".single-popup-filter");
      if (!el) return;
      const id = el.getAttribute("id");
      if (!id) return;

      userTabOverrideRef.current = id;
      lastSelectedFilterRef.current = id;

      setSingleStateData((prev) => ({ ...prev, selectedFilter: id }));
    };
    popupFilterRoot?.addEventListener("click", onFilter, { signal });

    return () => ac.abort();
  }, [paintHeatmap, clearHeatmap, paintConsulateMap]);

  // If data loads after user selected an overlay filter, reapply + fix legends
  useEffect(() => {
    if (!isAllLoaded) return;
    const svgRoot =
      document.querySelector("#si-map svg") ||
      document.querySelector("#si-map");
    if (!svgRoot) return;

    const filterId = currentMapFilterRef.current;
    updateLegendsForFilter(filterId);

    if (filterId === "si-filter-science-academia") {
      clearHeatmap(svgRoot);
      paintHeatmap(svgRoot, "science");
    } else if (filterId === "si-filter-apprenticeship-companies") {
      clearHeatmap(svgRoot);
      paintHeatmap(svgRoot, "apprenticeship");
    } else if (filterId === "si-filter-swiss-representatives") {
      clearHeatmap(svgRoot);
      paintConsulateMap(svgRoot);
    } else {
      clearHeatmap(svgRoot);
    }
  }, [isAllLoaded, paintHeatmap, clearHeatmap, paintConsulateMap]);

  // back-to-map
  useEffect(() => {
    const onBackToMap = () => {
      resetToMapFilterTab();
    };
    window.addEventListener("si:back-to-map", onBackToMap);
    return () => window.removeEventListener("si:back-to-map", onBackToMap);
  }, [resetToMapFilterTab]);

  // Observe popup visibility → reset tab to map filter when closed
  useEffect(() => {
    const popup = document.querySelector(".data-popup");
    if (!popup) return;

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "class") {
          const isHidden = popup.classList.contains("hidden");
          if (isHidden) {
            resetToMapFilterTab();
          }
        }
      }
    });

    observer.observe(popup, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [resetToMapFilterTab]);

  // reflect active class on popup pills
  useEffect(() => {
    const items = document.querySelectorAll(
      "#si-map-popup-filter .single-popup-filter"
    );
    items.forEach((i) =>
      i.classList.toggle("active", i.id === singleStateData.selectedFilter)
    );
  }, [singleStateData.selectedFilter]);

  // toggle tab availability + loading indicator
  useEffect(() => {
    const items = document.querySelectorAll(
      "#si-map-popup-filter .single-popup-filter"
    );
    items.forEach((i) =>
      i.classList.toggle("tab-active", !!singleStateData.activeTabs[i.id])
    );

    const loadingIndicator = document.querySelector(".tabs-loading-indicator");
    if (loadingIndicator) {
      loadingIndicator.style.display = singleStateData.isLoadingTabs
        ? "block"
        : "none";
    }
  }, [singleStateData.activeTabs, singleStateData.isLoadingTabs]);

  return (
    <div>
      {prefetchError && (
        <div
          style={{
            padding: "10px",
            textAlign: "center",
            fontSize: "14px",
            color: "#b91c1c",
            backgroundColor: "#fee2e2",
            borderRadius: "4px",
            margin: "10px 0",
          }}
        >
          Error loading state data: {prefetchError}
        </div>
      )}

      {singleStateData.isLoadingTabs && (
        <div
          className="tabs-loading-indicator"
          style={{
            padding: "10px",
            textAlign: "center",
            fontSize: "14px",
            color: "#666",
            backgroundColor: "#f9f9f9",
            borderRadius: "4px",
            margin: "10px 0",
          }}
        >
          Loading state data and tabs...
        </div>
      )}

      {selectedComponent}
    </div>
  );
}

// SIMapControl.jsx - Fixed infinite re-render issue
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

const isMobile = () => {
  return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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

  // Use ref to store cache - prevents re-renders when cache updates
  const dataCacheRef = useRef({
    scienceAcademia: {},
    apprenticeshipCompanies: {},
    industryClusters: {},
    swissRepresentations: {},
    swissImpact: {},
    economicImpact: {},
  });

  // Force component updates when needed
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const hasValidData = (data) => Array.isArray(data) && data.length > 0;

  // ---- Fetch & cache - NO dependencies to prevent infinite loops
  const fetchStateData = useCallback(async (stateId, dataType) => {
    const cache = dataCacheRef.current;

    if (cache[dataType][stateId]) {
      return cache[dataType][stateId];
    }

    // Set loading state
    cache[dataType] = {
      ...cache[dataType],
      [stateId]: { data: [], loading: true, error: null },
    };

    // Trigger update for loading state
    setUpdateTrigger((prev) => prev + 1);

    try {
      const response = await fetch(`/wp-json/wp/v2/mapstate?slug=${stateId}`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const acf = data?.[0]?.acf || {};
      let extractedData = [];

      switch (dataType) {
        case "scienceAcademia":
          extractedData = acf["science_&_academia_fields"] || [];
          break;

        case "apprenticeshipCompanies":
          extractedData = acf.apprenticeship_companies || [];
          break;

        case "industryClusters":
          extractedData = acf.industry_clusters || [];
          break;

        case "swissRepresentations":
          extractedData = acf.swiss_representations || [];
          if (extractedData.length > 0) {
            const statecode = acf.state_short_code || "";
            extractedData = extractedData.map((rep) => ({
              ...rep,
              statecode,
            }));
          }
          break;

        case "swissImpact": {
          console.log("swissImpact acf:", acf);
          const counts = {
            total_jobs: acf.economic_impact?.esbfa_total_jobs || 0,
            resident: acf.economic_impact?.resident_of_swiss_descent || 0,
            science_academia:
              (acf["science_&_academia_fields"] || []).length || 0,
            apprenticeship_companies:
              (acf.apprenticeship_companies || []).length || 0,
            industry_clusters: (acf.industry_clusters || []).length || 0,
          };

          const reps = Array.isArray(acf.swiss_representations)
            ? acf.swiss_representations
            : [];

          const payload = {
            ...(counts.total_jobs > 0 && { total_jobs: counts.total_jobs }),
            ...(counts.resident > 0 && { swiss_residents: counts.resident }),
            ...(counts.science_academia > 0 && {
              science_academia: counts.science_academia,
            }),
            ...(counts.apprenticeship_companies > 0 && {
              apprenticeship_companies: counts.apprenticeship_companies,
            }),
            ...(counts.industry_clusters > 0 && {
              industry_clusters: counts.industry_clusters,
            }),
            ...(reps.length > 0 && { swiss_representations: reps }),
            statecode: acf.state_short_code || "",
          };

          extractedData = Object.keys(payload).length > 1 ? [payload] : [];
          break;
        }

        case "economicImpact": {
          const economicData = acf.economic_impact;
          // Only include if economic_impact exists and has meaningful data
          if (
            economicData &&
            (economicData.esbfa_total_jobs > 0 ||
              economicData.resident_of_swiss_descent > 0 ||
              Object.keys(economicData).some(
                (key) => economicData[key] && economicData[key] !== 0
              ))
          ) {
            extractedData = [economicData];
          } else {
            extractedData = [];
          }
          break;
        }

        default:
          extractedData = [];
      }

      console.log(
        "EconomicImpact extractedData:",
        dataType,
        extractedData,
        Array.isArray(extractedData)
      );

      const result = {
        data: Array.isArray(extractedData) ? extractedData : [],
        loading: false,
        error: null,
      };

      cache[dataType][stateId] = result;
      setUpdateTrigger((prev) => prev + 1);

      return result;
    } catch (error) {
      const errorResult = { data: [], loading: false, error: error.message };
      cache[dataType][stateId] = errorResult;
      setUpdateTrigger((prev) => prev + 1);
      return errorResult;
    }
  }, []); // NO dependencies

  // ---- Tabs activation - NO dependencies to prevent infinite loops
  const updateActiveTabs = useCallback((stateId) => {
    const cache = dataCacheRef.current;
    const newActiveTabs = {
      [FILTERS.SEE_ALL]: true,
      [FILTERS.ECON]: false,
      [FILTERS.SCIENCE]: false,
      [FILTERS.APPRENTICESHIP]: false,
      [FILTERS.INDUSTRY]: false,
      [FILTERS.SWISS_REPRESENTATIVES]: false,
    };

    Object.entries(DATA_TYPE_TO_FILTER).forEach(([dataType, filterId]) => {
      const cached = cache[dataType][stateId];
      if (
        cached &&
        !cached.loading &&
        !cached.error &&
        hasValidData(cached.data)
      ) {
        newActiveTabs[filterId] = newActiveTabs[filterId] || true;
      }
    });

    setSingleStateData((prev) => ({ ...prev, activeTabs: newActiveTabs }));
  }, []); // NO dependencies

  // ---- Prefetch all data types for the selected state
  useEffect(() => {
    if (!singleStateData.stateId) return;

    setSingleStateData((prev) => ({ ...prev, isLoadingTabs: true }));

    const dataTypes = [
      "scienceAcademia",
      "apprenticeshipCompanies",
      "industryClusters",
      "swissRepresentations",
      "swissImpact",
      "economicImpact",
    ];

    const cache = dataCacheRef.current;

    Promise.all(
      dataTypes.map((t) =>
        cache[t][singleStateData.stateId]
          ? Promise.resolve(cache[t][singleStateData.stateId])
          : fetchStateData(singleStateData.stateId, t)
      )
    ).then(() => {
      updateActiveTabs(singleStateData.stateId);
      setSingleStateData((prev) => ({ ...prev, isLoadingTabs: false }));
    });
    
  }, [singleStateData.stateId]); // Only depend on stateId

  // Get current data - depends on updateTrigger to force re-renders when cache changes
  const getCurrentData = useCallback(
    (dataType) => {
      const cache = dataCacheRef.current;
      return (
        cache[dataType][singleStateData.stateId] || {
          data: [],
          loading: true,
          error: null,
        }
      );
    },
    [singleStateData.stateId, updateTrigger]
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

  // ---- One-time DOM wiring for SVG + state list + search + popup filters
  useEffect(() => {
    let svgEl;
    const holder = document.getElementById("si-map");

    inlineSVG(
      "/wp-content/themes/swissimpact_vite/assets/img/si-number-map/map.svg",
      holder
    ).then((el) => {
      svgEl = el;
      if (!svgEl) return;

      const onSvgClick = (e) => {
        let stateGroup =
          e.target.closest(".single-state") || e.target.closest(".singe-state");

        if (stateGroup) {
          const firstChild = stateGroup.firstElementChild;
          const stateName = firstChild?.getAttribute("data-name");
          const stateId = firstChild?.classList[0];

          if (stateId && stateName) {
            setSingleStateData((prev) => ({
              ...prev,
              name: stateName,
              stateId: stateId.toLowerCase().replace(/\s+/g, "-"),
              selectedFilter: FILTERS.SEE_ALL,
              isLoadingTabs: true,
            }));

            document.querySelector(".data-popup")?.classList.remove("hidden");
            return;
          }
        }

        const getStateInfo = (element) => {
          if (!element || !element.getAttribute) return null;
          const stateId = element.id || element.getAttribute("data-state");
          const stateName = element.getAttribute("data-name");
          if (stateId && stateId.length > 0) {
            return { stateId, stateName: stateName || stateId };
          }
          return null;
        };

        let stateInfo = getStateInfo(e.target);
        if (stateInfo) {
          setSingleStateData((prev) => ({
            ...prev,
            name: stateInfo.stateName,
            stateId: stateInfo.stateId.toLowerCase().replace(/\s+/g, "-"),
            selectedFilter: FILTERS.SEE_ALL,
            isLoadingTabs: true,
          }));
          document.querySelector(".data-popup")?.classList.remove("hidden");
        }
      };

      svgEl.addEventListener("click", onSvgClick);
      svgEl.__onSvgClick = onSvgClick;

      const mapFilters = document.querySelectorAll(
        "#si-map-filter .single-filter-item"
      );
      mapFilters.forEach((item) => {
        item.addEventListener("click", (e) => {
          const filterId = e.currentTarget.getAttribute("id");
          for (const child of svgEl.querySelectorAll(
            "g:not(#KEY) image, g:not(#KEY) use"
          )) {
            if (filterId === "si-filter-see-all") {
              child.style.opacity = "1";
              continue;
            }
            const imageFilterId = child.classList.contains(filterId);
            child.style.opacity = imageFilterId ? "1" : "0";
          }
          mapFilters.forEach((f) => f.classList.remove("active"));
          e.currentTarget.classList.add("active");
        });
      });
    });

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
    const onToggle = () => {
      btn?.classList.toggle("active");
      listC?.classList.toggle("active");
    };
    btn?.addEventListener("click", onToggle);

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
    search?.addEventListener("input", onSearch);

    const onStateClick = (e) => {
      e.preventDefault();
      const a = e.currentTarget;
      const id = a.getAttribute("href")?.substring(1) || "";
      const name = a.textContent || "";
      setSingleStateData((prev) => ({
        ...prev,
        stateId: id,
        name,
        selectedFilter: FILTERS.SEE_ALL,
        isLoadingTabs: true,
      }));
      document.querySelector(".data-popup")?.classList.remove("hidden");
      document.querySelector(".state-selector")?.classList.remove("active");
      document
        .querySelector(".state-list-container")
        ?.classList.remove("active");
    };

    const links = document.querySelectorAll(".state-link");
    links.forEach((a) => a.addEventListener("click", onStateClick));

    const popupFilterRoot = document.querySelector("#si-map-popup-filter");
    const onFilter = (e) => {
      const el = e.target.closest?.(".single-popup-filter");
      if (!el) return;
      const id = el.getAttribute("id");
      if (!id) return;
      setSingleStateData((prev) => ({ ...prev, selectedFilter: id }));
    };
    popupFilterRoot?.addEventListener("click", onFilter);

    return () => {
      if (svgEl && svgEl.__onSvgClick)
        svgEl.removeEventListener("click", svgEl.__onSvgClick);
      btn?.removeEventListener("click", onToggle);
      search?.removeEventListener("input", onSearch);
      links.forEach((a) => a.removeEventListener("click", onStateClick));
      popupFilterRoot?.removeEventListener("click", onFilter);
    };
  }, []);

  // Reflect active class on selectedFilter change
  useEffect(() => {
    const items = document.querySelectorAll(
      "#si-map-popup-filter .single-popup-filter"
    );
    items.forEach((i) =>
      i.classList.toggle("active", i.id === singleStateData.selectedFilter)
    );
  }, [singleStateData.selectedFilter]);

  // Toggle tab availability + loading indicator
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
    <div className="h-[90%] overflow-y-scroll">
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

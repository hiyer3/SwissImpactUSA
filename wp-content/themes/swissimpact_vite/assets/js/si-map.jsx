// SIMapControl.jsx
import { h } from "preact";
import { useEffect, useState, useMemo, useCallback } from "preact/hooks";
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

// Mapping between data types and filter IDs
const DATA_TYPE_TO_FILTER = {
  scienceAcademia: FILTERS.SCIENCE,
  apprenticeshipCompanies: FILTERS.APPRENTICESHIP,
  industryClusters: FILTERS.INDUSTRY,
  swissRepresentations: FILTERS.SWISS_REPRESENTATIVES,
  swissImpact: FILTERS.ECON, // Note: swissImpact maps to ECON filter
  economicImpact: FILTERS.ECON, // If you want separate economic impact data
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

  // Centralized data cache for all components - ADD economicImpact here
  const [dataCache, setDataCache] = useState({
    scienceAcademia: {},
    apprenticeshipCompanies: {},
    industryClusters: {},
    swissRepresentations: {},
    swissImpact: {},
    economicImpact: {}, // ADD THIS LINE
  });

  // Helper function to check if data array has content
  const hasValidData = (data) => {
    return Array.isArray(data) && data.length > 0;
  };

  // Update active tabs based on available data
  const updateActiveTabs = useCallback(
    (stateId) => {
      const newActiveTabs = {
        "si-popup-filter-see-all": true, // Always show "See All"
        "si-popup-filter-economic-impact": false,
        "si-popup-filter-science-academia": false,
        "si-popup-filter-apprenticeship-companies": false,
        "si-popup-filter-industry-clusters": false,
        "si-popup-filter-swiss-representatives": false,
      };

      // Check each data type and update corresponding tab
      Object.entries(DATA_TYPE_TO_FILTER).forEach(([dataType, filterId]) => {
        const cachedData = dataCache[dataType][stateId];
        if (cachedData && !cachedData.loading && !cachedData.error) {
          newActiveTabs[filterId] = hasValidData(cachedData.data);
        }
      });

      setSingleStateData((prev) => ({
        ...prev,
        activeTabs: newActiveTabs,
      }));
    },
    [dataCache]
  );

  // Generic data fetcher that caches results
  const fetchStateData = useCallback(
    async (stateId, dataType) => {
      // Check if data is already cached
      if (dataCache[dataType][stateId]) {
        return dataCache[dataType][stateId];
      }

      // Set loading state immediately
      setDataCache((prev) => ({
        ...prev,
        [dataType]: {
          ...prev[dataType],
          [stateId]: {
            data: [],
            loading: true,
            error: null,
          },
        },
      }));

      try {
        const response = await fetch(`/wp-json/wp/v2/mapstate?slug=${stateId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        let extractedData;

        // Extract the appropriate data based on type
        switch (dataType) {
          case "scienceAcademia":
            extractedData = data[0]?.acf?.["science_&_academia_fields"] || [];
            break;
          case "apprenticeshipCompanies":
            extractedData = data[0]?.acf?.apprenticeship_companies || [];
            break;
          case "industryClusters":
            extractedData = data[0]?.acf?.industry_clusters || [];
            break;
          case "swissRepresentations":
            extractedData = data[0]?.acf?.swiss_representations || [];
            break;
          case "swissImpact":
          case "economicImpact": // Handle both the same way, or customize as needed
            const acfData = data[0]?.acf || {};

            // Get field lengths/data
            const fieldData = {
              science_academia:
                acfData["science_&_academia_fields"]?.length || 0,
              apprenticeship_companies:
                acfData.apprenticeship_companies?.length || 0,
              industry_clusters: acfData.industry_clusters?.length || 0,
              swiss_representations: acfData.swiss_representations || [],
            };

            // Filter out fields with no data and build the result object
            const resultData = Object.entries(fieldData).reduce(
              (acc, [key, value]) => {
                if (
                  key === "swiss_representations" &&
                  Array.isArray(value) &&
                  value.length > 0
                ) {
                  acc[key] = value; // Store the actual array for swiss_representations
                } else if (typeof value === "number" && value > 0) {
                  acc[key] = value; // Store counts for other fields
                }
                return acc;
              },
              {}
            );

            // Only create extractedData if we have meaningful data
            extractedData =
              Object.keys(resultData).length > 0 ? [resultData] : [];
            break;
          default:
            extractedData = [];
        }

        if (extractedData.length > 0) {
          extractedData.statecode = data[0]?.acf?.state_short_code || "";
        }

        const result = {
          data: Array.isArray(extractedData) ? extractedData : [],
          loading: false,
          error: null,
        };

        // Cache the data
        setDataCache((prev) => ({
          ...prev,
          [dataType]: {
            ...prev[dataType],
            [stateId]: result,
          },
        }));

        return result;
      } catch (error) {
        console.error(
          `Error fetching ${dataType} for ${stateId}:`,
          error.message
        );

        const errorResult = {
          data: [],
          loading: false,
          error: error.message,
        };

        // Cache the error too
        setDataCache((prev) => ({
          ...prev,
          [dataType]: {
            ...prev[dataType],
            [stateId]: errorResult,
          },
        }));

        return errorResult;
      }
    },
    [dataCache]
  );

  // Pre-fetch data when state changes
  useEffect(() => {
    if (singleStateData.stateId) {
      // Set loading state
      setSingleStateData((prev) => ({
        ...prev,
        isLoadingTabs: true,
      }));

      // Pre-fetch all data types for the current state - ADD economicImpact here
      const dataTypes = [
        "scienceAcademia",
        "apprenticeshipCompanies",
        "industryClusters",
        "swissRepresentations",
        "swissImpact",
        "economicImpact", // ADD THIS LINE
      ];

      const fetchPromises = dataTypes.map((dataType) => {
        if (!dataCache[dataType][singleStateData.stateId]) {
          return fetchStateData(singleStateData.stateId, dataType);
        }
        return Promise.resolve(dataCache[dataType][singleStateData.stateId]);
      });

      // Update active tabs after all data is fetched
      Promise.all(fetchPromises).then(() => {
        updateActiveTabs(singleStateData.stateId);
        // Set loading finished
        setSingleStateData((prev) => ({
          ...prev,
          isLoadingTabs: false,
        }));
      });
    }
  }, [singleStateData.stateId, fetchStateData, dataCache, updateActiveTabs]);

  // Update active tabs when data cache changes
  useEffect(() => {
    if (singleStateData.stateId) {
      updateActiveTabs(singleStateData.stateId);
    }
  }, [dataCache, singleStateData.stateId, updateActiveTabs]);

  // Get cached data for current state
  const getCurrentData = useCallback(
    (dataType) => {
      return (
        dataCache[dataType][singleStateData.stateId] || {
          data: [],
          loading: true,
          error: null,
        }
      );
    },
    [dataCache, singleStateData.stateId]
  );

  // Memoize components with preloaded data
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
        <EconomicImpact {...commonProps} preloadedData={getCurrentData("economicImpact")} />
      ),
    };
  }, [singleStateData, getCurrentData]);

  // Memoize the component selection
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

  useEffect(() => {
    let svgEl; // keep a ref so we can clean up
    const holder = document.getElementById("si-map");

    // --- inline SVG + map click handling ---
    inlineSVG(
      "/wp-content/themes/swissimpact_vite/assets/img/si-number-map/map.svg",
      holder
    ).then((el) => {
      svgEl = el;
      if (!svgEl) return;

      // Optimized click handler for your specific SVG structure
      const onSvgClick = (e) => {
        console.log(
          "SVG clicked, target:",
          e.target,
          "tagName:",
          e.target.tagName
        );

        // Strategy 1: Look for parent with single-state or singe-state class (handling typo)
        let stateGroup =
          e.target.closest(".single-state") || e.target.closest(".singe-state");

        if (stateGroup) {
          // Get the state name from the first child element's data-name attribute
          const firstChild = stateGroup.firstElementChild;
          const stateName = firstChild?.getAttribute("data-name");
          const stateId = firstChild?.classList[0]; // first class as ID

          if (stateId && stateName) {
            setSingleStateData((prev) => ({
              ...prev,
              name: stateName,
              stateId: stateId.toLowerCase().replace(/\s+/g, "-"),
              selectedFilter: FILTERS.SEE_ALL,
              isLoadingTabs: true, // Start loading when new state is selected
            }));

            document.querySelector(".data-popup")?.classList.remove("hidden");
            console.log(
              "Successfully identified state:",
              stateId,
              "with name:",
              stateName
            );
            return;
          }
        }

        // Fallback: Check if the clicked element itself has state info
        const getStateInfo = (element) => {
          if (!element || !element.getAttribute) return null;

          const stateId = element.id || element.getAttribute("data-state");
          const stateName = element.getAttribute("data-name");

          if (stateId && stateId.length > 0) {
            return {
              stateId: stateId,
              stateName: stateName || stateId,
            };
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
            isLoadingTabs: true, // Start loading when new state is selected
          }));

          console.log(
            "Successfully identified state via fallback:",
            stateInfo.stateId
          );
          document.querySelector(".data-popup")?.classList.remove("hidden");
        } else {
          console.log("Could not identify state from click");
        }
      };

      svgEl.addEventListener("click", onSvgClick);
      // store for cleanup
      svgEl.__onSvgClick = onSvgClick;

      // add map icon filters
      const mapFilters = document.querySelectorAll(
        "#si-map-filter .single-filter-item"
      );

      mapFilters.forEach((item) => {
        item.addEventListener("click", (e) => {
          const filterId = e.currentTarget.getAttribute("id");

          for (const child of svgEl.querySelectorAll(
            "g:not(#KEY) image, g:not(#KEY) use"
          )) {
            // if see all then show all
            if (filterId === "si-filter-see-all") {
              child.style.opacity = "1";
              continue;
            }
            // otherwise filter by class attribute
            const imageFilterId = child.classList.contains(filterId);
            child.style.opacity = imageFilterId ? "1" : "0";
          }

          // update the active filter
          mapFilters.forEach((f) => f.classList.remove("active"));
          e.currentTarget.classList.add("active");
        });
      });
    });

    // --- build state list (once) ---
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
      stateList.innerHTML = ""; // avoid dupes
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

    // --- state selector toggle ---
    const btn = document.querySelector(".si-map-wrapper .state-selector");
    const listC = document.querySelector(
      ".si-map-wrapper .state-list-container"
    );
    const onToggle = () => {
      btn?.classList.toggle("active");
      listC?.classList.toggle("active");
    };
    btn?.addEventListener("click", onToggle);

    // --- search ---
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

    // --- state links -> update component state ---
    const onStateClick = (e) => {
      e.preventDefault();
      const a = e.currentTarget;
      const id = a.getAttribute("href")?.substring(1) || "";
      const name = a.textContent || "";
      console.log("State clicked:", id, name);
      setSingleStateData((prev) => ({
        ...prev,
        stateId: id,
        name,
        selectedFilter: FILTERS.SEE_ALL, // Reset to "See All" tab
        isLoadingTabs: true, // Start loading when new state is selected
      }));
      document.querySelector(".data-popup")?.classList.remove("hidden");
      document.querySelector(".state-selector")?.classList.remove("active");
      document
        .querySelector(".state-list-container")
        ?.classList.remove("active");
    };
    const links = document.querySelectorAll(".state-link");
    links.forEach((a) => a.addEventListener("click", onStateClick));

    // --- popup filter clicks (delegation) -> update component state ---
    const popupFilterRoot = document.querySelector("#si-map-popup-filter");
    const onFilter = (e) => {
      const el = e.target.closest?.(".single-popup-filter");
      if (!el) return;
      const id = el.getAttribute("id");
      if (!id) return;
      setSingleStateData((prev) => ({ ...prev, selectedFilter: id }));
    };
    popupFilterRoot?.addEventListener("click", onFilter);

    // --- cleanup ---
    return () => {
      if (svgEl && svgEl.__onSvgClick) {
        svgEl.removeEventListener("click", svgEl.__onSvgClick);
      }
      btn?.removeEventListener("click", onToggle);
      search?.removeEventListener("input", onSearch);
      links.forEach((a) => a.removeEventListener("click", onStateClick));
      popupFilterRoot?.removeEventListener("click", onFilter);
    };
  }, []);

  // Reflect "active" class to external buttons whenever selectedFilter changes
  useEffect(() => {
    const items = document.querySelectorAll(
      "#si-map-popup-filter .single-popup-filter"
    );
    items.forEach((i) => {
      i.classList.toggle("active", i.id === singleStateData.selectedFilter);
    });
  }, [singleStateData.selectedFilter]);

  // Update the popup filter buttons based on the current state
  useEffect(() => {
    const items = document.querySelectorAll(
      "#si-map-popup-filter .single-popup-filter"
    );
    items.forEach((i) => {
      i.classList.toggle("tab-active", singleStateData.activeTabs[i.id]);
    });

    // Show/hide loading indicator
    const loadingIndicator = document.querySelector(".tabs-loading-indicator");
    if (loadingIndicator) {
      loadingIndicator.style.display = singleStateData.isLoadingTabs
        ? "block"
        : "none";
    }
  }, [singleStateData.activeTabs, singleStateData.isLoadingTabs]); // Added isLoadingTabs dependency

  return (
    <div>
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
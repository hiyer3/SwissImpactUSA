import { h } from "preact";
import BackToMapButton from "./components/backToMapButton";
import PopupSearchInput from "./components/popupSearchInput";
import DataTable from "./components/dataTable";
import { useEffect, useState, useMemo } from "preact/hooks";

const IndustryClusters = (props) => {
  const [industryClustersData, setIndustryClustersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Props in IndustryClusters:", props.preloadedData);
  useEffect(() => {
    // FIXED: Check if preloadedData exists and use it
    if (props.preloadedData && typeof props.preloadedData === "object") {
      setIndustryClustersData(props.preloadedData.data || []);
      setLoading(props.preloadedData.loading || false);
      setError(props.preloadedData.error || null);
      return;
    }

    // Fallback to original fetch logic if no preloaded data
    const fetchData = async () => {
      try {
        setLoading(true);
        let fetchURL = `/wp-json/wp/v2/mapstate?slug=${props.stateId}`;

        if (props.stateId == "united-states") {
          fetchURL = `/wp-json/wp/v2/mapstate`;
        }
        const response = await fetch(fetchURL);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const clustersFields = [];
        data.forEach((item) => {
          const fields = item.acf?.industry_clusters || [];
          clustersFields.push(...fields);
        });

        setIndustryClustersData(
          Array.isArray(clustersFields) ? clustersFields : []
        );
        setError(null);
      } catch (e) {
        console.error("Error in IndustryClusters useEffect:", e.message);
        setError(e.message);
        setIndustryClustersData([]);
      } finally {
        setLoading(false);
      }
    };

    if (props.stateId) {
      fetchData();
    }
  }, [props.stateId, props.preloadedData]);

  const handleInputChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    const rows = document.querySelectorAll(".data-table tbody tr");

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      let matchFound = false;

      cells.forEach((cell) => {
        if (cell.textContent.toLowerCase().includes(searchValue)) {
          matchFound = true;
        }
      });

      row.style.display = matchFound ? "" : "none";
    });
  };

  // Memoize the transformed data to create rows for each cluster
  const transformedData = useMemo(() => {
    const flattenedData = [];
    let rowId = 1;

    industryClustersData.forEach((item) => {
      // Array of cluster fields to iterate through
      const clusterFields = [
        { key: 'cluster_1', fallback: 'field_1' },
        { key: 'cluster_2', fallback: 'field_2' },
        { key: 'cluster_3', fallback: 'field_3' },
        { key: 'cluster_4', fallback: 'field_4' },
        { key: 'cluster_5', fallback: 'field_5' },
        { key: 'cluster_6', fallback: 'field_6' },
        { key: 'cluster_7', fallback: 'field_7' },
      ];

      clusterFields.forEach((field) => {
        const clusterValue = item?.[field.key] || item?.[field.fallback] || "";
        
        // Only add non-empty clusters
        if (clusterValue.trim()) {
          flattenedData.push({
            id: rowId++,
            cluster: clusterValue.trim()
          });
        }
      });
    });

    return flattenedData;
  }, [industryClustersData]);

  // Memoize columns for the new 2-column format
  const columns = useMemo(
    () => [
      { key: "cluster", label: "Industry Cluster" },
    ],
    []
  );

  // Loading component for DataTable
  const LoadingDataTable = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-3 text-gray-600">
        Loading industry clusters data...
      </span>
    </div>
  );

  // Error component for DataTable
  const ErrorDataTable = () => (
    <div className="flex justify-center items-center py-20">
      <div className="text-red-600">
        <p className="text-lg font-semibold">Error loading data</p>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  );

  // Empty state component
  const EmptyDataTable = () => (
    <div className="flex justify-center items-center py-20">
      <div className="text-gray-600">
        <p className="text-lg font-semibold">No Industry Clusters Data</p>
        <p className="text-sm">
          No industry clusters information available for {props.name}
        </p>
      </div>
    </div>
  );

  return (
    <div className="pt-12 pb-5">
      <div
        className="flex flex-row items-end space-evenly"
        style={{ justifyContent: "space-between" }}
      >
        <div>
          <h2 className="popup-title text-white">{props.name}</h2>
          <p className="popup-description text-white mt-2 mb-0">
            Industry clusters in{" "}
            {props.name === "united-states" ? "the United States" : props.name}{" "}
            per GDP
          </p>
        </div>
        <BackToMapButton />
      </div>

      <div className="bg-white mt-5 rounded-3xl popup-table-content">
        <div className="mt-4 p-8 w-full flex justify-between gap-6 sm:gap-9 sm:items-center flex-col sm:flex-row">
          <p className="text-xl font-black pb-0">
            Creating Positive Impact in U.S. Industry Clusters
          </p>
          <PopupSearchInput onChange={handleInputChange} />
        </div>

        {/* Conditional rendering for DataTable area only */}
        {loading ? (
          <LoadingDataTable />
        ) : error ? (
          <ErrorDataTable />
        ) : transformedData.length === 0 ? (
          <EmptyDataTable />
        ) : (
          <DataTable data={transformedData} columns={columns} />
        )}
        <p className="text-xs text-gray-500 px-5">
          Ranked by cluster&apos;s contribution to the state GDP.
        </p>
      </div>
    </div>
  );
};

export default IndustryClusters;
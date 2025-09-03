import { h } from "preact";
import BackToMapButton from "./components/backToMapButton";
import PopupSearchInput from "./components/popupSearchInput";
import DataTable from "./components/dataTable";
import { useEffect, useState, useMemo } from "preact/hooks";

const IndustryClusters = (props) => {
  const [industryClustersData, setIndustryClustersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If preloaded data is available, use it instead of fetching
    if (props.preloadedData.length > 0) {
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

  // Memoize the transformed data to avoid recalculation on every render
  const transformedData = useMemo(() => {
    return industryClustersData.map((item, index) => ({
      id: index + 1,
      "cluster-1": item?.cluster_1 || item?.field_1 || "",
      "cluster-2": item?.cluster_2 || item?.field_2 || "",
      "cluster-3": item?.cluster_3 || item?.field_3 || "",
      "cluster-4": item?.cluster_4 || item?.field_4 || "",
      "cluster-5": item?.cluster_5 || item?.field_5 || "",
      "cluster-6": item?.cluster_6 || item?.field_6 || "",
      "cluster-7": item?.cluster_7 || item?.field_7 || "",
    }));
  }, [industryClustersData]);

  // Memoize columns to prevent unnecessary re-renders
  const columns = useMemo(
    () => [
      { key: "cluster-1", label: "Cluster #1" },
      { key: "cluster-2", label: "Cluster #2" },
      { key: "cluster-3", label: "Cluster #3" },
      { key: "cluster-4", label: "Cluster #4" },
      { key: "cluster-5", label: "Cluster #5" },
      { key: "cluster-6", label: "Cluster #6" },
      { key: "cluster-7", label: "Cluster #7" },
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
            Industry clusters driving economic growth in {props.name}.
          </p>
        </div>
        <BackToMapButton />
      </div>

      <div className="bg-white mt-5 rounded-3xl popup-table-content">
        <div className="mt-4 p-8 w-full flex justify-between gap-6 sm:gap-9 sm:items-center flex-col sm:flex-row">
          <p className="text-xl font-black pb-0">
            Creating Positive Impact in U.S. Industry Clusters.
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
      </div>
    </div>
  );
};

export default IndustryClusters;

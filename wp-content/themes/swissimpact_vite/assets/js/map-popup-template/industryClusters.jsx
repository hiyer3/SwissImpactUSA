import { h } from "preact";
import BackToMapButton from "./components/backToMapButton";
import PopupSearchInput from "./components/popupSearchInput";
import DataTable from "./components/dataTable";
import { useEffect, useState, useMemo } from "preact/hooks";
import RecommendedPosts from "./RecomendedPosts";
import {
  LoadingState,
  ErrorState,
  EmptyState,
  NoResultsState,
} from "./components/tableStates";

const CLUSTER_FIELDS = [
  { key: "cluster_1", fallback: "field_1" },
  { key: "cluster_2", fallback: "field_2" },
  { key: "cluster_3", fallback: "field_3" },
  { key: "cluster_4", fallback: "field_4" },
  { key: "cluster_5", fallback: "field_5" },
  { key: "cluster_6", fallback: "field_6" },
  { key: "cluster_7", fallback: "field_7" },
];

const IndustryClusters = ({ name, stateId, preloadedData }) => {
  const [industryClustersData, setIndustryClustersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (preloadedData && typeof preloadedData === "object") {
      setIndustryClustersData(preloadedData.data || []);
      setLoading(preloadedData.loading || false);
      setError(preloadedData.error || null);
      return;
    }

    // Fallback fetch if no preloaded data
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchURL =
          stateId === "united-states"
            ? `/wp-json/wp/v2/mapstate`
            : `/wp-json/wp/v2/mapstate?slug=${stateId}`;
        const response = await fetch(fetchURL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const clustersFields = [];
        data.forEach((item) => {
          clustersFields.push(...(item.acf?.industry_clusters || []));
        });
        setIndustryClustersData(Array.isArray(clustersFields) ? clustersFields : []);
        setError(null);
      } catch (e) {
        console.error("Error in IndustryClusters useEffect:", e.message);
        setError(e.message);
        setIndustryClustersData([]);
      } finally {
        setLoading(false);
      }
    };

    if (stateId) fetchData();
  }, [stateId, preloadedData]);

  const handleInputChange = (event) => setSearchTerm(event.target.value);

  const transformedData = useMemo(() => {
    const flattenedData = [];
    let rowId = 1;
    industryClustersData.forEach((item) => {
      CLUSTER_FIELDS.forEach(({ key, fallback }) => {
        const value = (item?.[key] || item?.[fallback] || "").trim();
        if (value) flattenedData.push({ id: rowId++, cluster: value });
      });
    });
    return flattenedData;
  }, [industryClustersData]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return transformedData;
    const q = searchTerm.toLowerCase();
    return transformedData.filter((item) => item.cluster.toLowerCase().includes(q));
  }, [transformedData, searchTerm]);

  const columns = useMemo(() => [{ key: "cluster", label: "Industry Cluster" }], []);

  return (
    <div className="pb-5">
      <div
        className="popup-tab-header flex flex-row items-end space-evenly"
        style={{ justifyContent: "space-between" }}
      >
        <div>
          <h2 className="popup-title text-white">{name}</h2>
          <p className="popup-description text-white mt-2 mb-0">
            Industry Clusters in{" "}
            {name === "united-states" ? "the United States" : name} per GDP:{" "}
            <strong>{filteredData.length}</strong>
            {searchTerm && transformedData.length !== filteredData.length && (
              <span className="text-gray-300">
                {" "}
                (of {transformedData.length} total)
              </span>
            )}
          </p>
        </div>
        <BackToMapButton />
      </div>

      <div className="bg-white mt-5 rounded-3xl popup-table-content popup-table-card flex flex-col overflow-hidden">
        <div className="mt-4 p-8 w-full flex justify-between gap-6 sm:gap-9 sm:items-center flex-col sm:flex-row shrink-0">
          <p className="text-xl font-black pb-0">
            Creating Positive Impact in U.S. Industry Clusters
          </p>
          <PopupSearchInput
            onChange={handleInputChange}
            value={searchTerm}
            placeholder="Search clusters..."
          />
        </div>

        {loading ? (
          <LoadingState message="Loading industry clusters data..." />
        ) : error ? (
          <ErrorState error={error} />
        ) : transformedData.length === 0 ? (
          <EmptyState
            message={`No industry clusters information available for ${name}`}
          />
        ) : filteredData.length === 0 && searchTerm ? (
          <NoResultsState searchTerm={searchTerm} entityLabel="industry clusters" />
        ) : (
          <DataTable data={filteredData} columns={columns} />
        )}
        <p className="text-xs text-gray-500 px-5 pt-3 shrink-0">
          Ranked by cluster&apos;s contribution to the{" "}
          {name === "United States" ? "national" : "state"} GDP.
        </p>
      </div>

      <div className="w-full">
        <RecommendedPosts tag="industry-clusters" />
      </div>
    </div>
  );
};

export default IndustryClusters;

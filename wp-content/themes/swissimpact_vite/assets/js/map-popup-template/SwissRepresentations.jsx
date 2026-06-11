import { h } from "preact";
import BackToMapButton from "./components/backToMapButton";
import PopupSearchInput from "./components/popupSearchInput";
import DataTable from "./components/dataTable";
import { useEffect, useState, useMemo } from "preact/hooks";
import constructLink from "./components/constructLink";
import RecommendedPosts from "./RecomendedPosts";
import {
  LoadingState,
  ErrorState,
  EmptyState,
  NoResultsState,
} from "./components/tableStates";

const SwissRepresentations = ({ name, stateId, preloadedData }) => {
  const [swissRepresentationsData, setSwissRepresentationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (preloadedData && typeof preloadedData === "object") {
      setSwissRepresentationsData(preloadedData.data || []);
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
        const representationsFields = [];
        data.forEach((item) => {
          representationsFields.push(...(item.acf?.swiss_representations || []));
        });
        representationsFields.statecode = data[0]?.acf?.state_short_code || "";
        setSwissRepresentationsData(
          Array.isArray(representationsFields) ? representationsFields : []
        );
        setError(null);
      } catch (e) {
        console.error("Error in SwissRepresentations useEffect:", e.message);
        setError(e.message);
        setSwissRepresentationsData([]);
      } finally {
        setLoading(false);
      }
    };

    if (stateId) fetchData();
  }, [stateId, preloadedData]);

  const handleInputChange = (event) => setSearchTerm(event.target.value);

  const transformedData = useMemo(
    () =>
      swissRepresentationsData.map((item, index) => ({
        id: index + 1,
        state: item?.state || "",
        representation:
          constructLink(item?.representation, item?.type_of_representation_link?.url) ||
          "",
        type: item?.type || "",
      })),
    [swissRepresentationsData]
  );

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return transformedData;
    const q = searchTerm.toLowerCase();
    return transformedData.filter((item) =>
      [item.state, item.representation, item.type]
        .join(" ")
        .toLowerCase()
        .replace(/<[^>]*>/g, "")
        .includes(q)
    );
  }, [transformedData, searchTerm]);

  const columns = useMemo(
    () => [
      { key: "state", label: "State", hideOnMobile: true },
      { key: "representation", label: "Representation", allowHTML: true },
      { key: "type", label: "Type of Representation" },
    ],
    []
  );

  return (
    <div className="pb-5">
      <div
        className="popup-tab-header flex flex-row items-end space-evenly"
        style={{ justifyContent: "space-between" }}
      >
        <div>
          <h2 className="popup-title text-white">{name}</h2>
          <p className="popup-description text-white mt-2 mb-0">
            Swiss Representations in{" "}
            {name === "United States" ? "the United States" : name}:{" "}
            <strong>{filteredData.length}</strong>
            {searchTerm && transformedData.length !== filteredData.length && (
              <span className="text-gray-300"> (of {transformedData.length} total)</span>
            )}
          </p>
        </div>
        <BackToMapButton />
      </div>

      <div className="bg-white mt-5 rounded-3xl popup-table-content">
        <div className="p-8 w-full flex justify-between gap-6 sm:gap-9 sm:items-center flex-col sm:flex-row popup-table-header rounded-t-3xl bg-white">
          <p className="text-xl font-black pb-0">
            Representing Switzerland in Your Area
          </p>
          <PopupSearchInput
            onChange={handleInputChange}
            value={searchTerm}
            placeholder="Search representations..."
          />
        </div>

        {loading ? (
          <LoadingState message="Loading Swiss representations data..." />
        ) : error ? (
          <ErrorState error={error} />
        ) : transformedData.length === 0 ? (
          <EmptyState
            message={`No Swiss representations information available for ${name}`}
          />
        ) : filteredData.length === 0 && searchTerm ? (
          <NoResultsState searchTerm={searchTerm} entityLabel="Swiss representations" />
        ) : (
          <DataTable data={filteredData} columns={columns} />
        )}
      </div>

      <div className="w-full">
        <RecommendedPosts tag="swiss-representations" />
      </div>
    </div>
  );
};

export default SwissRepresentations;

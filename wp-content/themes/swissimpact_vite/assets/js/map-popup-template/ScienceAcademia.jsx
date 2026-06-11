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

const ScienceAcademia = ({ name, stateId, preloadedData }) => {
  const [scienceAcademiaData, setScienceAcademiaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (preloadedData && typeof preloadedData === "object") {
      setScienceAcademiaData(preloadedData.data || []);
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
        const academiaFields = [];
        data.forEach((item) => {
          academiaFields.push(...(item.acf?.["science_&_academia_fields"] || []));
        });
        setScienceAcademiaData(Array.isArray(academiaFields) ? academiaFields : []);
        setError(null);
      } catch (e) {
        console.error("Error in ScienceAcademia useEffect:", e.message);
        setError(e.message);
        setScienceAcademiaData([]);
      } finally {
        setLoading(false);
      }
    };

    if (stateId) fetchData();
  }, [stateId, preloadedData]);

  const handleInputChange = (event) => setSearchTerm(event.target.value);

  const transformedData = useMemo(
    () =>
      scienceAcademiaData.map((item, index) => ({
        id: index + 1,
        institution: item?.institution || "",
        name: constructLink(item?.name, item?.department_link?.url) || "",
        position: item?.position || "",
        field: item?.department || "",
      })),
    [scienceAcademiaData]
  );

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return transformedData;
    const q = searchTerm.toLowerCase();
    return transformedData.filter((item) =>
      [item.institution, item.name, item.position, item.field]
        .join(" ")
        .toLowerCase()
        .replace(/<[^>]*>/g, "")
        .includes(q)
    );
  }, [transformedData, searchTerm]);

  const columns = useMemo(
    () => [
      { key: "institution", label: "Institution", hideOnMobile: true },
      { key: "name", label: "Name", allowHTML: true },
      { key: "position", label: "Position" },
      { key: "field", label: "Field/Department" },
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
            Swiss Academics and Scientists in {name}:{" "}
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
            Creating Positive Impact in U.S. Academia and Science
          </p>
          <PopupSearchInput
            onChange={handleInputChange}
            value={searchTerm}
            placeholder="Search academics..."
          />
        </div>

        {loading ? (
          <LoadingState message="Loading data..." />
        ) : error ? (
          <ErrorState error={error} />
        ) : transformedData.length === 0 ? (
          <EmptyState message={`No science and academia data available for ${name}`} />
        ) : filteredData.length === 0 && searchTerm ? (
          <NoResultsState searchTerm={searchTerm} entityLabel="academics or scientists" />
        ) : (
          <DataTable data={filteredData} columns={columns} />
        )}
      </div>

      <div className="w-full">
        <RecommendedPosts tag="science-academia" />
      </div>
    </div>
  );
};

export default ScienceAcademia;

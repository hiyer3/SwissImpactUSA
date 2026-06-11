import { h } from "preact";
import BackToMapButton from "./components/backToMapButton";
import PopupSearchInput from "./components/popupSearchInput";
import DataTable from "./components/dataTable";
import { useEffect, useState, useMemo } from "preact/hooks";
import RecommendedPosts from "./RecomendedPosts";
import constructLink from "./components/constructLink";
import {
  LoadingState,
  ErrorState,
  EmptyState,
  NoResultsState,
} from "./components/tableStates";

const ApprenticeshipCompanies = ({ name, stateId, preloadedData }) => {
  const [apprenticeshipData, setApprenticeshipData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (preloadedData && typeof preloadedData === "object") {
      setApprenticeshipData(preloadedData.data || []);
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
        const apprenticeshipFields = [];
        data.forEach((item) => {
          apprenticeshipFields.push(...(item.acf?.apprenticeship_companies || []));
        });
        setApprenticeshipData(
          Array.isArray(apprenticeshipFields) ? apprenticeshipFields : []
        );
        setError(null);
      } catch (e) {
        console.error("Error in ApprenticeshipCompanies useEffect:", e.message);
        setError(e.message);
        setApprenticeshipData([]);
      } finally {
        setLoading(false);
      }
    };

    if (stateId) fetchData();
  }, [stateId, preloadedData]);

  const handleInputChange = (event) => setSearchTerm(event.target.value);

  const transformedData = useMemo(
    () =>
      apprenticeshipData.map((item, index) => ({
        id: index + 1,
        location: item?.location || item?.city_state || item?.address || "",
        company:
          constructLink(
            item?.company || item?.company_name || item?.name || "",
            item?.company_link?.url
          ) || "",
        field: item?.field || item?.industry || item?.sector || "",
        program:
          item?.program ||
          item?.program_duration ||
          item?.apprenticeship_program ||
          "",
      })),
    [apprenticeshipData]
  );

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return transformedData;
    const q = searchTerm.toLowerCase();
    return transformedData.filter((item) =>
      [item.location, item.company, item.field, item.program]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [transformedData, searchTerm]);

  const columns = useMemo(
    () => [
      { key: "location", label: "City, State", hideOnMobile: true },
      { key: "company", label: "Company", allowHTML: true },
      { key: "field", label: "Field" },
      { key: "program", label: "Program (Duration)" },
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
            Apprenticeship Opportunities and Companies in{" "}
            {name === "united-states" ? "the United States" : name}:{" "}
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
            Investing in the Next Generation of Skilled Workers
          </p>
          <PopupSearchInput
            onChange={handleInputChange}
            value={searchTerm}
            placeholder="Search companies..."
          />
        </div>

        {loading ? (
          <LoadingState message="Loading apprenticeship companies data..." />
        ) : error ? (
          <ErrorState error={error} />
        ) : transformedData.length === 0 ? (
          <EmptyState
            message={`No apprenticeship companies information available for ${name}`}
          />
        ) : filteredData.length === 0 && searchTerm ? (
          <NoResultsState searchTerm={searchTerm} entityLabel="apprenticeship companies" />
        ) : (
          <DataTable data={filteredData} columns={columns} />
        )}
      </div>

      <div className="w-full">
        <RecommendedPosts tag="apprenticeship-companies" />
      </div>
    </div>
  );
};

export default ApprenticeshipCompanies;

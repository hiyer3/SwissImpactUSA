import { h } from "preact";
import BackToMapButton from "./components/backToMapButton";
import PopupSearchInput from "./components/popupSearchInput";
import DataTable from "./components/dataTable";
import { useEffect, useState, useMemo } from "preact/hooks";
import constructLink from "./components/constructLink";

const ScienceAcademia = (props) => {
  const [scienceAcademiaData, setScienceAcademiaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Add search state

  useEffect(() => {
    // If preloaded data is available, use it instead of fetching
    if (props.preloadedData && typeof props.preloadedData === "object") {
      setScienceAcademiaData(props.preloadedData.data || []);
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
        const academiaFields = [];
        data.forEach((item) => {
          const fields = item.acf?.["science_&_academia_fields"] || [];
          academiaFields.push(...fields);
        });

        setScienceAcademiaData(
          Array.isArray(academiaFields) ? academiaFields : []
        );
        setError(null);
      } catch (e) {
        console.error("Error in ScienceAcademia useEffect:", e.message);
        setError(e.message);
        setScienceAcademiaData([]);
      } finally {
        setLoading(false);
      }
    };

    if (props.stateId) {
      fetchData();
    }
  }, [props.stateId, props.preloadedData]);

  // Updated search handler that works with React state
  const handleInputChange = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
  };

  // Memoize the transformed data to avoid recalculation on every render
  const transformedData = useMemo(() => {
    return scienceAcademiaData.map((item, index) => ({
      id: index + 1,
      institution: item?.institution || "",
      name: constructLink(item?.name, item?.department_link?.url) || "",
      position: item?.position || "",
      field: item?.department || "",
    }));
  }, [scienceAcademiaData]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return transformedData;
    }

    const searchLower = searchTerm.toLowerCase();
    return transformedData.filter((item) => {
      // Search across all text fields
      const searchableText = [
        item.institution,
        item.name,
        item.position,
        item.field
      ]
        .join(' ')
        .toLowerCase()
        .replace(/<[^>]*>/g, ''); // Remove HTML tags for search

      return searchableText.includes(searchLower);
    });
  }, [transformedData, searchTerm]);

  // Memoize columns to prevent unnecessary re-renders
  const columns = useMemo(
    () => [
      { key: "institution", label: "Institution" },
      { key: "name", label: "Name", allowHTML: true },
      { key: "position", label: "Position" },
      { key: "field", label: "Field/Department" },
    ],
    []
  );

  // Loading component for DataTable
  const LoadingDataTable = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-3 text-gray-600">Loading data...</span>
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
        <p className="text-lg font-semibold">No Data Available</p>
        <p className="text-sm">
          No science and academia data available for {props.name}
        </p>
      </div>
    </div>
  );

  // Search results empty state
  const NoSearchResults = () => (
    <div className="flex justify-center items-center py-20">
      <div className="text-gray-600">
        <p className="text-lg font-semibold">No Results Found</p>
        <p className="text-sm">
          No academics or scientists match your search "{searchTerm}"
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
            Swiss Academics and Scientists in {props.name}:{" "}
            <strong>{filteredData.length}</strong>
            {searchTerm && transformedData.length !== filteredData.length && (
              <span className="text-gray-300"> (of {transformedData.length} total)</span>
            )}
          </p>
        </div>
        <BackToMapButton />
      </div>

      <div className="bg-white mt-5 rounded-3xl popup-table-content overflow-hidden">
        <div className="mt-2 p-8 w-full flex justify-between gap-6 sm:gap-9 sm:items-center flex-col sm:flex-row">
          <p className="text-xl font-black pb-0">
            Creating Positive Impact in U.S. Academia and Science
          </p>
          <PopupSearchInput 
            onChange={handleInputChange} 
            value={searchTerm}
            placeholder="Search academics..."
          />
        </div>

        {/* Conditional rendering for DataTable area only */}
        {loading ? (
          <LoadingDataTable />
        ) : error ? (
          <ErrorDataTable />
        ) : transformedData.length === 0 ? (
          <EmptyDataTable />
        ) : filteredData.length === 0 && searchTerm ? (
          <NoSearchResults />
        ) : (
          <DataTable
            data={filteredData}
            columns={columns}
          />
        )}
      </div>
    </div>
  );
};

export default ScienceAcademia;
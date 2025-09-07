import { h } from "preact";
import BackToMapButton from "./components/backToMapButton";
import PopupSearchInput from "./components/popupSearchInput";
import DataTable from "./components/dataTable";
import { useEffect, useState, useMemo } from "preact/hooks";

const ApprenticeshipCompanies = (props) => {
  const [apprenticeshipData, setApprenticeshipData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Add search state

  useEffect(() => {
    // FIXED: Check if preloadedData exists and use it
    if (props.preloadedData && typeof props.preloadedData === "object") {
      setApprenticeshipData(props.preloadedData.data || []);
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
        const apprenticeshipFields = [];
        data.forEach((item) => {
          const fields = item.acf?.apprenticeship_companies || [];
          apprenticeshipFields.push(...fields);
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

    if (props.stateId) {
      fetchData();
    }
  }, [props.stateId, props.preloadedData]);

  // Updated search handler that works with React state (like ScienceAcademia)
  const handleInputChange = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
  };

  // Memoize the transformed data to avoid recalculation on every render
  const transformedData = useMemo(() => {
    return apprenticeshipData.map((item, index) => ({
      id: index + 1,
      location: item?.location || item?.city_state || item?.address || "",
      company: item?.company || item?.company_name || item?.name || "",
      field: item?.field || item?.industry || item?.sector || "",
      program:
        item?.program ||
        item?.program_duration ||
        item?.apprenticeship_program ||
        "",
    }));
  }, [apprenticeshipData]);

  // Filter data based on search term (like ScienceAcademia)
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return transformedData;
    }

    const searchLower = searchTerm.toLowerCase();
    return transformedData.filter((item) => {
      // Search across all text fields
      const searchableText = [
        item.location,
        item.company,
        item.field,
        item.program
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(searchLower);
    });
  }, [transformedData, searchTerm]);

  // Memoize columns to prevent unnecessary re-renders
  const columns = useMemo(
    () => [
      { key: "location", label: "City, State" },
      { key: "company", label: "Company" },
      { key: "field", label: "Field" },
      { key: "program", label: "Program (Duration)" },
    ],
    []
  );

  // Loading component for DataTable
  const LoadingDataTable = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-3 text-gray-600">
        Loading apprenticeship companies data...
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
        <p className="text-lg font-semibold">
          No Apprenticeship Companies Data
        </p>
        <p className="text-sm">
          No apprenticeship companies information available for {props.name}
        </p>
      </div>
    </div>
  );

  // Search results empty state (like ScienceAcademia)
  const NoSearchResults = () => (
    <div className="flex justify-center items-center py-20">
      <div className="text-gray-600">
        <p className="text-lg font-semibold">No Results Found</p>
        <p className="text-sm">
          No apprenticeship companies match your search "{searchTerm}"
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
            Apprenticeship opportunities and companies in{" "}
            {props.name === "united-states" ? "the United States" : props.name}: <strong>{filteredData.length}</strong>
            {searchTerm && transformedData.length !== filteredData.length && (
              <span className="text-gray-300"> (of {transformedData.length} total)</span>
            )}
          </p>
        </div>
        <BackToMapButton />
      </div>

      <div className="bg-white mt-5 rounded-3xl popup-table-content">
        <div className="mt-4 p-8 w-full flex justify-between gap-6 sm:gap-9 sm:items-center flex-col sm:flex-row">
          <p className="text-xl font-black pb-0">
            Apprenticeship opportunities and companies in{" "}
            {props.name === "united-states" ? "the United States" : props.name}
          </p>
          <PopupSearchInput 
            onChange={handleInputChange} 
            value={searchTerm}
            placeholder="Search companies..."
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
          <DataTable data={filteredData} columns={columns} />
        )}
      </div>
    </div>
  );
};

export default ApprenticeshipCompanies;
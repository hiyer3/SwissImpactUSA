import { h } from "preact";
import BackToMapButton from "./components/backToMapButton";
import PopupSearchInput from "./components/popupSearchInput";
import DataTable from "./components/dataTable";
import { useEffect, useState, useMemo } from "preact/hooks";
import constructLink from "./components/constructLink";

const SwissRepresentations = (props) => {
  const [swissRepresentationsData, setSwissRepresentationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Add search state

  useEffect(() => {
    // If preloaded data is available, use it instead of fetching
    if (props.preloadedData && typeof props.preloadedData === "object") {
      setSwissRepresentationsData(props.preloadedData.data || []);
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
        const representationsFields = [];
        data.forEach((item) => {
          const fields = item.acf?.swiss_representations || [];
          representationsFields.push(...fields);
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

    if (props.stateId) {
      fetchData();
    }
  }, [props.stateId, props.preloadedData]);

  // Updated search handler that works with React state
  const handleInputChange = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
  };

  // Helper function to construct type value with optional link
  const constructTypeValue = (item) => {
    const typeText =
      item?.type || item?.representation_type || item?.office_type || "";
    const typeLink = item?.type_of_representation_link?.url;

    // If there's a link, wrap the type text in an anchor tag
    if (typeLink && typeText) {
      return `<a href="${typeLink}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${typeText}</a>`;
    }

    // Return plain text if no link
    return typeText;
  };

  // Memoize the transformed data to avoid recalculation on every render
  const transformedData = useMemo(() => {
    return swissRepresentationsData.map((item, index) => {
      return {
        id: index + 1,
        state: item?.state || "",
        representation:
          constructLink(
            item?.representation,
            item?.type_of_representation_link?.url
          ) || "",
        type: item?.type || "",
      };
    });
  }, [swissRepresentationsData]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return transformedData;
    }

    const searchLower = searchTerm.toLowerCase();
    return transformedData.filter((item) => {
      // Search across all text fields
      const searchableText = [
        item.state,
        item.representation,
        item.type
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
      { key: "state", label: "State" },
      { key: "representation", label: "Representation", allowHTML: true },
      { key: "type", label: "Type of Representation" },
    ],
    []
  );

  // Loading component for DataTable
  const LoadingDataTable = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-3 text-gray-600">
        Loading Swiss representations data...
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
        <p className="text-lg font-semibold">No Swiss Representations Data</p>
        <p className="text-sm">
          No Swiss representations information available for {props.name}
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
          No Swiss representations match your search "{searchTerm}"
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
            Swiss Representations in{" "}
            {props.name === "united-states" ? "the United States" : props.name}:{" "}
            <strong>{filteredData.length}</strong>
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
            Swiss Representations in{" "}
            {props.name === "united-states" ? "the United States" : props.name}
          </p>
          <PopupSearchInput 
            onChange={handleInputChange} 
            value={searchTerm}
            placeholder="Search representations..."
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

export default SwissRepresentations;
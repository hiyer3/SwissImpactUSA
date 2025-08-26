import { h } from "preact";
import BackToMapButton from "./components/backToMapButton";
import PopupSearchInput from "./components/popupSearchInput";
import DataTable from "./components/dataTable";
import { useEffect, useState, useMemo } from "preact/hooks";

const SwissRepresentations = (props) => {
  const [swissRepresentationsData, setSwissRepresentationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If preloaded data is available, use it instead of fetching
    if (props.preloadedData) {
      setSwissRepresentationsData(props.preloadedData.data || []);
      setLoading(props.preloadedData.loading || false);
      setError(props.preloadedData.error || null);
      return;
    }

    // Fallback to original fetch logic if no preloaded data
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/wp-json/wp/v2/mapstate?slug=${props.stateId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const representationsFields = data[0]?.acf?.swiss_representations || [];
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
        state: item.state || "",
        representation: item?.representation,
        type: constructTypeValue(item),
      };
    });
  }, [swissRepresentationsData]);

  // Memoize columns to prevent unnecessary re-renders
  const columns = useMemo(
    () => [
      { key: "state", label: "State" },
      { key: "representation", label: "Representation" },
      { key: "type", label: "Type of Representation", allowHTML: true },
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

  return (
    <div className="pt-12 pb-5">
      <div
        className="flex flex-row items-end space-evenly"
        style={{ justifyContent: "space-between" }}
      >
        <div>
          <h2 className="popup-title text-white">{props.name}</h2>
          <p className="popup-description text-white mt-2 mb-0">
            Swiss diplomatic and consular representations in {props.name}.
          </p>
        </div>
        <BackToMapButton />
      </div>

      <div className="bg-white mt-5 rounded-3xl popup-table-content">
        <div className="mt-4 p-8 w-full flex justify-between gap-6 sm:gap-9 sm:items-center flex-col sm:flex-row">
          <p className="text-xl font-black pb-0">
            Swiss Representations of Switzerland in {props.name}.
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

export default SwissRepresentations;

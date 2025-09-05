import { h } from "preact";
import BackToMapButton from "./components/backToMapButton";
import PopupSearchInput from "./components/popupSearchInput";
import DataTable from "./components/dataTable";
import { useEffect, useState, useMemo } from "preact/hooks";

const ApprenticeshipCompanies = (props) => {
  const [apprenticeshipData, setApprenticeshipData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // FIXED: Check if preloadedData exists and use it
    if (props.preloadedData && typeof props.preloadedData === 'object') {
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

  return (
    <div className="pt-12 pb-5">
      <div
        className="flex flex-row items-end space-evenly"
        style={{ justifyContent: "space-between" }}
      >
        <div>
          <h2 className="popup-title text-white">{props.name}</h2>
          <p className="popup-description text-white mt-2 mb-0">
            Apprenticeship Programs in{" "}
            {props.name === "united-states" ? "the United States" : props.name}.
          </p>
        </div>
        <BackToMapButton />
      </div>

      <div className="bg-white mt-5 rounded-3xl popup-table-content">
        <div className="mt-4 p-8 w-full flex justify-between gap-6 sm:gap-9 sm:items-center flex-col sm:flex-row">
          <p className="text-xl font-black pb-0">
            U.S. Apprenticeship Companies
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

export default ApprenticeshipCompanies;
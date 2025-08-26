import { h } from "preact";
import BackToMapButton from "./components/backToMapButton";
import PopupSearchInput from "./components/popupSearchInput";
import DataTable from "./components/dataTable";
import { useEffect, useState, useMemo } from "preact/hooks";

const ScienceAcademia = (props) => {
  const [scienceAcademiaData, setScienceAcademiaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If preloaded data is available, use it instead of fetching
    if (props.preloadedData) {
      setScienceAcademiaData(props.preloadedData.data || []);
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
        const academiaFields =
          data[0]?.acf?.["science_&_academia_fields"] || [];

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
    return scienceAcademiaData.map((item, index) => ({
      id: index + 1,
      institution: item?.institution || "",
      name: item?.name || "",
      position: item?.position || "",
      field: item?.department || "",
    }));
  }, [scienceAcademiaData]);

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

  return (
    <div className="pt-12 pb-5">
      <div
        className="flex flex-row items-end space-evenly"
        style={{ justifyContent: "space-between" }}
      >
        <div>
          <h2 className="popup-title text-white">{props.name}</h2>
          <p className="popup-description text-white mt-2 mb-0">
            Swiss academics and scientists in the United States:{" "}
            {props.scienceAcademiaData?.length || 0}
          </p>
        </div>
        <BackToMapButton />
      </div>

      <div className="bg-white rounded-3xl popup-table-content">
        <div className="mt-4 p-8 w-full flex justify-between gap-6 sm:gap-9 sm:items-center flex-col sm:flex-row">
          <p className="text-xl font-black pb-0">
            Creating Positive Impact in U.S. Academia and Science.
          </p>
          <PopupSearchInput onChange={handleInputChange} />
        </div>

        {/* Conditional rendering for DataTable area only */}
        {loading ? (
          <LoadingDataTable />
        ) : error ? (
          <ErrorDataTable />
        ) : (
          <DataTable
            data={transformedData}
            columns={[
              { key: "institution", label: "Institution" },
              { key: "name", label: "Name" },
              { key: "position", label: "Position" },
              { key: "field", label: "Field/Department" },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default ScienceAcademia;

import { h } from "preact";
import { useEffect, useState, useMemo } from "preact/hooks";
import BackToMapButton from "./components/backToMapButton";
import CardTitle from "./components/SwissImpactCard/CardTitle";
import CardStatNumber from "./components/SwissImpactCard/CardStatNumber";
import Card from "./components/SwissImpactCard/Card";
import CardContent from "./components/SwissImpactCard/CardContent";
import CardWrapper from "./components/SwissImpactCard/CardWrapper";
import SRUSCard from "./components/SwissImpactCard/SRUSCard";
import SwissRepresentations from "./SwissRepresentations";
import SRStateCard from "./components/SwissImpactCard/SRStateCard";

const SwissImpact = (props) => {
  const [swissImpactData, setSwissImpactData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("SwissImpact props:", props.preloadedData);
  useEffect(() => {
    // If preloaded data is available, use it instead of fetching
    if (props.preloadedData) {
      setSwissImpactData(props.preloadedData.data || []);
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
        const impactFields = data[0]?.acf?.swiss_impact || [];

        setSwissImpactData(Array.isArray(impactFields) ? impactFields : []);
        setError(null);
      } catch (e) {
        console.error("Error in SwissImpact useEffect:", e.message);
        setError(e.message);
        setSwissImpactData([]);
      } finally {
        setLoading(false);
      }
    };

    if (props.stateId) {
      fetchData();
    }
  }, [props.stateId, props.preloadedData]);

  // Extract data from the first item (assuming single record structure)
  const impactData = useMemo(() => {
    const data = swissImpactData[0] || {};
    return {
      swissResidents: data.swiss_residents || 0,
      SwissRepresentations: data.states || [],
      SwissRepresentationsDescription:
        data.swiss_representations_description || "default description",
      economicImpact: data.economic_impact || 0,
      scienceAcademia: data.science_academia || 0,
      apprenticeshipCompanies: data.apprenticeship_companies || 0,
      industryClusters: data.industry_clusters || 0,
    };
  }, [swissImpactData]);

  // Loading component
  const LoadingCards = () => (
    <div className="bg-swissred rounded-3xl popup-table-content mt-5">
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-3 text-white">Loading Swiss impact data...</span>
      </div>
    </div>
  );

  // Error component
  const ErrorCards = () => (
    <div className="bg-swissred rounded-3xl popup-table-content mt-5">
      <div className="flex justify-center items-center py-20">
        <div className="text-white text-center">
          <p className="text-lg font-semibold">Error loading data</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    </div>
  );

  // Empty state component
  const EmptyCards = () => (
    <div className="bg-swissred rounded-3xl popup-table-content mt-5">
      <div className="flex justify-center items-center py-20">
        <div className="text-white text-center">
          <p className="text-lg font-semibold">No Swiss Impact Data</p>
          <p className="text-sm">
            No Swiss impact information available for {props.name}
          </p>
        </div>
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
            Residents of Swiss Descent:{" "}
            <strong>
              {loading ? "Loading..." : impactData.swissResidents}
            </strong>
          </p>
        </div>
        <BackToMapButton />
      </div>

      {/* Conditional rendering based on loading state */}
      {loading ? (
        <LoadingCards />
      ) : error ? (
        <ErrorCards />
      ) : swissImpactData.length === 0 ? (
        <EmptyCards />
      ) : (
        <div className="bg-swissred rounded-3xl popup-table-content mt-5">
          <CardWrapper cols={2}>
            <Card>
              <CardTitle
                title="Economic Impact"
                imageURL="/wp-content/themes/swissimpact_vite/assets/img/si-number-map/icon-ei-2x.png"
                alt="Economic Impact Icon"
                iconWidth={70}
                iconPadding={10}
              />
              <CardContent
                type="fullWidth"
                description="Total Jobs Supported in U.S"
              >
                <CardStatNumber
                  style={{ marginLeft: "0", marginRight: "auto" }}
                  number={impactData.economicImpact}
                />
              </CardContent>
            </Card>

            <Card>
              <CardTitle
                title="Science & Academia"
                imageURL="/wp-content/themes/swissimpact_vite/assets/img/si-number-map/icon-sa-2x.png"
                alt="Academic Institutions Icon"
                iconWidth={60}
                iconPadding={20}
              />
              <CardContent description="Total Academic Institutions in U.S">
                <CardStatNumber number={impactData.scienceAcademia} />
              </CardContent>
            </Card>

            <Card>
              <CardTitle
                title="Apprenticeship Companies"
                imageURL="/wp-content/themes/swissimpact_vite/assets/img/si-number-map/icon-ec-2x.png"
                alt="Apprenticeship Companies Icon"
                iconWidth={80}
                iconPadding={0}
              />
              <CardContent description="Total Apprenticeships in U.S">
                <CardStatNumber number={impactData.apprenticeshipCompanies} />
              </CardContent>
            </Card>

            <Card>
              <CardTitle
                title="Industry Clusters"
                imageURL="/wp-content/themes/swissimpact_vite/assets/img/si-number-map/icon-ic-2x.png"
                alt="Industry Clusters Icon"
                iconWidth={30}
                iconPadding={40}
              />
              <CardContent description="Total number of Industry Clusters in U.S">
                <CardStatNumber number={impactData.industryClusters} />
              </CardContent>
            </Card>
          </CardWrapper>

          <CardWrapper style={{ gap: 0 }}>
            <Card
              style={{
                paddingBottom: "0px",
                borderBottomLeftRadius: "0px",
                borderBottomRightRadius: "0px",
              }}
            >
              <CardTitle
                title="Swiss Representations"
                imageURL="/wp-content/themes/swissimpact_vite/assets/img/si-number-map/icon-sr-2x.png"
                alt="Swiss Representations Icon"
                iconWidth={50}
                iconPadding={30}
              />
            </Card>

            {props.stateId == "united-states" ? (
              <SRUSCard description={impactData.SwissRepresentationsDescription} data={impactData.SwissRepresentations} />
            ) : (
              <SRStateCard description={impactData.SwissRepresentationsDescription} data={impactData.SwissRepresentations} />
            )}
          </CardWrapper>
        </div>
      )}
    </div>
  );
};

export default SwissImpact;

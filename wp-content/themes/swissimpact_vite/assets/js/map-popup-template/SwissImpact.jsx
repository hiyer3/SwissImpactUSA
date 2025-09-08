import { h } from "preact";
import BackToMapButton from "./components/backToMapButton";
import CardTitle from "./components/SwissImpactCard/CardTitle";
import CardStatNumber from "./components/SwissImpactCard/CardStatNumber";
import Card from "./components/SwissImpactCard/Card";
import CardContent from "./components/SwissImpactCard/CardContent";
import CardWrapper from "./components/SwissImpactCard/CardWrapper";
import SRStateCard from "./components/SwissImpactCard/SRStateCard";

// ---- tiny helpers ----
const toNumber = (v) => {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/,/g, "").trim());
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};
const formatUS = (n) => toNumber(n).toLocaleString("en-US");

const SwissImpact = ({ name = "", stateId = "", preloadedData = null }) => {
  const loading = !!preloadedData?.loading;
  const error = preloadedData?.error ?? null;
  const node = Array.isArray(preloadedData?.data)
    ? preloadedData.data[0]
    : null;
console.log("SwissImpact node:", node);
  const impact = node
    ? {
        totalJobs: toNumber(node.total_jobs),
        swissResidents: toNumber(node.swiss_residents),
        counts: {
          scienceAcademia: toNumber(node.science_academia),
          apprenticeshipCompanies: toNumber(node.apprenticeship_companies),
        },
        industryClusters: Array.isArray(node.industry_clusters)
          ? node.industry_clusters // array of strings per your sample
          : [],
        swissRepresentations: Array.isArray(node.swiss_representations)
          ? node.swiss_representations
          : [],
      }
    : {
        totalJobs: 0,
        swissResidents: 0,
        counts: { scienceAcademia: 0, apprenticeshipCompanies: 0 },
        industryClusters: [],
        swissRepresentations: [],
      };

  const placeLabel = stateId === "united-states" ? "the U.S." : name;

  const hasAnyContent =
    impact.swissResidents > 0 ||
    impact.totalJobs > 0 ||
    impact.counts.scienceAcademia > 0 ||
    impact.counts.apprenticeshipCompanies > 0 ||
    (impact.industryClusters && impact.industryClusters.length > 0) ||
    (impact.swissRepresentations && impact.swissRepresentations.length > 0);

  return (
    <div className="pt-12 pb-5">
      {/* Header */}
      <div
        className="flex flex-row items-end"
        style={{ justifyContent: "space-between" }}
      >
        <div>
          <h2 className="popup-title text-white">{name}</h2>
          <p className="popup-description text-white mt-2 mb-0">
            Residents of Swiss Descent:{" "}
            <strong>
              {loading ? "Loading..." : formatUS(impact.swissResidents)}
            </strong>
          </p>
        </div>
        <BackToMapButton />
      </div>

      {/* Body */}
      {loading ? (
        <div className="bg-swissred rounded-3xl popup-table-content mt-5">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            <span className="ml-3 text-white">
              Loading Swiss impact data...
            </span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-swissred rounded-3xl popup-table-content mt-5">
          <div className="flex justify-center items-center py-20">
            <div className="text-white text-center">
              <p className="text-lg font-semibold">Error loading data</p>
              <p className="text-sm">{String(error)}</p>
            </div>
          </div>
        </div>
      ) : !hasAnyContent ? (
        <div className="bg-swissred rounded-3xl popup-table-content mt-5">
          <div className="flex justify-center items-center py-20">
            <div className="text-white text-center">
              <p className="text-lg font-semibold">No Swiss Impact Data</p>
              <p className="text-sm">
                No Swiss impact information available for {name}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-swissred rounded-3xl popup-table-content mt-5">
          {/* Top metrics */}
          <CardWrapper cols={2}>
            {impact.totalJobs > 0 && (
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
                  description={`Total Jobs Supported in ${placeLabel}`}
                >
                  <CardStatNumber
                    style={{ marginLeft: "0", marginRight: "auto" }}
                    number={formatUS(impact.totalJobs)}
                  />
                </CardContent>
              </Card>
            )}

            {impact.counts.scienceAcademia > 0 && (
              <Card>
                <CardTitle
                  title="Science & Academia"
                  imageURL="/wp-content/themes/swissimpact_vite/assets/img/si-number-map/icon-sa-2x.png"
                  alt="Academic Institutions Icon"
                  iconWidth={60}
                  iconPadding={20}
                />
                <CardContent
                  description={`Total Academic Institutions in ${placeLabel}`}
                >
                  <CardStatNumber
                    number={formatUS(impact.counts.scienceAcademia)}
                  />
                </CardContent>
              </Card>
            )}

            {impact.counts.apprenticeshipCompanies > 0 && (
              <Card>
                <CardTitle
                  title="Apprenticeship Companies"
                  imageURL="/wp-content/themes/swissimpact_vite/assets/img/si-number-map/icon-ec-2x.png"
                  alt="Apprenticeship Companies Icon"
                  iconWidth={80}
                  iconPadding={0}
                />
                <CardContent
                  description={`Total Apprenticeships in ${placeLabel}`}
                >
                  <CardStatNumber
                    number={formatUS(impact.counts.apprenticeshipCompanies)}
                  />
                </CardContent>
              </Card>
            )}

            {impact.industryClusters && impact.industryClusters.length > 0 && (
              <Card>
                <CardTitle
                  title="Industry Clusters"
                  imageURL="/wp-content/themes/swissimpact_vite/assets/img/si-number-map/icon-ic-2x.png"
                  alt="Industry Clusters Icon"
                  iconWidth={30}
                  iconPadding={40}
                />
                <CardContent
                  description={`Top industry cluster in ${placeLabel}`}
                  type="fullWidth"
                ></CardContent>
                <div className="flex">
                  <div className="w-20 pr-10"></div>
                  <div className={`flex flex-col mt-4`}>
                    <p
                      style={{ lineHeight: "1.1" }}
                      className={`text-[30px] lg:text-[40px] xl:text-[40px] leading-[1.1] font-bold`}
                    >
                      {stateId == "united-states"
                        ? impact.industryClusters.join(", ")
                        : impact.industryClusters[0]}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </CardWrapper>

          {/* Swiss Representations */}
          {impact.swissRepresentations &&
            impact.swissRepresentations.length > 0 && (
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
                <SRStateCard data={impact.swissRepresentations} />
              </CardWrapper>
            )}
        </div>
      )}
    </div>
  );
};

export default SwissImpact;

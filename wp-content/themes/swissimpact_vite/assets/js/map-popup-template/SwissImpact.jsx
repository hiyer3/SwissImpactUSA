import { h } from "preact";
import { useEffect, useState, useMemo } from "preact/hooks";
import BackToMapButton from "./components/backToMapButton";
import CardTitle from "./components/SwissImpactCard/CardTitle";
import CardStatNumber from "./components/SwissImpactCard/CardStatNumber";
import Card from "./components/SwissImpactCard/Card";
import CardContent from "./components/SwissImpactCard/CardContent";
import CardWrapper from "./components/SwissImpactCard/CardWrapper";
import SRUSCard from "./components/SwissImpactCard/SRUSCard";
import SRStateCard from "./components/SwissImpactCard/SRStateCard";

// ---------- helpers ----------
const toNumber = (v) => {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/,/g, "").trim());
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const formatUSNumber = (n) => toNumber(n).toLocaleString("en-US");

// Normalize a swiss impact record from either ACF snake_case or camelCase / custom shapes
const normalizeImpact = (node) => {
  if (!node || typeof node !== "object") {
    return {
      swissResidents: 0,
      totalJobs: 0,
      swissRepresentations: [],
      swissRepresentationsDescription: "",
      counts: { scienceAcademia: 0, apprenticeshipCompanies: 0, industryClusters: 0 },
      statecode: "",
    };
  }

  // Some payloads may have only counts + reps; others include residents/jobs too.
  const swissResidents =
    toNumber(node.swiss_residents ?? node.swissResidents ?? 0);
  const totalJobs =
    toNumber(node.total_jobs ?? node.totalJobs ?? 0);

  const swissRepresentations =
    Array.isArray(node.swiss_representations ?? node.SwissRepresentations)
      ? (node.swiss_representations ?? node.SwissRepresentations)
      : [];

  const swissRepresentationsDescription =
    node.swiss_representations_description ??
    node.SwissRepresentationsDescription ??
    "";

  const counts = {
    scienceAcademia: toNumber(node.science_academia ?? node.scienceAcademia ?? 0),
    apprenticeshipCompanies: toNumber(
      node.apprenticeship_companies ?? node.apprenticeshipCompanies ?? 0
    ),
    industryClusters: toNumber(node.industry_clusters ?? node.industryClusters ?? 0),
  };

  const statecode = node.statecode ?? node.stateCode ?? "";

  return {
    swissResidents,
    totalJobs,
    swissRepresentations,
    swissRepresentationsDescription,
    counts,
    statecode,
  };
};

// ---------- component ----------
const SwissImpact = ({ name = "", stateId = "", preloadedData = null }) => {
  const [dataNode, setDataNode] = useState(null);
  const [loading, setLoading] = useState(!!preloadedData?.loading);
  const [error, setError] = useState(preloadedData?.error ?? null);

  // Prefer preloadedData; else fetch from WP
  useEffect(() => {
    let cancelled = false;

    const applyPreloaded = () => {
      const node = Array.isArray(preloadedData?.data) ? preloadedData.data[0] : null;
      setDataNode(node || null);
      setLoading(!!preloadedData?.loading);
      setError(preloadedData?.error ?? null);
    };

    const fetchLive = async () => {
      if (!stateId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/wp-json/wp/v2/mapstate?slug=${stateId}`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const json = await res.json();
        // ACF swiss_impact is typically an array; we take the first item
        const impactArray = json?.[0]?.acf?.swiss_impact;
        const node = Array.isArray(impactArray) ? impactArray[0] : null;
        if (!cancelled) setDataNode(node || null);
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || "Failed to load Swiss impact data.");
          setDataNode(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (preloadedData) {
      applyPreloaded();
    } else {
      fetchLive();
    }

    return () => {
      cancelled = true;
    };
  }, [stateId, preloadedData]);

  const impact = useMemo(() => normalizeImpact(dataNode), [dataNode]);

  // ---------- subviews ----------
  const LoadingView = () => (
    <div className="bg-swissred rounded-3xl popup-table-content mt-5">
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-3 text-white">Loading Swiss impact data...</span>
      </div>
    </div>
  );

  const ErrorView = () => (
    <div className="bg-swissred rounded-3xl popup-table-content mt-5">
      <div className="flex justify-center items-center py-20">
        <div className="text-white text-center">
          <p className="text-lg font-semibold">Error loading data</p>
          <p className="text-sm">{String(error)}</p>
        </div>
      </div>
    </div>
  );

  const EmptyView = () => (
    <div className="bg-swissred rounded-3xl popup-table-content mt-5">
      <div className="flex justify-center items-center py-20">
        <div className="text-white text-center">
          <p className="text-lg font-semibold">No Swiss Impact Data</p>
          <p className="text-sm">No Swiss impact information available for {name}</p>
        </div>
      </div>
    </div>
  );

  const hasAnyContent =
    impact.swissResidents > 0 ||
    impact.totalJobs > 0 ||
    impact.counts.scienceAcademia > 0 ||
    impact.counts.apprenticeshipCompanies > 0 ||
    impact.counts.industryClusters > 0 ||
    (Array.isArray(impact.swissRepresentations) && impact.swissRepresentations.length > 0);

  // ---------- render ----------
  return (
    <div className="pt-12 pb-5">
      {/* Header */}
      <div
        className="flex flex-row items-end space-evenly"
        style={{ justifyContent: "space-between" }}
      >
        <div>
          <h2 className="popup-title text-white">
            {name}
            {impact.statecode ? (
              <span className="ml-2 text-white/80 text-lg">({impact.statecode})</span>
            ) : null}
          </h2>
          <p className="popup-description text-white mt-2 mb-0">
            Residents of Swiss Descent:{" "}
            <strong>{loading ? "Loading..." : formatUSNumber(impact.swissResidents)}</strong>
          </p>
        </div>
        <BackToMapButton />
      </div>

      {/* Body */}
      {loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView />
      ) : !hasAnyContent ? (
        <EmptyView />
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
                <CardContent type="fullWidth" description="Total Jobs Supported in U.S">
                  <CardStatNumber
                    style={{ marginLeft: "0", marginRight: "auto" }}
                    number={formatUSNumber(impact.totalJobs)}
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
                <CardContent description="Total Academic Institutions in U.S">
                  <CardStatNumber number={formatUSNumber(impact.counts.scienceAcademia)} />
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
                <CardContent description="Total Apprenticeships in U.S">
                  <CardStatNumber number={formatUSNumber(impact.counts.apprenticeshipCompanies)} />
                </CardContent>
              </Card>
            )}

            {impact.counts.industryClusters > 0 && (
              <Card>
                <CardTitle
                  title="Industry Clusters"
                  imageURL="/wp-content/themes/swissimpact_vite/assets/img/si-number-map/icon-ic-2x.png"
                  alt="Industry Clusters Icon"
                  iconWidth={30}
                  iconPadding={40}
                />
                <CardContent description="Total number of Industry Clusters in U.S">
                  <CardStatNumber number={formatUSNumber(impact.counts.industryClusters)} />
                </CardContent>
              </Card>
            )}
          </CardWrapper>

          {/* Swiss Representations */}
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

            {stateId === "united-states" ? (
              <SRUSCard
                description={impact.swissRepresentationsDescription}
                data={impact.swissRepresentations}
              />
            ) : (
              <SRStateCard
                description={impact.swissRepresentationsDescription}
                data={impact.swissRepresentations}
              />
            )}
          </CardWrapper>
        </div>
      )}
    </div>
  );
};

export default SwissImpact; 

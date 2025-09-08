import { h } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Doughnut } from "react-chartjs-2";
import BackToMapButton from "./components/backToMapButton";
import DownloadPDF from "./components/downloadPDF";

/* ---------- donut center text ---------- */
const centerTextPlugin = {
  id: "centerTextPlugin",
  afterDraw: (chart) => {
    const { ctx, chartArea, options } = chart;
    if (!chartArea) return;
    const jobsTotal = options.jobsTotal;
    if (!jobsTotal) return;

    const { left, right, top, bottom } = chartArea;
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;

    const w = right - left;
    const numberFont = Math.max(16, Math.min(28, w * 0.1));
    const labelFont = Math.max(12, Math.min(16, numberFont * 0.55));

    const gapBelowNumber = Math.max(18, numberFont * 0.8);
    const gapBetweenLabels = Math.max(12, labelFont * 1.2);

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${numberFont}px sans-serif`;
    ctx.fillStyle = "#000";
    ctx.fillText(jobsTotal, centerX, centerY - gapBelowNumber);
    ctx.font = `${labelFont}px sans-serif`;
    ctx.fillStyle = "#555";
    ctx.fillText("Total jobs", centerX, centerY);
    ctx.fillText("supported", centerX, centerY + gapBetweenLabels);
    ctx.restore();
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels,
  centerTextPlugin
);

/* ---------- viewport helpers ---------- */
const getVW = () =>
  typeof window !== "undefined" ? Math.max(320, window.innerWidth) : 1440;

const useViewportWidth = () => {
  const [w, setW] = useState(getVW());
  useEffect(() => {
    const onR = () => setW(getVW());
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  return w;
};

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

/* ---------- label wrapping ---------- */
const wrapLabel = (str, maxChars) => {
  const words = String(str || "").split(" ");
  const lines = [];
  let line = "";

  const pushChunks = (token) => {
    for (let i = 0; i < token.length; i += maxChars) {
      lines.push(token.slice(i, i + maxChars));
    }
  };

  for (const w of words) {
    if (w.length > maxChars) {
      if (line) {
        lines.push(line);
        line = "";
      }
      pushChunks(w);
      continue;
    }
    const test = (line ? line + " " : "") + w;
    if (test.length <= maxChars) line = test;
    else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
};

const EconomicImpact = ({ name = "", stateId = "", preloadedData = null }) => {
  const [isVisible, setIsVisible] = useState({
    employment: false,
    jobs: false,
    export: false,
    import: false,
  });

  const containerRef = useRef(null);
  const exportCardRef = useRef(null);
  const importCardRef = useRef(null);

  const data = preloadedData?.data?.[0] || null;
  const loading = preloadedData?.loading || false;
  const error = preloadedData?.error || null;

  /* ---------- number helpers ---------- */
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
  const formatCurrency = (amount) => {
    if (!amount) return "$0";
    const absAmount = Math.abs(amount);
    const sign = amount < 0 ? "-" : "";
    if (absAmount >= 1e9)
      return `${sign}$${(absAmount / 1e9).toFixed(3).replace(/\.?0+$/, "")}B`;
    if (absAmount >= 1e6)
      return `${sign}$${(absAmount / 1e6).toFixed(3).replace(/\.?0+$/, "")}M`;
    if (absAmount >= 1e3)
      return `${sign}$${(absAmount / 1e3).toFixed(3).replace(/\.?0+$/, "")}K`;
    return `${sign}$${absAmount}`;
  };

  /* ---------- animate in on view ---------- */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [e.target.dataset.chart]: true,
            }));
          }
        }),
      { threshold: 0.1, rootMargin: "50px" }
    );
    containerRef.current
      ?.querySelectorAll("[data-chart]")
      ?.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ---------- states ---------- */
  if (loading || error || !data) {
    const msg = loading
      ? "Loading economic impact data..."
      : error
      ? "Error loading economic impact data"
      : "No economic impact data available";
    return (
      <div className="pt-12 pb-5">
        <div className="flex flex-row items-end justify-between">
          <div>
            <h2 className="popup-title text-white">{name}</h2>
            <p className="popup-description text-white mt-2 mb-0">{msg}</p>
          </div>
          <BackToMapButton />
        </div>
        <div className="bg-white mt-5 rounded-3xl p-6">
          <div className="flex justify-center items-center py-20">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                <span className="ml-3 text-gray-600">{msg}</span>
              </>
            ) : (
              <div className={error ? "text-red-600 text-center" : "text-gray-600 text-center"}>
                <p className="text-lg font-semibold">{msg}</p>
                {error && <p className="text-sm">{String(error)}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- responsive sizing (tablet-safe & thicker bars) ---------- */
  const vw = useViewportWidth();
  const bp = vw < 768 ? "sm" : vw <= 1024 ? "md" : "lg";

  // Base label px (clamped per breakpoint) +1px bump
  const baseLabelPx =
    bp === "lg"
      ? clamp(vw * 0.008, 11, 14)
      : bp === "md"
      ? clamp(vw * 0.0072, 11, 13) // ↑ a bit on tablet
      : clamp(vw * 0.030, 11, 13); // ↑ on mobile too
  const labelFontSize = Math.round(baseLabelPx) + 1;
  const scaled = (m) => Math.max(9, Math.round(baseLabelPx * m) + 1);

  // Bar thickness (make tablet thicker)
  const barThickness =
    bp === "lg"
      ? clamp(vw * 0.018, 16, 24)
      : bp === "md"
      ? clamp(vw * 0.022, 18, 28) // ↑ tablet
      : clamp(vw * 0.036, 14, 22); // ↑ mobile

  // Chart heights
  const employmentChartHeight =
    bp === "lg"
      ? clamp(vw * 0.22, 320, 380)
      : bp === "md"
      ? clamp(vw * 0.30, 300, 360)
      : clamp(vw * 0.45, 260, 320);

  const barChartHeight =
    bp === "lg"
      ? clamp(vw * 0.19, 280, 340)
      : bp === "md"
      ? clamp(vw * 0.26, 260, 320) // ↑ tablet
      : clamp(vw * 0.38, 240, 300); // ↑ mobile

  const donutHeight =
    bp === "lg"
      ? clamp(vw * 0.22, 300, 360)
      : bp === "md"
      ? clamp(vw * 0.28, 290, 340)
      : clamp(vw * 0.34, 270, 320);

  // Label wrapping target per breakpoint (fewer chars on small screens)
  const wrapAt = bp === "lg" ? 18 : bp === "md" ? 12 : 10;

  /* ---------- data extraction ---------- */
  const employmentLabels =
    data?.employment_supported_by_foreign_affiliates?.map(
      (i) => i.esbfa_country
    ) || [];
  const employmentValues =
    data?.employment_supported_by_foreign_affiliates?.map(
      (i) => i.esbfa_value
    ) || [];

  const exportLabels =
    data?.exports_top_exports_of_goods_by_industry?.map(
      (i) => i.export_industry
    ) || [];
  const exportValues =
    data?.exports_top_exports_of_goods_by_industry?.map(
      (i) => i.export_value
    ) || [];

  const importLabels =
    data?.import_top_imports_of_goods_by_industry_from_switzerland?.map(
      (i) => i.import_industry
    ) || [];
  const importValues =
    data?.import_top_imports_of_goods_by_industry_from_switzerland?.map(
      (i) => i.import_value
    ) || [];

  const jobsSlices = [
    data?.esbfa_jobs_supported_by_swiss_affiliates,
    data?.esbfa_jobs_supported_by_services_exports_to_switzerland,
    data?.esbfajobs_supported_by_goods_exports_to_switzerland,
  ].map((v) => toNumber(v));

  /* ---------- dynamic label column width (bigger on sm/md) ---------- */
  const [leftPads, setLeftPads] = useState({ export: 32, import: 32 });

  const computeLeftPadding = (
    labels,
    fontPx,
    wrapTarget,
    containerW,
    share
  ) => {
    const widths = labels.map((lab) => {
      const lines = wrapLabel(lab, wrapTarget);
      const longest = Math.max(...lines.map((ln) => ln.length), 0);
      return longest * fontPx * 0.5;
    });
    const widest = Math.max(0, ...widths);
    const raw = Math.max(Math.ceil(widest) + 8, 24);
    const maxByCard = Math.floor(containerW * share);
    return Math.min(raw, maxByCard);
  };

  useEffect(() => {
    const recalc = () => {
      const exportW = exportCardRef.current?.offsetWidth ?? vw;
      const importW = importCardRef.current?.offsetWidth ?? vw;
      // ↑ give more left column on small/tablet so labels fit inside canvas
      const share = bp === "lg" ? 0.18 : bp === "md" ? 0.24 : 0.34;
      setLeftPads({
        export: computeLeftPadding(
          exportLabels,
          labelFontSize,
          wrapAt,
          exportW,
          share
        ),
        import: computeLeftPadding(
          importLabels,
          labelFontSize,
          wrapAt,
          importW,
          share
        ),
      });
    };
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [vw, bp, labelFontSize, wrapAt, exportLabels.join("|"), importLabels.join("|")]);

  /* ---------- chart configs ---------- */
  const employmentChartData = {
    labels: employmentLabels,
    datasets: [
      {
        data: employmentValues,
        backgroundColor: employmentLabels.map((lab) =>
          String(lab).includes("Switzerland")
            ? "rgb(228, 16, 28)"
            : "rgb(157, 157, 156)"
        ),
        borderRadius: { topLeft: 5, topRight: 5 },
        barThickness,
        categoryPercentage: bp === "md" ? 0.7 : 0.72,
        barPercentage: bp === "md" ? 0.75 : 0.78,
      },
    ],
  };

  const employmentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: formatUSNumber,
        backgroundColor: "#FFF",
        color: "#000",
        borderRadius: 5,
        padding: { top: 3, bottom: 3, left: 8, right: 8 },
        borderWidth: 0,
        borderColor: "#EDEEEE",
        font: { size: labelFontSize, lineHeight: 1.1 },
        clip: true,
      },
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      y: {
        max:
          Math.max(...(employmentValues.length ? employmentValues : [0])) *
          1.1,
        beginAtZero: true,
        ticks: { display: false },
        grid: { display: false, drawTicks: false, drawBorder: false },
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { font: { size: labelFontSize } },
      },
    },
    animation: { duration: 2000 },
  };

  const jobsChartData = {
    datasets: [
      {
        data: jobsSlices,
        backgroundColor: ["#ff0000", "#F08262", "#F9C5AF"],
        hoverOffset: 0,
        cutout: "60%",
        radius: "100%",
      },
    ],
  };

  const jobsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: formatUSNumber,
        backgroundColor: "#FFF",
        color: "#000",
        borderRadius: 5,
        padding: { top: 3, bottom: 3, left: 8, right: 8 },
        borderWidth: 1,
        borderColor: "#EDEEEE",
        font: { size: scaled(0.85), lineHeight: 1.1 },
        clip: true,
      },
      legend: { display: false },
      tooltip: { enabled: false, displayColors: false },
    },
    animation: { duration: 2000 },
    jobsTotal: data?.esbfa_total_jobs
      ? formatUSNumber(data.esbfa_total_jobs)
      : "0",
  };

  // Tablet gets a bit more category space & bar size
  const catPct = bp === "md" ? 0.68 : 0.6;
  const barPct = bp === "md" ? 0.78 : 0.7;

  const exportChartData = {
    labels: exportLabels,
    datasets: [
      {
        data: exportValues,
        backgroundColor: "rgb(157, 157, 156)",
        borderRadius: { topRight: 5, bottomRight: 5 },
        barThickness,
        categoryPercentage: catPct,
        barPercentage: barPct,
      },
    ],
  };

  const exportChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    layout: { padding: { left: leftPads.export, right: 12 } },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        labels: {
          industry: {
            anchor: "start",
            align: "left",
            offset: 2,
            clip: false, // ← show on mobile/tablet
            textAlign: "left",
            formatter: (_, ctx) => {
              const lab = ctx.chart.data.labels?.[ctx.dataIndex] ?? "";
              return wrapLabel(lab, wrapAt);
            },
            color: "#111",
            font: {
              size: bp === "sm" ? scaled(0.9) : scaled(0.95),
              weight: 500,
              lineHeight: 1.12,
            },
          },
          value: {
            anchor: "end",
            align: "right",
            offset: -4,
            clip: true, // keep inside chart area
            formatter: (val) => formatCurrency(val),
            backgroundColor: "#FFF",
            color: "#000",
            borderRadius: 4,
            padding:
              bp === "sm"
                ? { top: 1, bottom: 1, left: 3, right: 3 }
                : { top: 2, bottom: 2, left: 6, right: 6 },
            borderWidth: 1,
            borderColor: "#EDEEEE",
            font: {
              size: bp === "sm" ? scaled(0.8) : scaled(0.9),
              lineHeight: 1.1,
            },
          },
        },
      },
    },
    scales: {
      x: {
        max: Math.max(...(exportValues.length ? exportValues : [0])) * 1.08,
        grid: { display: false, drawBorder: false },
        ticks: { display: false },
      },
      y: {
        ticks: { display: false },
        grid: { display: false, drawTicks: false, drawBorder: false },
      },
    },
    animation: { duration: 2000 },
  };

  const importChartData = {
    labels: importLabels,
    datasets: [
      {
        data: importValues,
        backgroundColor: "rgb(157, 157, 156)",
        borderRadius: { topRight: 5, bottomRight: 5 },
        barThickness,
        categoryPercentage: catPct,
        barPercentage: barPct,
      },
    ],
  };

  const importChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    layout: { padding: { left: leftPads.import, right: 12 } },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        labels: {
          industry: {
            anchor: "start",
            align: "left",
            offset: 2,
            clip: false, // ← show on mobile/tablet
            textAlign: "left",
            formatter: (_, ctx) => {
              const lab = ctx.chart.data.labels?.[ctx.dataIndex] ?? "";
              return wrapLabel(lab, wrapAt);
            },
            color: "#111",
            font: {
              size: bp === "sm" ? scaled(0.9) : scaled(0.95),
              weight: 500,
              lineHeight: 1.12,
            },
          },
          value: {
            anchor: "end",
            align: "right",
            offset: -4,
            clip: true,
            formatter: (val) => formatCurrency(val),
            backgroundColor: "#FFF",
            color: "#000",
            borderRadius: 4,
            padding:
              bp === "sm"
                ? { top: 1, bottom: 1, left: 3, right: 3 }
                : { top: 2, bottom: 2, left: 6, right: 6 },
            borderWidth: 1,
            borderColor: "#EDEEEE",
            font: {
              size: bp === "sm" ? scaled(0.8) : scaled(0.9),
              lineHeight: 1.1,
            },
          },
        },
      },
    },
    scales: {
      x: {
        max: Math.max(...(importValues.length ? importValues : [0])) * 1.08,
        grid: { display: false, drawBorder: false },
        ticks: { display: false },
      },
      y: {
        ticks: { display: false },
        grid: { display: false, drawTicks: false, drawBorder: false },
      },
    },
    animation: { duration: 2000 },
  };

  const pdfUrl =
    data?.pdf_download_url ||
    `/wp-content/uploads/2025/09/${name} 2025 Swiss Impact.pdf`;

  return (
    <div ref={containerRef} className="pt-12 pb-5">
      {/* Header */}
      <div className="flex flex-row items-end justify-between">
        <div>
          <h2 className="popup-title text-white">{name}</h2>
          <p className="popup-description text-white mt-2 mb-0">
            Residents of Swiss Descent:{" "}
            <strong>
              {data?.resident_of_swiss_descent
                ? formatUSNumber(data?.resident_of_swiss_descent)
                : 0}
            </strong>
          </p>
        </div>
        <div className="flex gap-3">
          <DownloadPDF pdfUrl={pdfUrl} />
          <BackToMapButton />
        </div>
      </div>

      {/* Body */}
      <div className="chart-container flex gap-6 mt-5 flex-col lg:flex-row">
        {/* Left column: charts */}
        <div className="bg-white p-3 md:p-6 rounded-3xl max-h-[1200px] overflow-y-auto flex-1">
          <h2 className="text-xl mb-4">
            Employment Supported by Foreign Affiliates, 2022
          </h2>

          <div className="flex gap-2 flex-col md:flex-row">
            {/* Employment */}
            {employmentLabels.length > 0 && (
              <div
                data-chart="employment"
                className="bg-white p-2 rounded-2xl w-full lg:w-1/2"
              >
                {isVisible.employment && (
                  <div style={{ height: employmentChartHeight }}>
                    <Bar
                      data={employmentChartData}
                      options={employmentChartOptions}
                    />
                  </div>
                )}
                <p className="text-sm text-gray-600 mt-4">
                  Swiss Affiliates account for{" "}
                  {data?.esbfa_affiliate_percentage || 0}% of the{" "}
                  {data?.esbfa_foreign_jobs
                    ? formatUSNumber(data?.esbfa_foreign_jobs)
                    : 0}{" "}
                  jobs created by all foreign affiliates in{" "}
                  {name === "United States" ? "the United States" : name}.
                </p>
              </div>
            )}

            {/* Jobs Doughnut */}
            {jobsSlices.some((v) => v > 0) && (
              <div
                data-chart="jobs"
                className="bg-white p-6 rounded-2xl w-full lg:w-1/2"
              >
                <div className="w-full max-w-md mx-auto" style={{ height: donutHeight }}>
                  {isVisible.jobs && (
                    <Doughnut data={jobsChartData} options={jobsChartOptions} />
                  )}
                </div>
                <ul className="ei-donut-legend mt-4 text-sm text-gray-600 list-none">
                  <li>Jobs Supported by Swiss Affiliates</li>
                  <li>Jobs Supported by Services Exports to Switzerland</li>
                  <li>Jobs Supported by Goods Exports to Switzerland</li>
                </ul>
              </div>
            )}
          </div>

          {/* Export/Import */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {exportLabels.length > 0 && (
              <div
                data-chart="export"
                className="bg-white p-4 rounded-3xl"
                ref={exportCardRef}
              >
                <h2 className="text-lg font-semibold mb-4 leading-[1.2]">
                  Top Exports of Goods by Industry from {name} to Switzerland,
                  2023
                </h2>
                {isVisible.export && (
                  <div style={{ height: barChartHeight }}>
                    <Bar data={exportChartData} options={exportChartOptions} />
                  </div>
                )}
                <div className="text-sm mt-4">
                  Total Export Value of Goods ={" "}
                  {formatCurrency(data?.export_total_export_value_of_goods) ||
                    "$0"}
                </div>
              </div>
            )}

            {importLabels.length > 0 && (
              <div
                data-chart="import"
                className="bg-white p-4 rounded-3xl"
                ref={importCardRef}
              >
                <h2 className="text-lg font-semibold mb-4 leading-[1.2]">
                  Top Imports of Goods by Industry from {name} to Switzerland,
                  2023
                </h2>
                {isVisible.import && (
                  <div style={{ height: barChartHeight }}>
                    <Bar data={importChartData} options={importChartOptions} />
                  </div>
                )}
                <div className="text-sm mt-4">
                  Total Import Value of Goods ={" "}
                  {data?.import_total_import_value
                    ? formatCurrency(data?.import_total_import_value)
                    : "$0"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: companies */}
        <div>
          {Array.isArray(data?.companies_located_in_state) &&
            data.companies_located_in_state.length > 0 && (
              <div className="bg-white p-6 rounded-3xl lg:min-w-[300px] lg:max-w-xs">
                <h2 className="text-xl mb-4">
                  Swiss Companies Located in {name}
                </h2>
                <div className="grid max-h-[1000px] overflow-y-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2">
                  {data.companies_located_in_state.map((company, index) => (
                    <div key={index} className="text-sm text-gray-700 py-1">
                      {company.company_name}
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default EconomicImpact;

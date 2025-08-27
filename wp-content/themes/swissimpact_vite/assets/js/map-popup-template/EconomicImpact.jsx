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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);

// ===== Demo data (unchanged) =====
const DEMO_DATA = {
  data: [
    {
      // Basic stats
      resident_of_swiss_descent: "7,000",
      esbfa_affiliate_percentage: "3.34%",
      esbfa_foreign_jobs: "12,841",

      // Employment data
      employment: [19835, 22600, 20400, 16000, 12900, 7000],
      employment_label: [
        "Virginia",
        "Germany",
        "France",
        "Canada",
        "Japan",
        "Switzerland",
      ],
      index_color: 5, // Switzerland is highlighted

      // Jobs distribution
      jobs: [7000, 5714, 127],

      // Export data
      export: [18, 15, 5.6, 5.2, 4.4],
      export_label: [
        "Machinery",
        "Transportation Equipment",
        "Agricultural Products",
        "Computer & Electronic Products",
        "Electrical Equipment",
      ],
      export_amount: "$58.0M",

      // Import data
      import: [79, 66, 43, 41, 23],
      import_label: [
        "Fabricated Metal Products",
        "Computer & Electronic Products",
        "Machinery",
        "Beverages & Tobacco Products",
        "Electrical Equipment",
      ],
      import_amount: "$295.0M",

      // Companies list
      companies: [
        "ABB",
        "Adecco",
        "Arktis Radiation Detectors",
        "Ascom",
        "Auterion",
        "Bally",
        "Bucherer Group",
        "Chubb (ACE)",
        "Endress+Hauser",
        "ERNI Electronics",
        "Energy Vault",
        "FRACHT FWO",
        "Gategroup",
        "Holcim",
        "HV Technologies",
        "Keller",
        "KRISS",
        "Kuehne+Nagel",
        "Liebherr",
        "Lindt & Sprüngli",
        "Nagra",
        "Nespresso",
        "Nestlé",
        "Quadrant",
        "Record (agta record)",
        "Renesco",
        "Safran Vectronix",
        "Schaffner EMC",
        "Schindler",
        "SGS",
        "SICPA",
        "Sika",
        "Spahr Metric",
        "Sulzer",
        "Swatch",
        "Swisslog",
        "Swissport",
        "Syngenta",
        "TE Connectivity",
        "The Swiss Bakery",
        "u-blox",
        "UBS",
        "United Grinding",
        "Zurich",
      ],

      // Summary counts (from swissImpact structure)
      science_academia: 3,
      apprenticeship_companies: 12,
      industry_clusters: 8,
      swiss_representations: ["Embassy", "Trade Office", "Cultural Center"],
    },
  ],
  loading: false,
  error: null,
};

// Safe viewport helpers
const vp = () => (typeof window !== "undefined" ? window.innerWidth : 1440);
const isLg = () => vp() > 1024;

const EconomicImpact = ({ name = "", stateId = "", preloadedData = null }) => {
  const [isVisible, setIsVisible] = useState({
    employment: false,
    jobs: false,
    export: false,
    import: false,
    exportService: false,
    importService: false,
  });

  const containerRef = useRef(null);
  const exportCardRef = useRef(null);

  // Prefer preloadedData if it has rows; otherwise use demo
  const usingPreloaded = !!(
    preloadedData &&
    Array.isArray(preloadedData.data) &&
    preloadedData.data.length > 0
  );
  const actualData = usingPreloaded ? preloadedData : DEMO_DATA;

  const data = actualData?.data?.[0] || null;
  const loading = usingPreloaded ? !!preloadedData?.loading : false;
  const error = usingPreloaded ? preloadedData?.error ?? null : null;

  function formatUSNumber(number) {
    return number.toLocaleString("en-US");
  }

  // Helper function to format currency (expects numbers in millions unless noted)
  const formatCurrency = (amount) => {
    if (amount === 0) return "$0";

    const absAmount = Math.abs(amount);
    const sign = amount < 0 ? "-" : "";

    if (absAmount >= 1e9) {
      // Billions
      const billions = absAmount / 1e9;
      return `${sign}$${billions.toFixed(3).replace(/\.?0+$/, "")}B`;
    } else if (absAmount >= 1e6) {
      // Millions
      const millions = absAmount / 1e6;
      return `${sign}$${millions.toFixed(3).replace(/\.?0+$/, "")}M`;
    } else if (absAmount >= 1e3) {
      // Thousands
      const thousands = absAmount / 1e3;
      return `${sign}$${thousands.toFixed(3).replace(/\.?0+$/, "")}K`;
    } else {
      // Less than 1000
      return `${sign}$${absAmount}`;
    }
  };

  // Split a string into multiple lines not exceeding `maxChars` per line.
  const wrapLabel = (str, maxChars) => {
    const words = String(str || "").split(" ");
    const lines = [];
    let line = "";

    for (const w of words) {
      const test = (line ? line + " " : "") + w;
      if (test.length <= maxChars) {
        line = test;
      } else {
        if (line) lines.push(line);
        line = w;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  // Estimate left padding so the wrapped label fits inside the canvas.
  // Uses a rough width factor (0.6 * fontSize per char). Clamp to a max.
  const computeLeftPadding = (labels, fontPx, wrapAt = 22, maxPad = 240) => {
    const widths = labels.map((lab) => {
      const lines = wrapLabel(lab, wrapAt);
      const longest = Math.max(...lines.map((ln) => ln.length), 0);
      return longest * fontPx * 0.6; // approx width in px
    });
    const widest = Math.max(0, ...widths);
    // +16px breathing room; min 32px base
    return Math.min(Math.max(Math.ceil(widest) + 16, 32), maxPad);
  };

  // Sum total jobs
  const sumTotalJobs = (jobsArray) => {
    const sum = (jobsArray || [])
      .slice(0, 3)
      .reduce((acc, val) => acc + (Number(val) || 0), 0);
    return formatUSNumber(sum);
  };

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chartType = entry.target.dataset.chart;
            setIsVisible((prev) => ({ ...prev, [chartType]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const chartElements =
      containerRef.current?.querySelectorAll("[data-chart]");
    chartElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Loading/Error states (only show when we’re using preloaded)
  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">
            Error Loading Economic Impact Data
          </h2>
          <p>{String(error)}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="text-center text-gray-600">
          <h2 className="text-xl font-semibold mb-2">
            No Economic Impact Data Available
          </h2>
          <p>
            Economic impact information for {name} is not currently available.
          </p>
        </div>
      </div>
    );
  }

  // ===== Chart configs (compute sizes from viewport safely) =====
  const barThickness = isLg() ? vp() * 0.025 : vp() * 0.0468;
  const labelFontSize = isLg() ? vp() * 0.00833 : vp() * 0.03889;
  console.log(
    "EconomicImpact data:",
    data,
    data?.employment_supported_by_foreign_affiliates.map(
      (item) => item.esbfa_country
    )
  );
  // Employment Chart
  const employmentChartData = {
    labels: data?.employment_supported_by_foreign_affiliates.map(
      (item) => item.esbfa_country
    ),
    datasets: [
      {
        data: data?.employment_supported_by_foreign_affiliates.map(
          (item) => item.esbfa_value
        ),
        backgroundColor: (data?.employment_supported_by_foreign_affiliates).map(
          (item, index) =>
            item.esbfa_country.includes("Switzerland")
              ? "rgb(228, 16, 28)"
              : "rgb(157, 157, 156)"
        ),
        borderRadius: { topLeft: 5, topRight: 5 },
        barThickness,
      },
    ],
  };

  const employmentChartOptions = {
    responsive: true,
    aspectRatio: isLg() ? 2 : 1.02,
    plugins: {
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: formatUSNumber,
        backgroundColor: "#FFF",
        color: "#000",
        borderRadius: 5,
        padding: { top: 4, bottom: 4, left: 12, right: 12 },
        borderWidth: 0,
        borderColor: "#EDEEEE",
        font: { size: labelFontSize },
      },
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      y: {
        max:
          Math.max(
            ...(data?.employment_supported_by_foreign_affiliates.map(
              (item) => item.esbfa_value
            ) || [0])
          ) * 1.2,
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

  // Jobs Doughnut Chart
  const jobsChartData = {
    datasets: [
      {
        data:
          [
            data?.esbfa_jobs_supported_by_services_exports_to_switzerland,
            data?.esbfa_jobs_supported_by_swiss_affiliates,
            data?.esbfajobs_supported_by_goods_exports_to_switzerland,
          ] || [],
        backgroundColor: ["#ff0000", "#F08262", "#F9C5AF"],
        hoverOffset: 0,
        cutout: "60%",
        radius: "80%",
      },
    ],
  };

  const jobsChartOptions = {
    responsive: true,
    aspectRatio: isLg() ? 1.6 : 1,
    plugins: {
      datalabels: {
        formatter: formatUSNumber,
        backgroundColor: "#FFF",
        color: "#000",
        borderRadius: 5,
        padding: { top: 4, bottom: 4, left: 12, right: 12 },
        borderWidth: 1,
        borderColor: "#EDEEEE",
        font: { size: labelFontSize },
      },
      legend: { display: false },
      tooltip: { enabled: false },
    },
    animation: { duration: 2000 },
  };

  // Export Chart
  const exportChartData = {
    labels:
      data?.exports_top_exports_of_goods_by_industry.map(
        (item) => item.export_industry
      ) || [],
    datasets: [
      {
        data:
          data?.exports_top_exports_of_goods_by_industry.map(
            (item) => item.export_value
          ) || [],
        backgroundColor: "rgb(157, 157, 156)",
        borderRadius: { topRight: 5, bottomRight: 5 },
        barThickness,
      },
    ],
  };

  const exportLabels =
    data?.exports_top_exports_of_goods_by_industry?.map(
      (i) => i.export_industry
    ) || [];
  const importLabels =
    data?.import_top_imports_of_goods_by_industry_from_switzerland?.map(
      (i) => i.import_industry
    ) || [];

  const wrapAt = isLg() ? 28 : 18; // tweak to taste
  const leftPadExport = computeLeftPadding(exportLabels, labelFontSize, wrapAt);
  const leftPadImport = computeLeftPadding(importLabels, labelFontSize, wrapAt);

  const exportChartOptions = {
    responsive: true,
    aspectRatio: isLg() ? 1.5 : 0.5,
    indexAxis: "y",
    layout: {
      padding: { left: leftPadExport }, // <= dynamic padding
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        labels: {
          // LEFT label: the (possibly wrapped) industry name
          industry: {
            anchor: "start",
            align: "left",
            offset: 6,
            clip: false, // allow drawing outside chartArea
            textAlign: "left",
            formatter: (_, ctx) => {
              const lab = ctx.chart.data.labels?.[ctx.dataIndex] ?? "";
              return wrapLabel(lab, wrapAt); // return array => multi-line
            },
            color: "#111",
            font: { size: labelFontSize, weight: 500 },
          },
          // RIGHT label: the value pill
          value: {
            anchor: "end",
            align: "right",
            formatter: (val) => formatCurrency(val),
            backgroundColor: "#FFF",
            color: "#000",
            borderRadius: 5,
            padding: { top: 4, bottom: 4, left: 12, right: 12 },
            borderWidth: 1,
            borderColor: "#EDEEEE",
            font: { size: labelFontSize },
          },
        },
      },
    },
    scales: {
      x: {
        max:
          Math.max(
            ...(data?.exports_top_exports_of_goods_by_industry?.map(
              (i) => i.export_value
            ) || [0])
          ) * 1.35,
        grid: { display: false, drawBorder: false },
        ticks: { display: false },
      },
      y: {
        ticks: { display: false }, // keep axis clean
        grid: { display: false, drawTicks: false, drawBorder: false },
      },
    },
    animation: { duration: 2000 },
  };

  // Import Chart
  const importChartData = {
    labels:
      data?.import_top_imports_of_goods_by_industry_from_switzerland.map(
        (item) => item.import_industry
      ) || [],
    datasets: [
      {
        data:
          data?.import_top_imports_of_goods_by_industry_from_switzerland.map(
            (item) => item.import_value
          ) || [],
        backgroundColor: "rgb(157, 157, 156)",
        borderRadius: { topRight: 5, bottomRight: 5 },
        barThickness,
      },
    ],
  };

  const importChartOptions = {
    ...exportChartOptions,
    scales: {
      x: {
        max:
          Math.max(
            ...(data?.import_top_imports_of_goods_by_industry_from_switzerland.map(
              (item) => item.import_value
            ) || [0])
          ) * 1.35,
        grid: { display: false, drawBorder: false },
        ticks: { display: false },
      },
      y: {
        ticks: { display: false },
        grid: { display: false, drawTicks: false, drawBorder: false },
      },
    },
  };

  return (
    <div ref={containerRef} className="pt-12 pb-5">
      {/* Header Section */}
      <div
        className="flex flex-row items-end space-evenly"
        style={{ justifyContent: "space-between" }}
      >
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
        <BackToMapButton />
      </div>

      <div className="chart-container flex gap-6 mt-5 flex-col lg:flex-row">
        {/* Employment Chart */}
        <div className="bg-white p-6 rounded-3xl">
          <h2 className="text-xl mb-4">
            Employment Supported by Foreign Affiliates
          </h2>
          <div className="flex gap-2 flex-col lg:flex-row">
            {Array.isArray(data?.employment_supported_by_foreign_affiliates) &&
              data.employment_supported_by_foreign_affiliates.length > 0 && (
                <div data-chart="employment">
                  {isVisible.employment && (
                    <Bar
                      data={employmentChartData}
                      options={employmentChartOptions}
                    />
                  )}
                  <p className="text-sm text-gray-600 mt-4">
                    Swiss Affiliates account for{" "}
                    {data?.esbfa_affiliate_percentage || 0}% of the{" "}
                    {data?.esbfa_foreign_jobs
                      ? formatUSNumber(data?.esbfa_foreign_jobs)
                      : 0}{" "}
                    jobs created by all foreign affiliates in {name}.
                  </p>
                </div>
              )}
            {/* Jobs Doughnut Chart */}
            {data?.esbfa_jobs_supported_by_services_exports_to_switzerland &&
              data?.esbfa_jobs_supported_by_services_exports_to_switzerland &&
              data?.esbfa_jobs_supported_by_swiss_affiliates && (
                <div data-chart="jobs" className="bg-white p-6">
                  <div className="w-full max-w-md mx-auto">
                    {isVisible.jobs && (
                      <Doughnut
                        data={jobsChartData}
                        options={jobsChartOptions}
                      />
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

          {/* Export/Import Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export Chart */}
            {Array.isArray(data?.exports_top_exports_of_goods_by_industry) &&
              data.exports_top_exports_of_goods_by_industry.length > 0 && (
                <div
                  data-chart="export"
                  className="bg-white p-6 rounded-3xl"
                  ref={exportCardRef}
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Top Exports of Goods by Industry from Georgia to Switzerland
                  </h2>
                  {isVisible.export && (
                    <Bar data={exportChartData} options={exportChartOptions} />
                  )}
                  <div className="text-sm mt-4">
                    Total Export Value of Goods ={" "}
                    {formatCurrency(data?.export_total_export_value_of_goods) ||
                      "$0"}
                  </div>
                </div>
              )}

            {/* Import Chart */}
            {Array.isArray(
              data?.import_top_imports_of_goods_by_industry_from_switzerland
            ) &&
              data.import_top_imports_of_goods_by_industry_from_switzerland
                .length > 0 && (
                <div data-chart="import" className="bg-white p-6 rounded-3xl">
                  <h2 className="text-xl font-semibold mb-4">
                    Top Imports of Goods by Industry from {name} to Switzerland
                  </h2>
                  {isVisible.import && (
                    <Bar data={importChartData} options={importChartOptions} />
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

        <div>
          {/* Companies List for non-US states */}
          {name !== "United States" &&
            Array.isArray(data?.companies_located_in_state) &&
            data.companies_located_in_state.length > 0 && (
              <div className="bg-white p-6 rounded-3xl lg:min-w-[300px]">
                <h2 className="text-xl mb-4">
                  Swiss Companies Located in {name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

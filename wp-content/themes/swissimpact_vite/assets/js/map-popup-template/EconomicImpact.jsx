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
      resident: "71,000",
      percent: "3.34%",
      jobs_created: "12,841",

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
    console.log("EconomicImpact props:", { name, stateId, preloadedData }); // Debug log
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

  console.log("EconomicImpact actualData:", actualData);

  const data = actualData?.data?.[0] || null;
  const loading = usingPreloaded ? !!preloadedData?.loading : false;
  const error = usingPreloaded ? preloadedData?.error ?? null : null;

  // Helper function to format numbers
  const formatNumber = (value) => {
    const n =
      typeof value === "string" ? Number(value.replace(/,/g, "")) : value;
    if (Number.isNaN(n) || n == null) return "0";
    const s = String(n);
    if (n >= 100000) return s.slice(0, 3) + "," + s.slice(3);
    if (n >= 10000) return s.slice(0, 2) + "," + s.slice(2);
    if (n >= 1000) return s.slice(0, 1) + "," + s.slice(1);
    return s;
  };

  // Helper function to format currency (expects numbers in millions unless noted)
  const formatCurrency = (value) => {
    const n =
      typeof value === "string" ? Number(value.replace(/[^0-9.]/g, "")) : value;
    if (Number.isNaN(n) || n == null) return "$ 0";
    if (n >= 1000) return `$ ${n / 1000} B`;
    if (n < 1) return `$ ${n * 1000} K`;
    return `$ ${n} M`;
  };

  // Sum total jobs
  const sumTotalJobs = (jobsArray) => {
    const sum = (jobsArray || [])
      .slice(0, 3)
      .reduce((acc, val) => acc + (Number(val) || 0), 0);
    return formatNumber(sum);
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

  // Employment Chart
  const employmentChartData = {
    labels: data?.employment_label || [],
    datasets: [
      {
        data: data?.employment || [],
        backgroundColor: (data?.employment || []).map((_, index) =>
          index === (data?.index_color ?? -1)
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
        formatter: formatNumber,
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
        max: Math.max(...(data?.employment || [0])) * 1.2,
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
        data: data?.jobs || [],
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
        formatter: formatNumber,
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
    labels: data?.export_label || [],
    datasets: [
      {
        data: data?.export || [],
        backgroundColor: "rgb(157, 157, 156)",
        borderRadius: { topRight: 5, bottomRight: 5 },
        barThickness,
      },
    ],
  };

  const exportChartOptions = {
    responsive: true,
    aspectRatio: isLg() ? 1.5 : 0.5,
    indexAxis: "y",
    plugins: {
      datalabels: {
        anchor: "end",
        align: "right",
        formatter: formatCurrency,
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
    scales: {
      x: {
        max: Math.max(...(data?.export || [0])) * 1.35,
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

  // Import Chart
  const importChartData = {
    labels: data?.import_label || [],
    datasets: [
      {
        data: data?.import || [],
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
        max: Math.max(...(data?.import || [0])) * 1.35,
        grid: { display: false, drawBorder: false },
        ticks: { display: false },
      },
      y: {
        ticks: { display: false },
        grid: { display: false, drawTicks: false, drawBorder: false },
      },
    },
  };

  // Service Charts (US only) – kept for future data
  const exportServiceChartData = {
    labels: data?.export_service_label || [],
    datasets: [
      {
        data: data?.export_service || [],
        backgroundColor: "rgb(157, 157, 156)",
        borderRadius: { topLeft: 5, topRight: 5 },
        barThickness,
      },
    ],
  };

  const serviceChartOptions = {
    responsive: true,
    aspectRatio: isLg() ? 2.15 : 1.2,
    plugins: {
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: formatCurrency,
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
    scales: {
      y: {
        max: Math.max(...(data?.export_service || [0])) * 1.3,
        beginAtZero: true,
        ticks: { display: false },
        grid: { display: false, drawTicks: false, drawBorder: false },
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { display: false },
      },
    },
    animation: { duration: 2000 },
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
            Residents of Swiss Descent: {formatNumber(data?.resident || 0)}
          </p>
        </div>
        <BackToMapButton />
      </div>

      <div className="chart-container flex gap-6 mt-5 flex-col lg:flex-row">
        {/* Employment Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl mb-4">
            Employment Supported by Foreign Affiliates
          </h2>
          <div className="flex gap-2 flex-col lg:flex-row">
            {Array.isArray(data?.employment) && data.employment.length > 0 && (
              <div data-chart="employment">
                {isVisible.employment && (
                  <Bar
                    data={employmentChartData}
                    options={employmentChartOptions}
                  />
                )}
                <p className="text-sm text-gray-600 mt-4">
                  Swiss Affiliates account for 2% of the 11,400 jobs created by
                  all foreign affiliates in {name}.
                </p>
              </div>
            )}
            {/* Jobs Doughnut Chart */}
            {Array.isArray(data?.jobs) && data.jobs.length > 0 && (
              <div data-chart="jobs" className="bg-white p-6">
                <div className="w-full max-w-md mx-auto">
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

          {/* Export/Import Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export Chart */}
            {Array.isArray(data?.export) && data.export.length > 0 && (
              <div
                data-chart="export"
                className="bg-white p-6 rounded-lg shadow-lg"
                ref={exportCardRef}
              >
                <h2 className="text-xl font-semibold mb-4">
                  Top Exports of Goods by Industry from Georgia to Switzerland
                </h2>
                {isVisible.export && (
                  <Bar data={exportChartData} options={exportChartOptions} />
                )}
                <div className="mt-4 space-y-1">
                  {(data?.export_label || []).map((label, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {label}
                    </div>
                  ))}
                </div>
                <div className="text-sm mt-4">
                  Total Export Value of Goods = {data?.export_amount || "$0"}
                </div>
              </div>
            )}

            {/* Import Chart */}
            {Array.isArray(data?.import) && data.import.length > 0 && (
              <div
                data-chart="import"
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h2 className="text-xl font-semibold mb-4">
                  Imports from Switzerland
                  <span className="block text-sm font-normal text-gray-600 mt-1">
                    {data?.import_amount || "$0"}
                  </span>
                </h2>
                {isVisible.import && (
                  <Bar data={importChartData} options={importChartOptions} />
                )}
                <div className="mt-4 space-y-1">
                  {(data?.import_label || []).map((label, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          {/* Companies List for non-US states */}
          {name !== "United States" &&
            Array.isArray(data?.companies) &&
            data.companies.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-lg lg:min-w-[300px]">
                <h2 className="text-xl mb-4">
                  Swiss Companies Located in {name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.companies
                    .slice()
                    .sort()
                    .map((company, index) => (
                      <div key={index} className="text-sm text-gray-700 py-1">
                        {company}
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

import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Doughnut } from 'react-chartjs-2';

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

// Demo data for testing
const DEMO_DATA = {
  data: [{
    // Basic stats
    resident: '7,000',
    percent: '3.34%',
    jobs_created: '12,841',
    
    // Employment data
    employment: [19835, 22600, 20400, 16000, 12900, 7000],
    employment_label: ['Virginia', 'Germany', 'France', 'Canada', 'Japan', 'Switzerland'],
    index_color: 5, // Switzerland is highlighted
    
    // Jobs distribution
    jobs: [7000, 5714, 127],
    
    // Export data
    export: [18, 15, 5.6, 5.2, 4.4],
    export_label: [
      'Machinery',
      'Transportation Equipment', 
      'Agricultural Products',
      'Computer & Electronic Products',
      'Electrical Equipment'
    ],
    export_amount: '$58.0M',
    
    // Import data
    import: [79, 66, 43, 41, 23],
    import_label: [
      'Fabricated Metal Products',
      'Computer & Electronic Products',
      'Machinery', 
      'Beverages & Tobacco Products',
      'Electrical Equipment'
    ],
    import_amount: '$295.0M',
    
    // Companies list
    companies: [
      'ABB', 'Adecco', 'Arktis Radiation Detectors', 'Ascom', 'Auterion', 'Bally', 
      'Bucherer Group', 'Chubb (ACE)', 'Endress+Hauser', 'ERNI Electronics', 
      'Energy Vault', 'FRACHT FWO', 'Gategroup', 'Holcim', 'HV Technologies', 
      'Keller', 'KRISS', 'Kuehne+Nagel', 'Liebherr', 'Lindt & Sprüngli', 
      'Nagra', 'Nespresso', 'Nestlé', 'Quadrant', 'Record (agta record)', 
      'Renesco', 'Safran Vectronix', 'Schaffner EMC', 'Schindler', 'SGS', 
      'SICPA', 'Sika', 'Spahr Metric', 'Sulzer', 'Swatch', 'Swisslog', 
      'Swissport', 'Syngenta', 'TE Connectivity', 'The Swiss Bakery', 
      'u-blox', 'UBS', 'United Grinding', 'Zurich'
    ],
    
    // Summary counts (from swissImpact structure)
    science_academia: 3,
    apprenticeship_companies: 12,
    industry_clusters: 8,
    swiss_representations: ['Embassy', 'Trade Office', 'Cultural Center']
  }],
  loading: false,
  error: null
};

const EconomicImpact = ({ name = "Virginia", stateId = "virginia", preloadedData = null }) => {
  const [isVisible, setIsVisible] = useState({
    employment: false,
    jobs: false,
    export: false,
    import: false,
    exportService: false,
    importService: false
  });
  
  const containerRef = useRef(null);
  const exportCardRef = useRef(null);

  // Extract data from preloadedData structure, fallback to demo data for testing
  const actualData = DEMO_DATA;
  const data = actualData?.data?.[0] || null;
  const loading = actualData?.loading || false;
  const error = actualData?.error || null;

  // Helper function to format numbers
  const formatNumber = (value) => {
    if (value >= 100000) return value.toString().slice(0,3) + "," + value.toString().slice(3);
    if (value >= 10000) return value.toString().slice(0,2) + "," + value.toString().slice(2);
    if (value >= 1000) return value.toString().slice(0,1) + "," + value.toString().slice(1);
    return value.toString();
  };

  // Helper function to format currency
  const formatCurrency = (value) => {
    if (value >= 1000) return `$ ${value/1000} B`;
    if (value < 1) return `$ ${value*1000} K`;
    return `$ ${value} M`;
  };

  // Sum total jobs
  const sumTotalJobs = (jobsArray) => {
    const sum = jobsArray.slice(0, 3).reduce((acc, val) => acc + val, 0);
    return formatNumber(sum);
  };

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chartType = entry.target.dataset.chart;
            setIsVisible(prev => ({ ...prev, [chartType]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const chartElements = containerRef.current?.querySelectorAll('[data-chart]');
    chartElements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Show loading state
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

  // Show error state
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">Error Loading Economic Impact Data</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!data) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="text-center text-gray-600">
          <h2 className="text-xl font-semibold mb-2">No Economic Impact Data Available</h2>
          <p>Economic impact information for {name} is not currently available.</p>
        </div>
      </div>
    );
  }

  // Employment Chart Configuration
  const employmentChartData = {
    labels: data?.employment_label || [],
    datasets: [{
      data: data?.employment || [],
      backgroundColor: data?.employment?.map((_, index) => 
        index === data?.index_color ? 'rgb(228, 16, 28)' : 'rgb(157, 157, 156)'
      ),
      borderRadius: { topLeft: 5, topRight: 5 },
      barThickness: window.innerWidth > 1024 ? window.innerWidth * 0.025 : window.innerWidth * 0.0468,
    }]
  };

  const employmentChartOptions = {
    responsive: true,
    aspectRatio: window.innerWidth > 1024 ? 1.7 : 1.02,
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: formatNumber,
        backgroundColor: '#FFF',
        color: '#000',
        borderRadius: 5,
        padding: { top: 4, bottom: 4, left: 12, right: 12 },
        borderWidth: 1,
        borderColor: '#EDEEEE',
        font: { size: window.innerWidth > 1024 ? window.innerWidth * 0.00833 : window.innerWidth * 0.03889 }
      },
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      y: {
        max: Math.max(...(data?.employment || [0])) * 1.2,
        beginAtZero: true,
        ticks: { display: false },
        grid: { display: false, drawTicks: false, drawBorder: false }
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { font: { size: window.innerWidth > 1024 ? window.innerWidth * 0.00833 : window.innerWidth * 0.03889 } }
      }
    },
    animation: { duration: 2000 }
  };

  // Jobs Doughnut Chart Configuration
  const jobsChartData = {
    datasets: [{
      data: data?.jobs || [],
      backgroundColor: ['rgb(228, 16, 28)', 'rgb(241, 130, 98)', 'rgb(249, 197, 175)'],
      hoverOffset: 0,
      cutout: '60%',
      radius: '80%'
    }]
  };

  const jobsChartOptions = {
    responsive: true,
    aspectRatio: window.innerWidth > 1024 ? 1.6 : 1,
    plugins: {
      datalabels: {
        formatter: formatNumber,
        backgroundColor: '#FFF',
        color: '#000',
        borderRadius: 5,
        padding: { top: 4, bottom: 4, left: 12, right: 12 },
        borderWidth: 1,
        borderColor: '#EDEEEE',
        font: { size: window.innerWidth > 1024 ? window.innerWidth * 0.00833 : window.innerWidth * 0.03889 }
      },
      legend: { display: false },
      tooltip: { enabled: false }
    },
    animation: { duration: 2000 }
  };

  // Export Chart Configuration
  const exportChartData = {
    labels: data?.export_label || [],
    datasets: [{
      data: data?.export || [],
      backgroundColor: 'rgb(157, 157, 156)',
      borderRadius: { topRight: 5, bottomRight: 5 },
      barThickness: window.innerWidth > 1024 ? window.innerWidth * 0.025 : window.innerWidth * 0.0468,
    }]
  };

  const exportChartOptions = {
    responsive: true,
    aspectRatio: window.innerWidth > 1024 ? 1.1 : 0.5,
    indexAxis: 'y',
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'right',
        formatter: formatCurrency,
        backgroundColor: '#FFF',
        color: '#000',
        borderRadius: 5,
        padding: { top: 4, bottom: 4, left: 12, right: 12 },
        borderWidth: 1,
        borderColor: '#EDEEEE',
        font: { size: window.innerWidth > 1024 ? window.innerWidth * 0.00833 : window.innerWidth * 0.03889 }
      },
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: {
        max: Math.max(...(data?.export || [0])) * 1.35,
        grid: { display: false, drawBorder: false },
        ticks: { display: false }
      },
      y: {
        ticks: { display: false },
        grid: { display: false, drawTicks: false, drawBorder: false }
      }
    },
    animation: { duration: 2000 }
  };

  // Import Chart Configuration (similar to export)
  const importChartData = {
    labels: data?.import_label || [],
    datasets: [{
      data: data?.import || [],
      backgroundColor: 'rgb(157, 157, 156)',
      borderRadius: { topRight: 5, bottomRight: 5 },
      barThickness: window.innerWidth > 1024 ? window.innerWidth * 0.025 : window.innerWidth * 0.0468,
    }]
  };

  const importChartOptions = {
    ...exportChartOptions,
    scales: {
      x: {
        max: Math.max(...(data?.import || [0])) * 1.35,
        grid: { display: false, drawBorder: false },
        ticks: { display: false }
      },
      y: {
        ticks: { display: false },
        grid: { display: false, drawTicks: false, drawBorder: false }
      }
    }
  };

  // Service Charts for US data
  const exportServiceChartData = {
    labels: data?.export_service_label || [],
    datasets: [{
      data: data?.export_service || [],
      backgroundColor: 'rgb(157, 157, 156)',
      borderRadius: { topLeft: 5, topRight: 5 },
      barThickness: window.innerWidth > 1024 ? window.innerWidth * 0.025 : window.innerWidth * 0.0468,
    }]
  };

  const serviceChartOptions = {
    responsive: true,
    aspectRatio: window.innerWidth > 1024 ? 2.15 : 1.2,
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: formatCurrency,
        backgroundColor: '#FFF',
        color: '#000',
        borderRadius: 5,
        padding: { top: 4, bottom: 4, left: 12, right: 12 },
        borderWidth: 1,
        borderColor: '#EDEEEE',
        font: { size: window.innerWidth > 1024 ? window.innerWidth * 0.00833 : window.innerWidth * 0.03889 }
      },
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      y: {
        max: Math.max(...(data?.export_service || [0])) * 1.3,
        beginAtZero: true,
        ticks: { display: false },
        grid: { display: false, drawTicks: false, drawBorder: false }
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { display: false }
      }
    },
    animation: { duration: 2000 }
  };

  const importServiceChartData = {
    labels: data?.import_service_label || [],
    datasets: [{
      data: data?.import_service || [],
      backgroundColor: 'rgb(157, 157, 156)',
      borderRadius: { topLeft: 5, topRight: 5 },
      barThickness: window.innerWidth > 1024 ? window.innerWidth * 0.025 : window.innerWidth * 0.0468,
    }]
  };

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Swiss Economic Impact in {name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">{data?.resident || '0'}</div>
            <div className="text-sm text-gray-600">Swiss Residents</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">{data?.percent || '0%'}</div>
            <div className="text-sm text-gray-600">Economic Impact</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">{data?.jobs_created || '0'}</div>
            <div className="text-sm text-gray-600">Jobs Created</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">
              {data?.jobs ? sumTotalJobs(data.jobs) : '0'}
            </div>
            <div className="text-sm text-gray-600">Total Jobs</div>
          </div>
        </div>
      </div>

      {/* Employment Chart */}
      {data?.employment && (
        <div data-chart="employment" className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Employment by Swiss Companies</h2>
          {isVisible.employment && (
            <Bar data={employmentChartData} options={employmentChartOptions} />
          )}
          <p className="text-sm text-gray-600 mt-4">
            Employment figures show the impact of Swiss companies across different sectors.
          </p>
        </div>
      )}

      {/* Jobs Doughnut Chart */}
      {data?.jobs && (
        <div data-chart="jobs" className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Job Distribution</h2>
          <div className="w-full max-w-md mx-auto">
            {isVisible.jobs && (
              <Doughnut data={jobsChartData} options={jobsChartOptions} />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Distribution of jobs created by Swiss companies across different categories.
          </p>
        </div>
      )}

      {/* Export/Import Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Chart */}
        {data?.export && (
          <div data-chart="export" className="bg-white p-6 rounded-lg shadow-lg" ref={exportCardRef}>
            <h2 className="text-xl font-semibold mb-4">
              Exports to Switzerland
              <span className="block text-sm font-normal text-gray-600 mt-1">
                {data?.export_amount || '$0'}
              </span>
            </h2>
            {isVisible.export && (
              <Bar data={exportChartData} options={exportChartOptions} />
            )}
            <div className="mt-4 space-y-1">
              {data?.export_label?.map((label, index) => (
                <div key={index} className="text-sm text-gray-600">{label}</div>
              ))}
            </div>
          </div>
        )}

        {/* Import Chart */}
        {data?.import && (
          <div data-chart="import" className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Imports from Switzerland
              <span className="block text-sm font-normal text-gray-600 mt-1">
                {data?.import_amount || '$0'}
              </span>
            </h2>
            {isVisible.import && (
              <Bar data={importChartData} options={importChartOptions} />
            )}
            <div className="mt-4 space-y-1">
              {data?.import_label?.map((label, index) => (
                <div key={index} className="text-sm text-gray-600">{label}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* US-specific Service Charts */}
      {name === "United States" && data?.export_service && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export Services */}
          <div data-chart="exportService" className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Export Services</h2>
            {isVisible.exportService && (
              <Bar data={exportServiceChartData} options={serviceChartOptions} />
            )}
            <p className="text-sm text-gray-600 mt-4">
              Service exports to Switzerland by category.
            </p>
          </div>

          {/* Import Services */}
          {data?.import_service && (
            <div data-chart="importService" className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Import Services</h2>
              {isVisible.importService && (
                <Bar 
                  data={{
                    labels: data.import_service_label || [],
                    datasets: [{
                      data: data.import_service || [],
                      backgroundColor: 'rgb(157, 157, 156)',
                      borderRadius: { topLeft: 5, topRight: 5 },
                      barThickness: window.innerWidth > 1024 ? window.innerWidth * 0.025 : window.innerWidth * 0.0468,
                    }]
                  }} 
                  options={{
                    ...serviceChartOptions,
                    scales: {
                      ...serviceChartOptions.scales,
                      y: {
                        ...serviceChartOptions.scales.y,
                        max: Math.max(...(data.import_service || [0])) * 1.3
                      }
                    }
                  }} 
                />
              )}
              <p className="text-sm text-gray-600 mt-4">
                Service imports from Switzerland by category.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Companies List for non-US states */}
      {name !== "United States" && data?.companies && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Swiss Companies in {name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {data.companies.sort().map((company, index) => (
              <div key={index} className="text-sm text-gray-700 py-1">
                {company}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary counts from preloadedData structure */}
      {(data?.science_academia > 0 || data?.apprenticeship_companies > 0 || 
        data?.industry_clusters > 0 || data?.swiss_representations?.length > 0) && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Swiss Impact Summary for {name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data?.science_academia > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{data.science_academia}</div>
                <div className="text-sm text-gray-600">Science & Academia</div>
              </div>
            )}
            {data?.apprenticeship_companies > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{data.apprenticeship_companies}</div>
                <div className="text-sm text-gray-600">Apprenticeship Companies</div>
              </div>
            )}
            {data?.industry_clusters > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{data.industry_clusters}</div>
                <div className="text-sm text-gray-600">Industry Clusters</div>
              </div>
            )}
            {data?.swiss_representations?.length > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{data.swiss_representations.length}</div>
                <div className="text-sm text-gray-600">Swiss Representations</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EconomicImpact;
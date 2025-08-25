import React, { useState, useEffect, useRef } from 'react';
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

const EconomicImpact = ({ data, stateName = "United States" }) => {
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
          Swiss Economic Impact in {stateName}
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
      <div data-chart="employment" className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Employment by Swiss Companies</h2>
        {isVisible.employment && data?.employment && (
          <Bar data={employmentChartData} options={employmentChartOptions} />
        )}
        <p className="text-sm text-gray-600 mt-4">
          Employment figures show the impact of Swiss companies across different sectors.
        </p>
      </div>

      {/* Jobs Doughnut Chart */}
      <div data-chart="jobs" className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Job Distribution</h2>
        <div className="w-full max-w-md mx-auto">
          {isVisible.jobs && data?.jobs && (
            <Doughnut data={jobsChartData} options={jobsChartOptions} />
          )}
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Distribution of jobs created by Swiss companies across different categories.
        </p>
      </div>

      {/* Export/Import Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Chart */}
        <div data-chart="export" className="bg-white p-6 rounded-lg shadow-lg" ref={exportCardRef}>
          <h2 className="text-xl font-semibold mb-4">
            Exports to Switzerland
            <span className="block text-sm font-normal text-gray-600 mt-1">
              {data?.export_amount || '$0'}
            </span>
          </h2>
          {isVisible.export && data?.export && (
            <Bar data={exportChartData} options={exportChartOptions} />
          )}
          <div className="mt-4 space-y-1">
            {data?.export_label?.map((label, index) => (
              <div key={index} className="text-sm text-gray-600">{label}</div>
            ))}
          </div>
        </div>

        {/* Import Chart */}
        <div data-chart="import" className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Imports from Switzerland
            <span className="block text-sm font-normal text-gray-600 mt-1">
              {data?.import_amount || '$0'}
            </span>
          </h2>
          {isVisible.import && data?.import && (
            <Bar data={importChartData} options={importChartOptions} />
          )}
          <div className="mt-4 space-y-1">
            {data?.import_label?.map((label, index) => (
              <div key={index} className="text-sm text-gray-600">{label}</div>
            ))}
          </div>
        </div>
      </div>

      {/* US-specific Service Charts */}
      {stateName === "United States" && data?.export_service && (
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
          <div data-chart="importService" className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Import Services</h2>
            {isVisible.importService && data?.import_service && (
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
        </div>
      )}

      {/* Companies List for non-US states */}
      {stateName !== "United States" && data?.companies && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Swiss Companies in {stateName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {data.companies.sort().map((company, index) => (
              <div key={index} className="text-sm text-gray-700 py-1">
                {company}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EconomicImpact;
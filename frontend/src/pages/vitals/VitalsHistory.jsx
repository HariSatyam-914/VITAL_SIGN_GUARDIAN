import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiFilter, FiDownload, FiChevronDown, FiChevronUp, FiHeart, FiActivity, FiWind, FiDroplet, FiThermometer } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const VitalsHistory = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [dateRange, setDateRange] = useState('week');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedVitals, setSelectedVitals] = useState(['heartRate', 'bloodPressure', 'respiratoryRate', 'oxygenSaturation']);
  
  // Mock data for vitals history
  const [vitalsData, setVitalsData] = useState([]);
  
  useEffect(() => {
    // Generate mock data based on date range
    generateMockData();
  }, [dateRange]);
  
  const generateMockData = () => {
    const data = [];
    const now = new Date();
    let days = 7;
    
    switch (dateRange) {
      case 'week':
        days = 7;
        break;
      case 'month':
        days = 30;
        break;
      case 'year':
        days = 365;
        break;
      default:
        days = 7;
    }
    
    // Generate data points
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        id: i,
        date: date.toISOString(),
        source: Math.random() > 0.5 ? 'manual' : 'faceScan',
        vitals: {
          heartRate: Math.floor(65 + Math.random() * 20),
          bloodPressureSystolic: Math.floor(110 + Math.random() * 20),
          bloodPressureDiastolic: Math.floor(70 + Math.random() * 15),
          respiratoryRate: Math.floor(14 + Math.random() * 4),
          oxygenSaturation: Math.floor(95 + Math.random() * 5),
          temperature: (97 + Math.random() * 2).toFixed(1),
          stressLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        }
      });
    }
    
    setVitalsData(data);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: dateRange === 'year' ? 'numeric' : undefined
    });
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusColor = (vital, value) => {
    // Define normal ranges for each vital
    const ranges = {
      heartRate: { min: 60, max: 100 },
      bloodPressureSystolic: { min: 90, max: 140 },
      bloodPressureDiastolic: { min: 60, max: 90 },
      respiratoryRate: { min: 12, max: 20 },
      oxygenSaturation: { min: 95, max: 100 },
      temperature: { min: 97, max: 99 },
    };
    
    if (!ranges[vital]) return 'text-gray-600 dark:text-gray-300';
    
    const { min, max } = ranges[vital];
    if (value < min) return 'text-blue-600 dark:text-blue-400';
    if (value > max) return 'text-red-600 dark:text-red-400';
    return 'text-green-600 dark:text-green-400';
  };
  
  const getSourceIcon = (source) => {
    if (source === 'manual') {
      return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Manual</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Face Scan</span>;
  };
  
  const toggleVitalSelection = (vital) => {
    if (selectedVitals.includes(vital)) {
      setSelectedVitals(selectedVitals.filter(v => v !== vital));
    } else {
      setSelectedVitals([...selectedVitals, vital]);
    }
  };
  
  // Prepare chart data
  const chartData = {
    labels: vitalsData.map(data => formatDate(data.date)),
    datasets: [
      selectedVitals.includes('heartRate') && {
        label: 'Heart Rate',
        data: vitalsData.map(data => data.vitals.heartRate),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
      },
      selectedVitals.includes('bloodPressure') && {
        label: 'Systolic BP',
        data: vitalsData.map(data => data.vitals.bloodPressureSystolic),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
      selectedVitals.includes('bloodPressure') && {
        label: 'Diastolic BP',
        data: vitalsData.map(data => data.vitals.bloodPressureDiastolic),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.3,
      },
      selectedVitals.includes('respiratoryRate') && {
        label: 'Respiratory Rate',
        data: vitalsData.map(data => data.vitals.respiratoryRate),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        tension: 0.3,
      },
      selectedVitals.includes('oxygenSaturation') && {
        label: 'Oxygen Saturation',
        data: vitalsData.map(data => data.vitals.oxygenSaturation),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        tension: 0.3,
        yAxisID: 'y1',
      },
      selectedVitals.includes('temperature') && {
        label: 'Temperature',
        data: vitalsData.map(data => data.vitals.temperature),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
        tension: 0.3,
        yAxisID: 'y2',
      },
    ].filter(Boolean),
  };
  
  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
        },
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Value',
        },
      },
      y1: {
        type: 'linear',
        display: selectedVitals.includes('oxygenSaturation'),
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        min: 90,
        max: 100,
        title: {
          display: true,
          text: 'O₂ Saturation (%)',
        },
      },
      y2: {
        type: 'linear',
        display: selectedVitals.includes('temperature'),
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        min: 96,
        max: 100,
        title: {
          display: true,
          text: 'Temperature (°F)',
        },
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Vitals History</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            View and analyze your vital signs over time
          </p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterOpen(!filterOpen)}
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center"
          >
            <FiFilter className="mr-1" />
            Filter
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center"
          >
            <FiDownload className="mr-1" />
            Export
          </motion.button>
        </div>
      </div>

      {/* Filter Panel */}
      <motion.div
        initial={false}
        animate={{ height: filterOpen ? 'auto' : 0, opacity: filterOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 overflow-hidden"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Date Range</h3>
              <div className="flex space-x-2">
                {['week', 'month', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      dateRange === range
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Vital Signs</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleVitalSelection('heartRate')}
                  className={`px-3 py-1 rounded-lg text-xs flex items-center ${
                    selectedVitals.includes('heartRate')
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <FiHeart className="mr-1" /> Heart Rate
                </button>
                <button
                  onClick={() => toggleVitalSelection('bloodPressure')}
                  className={`px-3 py-1 rounded-lg text-xs flex items-center ${
                    selectedVitals.includes('bloodPressure')
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <FiActivity className="mr-1" /> Blood Pressure
                </button>
                <button
                  onClick={() => toggleVitalSelection('respiratoryRate')}
                  className={`px-3 py-1 rounded-lg text-xs flex items-center ${
                    selectedVitals.includes('respiratoryRate')
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <FiWind className="mr-1" /> Respiratory Rate
                </button>
                <button
                  onClick={() => toggleVitalSelection('oxygenSaturation')}
                  className={`px-3 py-1 rounded-lg text-xs flex items-center ${
                    selectedVitals.includes('oxygenSaturation')
                      ? 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <FiDroplet className="mr-1" /> Oxygen Saturation
                </button>
                <button
                  onClick={() => toggleVitalSelection('temperature')}
                  className={`px-3 py-1 rounded-lg text-xs flex items-center ${
                    selectedVitals.includes('temperature')
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <FiThermometer className="mr-1" /> Temperature
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Trends</h2>
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {['all', 'manual', 'faceScan'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {tab === 'all' ? 'All Entries' : tab === 'manual' ? 'Manual Input' : 'Face Scan'}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Source
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Heart Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Blood Pressure
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Respiratory Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  O₂ Saturation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {vitalsData
                .filter(data => activeTab === 'all' || data.source === activeTab)
                .map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(entry.date)}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{formatTime(entry.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSourceIcon(entry.source)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getStatusColor('heartRate', entry.vitals.heartRate)}`}>
                        {entry.vitals.heartRate} <span className="text-xs text-gray-500 dark:text-gray-400">bpm</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getStatusColor('bloodPressureSystolic', entry.vitals.bloodPressureSystolic)}`}>
                        {entry.vitals.bloodPressureSystolic}/{entry.vitals.bloodPressureDiastolic} <span className="text-xs text-gray-500 dark:text-gray-400">mmHg</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getStatusColor('respiratoryRate', entry.vitals.respiratoryRate)}`}>
                        {entry.vitals.respiratoryRate} <span className="text-xs text-gray-500 dark:text-gray-400">bpm</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getStatusColor('oxygenSaturation', entry.vitals.oxygenSaturation)}`}>
                        {entry.vitals.oxygenSaturation}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VitalsHistory;
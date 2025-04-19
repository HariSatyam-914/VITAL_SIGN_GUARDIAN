import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InteractiveHealthTrend = ({ data, timeRange }) => {
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [chartData, setChartData] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [animateChart, setAnimateChart] = useState(true);

  // Define colors for different metrics
  const metricColors = {
    heartRate: '#FF6384',
    systolic: '#36A2EB',
    diastolic: '#4BC0C0',
    respiratoryRate: '#FFCE56',
    stress: '#9966FF'
  };

  // Define metrics to display
  const metrics = [
    { id: 'all', label: 'All Metrics' },
    { id: 'heartRate', label: 'Heart Rate' },
    { id: 'bloodPressure', label: 'Blood Pressure' },
    { id: 'respiratoryRate', label: 'Respiratory Rate' },
    { id: 'stress', label: 'Stress Level' }
  ];

  // Process data for chart based on selected metric
  useEffect(() => {
    if (!data) return;

    // Reset animation flag when data changes
    setAnimateChart(true);
    
    // Process data based on selected metric
    const processedData = {
      labels: data.labels,
      datasets: []
    };

    if (selectedMetric === 'all' || selectedMetric === 'heartRate') {
      processedData.datasets.push({
        id: 'heartRate',
        label: 'Heart Rate (bpm)',
        data: data.datasets.heartRate,
        color: metricColors.heartRate
      });
    }

    if (selectedMetric === 'all' || selectedMetric === 'bloodPressure') {
      processedData.datasets.push({
        id: 'systolic',
        label: 'Systolic (mmHg)',
        data: data.datasets.bloodPressure.systolic,
        color: metricColors.systolic
      });
      
      processedData.datasets.push({
        id: 'diastolic',
        label: 'Diastolic (mmHg)',
        data: data.datasets.bloodPressure.diastolic,
        color: metricColors.diastolic
      });
    }

    if (selectedMetric === 'all' || selectedMetric === 'respiratoryRate') {
      processedData.datasets.push({
        id: 'respiratoryRate',
        label: 'Respiratory Rate (bpm)',
        data: data.datasets.respiratoryRate,
        color: metricColors.respiratoryRate
      });
    }

    if (selectedMetric === 'all' || selectedMetric === 'stress') {
      processedData.datasets.push({
        id: 'stress',
        label: 'Stress Level (%)',
        data: data.datasets.stress,
        color: metricColors.stress
      });
    }

    setChartData(processedData);
    
    // Turn off animation after initial render
    const timer = setTimeout(() => {
      setAnimateChart(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [data, selectedMetric]);

  // Find min and max values for y-axis scaling
  const getYAxisBounds = () => {
    if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
      return { min: 0, max: 100 };
    }

    let allValues = [];
    chartData.datasets.forEach(dataset => {
      allValues = [...allValues, ...dataset.data];
    });

    const min = Math.floor(Math.min(...allValues) * 0.9);
    const max = Math.ceil(Math.max(...allValues) * 1.1);
    
    return { min, max };
  };

  const yAxisBounds = getYAxisBounds();
  const chartHeight = 300;
  const chartWidth = '100%';
  const paddingX = 50;
  const paddingY = 30;
  
  // Calculate positions for chart elements
  const getXPosition = (index) => {
    if (!chartData) return 0;
    const availableWidth = 100 - (paddingX / 5);
    const step = availableWidth / (chartData.labels.length - 1);
    return (paddingX / 10) + (index * step) + '%';
  };

  const getYPosition = (value) => {
    const range = yAxisBounds.max - yAxisBounds.min;
    const normalizedValue = (value - yAxisBounds.min) / range;
    return chartHeight - (normalizedValue * (chartHeight - paddingY * 2)) - paddingY;
  };

  // Generate path for a dataset
  const generatePath = (dataset) => {
    if (!dataset || !dataset.data || dataset.data.length === 0) return '';
    
    return dataset.data.map((value, index) => {
      const x = getXPosition(index);
      const y = getYPosition(value);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-4">
        {metrics.map(metric => (
          <button
            key={metric.id}
            onClick={() => setSelectedMetric(metric.id)}
            className={`px-3 py-1 text-sm rounded-full transition-all ${
              selectedMetric === metric.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {metric.label}
          </button>
        ))}
      </div>
      
      <div className="relative w-full h-[300px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full w-10 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 py-6">
          <div>{yAxisBounds.max}</div>
          <div>{Math.round((yAxisBounds.max + yAxisBounds.min) / 2)}</div>
          <div>{yAxisBounds.min}</div>
        </div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 dark:text-gray-400 px-12 pb-2">
          {chartData.labels.map((label, index) => (
            <div key={index} style={{ position: 'absolute', left: getXPosition(index), transform: 'translateX(-50%)' }}>
              {label}
            </div>
          ))}
        </div>
        
        {/* Chart grid */}
        <svg width={chartWidth} height={chartHeight} className="absolute top-0 left-0">
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = paddingY + ratio * (chartHeight - paddingY * 2);
            return (
              <line
                key={index}
                x1={paddingX}
                y1={y}
                x2="95%"
                y2={y}
                stroke="rgba(156, 163, 175, 0.2)"
                strokeDasharray="5,5"
              />
            );
          })}
          
          {/* Vertical grid lines */}
          {chartData.labels.map((_, index) => {
            const x = getXPosition(index).replace('%', '');
            return (
              <line
                key={index}
                x1={`${x}%`}
                y1={paddingY}
                x2={`${x}%`}
                y2={chartHeight - paddingY}
                stroke="rgba(156, 163, 175, 0.2)"
                strokeDasharray="5,5"
              />
            );
          })}
        </svg>
        
        {/* Chart lines and points */}
        <svg width={chartWidth} height={chartHeight} className="absolute top-0 left-0">
          {chartData.datasets.map((dataset, datasetIndex) => (
            <g key={dataset.id}>
              {/* Animated path */}
              <motion.path
                d={generatePath(dataset)}
                fill="none"
                stroke={dataset.color}
                strokeWidth={2}
                initial={animateChart ? { pathLength: 0 } : { pathLength: 1 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: datasetIndex * 0.2 }}
              />
              
              {/* Data points */}
              {dataset.data.map((value, index) => (
                <motion.circle
                  key={`${dataset.id}-${index}`}
                  cx={getXPosition(index)}
                  cy={getYPosition(value)}
                  r={hoveredPoint && hoveredPoint.datasetId === dataset.id && hoveredPoint.index === index ? 6 : 4}
                  fill={dataset.color}
                  initial={animateChart ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: animateChart ? 0.8 + (index * 0.05) + (datasetIndex * 0.2) : 0 }}
                  onMouseEnter={() => setHoveredPoint({ datasetId: dataset.id, index, value })}
                  onMouseLeave={() => setHoveredPoint(null)}
                  className="cursor-pointer"
                />
              ))}
            </g>
          ))}
        </svg>
        
        {/* Tooltip */}
        <AnimatePresence>
          {hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 z-10 text-sm pointer-events-none"
              style={{
                left: getXPosition(hoveredPoint.index),
                top: getYPosition(hoveredPoint.value) - 40,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-semibold text-gray-800 dark:text-white">
                {chartData.datasets.find(d => d.id === hoveredPoint.datasetId)?.label}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                {hoveredPoint.value} {hoveredPoint.datasetId === 'heartRate' || hoveredPoint.datasetId === 'respiratoryRate' ? 'bpm' : 
                  hoveredPoint.datasetId === 'systolic' || hoveredPoint.datasetId === 'diastolic' ? 'mmHg' : '%'}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">
                {chartData.labels[hoveredPoint.index]}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Legend */}
        <div className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 text-xs">
          {chartData.datasets.map(dataset => (
            <div key={dataset.id} className="flex items-center mb-1 last:mb-0">
              <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: dataset.color }}></div>
              <span className="text-gray-700 dark:text-gray-300">{dataset.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        {timeRange === 'week' && 'Data from the past 7 days'}
        {timeRange === 'month' && 'Data from the past 30 days'}
        {timeRange === 'quarter' && 'Data from the past 3 months'}
        {timeRange === 'year' && 'Data from the past 12 months'}
      </div>
    </div>
  );
};

export default InteractiveHealthTrend;
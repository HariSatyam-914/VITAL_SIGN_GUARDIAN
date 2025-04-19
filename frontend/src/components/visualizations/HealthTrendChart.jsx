import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const HealthTrendChart = ({ data, dataType }) => {
  const canvasRef = useRef(null);
  
  // Draw chart on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up chart dimensions
    const padding = 40;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    // Draw background grid
    ctx.beginPath();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Vertical grid lines (days)
    const dayCount = data.labels.length;
    for (let i = 0; i <= dayCount; i++) {
      const x = padding + (i * (chartWidth / dayCount));
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (i * (chartHeight / 5));
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
    }
    
    ctx.stroke();
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    
    // Y-axis
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding);
    
    ctx.stroke();
    
    // Draw labels
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'center';
    
    // X-axis labels (days)
    data.labels.forEach((label, i) => {
      const x = padding + ((i + 0.5) * (chartWidth / dayCount));
      ctx.fillText(label, x, height - (padding / 2));
    });
    
    // Y-axis labels depend on data type
    let maxValue = 0;
    let minValue = Infinity;
    let datasets = [];
    
    // Determine which datasets to show based on dataType
    if (dataType === 'all' || dataType === 'heart') {
      datasets.push({
        name: 'Heart Rate',
        data: data.datasets.heartRate,
        color: '#ef4444' // red
      });
      maxValue = Math.max(maxValue, ...data.datasets.heartRate);
      minValue = Math.min(minValue, ...data.datasets.heartRate);
    }
    
    if (dataType === 'all' || dataType === 'blood') {
      datasets.push({
        name: 'Systolic BP',
        data: data.datasets.bloodPressure.systolic,
        color: '#3b82f6' // blue
      });
      datasets.push({
        name: 'Diastolic BP',
        data: data.datasets.bloodPressure.diastolic,
        color: '#60a5fa' // lighter blue
      });
      maxValue = Math.max(maxValue, ...data.datasets.bloodPressure.systolic);
      minValue = Math.min(minValue, ...data.datasets.bloodPressure.diastolic);
    }
    
    if (dataType === 'all' || dataType === 'respiratory') {
      datasets.push({
        name: 'Respiratory Rate',
        data: data.datasets.respiratoryRate,
        color: '#10b981' // green
      });
      maxValue = Math.max(maxValue, ...data.datasets.respiratoryRate);
      minValue = Math.min(minValue, ...data.datasets.respiratoryRate);
    }
    
    if (dataType === 'all' || dataType === 'stress') {
      datasets.push({
        name: 'Stress Level',
        data: data.datasets.stress,
        color: '#8b5cf6' // purple
      });
      maxValue = Math.max(maxValue, ...data.datasets.stress);
      minValue = Math.min(minValue, ...data.datasets.stress);
    }
    
    // Add some padding to the value range
    const valueRange = maxValue - minValue;
    maxValue += valueRange * 0.1;
    minValue -= valueRange * 0.1;
    minValue = Math.max(0, minValue); // Don't go below zero
    
    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (i * ((maxValue - minValue) / 5));
      const y = height - padding - (i * (chartHeight / 5));
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(value), padding - 10, y + 4);
    }
    
    // Draw data lines
    datasets.forEach(dataset => {
      ctx.beginPath();
      ctx.strokeStyle = dataset.color;
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      
      dataset.data.forEach((value, i) => {
        const x = padding + ((i + 0.5) * (chartWidth / dayCount));
        const normalizedValue = (value - minValue) / (maxValue - minValue);
        const y = height - padding - (normalizedValue * chartHeight);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Draw data points
      ctx.fillStyle = dataset.color;
      dataset.data.forEach((value, i) => {
        const x = padding + ((i + 0.5) * (chartWidth / dayCount));
        const normalizedValue = (value - minValue) / (maxValue - minValue);
        const y = height - padding - (normalizedValue * chartHeight);
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
    
    // Draw legend
    const legendX = width - padding - 150;
    const legendY = padding + 20;
    
    datasets.forEach((dataset, i) => {
      const y = legendY + (i * 25);
      
      // Legend color box
      ctx.fillStyle = dataset.color;
      ctx.fillRect(legendX, y - 8, 16, 16);
      
      // Legend text
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'left';
      ctx.fillText(dataset.name, legendX + 24, y);
    });
    
  }, [data, dataType]);

  return (
    <div className="w-full">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400} 
        className="w-full h-auto"
      />
    </div>
  );
};

export default HealthTrendChart;
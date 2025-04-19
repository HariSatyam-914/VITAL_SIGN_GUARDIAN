import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const HealthScoreGauge = ({ score }) => {
  const canvasRef = useRef(null);
  
  // Get color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e'; // Green for good
    if (score >= 60) return '#f59e0b'; // Amber for moderate
    return '#ef4444'; // Red for poor
  };
  
  // Get text description based on score
  const getScoreDescription = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Very Good';
    if (score >= 60) return 'Good';
    if (score >= 50) return 'Fair';
    if (score >= 40) return 'Poor';
    return 'Critical';
  };

  // Draw gauge on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw gauge background
    const startAngle = Math.PI * 0.75;
    const endAngle = Math.PI * 2.25;
    
    // Background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = 30;
    ctx.strokeStyle = '#e5e7eb';
    ctx.stroke();
    
    // Colored sections
    const drawSection = (start, end, color) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, start, end);
      ctx.lineWidth = 30;
      ctx.strokeStyle = color;
      ctx.stroke();
    };
    
    // Red section (0-40)
    drawSection(
      startAngle,
      startAngle + (endAngle - startAngle) * 0.25,
      '#ef4444'
    );
    
    // Yellow section (40-70)
    drawSection(
      startAngle + (endAngle - startAngle) * 0.25,
      startAngle + (endAngle - startAngle) * 0.625,
      '#f59e0b'
    );
    
    // Green section (70-100)
    drawSection(
      startAngle + (endAngle - startAngle) * 0.625,
      endAngle,
      '#22c55e'
    );
    
    // Draw needle
    const needleAngle = startAngle + (endAngle - startAngle) * (score / 100);
    const needleLength = radius - 40;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + needleLength * Math.cos(needleAngle),
      centerY + needleLength * Math.sin(needleAngle)
    );
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1f2937';
    ctx.stroke();
    
    // Draw needle center
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#1f2937';
    ctx.fill();
    
    // Draw score text
    ctx.font = 'bold 48px Inter, sans-serif';
    ctx.fillStyle = getScoreColor(score);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(score, centerX, centerY + 70);
    
    // Draw description
    ctx.font = '16px Inter, sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(getScoreDescription(score), centerX, centerY + 100);
    
    // Draw min/max labels
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'left';
    ctx.fillText('0', centerX - radius + 10, centerY + 20);
    ctx.textAlign = 'right';
    ctx.fillText('100', centerX + radius - 10, centerY + 20);
    
  }, [score]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="flex justify-center"
    >
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={300} 
        className="my-2"
      />
    </motion.div>
  );
};

export default HealthScoreGauge;
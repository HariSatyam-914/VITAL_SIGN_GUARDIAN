import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const RiskScoreCard = ({ score, level }) => {
  const canvasRef = useRef(null);
  
  // Determine color based on risk level
  const getColor = () => {
    if (score >= 80) return '#22c55e'; // Green for low risk
    if (score >= 60) return '#f59e0b'; // Amber for moderate risk
    return '#ef4444'; // Red for high risk
  };

  // Draw circular progress
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 15;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#e5e7eb';
    ctx.stroke();
    
    // Draw progress arc
    const startAngle = -0.5 * Math.PI; // Start at top
    const endAngle = startAngle + (score / 100) * 2 * Math.PI;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.strokeStyle = getColor();
    ctx.stroke();
    
    // Draw center text
    ctx.font = 'bold 48px Inter, sans-serif';
    ctx.fillStyle = getColor();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(score, centerX, centerY);
    
    // Draw smaller "out of 100" text
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('out of 100', centerX, centerY + 30);
  }, [score]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <h3 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
        Health Risk Score
      </h3>
      
      <div className="flex justify-center mb-4">
        <canvas 
          ref={canvasRef} 
          width={220} 
          height={220} 
          className="my-2"
        />
      </div>
      
      <div className="text-center">
        <span 
          className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
            level === 'Low' ? 'bg-green-100 text-green-800' :
            level === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}
        >
          {level} Risk
        </span>
        
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Your health risk assessment based on vital signs, medical history, and lifestyle factors.
        </p>
      </div>
    </motion.div>
  );
};

export default RiskScoreCard;
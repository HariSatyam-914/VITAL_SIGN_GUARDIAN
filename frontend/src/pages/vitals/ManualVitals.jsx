import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiActivity, FiThermometer, FiDroplet, FiWind, FiCheck, FiInfo } from 'react-icons/fi';
import vitalsService from '../../api/vitalsService';

const ManualVitals = () => {
  const [formData, setFormData] = useState({
    heartRate: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    temperature: '',
    glucoseLevel: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Heart Rate validation (40-220 bpm)
    if (formData.heartRate && (formData.heartRate < 40 || formData.heartRate > 220)) {
      newErrors.heartRate = 'Heart rate should be between 40-220 bpm';
    }
    
    // Blood Pressure validation
    if (formData.bloodPressureSystolic && (formData.bloodPressureSystolic < 70 || formData.bloodPressureSystolic > 250)) {
      newErrors.bloodPressureSystolic = 'Systolic pressure should be between 70-250 mmHg';
    }
    
    if (formData.bloodPressureDiastolic && (formData.bloodPressureDiastolic < 40 || formData.bloodPressureDiastolic > 150)) {
      newErrors.bloodPressureDiastolic = 'Diastolic pressure should be between 40-150 mmHg';
    }
    
    // Respiratory Rate validation (8-40 breaths per minute)
    if (formData.respiratoryRate && (formData.respiratoryRate < 8 || formData.respiratoryRate > 40)) {
      newErrors.respiratoryRate = 'Respiratory rate should be between 8-40 breaths per minute';
    }
    
    // Oxygen Saturation validation (70-100%)
    if (formData.oxygenSaturation && (formData.oxygenSaturation < 70 || formData.oxygenSaturation > 100)) {
      newErrors.oxygenSaturation = 'Oxygen saturation should be between 70-100%';
    }
    
    // Temperature validation (95-108°F)
    if (formData.temperature && (formData.temperature < 95 || formData.temperature > 108)) {
      newErrors.temperature = 'Temperature should be between 95-108°F';
    }
    
    // Glucose Level validation (20-600 mg/dL)
    if (formData.glucoseLevel && (formData.glucoseLevel < 20 || formData.glucoseLevel > 600)) {
      newErrors.glucoseLevel = 'Glucose level should be between 20-600 mg/dL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for API
      const vitalsData = {
        timestamp: `${formData.date}T${formData.time}:00`,
        metrics: [
          {
            id: 'heart-rate',
            name: 'Heart Rate',
            value: parseInt(formData.heartRate),
            unit: 'bpm'
          },
          {
            id: 'blood-pressure',
            name: 'Blood Pressure',
            value: `${formData.bloodPressureSystolic}/${formData.bloodPressureDiastolic}`,
            unit: 'mmHg'
          },
          {
            id: 'respiratory-rate',
            name: 'Respiratory Rate',
            value: parseInt(formData.respiratoryRate),
            unit: 'breaths/min'
          },
          {
            id: 'oxygen-saturation',
            name: 'Oxygen Saturation',
            value: parseInt(formData.oxygenSaturation),
            unit: '%'
          },
          {
            id: 'temperature',
            name: 'Temperature',
            value: parseFloat(formData.temperature),
            unit: '°F'
          },
          {
            id: 'glucose-level',
            name: 'Glucose Level',
            value: parseInt(formData.glucoseLevel),
            unit: 'mg/dL'
          }
        ].filter(metric => metric.value !== '' && !isNaN(metric.value)),
        notes: formData.notes
      };
      
      // Save to database
      await vitalsService.saveManualVitals(vitalsData);
      
      // Show success message
      setIsSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          heartRate: '',
          bloodPressureSystolic: '',
          bloodPressureDiastolic: '',
          respiratoryRate: '',
          oxygenSaturation: '',
          temperature: '',
          glucoseLevel: '',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          notes: '',
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting vitals:', error);
      setErrors({ submit: 'Failed to submit vitals. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputFields = [
    {
      id: 'heartRate',
      label: 'Heart Rate',
      type: 'number',
      placeholder: 'e.g., 72',
      unit: 'bpm',
      icon: <FiHeart className="text-red-500" />,
    },
    {
      id: 'bloodPressureSystolic',
      label: 'Blood Pressure (Systolic)',
      type: 'number',
      placeholder: 'e.g., 120',
      unit: 'mmHg',
      icon: <FiActivity className="text-blue-500" />,
    },
    {
      id: 'bloodPressureDiastolic',
      label: 'Blood Pressure (Diastolic)',
      type: 'number',
      placeholder: 'e.g., 80',
      unit: 'mmHg',
      icon: <FiActivity className="text-blue-500" />,
    },
    {
      id: 'respiratoryRate',
      label: 'Respiratory Rate',
      type: 'number',
      placeholder: 'e.g., 16',
      unit: 'breaths/min',
      icon: <FiWind className="text-green-500" />,
    },
    {
      id: 'oxygenSaturation',
      label: 'Oxygen Saturation',
      type: 'number',
      placeholder: 'e.g., 98',
      unit: '%',
      icon: <FiDroplet className="text-blue-500" />,
    },
    {
      id: 'temperature',
      label: 'Temperature',
      type: 'number',
      placeholder: 'e.g., 98.6',
      unit: '°F',
      icon: <FiThermometer className="text-red-500" />,
      step: '0.1',
    },
    {
      id: 'glucoseLevel',
      label: 'Glucose Level',
      type: 'number',
      placeholder: 'e.g., 100',
      unit: 'mg/dL',
      icon: <FiDroplet className="text-purple-500" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manual Vitals Input</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Record your vital signs manually for tracking and analysis
        </p>
      </div>

      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 rounded-r-lg"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <FiCheck className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Vitals recorded successfully!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {errors.submit && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-r-lg"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <FiInfo className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {errors.submit}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Vital Signs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inputFields.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field.label}
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {field.icon}
                    </div>
                    <input
                      type={field.type}
                      name={field.id}
                      id={field.id}
                      className={`block w-full pl-10 pr-12 py-2 sm:text-sm rounded-md ${
                        errors[field.id]
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                      placeholder={field.placeholder}
                      value={formData[field.id]}
                      onChange={handleChange}
                      step={field.step}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{field.unit}</span>
                    </div>
                  </div>
                  {errors[field.id] && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[field.id]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Date & Time</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  id="time"
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Additional Notes</h2>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (optional)
              </label>
              <textarea
                name="notes"
                id="notes"
                rows="3"
                className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Add any additional information about your current health status..."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition-colors duration-200 flex items-center disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Vitals'
            )}
          </motion.button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiInfo className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Tips for accurate measurements</h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <ul className="list-disc pl-5 space-y-1">
                <li>Measure your heart rate while at rest</li>
                <li>Take blood pressure readings at the same time each day</li>
                <li>Ensure your thermometer is properly calibrated</li>
                <li>For respiratory rate, count breaths for a full minute</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualVitals;
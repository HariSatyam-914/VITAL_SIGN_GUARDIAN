import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiFile, FiX, FiCheck, FiEdit2, FiInfo, FiLoader } from 'react-icons/fi';
import vitalsService from '../../api/vitalsService';

const PdfUpload = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [processingStatus, setProcessingStatus] = useState({}); // 'uploading', 'processing', 'success', 'error'
  const [extractedData, setExtractedData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(
      file => file.type === 'application/pdf'
    );
    
    if (selectedFiles.length > 0) {
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles) => {
    const updatedFiles = [...files];
    const updatedStatus = { ...processingStatus };
    
    newFiles.forEach(file => {
      // Check if file already exists
      if (!files.some(f => f.name === file.name)) {
        updatedFiles.push(file);
        updatedStatus[file.name] = 'uploading';
      }
    });
    
    setFiles(updatedFiles);
    setProcessingStatus(updatedStatus);
    
    // Process the files
    newFiles.forEach(file => {
      processFile(file);
    });
  };

  const processFile = async (file) => {
    try {
      // Set status to uploading
      setProcessingStatus(prev => ({ ...prev, [file.name]: 'uploading' }));
      
      // Upload the file to the server
      const uploadResponse = await vitalsService.uploadPdf(file);
      
      // Set status to processing
      setProcessingStatus(prev => ({ ...prev, [file.name]: 'processing' }));
      
      // In a real app, the server would process the PDF and return extracted data
      // For demo purposes, we'll simulate this with a delay and mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful OCR processing
      const mockData = {
        patientName: 'John Doe',
        patientId: 'P12345',
        date: '2023-05-15',
        vitals: {
          heartRate: '72 bpm',
          bloodPressure: '120/80 mmHg',
          respiratoryRate: '16 breaths/min',
          oxygenSaturation: '98%',
          temperature: '98.6°F',
          glucose: '95 mg/dL'
        },
        labResults: [
          { name: 'Hemoglobin', value: '14.5 g/dL', range: '13.5-17.5 g/dL', status: 'normal' },
          { name: 'White Blood Cells', value: '7.5 x10^9/L', range: '4.5-11.0 x10^9/L', status: 'normal' },
          { name: 'Cholesterol', value: '210 mg/dL', range: '<200 mg/dL', status: 'high' },
          { name: 'Glucose', value: '95 mg/dL', range: '70-100 mg/dL', status: 'normal' }
        ]
      };
      
      // In a real app, this data would come from the server response
      // const extractedData = uploadResponse.data.extractedData;
      
      // Update status to success
      setProcessingStatus(prev => ({ ...prev, [file.name]: 'success' }));
      
      // If this is the first successful file, set it as current and show extracted data
      if (!currentFile) {
        setCurrentFile(file);
        setExtractedData(mockData);
        setEditedData(mockData);
        
        // In a real app, we would save the extracted data to the database
        try {
          await vitalsService.savePdfData({
            fileId: uploadResponse.data?.fileId || `mock-${Date.now()}`,
            fileName: file.name,
            extractedData: mockData,
            timestamp: new Date().toISOString()
          });
        } catch (saveError) {
          console.error('Error saving PDF data:', saveError);
          // Continue showing data even if save fails
        }
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setProcessingStatus(prev => ({ ...prev, [file.name]: 'error' }));
    }
  };

  const removeFile = (fileName) => {
    setFiles(files.filter(file => file.name !== fileName));
    
    // If removing the current file, set the first successful file as current
    if (currentFile && currentFile.name === fileName) {
      const successfulFiles = files.filter(file => 
        processingStatus[file.name] === 'success' && file.name !== fileName
      );
      
      if (successfulFiles.length > 0) {
        setCurrentFile(successfulFiles[0]);
        // Would fetch data for this file in a real app
      } else {
        setCurrentFile(null);
        setExtractedData(null);
        setEditedData({});
      }
    }
    
    // Update processing status
    const updatedStatus = { ...processingStatus };
    delete updatedStatus[fileName];
    setProcessingStatus(updatedStatus);
  };

  const selectFile = (file) => {
    if (processingStatus[file.name] === 'success') {
      setCurrentFile(file);
      // In a real app, would fetch the extracted data for this file
      // For demo, just generate new mock data
      const mockData = {
        patientName: 'Jane Smith',
        patientId: 'P67890',
        date: '2023-06-22',
        vitals: {
          heartRate: '68 bpm',
          bloodPressure: '118/75 mmHg',
          respiratoryRate: '14 breaths/min',
          oxygenSaturation: '99%',
          temperature: '98.2°F',
          glucose: '88 mg/dL'
        },
        labResults: [
          { name: 'Hemoglobin', value: '13.8 g/dL', range: '12.0-15.5 g/dL', status: 'normal' },
          { name: 'White Blood Cells', value: '6.2 x10^9/L', range: '4.5-11.0 x10^9/L', status: 'normal' },
          { name: 'Cholesterol', value: '185 mg/dL', range: '<200 mg/dL', status: 'normal' },
          { name: 'Glucose', value: '88 mg/dL', range: '70-100 mg/dL', status: 'normal' }
        ]
      };
      setExtractedData(mockData);
      setEditedData(mockData);
      setEditMode(false);
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e, section, field) => {
    const { value } = e.target;
    
    if (section) {
      setEditedData({
        ...editedData,
        [section]: {
          ...editedData[section],
          [field]: value
        }
      });
    } else {
      setEditedData({
        ...editedData,
        [field]: value
      });
    }
  };

  const handleLabResultChange = (index, field, value) => {
    const updatedLabResults = [...editedData.labResults];
    updatedLabResults[index] = {
      ...updatedLabResults[index],
      [field]: value
    };
    
    setEditedData({
      ...editedData,
      labResults: updatedLabResults
    });
  };

  const saveChanges = async () => {
    setExtractedData(editedData);
    setEditMode(false);
    
    // Save the updated data to the server
    try {
      await vitalsService.savePdfData({
        fileId: `edited-${currentFile.name}-${Date.now()}`,
        fileName: currentFile.name,
        extractedData: editedData,
        timestamp: new Date().toISOString(),
        isEdited: true
      });
    } catch (error) {
      console.error('Error saving edited PDF data:', error);
      // Continue showing updated data even if save fails
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return (
          <div className="animate-pulse text-blue-500">
            <FiLoader className="w-5 h-5" />
          </div>
        );
      case 'processing':
        return (
          <div className="animate-spin text-yellow-500">
            <FiLoader className="w-5 h-5" />
          </div>
        );
      case 'success':
        return <FiCheck className="w-5 h-5 text-green-500" />;
      case 'error':
        return <FiX className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing...';
      case 'success':
        return 'Processed';
      case 'error':
        return 'Failed';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">PDF Report Upload</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Upload medical PDF reports to automatically extract vital signs and lab results
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - File Upload */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Upload Files</h2>
              
              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <FiUpload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Drag and drop PDF files here, or
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Only PDF files are supported
                </p>
              </div>
              
              {/* File List */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Uploaded Files</h3>
                
                {files.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No files uploaded yet
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {files.map((file) => (
                      <li
                        key={file.name}
                        className={`py-3 flex items-center justify-between cursor-pointer ${
                          currentFile && currentFile.name === file.name
                            ? 'bg-indigo-50 dark:bg-indigo-900/20'
                            : ''
                        }`}
                        onClick={() => selectFile(file)}
                      >
                        <div className="flex items-center">
                          <FiFile className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                          <div className="text-sm">
                            <p className="font-medium text-gray-800 dark:text-white truncate max-w-[150px]">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                            {getStatusText(processingStatus[file.name])}
                          </span>
                          {getStatusIcon(processingStatus[file.name])}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(file.name);
                            }}
                            className="ml-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          
          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiInfo className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Tips</h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Upload clear, high-quality PDF files</li>
                    <li>Make sure text in PDFs is selectable, not scanned images</li>
                    <li>Check extracted data for accuracy</li>
                    <li>Edit any incorrectly extracted information</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Extracted Data */}
        <div className="lg:col-span-2">
          {currentFile && extractedData ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Extracted Data
                  </h2>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEditToggle}
                      className={`px-3 py-1 rounded-md text-sm flex items-center ${
                        editMode
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {editMode ? (
                        <>
                          <FiCheck className="mr-1" /> Done
                        </>
                      ) : (
                        <>
                          <FiEdit2 className="mr-1" /> Edit
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {editMode ? (
                    <motion.div
                      key="edit-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Edit Form */}
                      <div className="space-y-6">
                        {/* Patient Info */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Patient Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                Patient Name
                              </label>
                              <input
                                type="text"
                                value={editedData.patientName || ''}
                                onChange={(e) => handleInputChange(e, null, 'patientName')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                Patient ID
                              </label>
                              <input
                                type="text"
                                value={editedData.patientId || ''}
                                onChange={(e) => handleInputChange(e, null, 'patientId')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                Date
                              </label>
                              <input
                                type="date"
                                value={editedData.date || ''}
                                onChange={(e) => handleInputChange(e, null, 'date')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Vitals */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Vital Signs
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(editedData.vitals || {}).map(([key, value]) => (
                              <div key={key}>
                                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                <input
                                  type="text"
                                  value={value}
                                  onChange={(e) => handleInputChange(e, 'vitals', key)}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Lab Results */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Lab Results
                          </h3>
                          <div className="space-y-3">
                            {(editedData.labResults || []).map((result, index) => (
                              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                                <div>
                                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    Test Name
                                  </label>
                                  <input
                                    type="text"
                                    value={result.name}
                                    onChange={(e) => handleLabResultChange(index, 'name', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    Value
                                  </label>
                                  <input
                                    type="text"
                                    value={result.value}
                                    onChange={(e) => handleLabResultChange(index, 'value', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    Normal Range
                                  </label>
                                  <input
                                    type="text"
                                    value={result.range}
                                    onChange={(e) => handleLabResultChange(index, 'range', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    Status
                                  </label>
                                  <select
                                    value={result.status}
                                    onChange={(e) => handleLabResultChange(index, 'status', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                  >
                                    <option value="normal">Normal</option>
                                    <option value="low">Low</option>
                                    <option value="high">High</option>
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setEditMode(false)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={saveChanges}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view-data"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* View Data */}
                      <div className="space-y-6">
                        {/* Patient Info */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Patient Information
                          </h3>
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Patient Name</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white">
                                  {extractedData.patientName}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Patient ID</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white">
                                  {extractedData.patientId}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white">
                                  {new Date(extractedData.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Vitals */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Vital Signs
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(extractedData.vitals || {}).map(([key, value]) => (
                              <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </p>
                                <p className="text-lg font-medium text-gray-800 dark:text-white">
                                  {value}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Lab Results */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Lab Results
                          </h3>
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                              <thead>
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Test
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Result
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Normal Range
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                {(extractedData.labResults || []).map((result, index) => (
                                  <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                                      {result.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                      {result.value}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                      {result.range}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 py-1 text-xs rounded-full ${
                                        result.status === 'normal'
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                          : result.status === 'low'
                                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                      }`}>
                                        {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Save to Health Record
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full flex items-center justify-center p-12">
              <div className="text-center">
                <FiFile className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No file selected</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Upload and select a PDF file to view extracted data
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiUpload className="mr-2" />
                    Upload PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfUpload;
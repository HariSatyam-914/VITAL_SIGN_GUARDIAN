import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiX, FiInfo, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import * as faceDetection from '@mediapipe/face_detection';
import * as camera from '@mediapipe/camera_utils';
import * as drawingUtils from '@mediapipe/drawing_utils';

const FaceScan = () => {
  const [scanState, setScanState] = useState('initial'); // initial, scanning, complete, error
  const [cameraPermission, setCameraPermission] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [facePosition, setFacePosition] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const cameraUtilRef = useRef(null);
  const navigate = useNavigate();

  // Initialize face detector
  useEffect(() => {
    const initializeDetector = async () => {
      const detector = new faceDetection.FaceDetection({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
        }
      });
      
      detector.setOptions({
        modelSelection: 1, // 0 for short-range, 1 for full-range detection
        minDetectionConfidence: 0.5,
      });
      
      detector.onResults(onResults);
      detectorRef.current = detector;
    };
    
    initializeDetector();
    
    return () => {
      // Clean up video stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (cameraUtilRef.current) {
        cameraUtilRef.current.stop();
      }
    };
  }, []);

  const onResults = (results) => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');
    
    // Clear the canvas
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Draw the video frame
    canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height
    );
    
    if (results.detections.length > 0) {
      setFaceDetected(true);
      
      // Get the first face detected
      const face = results.detections[0];
      const boundingBox = face.boundingBox;
      
      // Store face position for UI feedback
      setFacePosition({
        x: boundingBox.xCenter * canvasElement.width,
        y: boundingBox.yCenter * canvasElement.height,
        width: boundingBox.width * canvasElement.width,
        height: boundingBox.height * canvasElement.height
      });
      
      // Draw face landmarks
      drawingUtils.drawRectangle(
        canvasCtx, 
        boundingBox.xCenter * canvasElement.width - (boundingBox.width * canvasElement.width) / 2,
        boundingBox.yCenter * canvasElement.height - (boundingBox.height * canvasElement.height) / 2,
        boundingBox.width * canvasElement.width,
        boundingBox.height * canvasElement.height,
        { color: 'rgba(79, 70, 229, 0.5)', lineWidth: 2 }
      );
      
      // Draw keypoints
      for (const keypoint of face.keypoints) {
        const keypointX = keypoint.x * canvasElement.width;
        const keypointY = keypoint.y * canvasElement.height;
        
        canvasCtx.beginPath();
        canvasCtx.arc(keypointX, keypointY, 3, 0, 2 * Math.PI);
        canvasCtx.fillStyle = '#4F46E5';
        canvasCtx.fill();
      }
    } else {
      setFaceDetected(false);
      setFacePosition(null);
    }
    
    canvasCtx.restore();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current && canvasRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraPermission('granted');
        
        // Set canvas dimensions to match video
        canvasRef.current.width = videoRef.current.videoWidth || 640;
        canvasRef.current.height = videoRef.current.videoHeight || 480;
        
        // Initialize camera utility
        if (detectorRef.current) {
          const cameraUtil = new camera.Camera(videoRef.current, {
            onFrame: async () => {
              if (detectorRef.current && videoRef.current.readyState === 4) {
                await detectorRef.current.send({ image: videoRef.current });
              }
            },
            width: 1280,
            height: 720
          });
          
          cameraUtil.start();
          cameraUtilRef.current = cameraUtil;
        }
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraPermission('denied');
    }
  };

  const startScan = () => {
    if (!faceDetected) {
      alert('Please position your face in the frame before starting the scan');
      return;
    }
    
    setScanState('scanning');
    setCountdown(3);
    
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          beginScanProcess();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const beginScanProcess = () => {
    // Start progress bar
    setProgress(0);
    const scanDuration = 10000; // 10 seconds
    const interval = 50; // Update every 50ms
    const steps = scanDuration / interval;
    let currentStep = 0;
    
    // Store face data during scan
    const faceData = [];
    
    const progressInterval = setInterval(() => {
      currentStep++;
      const newProgress = (currentStep / steps) * 100;
      setProgress(newProgress);
      
      // If face is detected, collect data
      if (faceDetected && facePosition) {
        faceData.push({
          timestamp: Date.now(),
          position: { ...facePosition }
        });
      }
      
      if (newProgress >= 100) {
        clearInterval(progressInterval);
        
        // Check if we collected enough face data
        if (faceData.length > (steps * 0.8)) {
          setScanState('complete');
          
          // Store face data in session storage for results page
          sessionStorage.setItem('faceData', JSON.stringify(faceData));
          
          // Navigate to results after a short delay
          setTimeout(() => {
            navigate('/face-scan/results');
          }, 1500);
        } else {
          // Not enough face data collected
          setScanState('error');
          setTimeout(() => {
            setScanState('initial');
          }, 2000);
        }
      }
    }, interval);
  };

  const cancelScan = () => {
    setScanState('initial');
    setProgress(0);
    setCountdown(null);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Face Scan</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Scan your face to detect vital signs like heart rate, respiratory rate, and stress levels
        </p>
      </div>

      <div className="relative">
        {/* Info button */}
        <button
          onClick={toggleInfo}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <FiInfo size={20} />
        </button>

        {/* Info modal */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 right-4 z-10 w-72 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-white">How it works</h3>
                <button onClick={toggleInfo} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <FiX size={18} />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                This feature uses remote photoplethysmography (rPPG) to detect subtle color changes in your face that correspond to your pulse.
              </p>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <p>• Ensure good lighting on your face</p>
                <p>• Keep still during the scan</p>
                <p>• Position your face within the frame</p>
                <p>• Remove glasses if possible</p>
              </div>
              <div className="mt-3 text-xs text-red-500 dark:text-red-400">
                <strong>Disclaimer:</strong> This is not a medical device and should not be used for clinical diagnosis.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Camera view */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-900 aspect-video shadow-lg">
          {cameraPermission === 'granted' ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover opacity-0 absolute"
              />
              <canvas
                ref={canvasRef}
                className="w-full h-full object-cover"
              />
              {!faceDetected && scanState === 'initial' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="text-center p-6">
                    <FiAlertTriangle className="mx-auto text-yellow-500 text-4xl mb-2" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Face Detected</h3>
                    <p className="text-gray-300 mb-4">
                      Please position your face within the frame to continue.
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              {cameraPermission === 'denied' ? (
                <div className="text-center p-6">
                  <FiX className="mx-auto text-red-500 text-4xl mb-2" />
                  <h3 className="text-xl font-semibold text-white mb-2">Camera Access Denied</h3>
                  <p className="text-gray-300 mb-4">
                    Please allow camera access in your browser settings to use this feature.
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="text-center p-6">
                  <FiCamera className="mx-auto text-gray-400 text-4xl mb-2" />
                  <h3 className="text-xl font-semibold text-white mb-2">Camera Access Required</h3>
                  <p className="text-gray-300 mb-4">
                    We need access to your camera to scan your face for vital signs.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Scanning overlay */}
          <AnimatePresence>
            {scanState === 'scanning' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                {countdown ? (
                  <motion.div
                    key="countdown"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    className="text-6xl font-bold text-white bg-black/30 w-24 h-24 rounded-full flex items-center justify-center"
                  >
                    {countdown}
                  </motion.div>
                ) : (
                  <div className="text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: [0.5, 1, 0.5], 
                        scale: [0.8, 1, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-64 h-64 border-4 border-indigo-500/70 rounded-full mx-auto mb-4"
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-white text-xl font-semibold mb-2"
                    >
                      Scanning...
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-white/80 text-sm"
                    >
                      Please remain still
                    </motion.p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scan complete overlay */}
          <AnimatePresence>
            {scanState === 'complete' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <FiCheckCircle className="text-white text-4xl" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">Scan Complete!</h3>
                  <p className="text-white/80">Redirecting to results...</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Scan error overlay */}
          <AnimatePresence>
            {scanState === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <FiX className="text-white text-4xl" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">Scan Failed</h3>
                  <p className="text-white/80 mb-4">Face not detected consistently during scan.</p>
                  <p className="text-white/60 text-sm">Please ensure your face is clearly visible and try again.</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          {scanState === 'scanning' && !countdown && (
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-800">
              <motion.div
                className="h-full bg-indigo-600"
                style={{ width: `${progress}%` }}
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-6 flex justify-center">
          {scanState === 'initial' ? (
            cameraPermission === 'granted' ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startScan}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition-colors duration-200 flex items-center"
              >
                <FiCamera className="mr-2" />
                Start Scan
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startCamera}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition-colors duration-200 flex items-center"
              >
                <FiCamera className="mr-2" />
                Enable Camera
              </motion.button>
            )
          ) : scanState === 'scanning' ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={cancelScan}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-colors duration-200 flex items-center"
            >
              <FiX className="mr-2" />
              Cancel
            </motion.button>
          ) : null}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiInfo className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Disclaimer</h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>
                This feature is for informational purposes only and is not intended to diagnose, treat, cure, or prevent any disease or health condition. Always consult with a qualified healthcare provider before making any health decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceScan;
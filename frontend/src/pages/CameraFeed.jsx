import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

const styles = {
  cameraContainer: {
    position: 'fixed',
    top: 20,
    right: 20,
    width: 180,
    height: 135,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 9999,
    border: '2px solid #5a67d8',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
};

export default function CameraFeed({ onMultipleFacesDetected, onNoFaceDetected }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    };

    const loadModels = async () => {
      const MODEL_URL = '/models'; // or CDN path for models
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    };

    loadModels().then(startVideo);

    return () => {
      // Cleanup video stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let intervalId;

    const detectFaces = async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) return;

      const options = new faceapi.TinyFaceDetectorOptions();

      const detections = await faceapi.detectAllFaces(videoRef.current, options);

      const canvas = canvasRef.current;
      const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };

      faceapi.matchDimensions(canvas, displaySize);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);

      if (detections.length === 0) {
        onNoFaceDetected && onNoFaceDetected();
      } else if (detections.length > 1) {
        onMultipleFacesDetected && onMultipleFacesDetected();
      }
    };

    intervalId = setInterval(detectFaces, 1000);

    return () => clearInterval(intervalId);
  }, [onMultipleFacesDetected, onNoFaceDetected]);

  return (
    <div style={styles.cameraContainer}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={styles.video}
        width={180}
        height={135}
      />
      <canvas
        ref={canvasRef}
        width={180}
        height={135}
        style={styles.canvas}
      />
    </div>
  );
}

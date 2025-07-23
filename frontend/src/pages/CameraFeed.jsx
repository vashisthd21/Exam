import { useEffect, useRef } from 'react';

export default function CameraFeed() {
  const videoRef = useRef(null);

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert('Unable to access camera');
        console.error('Camera error:', err);
      }
    };

    getCameraStream();
  }, []);

  return (
    <div style={styles.cameraContainer}>
      <video ref={videoRef} autoPlay muted playsInline style={styles.video} />
    </div>
  );
}

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
};

import { useEffect, useRef } from 'react';

export default function CameraFeed() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const start = async () => {
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });

        if (mounted && videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
        }
      } catch (err) {
        console.warn('Camera denied');
      }
    };

    start();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <div style={styles.box}>
      <video ref={videoRef} autoPlay muted playsInline style={styles.video} />
    </div>
  );
}

const styles = {
  box: {
    position: 'fixed',
    top: 20,
    right: 20,
    width: 180,
    height: 135,
    borderRadius: 12,
    overflow: 'hidden',
    border: '2px solid #2563eb',
    background: '#000',
    zIndex: 9999,
  },
  video: { width: '100%', height: '100%', objectFit: 'cover' },
};

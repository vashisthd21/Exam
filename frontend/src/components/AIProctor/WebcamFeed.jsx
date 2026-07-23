import Webcam from "react-webcam";

const WebcamFeed = ({ webcamRef, status }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 999,
      }}
    >
      <div style={{ position: "relative" }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored
          screenshotFormat="image/jpeg"
          style={{
            width: 230,
            height: 170,
            borderRadius: 16,
            objectFit: "cover",
            border: "3px solid white",
            boxShadow: "0 10px 30px rgba(0,0,0,.25)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            padding: "6px 12px",
            borderRadius: 20,
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            background:
              status === "one-face"
                ? "#16a34a"
                : status === "multiple-faces"
                ? "#f59e0b"
                : "#ef4444",
          }}
        >
          {status === "one-face"
            ? "✓ Face Detected"
            : status === "multiple-faces"
            ? "⚠ Multiple Faces"
            : "🚫 Face Lost"}
        </div>
      </div>
    </div>
  );
};

export default WebcamFeed;
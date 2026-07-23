import { useEffect } from "react";
import {
  FilesetResolver,
  FaceDetector,
} from "@mediapipe/tasks-vision";

const FaceDetection = ({ webcamRef, setStatus }) => {
  useEffect(() => {
    let detector;

    async function initialize() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      detector = await FaceDetector.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
          },
          runningMode: "VIDEO",
        }
      );

      detectFaces();
    }

    function detectFaces() {
      if (
        detector &&
        webcamRef.current &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;

        const result = detector.detectForVideo(
          video,
          performance.now()
        );

        const faces = result.detections;

        if (faces.length === 0)
          setStatus("no-face");
        else if (faces.length === 1)
          setStatus("one-face");
        else
          setStatus("multiple-faces");
      }

      requestAnimationFrame(detectFaces);
    }

    initialize();

    return () => {
      detector = null;
    };

  }, []);

  return null;
};

export default FaceDetection;
import { useRef, useState } from "react";

import WebcamFeed from "./WebcamFeed";
import FaceDetection from "./FaceDetector";
import ProctorStatus from "./ProctorStatus";
import ProctorMonitor from "./ProctorMonitor";

const AIProctor = ({ onAutoSubmit }) => {

  const webcamRef = useRef(null);

  const [status, setStatus] = useState("one-face");

  return (

    <div className="w-[320px] bg-white rounded-xl shadow-lg p-4">

      <h2 className="text-lg font-bold mb-3">

        AI Proctor

      </h2>

      <WebcamFeed webcamRef={webcamRef} />

      <FaceDetection

        webcamRef={webcamRef}

        setStatus={setStatus}

      />

      <ProctorStatus

        status={status}

      />

      <ProctorMonitor

        status={status}

        onAutoSubmit={onAutoSubmit}

      />

    </div>

  );

};

export default AIProctor;
import { useRef, useState } from "react";

import WebcamFeed from "../components/AIProctor/WebcamFeed";
import FaceDetection from "../components/AIProctor/FaceDetector";
import BrowserMonitor from "../components/AIProctor/BrowserMonitor";
import ProctorStatus from "../components/AIProctor/ProctorStatus";
import ProctorMonitor from "../components/AIProctor/ProctorMonitor";
import ViolationPanel from "../components/AIProctor/ViolationPanel";

const ProctorTest = () => {

  const webcamRef = useRef(null);

  const [status, setStatus] = useState("no-face");
  const [violations, setViolations] = useState([]);

  //---------------------------------------
  // Face Detection Auto Submit
  //---------------------------------------

  const handleAutoSubmit = (reason) => {

    setViolations((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "AUTO_SUBMIT",
        message: reason,
        time: new Date().toLocaleTimeString(),
      },
    ]);

    alert(reason);

    console.log("Auto Submit Triggered:", reason);

    // Later:
    // submitQuiz();

  };

  //---------------------------------------
  // Browser Violations
  //---------------------------------------

  const handleViolation = (violation) => {

    setViolations((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...violation,
        time: new Date().toLocaleTimeString(),
      },
    ]);

    console.log("Violation:", violation);

  };

  return (

    <div className="min-h-screen bg-gray-950 p-10">

      {/* Heading */}

      <h1 className="text-4xl font-bold text-white mb-10">

        🛡 AI Proctor Dashboard

      </h1>

      {/* Main Layout */}

      <div className="flex gap-10 items-start">

        {/* Left Section */}

        <div className="flex flex-col gap-5">

          <WebcamFeed
            webcamRef={webcamRef}
          />

          <FaceDetection
            webcamRef={webcamRef}
            setStatus={setStatus}
          />

          <BrowserMonitor
            onViolation={handleViolation}
          />

          <ProctorStatus
            status={status}
          />

          <ProctorMonitor
            status={status}
            onAutoSubmit={handleAutoSubmit}
          />

        </div>

        {/* Right Section */}

        <ViolationPanel
          violations={violations}
        />

      </div>

    </div>

  );

};

export default ProctorTest;
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const ProctorMonitor = ({ status, onAutoSubmit }) => {

  const [countdown, setCountdown] = useState(null);

  useEffect(() => {

    let timeout;
    let interval;

    if (status === "no-face") {

      setCountdown(30);

      interval = setInterval(() => {
        setCountdown(prev => {

          if (prev <= 1) {

            clearInterval(interval);

            return 0;

          }

          return prev - 1;

        });

      }, 1000);

      timeout = setTimeout(() => {

        onAutoSubmit(
          "No face detected continuously for 30 seconds."
        );

      }, 30000);

    }

    else if (status === "multiple-faces") {

      setCountdown(10);

      interval = setInterval(() => {

        setCountdown(prev => {

          if (prev <= 1) {

            clearInterval(interval);

            return 0;

          }

          return prev - 1;

        });

      }, 1000);

      timeout = setTimeout(() => {

        onAutoSubmit(
          "Multiple faces detected continuously for 10 seconds."
        );

      }, 10000);

    }

    else {

      setCountdown(null);

    }

    return () => {

      clearTimeout(timeout);

      clearInterval(interval);

    };

  }, [status]);

  return null;
}

export default ProctorMonitor;
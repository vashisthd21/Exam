import { useEffect } from "react";

const BrowserMonitor = ({ onViolation }) => {

  useEffect(() => {

    //-----------------------------------
    // Tab Switch
    //-----------------------------------

    const handleVisibility = () => {

      if (document.hidden) {

        onViolation({
          type: "TAB_SWITCH",
          message: "Tab switched."
        });

      }

    };

    //-----------------------------------
    // Full Screen Exit
    //-----------------------------------

    const handleFullscreen = () => {

      if (!document.fullscreenElement) {

        onViolation({
          type: "FULLSCREEN_EXIT",
          message: "Fullscreen exited."
        });

      }

    };

    //-----------------------------------
    // Right Click
    //-----------------------------------

    const handleContextMenu = (e) => {

      e.preventDefault();

      onViolation({
        type: "RIGHT_CLICK",
        message: "Right click detected."
      });

    };

    //-----------------------------------
    // Copy Paste
    //-----------------------------------

    const handleKeyDown = (e) => {

      if (e.ctrlKey && e.key.toLowerCase() === "c") {

        e.preventDefault();

        onViolation({
          type: "COPY",
          message: "Copy attempt."
        });

      }

      if (e.ctrlKey && e.key.toLowerCase() === "v") {

        e.preventDefault();

        onViolation({
          type: "PASTE",
          message: "Paste attempt."
        });

      }

      if (e.metaKey && e.key.toLowerCase() === "c") {

        e.preventDefault();

        onViolation({
          type: "COPY",
          message: "Copy attempt."
        });

      }

      if (e.metaKey && e.key.toLowerCase() === "v") {

        e.preventDefault();

        onViolation({
          type: "PASTE",
          message: "Paste attempt."
        });

      }

    };

    //-----------------------------------

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    document.addEventListener(
      "fullscreenchange",
      handleFullscreen
    );

    document.addEventListener(
      "contextmenu",
      handleContextMenu
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

      document.removeEventListener(
        "fullscreenchange",
        handleFullscreen
      );

      document.removeEventListener(
        "contextmenu",
        handleContextMenu
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, []);

  return null;

};

export default BrowserMonitor;
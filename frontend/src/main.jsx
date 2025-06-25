import React from "react";
import ReactDOM from "react-dom/client"; // ✅ correct package for React 18+
import App from "./app.jsx"; // ✅ match the component name to your file

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

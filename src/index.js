import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// React 18: Use createRoot to render the App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
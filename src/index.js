import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import reportWebVitals from './reportWebVitals';
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./static/styles.scss" 

const root = createRoot(document.getElementById("root"));
root.render(<App />);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// Import Cesium and its assets
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

// Extend Window interface to include Cesium properties
declare global {
  interface Window {
    CESIUM_BASE_URL?: string;
    Cesium?: typeof Cesium;
  }
}

// Configure Cesium
window.CESIUM_BASE_URL = '/cesium';
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyMjY0NDE0OH0.XcKpgANiY19MC4bdFUXMVEBToBmqS8kuYpUlxJHYZxk';

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

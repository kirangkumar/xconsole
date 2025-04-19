import React from "react";
import { useNavigate } from "react-router-dom";
import FleetStatusGrid from "./FleetStatusGrid";
import TelemetryTrends from "./TelemetryTrends";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Updated satellite names for telemetry
  const satelliteNames = [
    "Optical-1",
    "Radar-1",
    "Varuna-1",
    "Meteo-1",
    "Optical-2",
    "Radar-2",
    "Varuna-2",
    "Meteo-2"
  ];

  const handleSatelliteClick = (satelliteId: string) => {
    navigate(`/satellite/${satelliteId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0B1120] text-white">
      <main className="flex-1 p-6 overflow-auto mt-16">
        <div className="space-y-6">
          <FleetStatusGrid onSatelliteClick={handleSatelliteClick} />
          <TelemetryTrends 
            satellites={satelliteNames}
            className="mt-6"
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 
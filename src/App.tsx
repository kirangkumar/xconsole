import { Suspense, useState, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Satellite, Activity, Heart, Command, Rocket, Server, Database, LineChart, SatelliteIcon } from "lucide-react";
import Home from "./components/home";
import Sidebar from "./components/Sidebar";
import Header from "./components/dashboard/Header";
import Dashboard from "./components/dashboard/Dashboard";
import CommandCenter from "./components/command-center/CommandCenter";

// Lazy load dashboard components
const DownlinkingDashboard = lazy(() => import("./components/dashboard/DownlinkingDashboard"));
const TaskingDashboard = lazy(() => import("./components/dashboard/TaskingDashboard"));
const PredictiveHealthMonitoring = lazy(() => import("./components/dashboard/PredictiveHealthMonitoring"));
const MissionControlDashboard = lazy(() => import("./components/dashboard/MissionControlDashboard"));
const SatelliteDetailView = lazy(() => import("./components/dashboard/SatelliteDetailView"));
const TrajectorySimulation = lazy(() => import("./components/dashboard/TrajectorySimulation"));
const GroundStationsNetwork = lazy(() => import("./components/dashboard/GroundStationsNetwork"));
const ClientStorage = lazy(() => import("./components/dashboard/ClientStorage"));
const TelemetryDashboard = lazy(() => import("./components/dashboard/TelemetryDashboard"));

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  const getHeaderProps = () => {
    switch (location.pathname) {
      case "/dashboard":
        return {
          title: "Satellite Fleet Status",
          icon: <SatelliteIcon className="h-5 w-5 text-blue-400" />
        };
      case "/downlinking":
        return {
          title: "Downlinking Dashboard",
          icon: <Satellite className="h-5 w-5 text-green-400" />
        };
      case "/tasking":
        return {
          title: "Tasking Dashboard",
          icon: <Activity className="h-5 w-5 text-purple-400" />
        };
      case "/health":
        return {
          title: "Predictive Health Monitoring",
          icon: <Heart className="h-5 w-5 text-red-400" />
        };
      case "/command-center":
        return {
          title: "Command Center",
          icon: <Command className="h-5 w-5 text-yellow-400" />
        };
      case "/trajectory":
        return {
          title: "Trajectory Simulation",
          icon: <Rocket className="h-5 w-5 text-orange-400" />
        };
      case "/ground-stations":
        return {
          title: "Ground Stations Network",
          icon: <Server className="h-5 w-5 text-cyan-400" />
        };
      case "/storage":
        return {
          title: "Client Storage",
          icon: <Database className="h-5 w-5 text-indigo-400" />
        };
      case "/telemetry":
        return {
          title: "Satellite Telemetry",
          icon: <LineChart className="h-5 w-5 text-pink-400" />
        };
      default:
        return {
          title: "Mission Overview",
          icon: <LayoutDashboard className="h-5 w-5 text-blue-400" />
        };
    }
  };

  const headerProps = getHeaderProps();

  return (
    <div className="flex h-screen bg-[#0B1120] text-white overflow-hidden">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <div className={`transition-[margin] duration-300 ${isSidebarCollapsed ? "ml-[60px]" : "ml-[240px]"}`}>
          <Header 
            title={headerProps.title}
            icon={headerProps.icon}
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        }>
          <div className={`flex-1 mt-4 transition-[margin] duration-300 ${isSidebarCollapsed ? "" : ""}`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/downlinking" element={<DownlinkingDashboard />} />
              <Route path="/tasking" element={<TaskingDashboard />} />
              <Route path="/health" element={<PredictiveHealthMonitoring />} />
              <Route path="/command-center" element={<CommandCenter satelliteId="default" />} />
              <Route path="/trajectory" element={<TrajectorySimulation />} />
              <Route path="/ground-stations" element={<GroundStationsNetwork />} />
              <Route path="/storage" element={<ClientStorage />} />
              <Route path="/telemetry" element={<TelemetryDashboard />} />
              <Route path="/satellite/:id" element={<SatelliteDetailView />} />
            </Routes>
          </div>
        </Suspense>
      </div>
    </div>
  );
}

export default App;

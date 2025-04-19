import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Satellite, AlertCircle, Clock, Target, Calendar, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusCard from "./ui/StatusCard";
import SubsystemCard from "./ui/SubsystemCard";
import SatelliteTable from "./dashboard/tables/SatelliteTable";
import AlertRecommendationPanel from "./dashboard/AlertRecommendationPanel";

type SatelliteStatus = 'critical' | 'degraded' | 'nominal';

interface Satellite {
  name: string;
  type: string;
  status: SatelliteStatus;
  health: number;
}

interface Command {
  id: string;
  name: string;
  satellite: string;
  scheduledTime: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

interface Anomaly {
  id: string;
  title: string;
  satellite: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'investigating' | 'resolved';
  timestamp: string;
}

const Home = () => {
  const [activeTab, setActiveTab] = useState("constellation-overview");
  const navigate = useNavigate();
  
  const statusCards = [
    {
      title: "Satellites",
      value: "12",
      subtitle: "9 nominal",
      icon: <Satellite className="h-6 w-6 text-blue-400" />,
      onClick: () => navigate("/dashboard"),
    },
    {
      title: "Active Anomalies",
      value: "6",
      subtitle: "6 predicted",
      icon: <AlertCircle className="h-6 w-6 text-red-400" />,
    },
    {
      title: "Priority AOIs",
      value: "4",
      subtitle: "8 total areas",
      icon: <Target className="h-6 w-6 text-green-400" />,
    },
  ];

  const satellites: Satellite[] = [
    {
      name: "QUANSAT-8",
      type: "Communications",
      status: "critical",
      health: 20,
    },
    {
      name: "QUANSAT-4",
      type: "Weather",
      status: "degraded",
      health: 60,
    },
    {
      name: "QUANSAT-1",
      type: "Optical",
      status: "nominal",
      health: 95,
    },
  ];

  // Mock data for upcoming commands
  const upcomingCommands: Command[] = [
    {
      id: "cmd-001",
      name: "Orbit Adjustment",
      satellite: "QUANSAT-8",
      scheduledTime: "2023-06-15 14:30 UTC",
      status: "scheduled",
      priority: "high",
    },
    {
      id: "cmd-002",
      name: "Payload Calibration",
      satellite: "QUANSAT-4",
      scheduledTime: "2023-06-15 16:45 UTC",
      status: "scheduled",
      priority: "medium",
    },
    {
      id: "cmd-003",
      name: "Communication Test",
      satellite: "QUANSAT-1",
      scheduledTime: "2023-06-16 09:15 UTC",
      status: "scheduled",
      priority: "low",
    },
    {
      id: "cmd-004",
      name: "Battery Maintenance",
      satellite: "QUANSAT-8",
      scheduledTime: "2023-06-16 11:30 UTC",
      status: "scheduled",
      priority: "high",
    },
    {
      id: "cmd-005",
      name: "Imaging Sequence",
      satellite: "QUANSAT-1",
      scheduledTime: "2023-06-16 13:45 UTC",
      status: "scheduled",
      priority: "medium",
    },
  ];

  // Mock data for active anomalies
  const activeAnomalies: Anomaly[] = [
    {
      id: "anom-001",
      title: "Power System Degradation",
      satellite: "QUANSAT-8",
      severity: "critical",
      status: "active",
      timestamp: "2023-06-14 08:15 UTC",
    },
    {
      id: "anom-002",
      title: "Communication Delay",
      satellite: "QUANSAT-4",
      severity: "warning",
      status: "investigating",
      timestamp: "2023-06-14 10:30 UTC",
    },
    {
      id: "anom-003",
      title: "Thermal Control Issue",
      satellite: "QUANSAT-8",
      severity: "critical",
      status: "active",
      timestamp: "2023-06-14 12:45 UTC",
    },
    {
      id: "anom-004",
      title: "Sensor Calibration Required",
      satellite: "QUANSAT-1",
      severity: "info",
      status: "active",
      timestamp: "2023-06-14 14:20 UTC",
    },
    {
      id: "anom-005",
      title: "Orbit Drift Detected",
      satellite: "QUANSAT-4",
      severity: "warning",
      status: "active",
      timestamp: "2023-06-14 16:10 UTC",
    },
  ];

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "constellation-overview":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Satellite Status */}
            <div className="col-span-2">
              <SatelliteTable satellites={satellites} />
            </div>
          </div>
        );
      
      case "upcoming-commands":
        return (
          <div className="bg-[#151B2B] rounded-lg p-4">
            <div className="flex items-center mb-4">
              <Calendar className="h-5 w-5 text-blue-400 mr-2" />
              <h2 className="text-lg font-semibold">Upcoming Commands</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-800">
                    <th className="text-left py-3">Command</th>
                    <th className="text-left py-3">Satellite</th>
                    <th className="text-left py-3">Scheduled Time</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingCommands.map((command) => (
                    <tr key={command.id} className="border-b border-gray-800">
                      <td className="py-3">{command.name}</td>
                      <td className="py-3">{command.satellite}</td>
                      <td className="py-3">{command.scheduledTime}</td>
                      <td className="py-3">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs",
                          command.status === "scheduled" && "bg-blue-500/10 text-blue-500",
                          command.status === "in-progress" && "bg-yellow-500/10 text-yellow-500",
                          command.status === "completed" && "bg-green-500/10 text-green-500"
                        )}>
                          {command.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs",
                          command.priority === "high" && "bg-red-500/10 text-red-500",
                          command.priority === "medium" && "bg-yellow-500/10 text-yellow-500",
                          command.priority === "low" && "bg-green-500/10 text-green-500"
                        )}>
                          {command.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case "active-anomalies":
        return (
          <div className="bg-[#151B2B] rounded-lg p-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <h2 className="text-lg font-semibold">Active Anomalies</h2>
            </div>
            <div className="space-y-4">
              {activeAnomalies.map((anomaly) => (
                <div key={anomaly.id} className="bg-[#1A2235] rounded-lg p-4 border border-gray-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{anomaly.title}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-400">
                        <span>{anomaly.satellite}</span>
                        <span className="mx-2">•</span>
                        <span>{anomaly.timestamp}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs",
                        anomaly.severity === "critical" && "bg-red-500/10 text-red-500",
                        anomaly.severity === "warning" && "bg-yellow-500/10 text-yellow-500",
                        anomaly.severity === "info" && "bg-blue-500/10 text-blue-500"
                      )}>
                        {anomaly.severity}
                      </span>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs",
                        anomaly.status === "active" && "bg-red-500/10 text-red-500",
                        anomaly.status === "investigating" && "bg-yellow-500/10 text-yellow-500",
                        anomaly.status === "resolved" && "bg-green-500/10 text-green-500"
                      )}>
                        {anomaly.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0B1120] text-white mt-16">
      <main className="flex-1 p-6 overflow-auto ">
        <div className="flex gap-6">
          {/* Left Content - 2/3 width */}
          <div className="w-3/5">
            {/* Status Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {statusCards.map((card) => (
                <StatusCard key={card.title} {...card} />
              ))}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-800 mb-6">
              <div className="flex space-x-8">
                {["Constellation Overview", "Upcoming Commands", "Active Anomalies"].map((tab) => (
                  <button
                    key={tab}
                    className={cn(
                      "pb-4 text-sm font-medium relative",
                      activeTab === tab.toLowerCase().replace(/\s+/g, "-")
                        ? "text-blue-400"
                        : "text-gray-400 hover:text-gray-300"
                    )}
                    onClick={() => setActiveTab(tab.toLowerCase().replace(/\s+/g, "-"))}
                  >
                    {tab}
                    {activeTab === tab.toLowerCase().replace(/\s+/g, "-") && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>

          {/* Right Content - 1/3 width */}
          <div className="w-2/5">
            <div className="bg-[#151B2B] rounded-lg p-2 h-screen overflow-auto">
              <AlertRecommendationPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

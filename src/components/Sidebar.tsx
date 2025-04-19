import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Download,
  Upload,
  Activity,
  Terminal,
  Globe,
  Satellite,
  Server,
  LineChart,
  SatelliteIcon,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const location = useLocation();

  const navigationItems = [
    {
      name: "Home",
      path: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Fleet",
      path: "/dashboard",
      icon: <SatelliteIcon className="h-5 w-5" />,
    },
    {
      name: "Telemetry",
      path: "/telemetry",
      icon: <LineChart className="h-5 w-5" />,
    },
    {
      name: "Command Center",
      path: "/command-center",
      icon: <Terminal className="h-5 w-5" />,
    },
    {
      name: "Health",
      path: "/health",
      icon: <Activity className="h-5 w-5" />,
      badge: 6,
    },
    {
      name: "Tasking",
      path: "/tasking",
      icon: <Upload className="h-5 w-5" />,
    },
    {
      name: "Downlinking",
      path: "/downlinking",
      icon: <Download className="h-5 w-5" />,
    },
    {
      name: "Trajectory",
      path: "/trajectory",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      name: "Ground Stations",
      path: "/ground-stations",
      icon: <Satellite className="h-5 w-5" />,
    },
    {
      name: "Storage",
      path: "/storage",
      icon: <Server className="h-5 w-5" />,
    },
   
  ];

  // const statusItems = [
  //   { label: "Nominal:", value: "9", color: "bg-green-500" },
  //   { label: "Degraded:", value: "1", color: "bg-yellow-500" },
  //   { label: "Critical:", value: "1", color: "bg-red-500" },
  //   { label: "Anomalies:", value: "6", color: "text-gray-400" },
  // ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-[#0B1120] border-r border-gray-800 transition-all duration-300",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        "flex items-center p-4 border-b border-gray-800",
        isCollapsed ? "justify-center" : "px-4"
      )}>
        <div className="flex items-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-500"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {!isCollapsed && (
            <span className="ml-3 text-xl font-semibold text-white">Quanmo</span>
          )}
        </div>
      </div>

      <nav className="flex-1 px-2 py-3">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center px-2 py-2 my-1 rounded-md transition-colors relative",
              location.pathname === item.path
                ? "bg-blue-500/10 text-blue-500"
                : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            )}
          >
            <div className="flex items-center">
              {item.icon}
              {!isCollapsed && <span className="ml-3">{item.name}</span>}
            </div>
            {item.badge && (
              <span className={cn(
                "flex items-center justify-center rounded-full bg-red-500 text-white text-xs",
                isCollapsed ? "h-4 w-4 absolute -top-1 -right-1" : "h-5 w-5 ml-auto"
              )}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Status Indicators
      <div className={cn(
        "border-t border-gray-800 p-4",
        isCollapsed ? "hidden" : "block"
      )}>
        {statusItems.map((item) => (
          <div key={item.label} className="flex justify-between items-center py-1 text-sm">
            <span className="text-gray-400">{item.label}</span>
            <div className="flex items-center gap-2">
              {item.color !== "text-gray-400" && (
                <div className={cn("h-2 w-2 rounded-full", item.color)} />
              )}
              <span className={cn(
                item.color === "text-gray-400" ? item.color : "text-white"
              )}>
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Sidebar;

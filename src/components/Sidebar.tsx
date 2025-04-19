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
  Menu,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

const Sidebar = ({ isCollapsed, onToggleSidebar }: SidebarProps) => {
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
        "flex items-center h-16 p-4 w-16",
        isCollapsed ? "justify-center" : "px-4"
      )}>
        <div className="flex items-center">
          {isCollapsed ? (
            <img src="/logo.png" alt="Logo" className="h-8 w-8 brightness-120 " />
          ) : (
            <>
              <img src="/logo.png" alt="Q" className="h-8 w-8" />
              <span className="ml-3 text-2xl font-bold bg-gradient-to-l from-cyan-400 to-blue-500 text-transparent bg-clip-text">Quanmo</span>
            </>
          )}
        </div>
      </div>
      {/* Toggle Button */}
      <div className={cn(
        "absolute top-12",
        isCollapsed ? "left-11" : "left-[208px]"
      )}>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "px-2 text-gray-200 hover:text-white hover:bg-transparent",
            "flex items-center justify-center"
          )}
          onClick={onToggleSidebar}
        >
          <ChevronRight className={cn(
            "h-6 w-6 transition-transform bg-gray-600",
            !isCollapsed && "rotate-180"
          )} />
        </Button>
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
            {isCollapsed ? (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      {item.icon}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="flex items-center">
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </div>
            )}
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

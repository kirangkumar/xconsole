import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Thermometer,
  Wifi,
  Database,
  Compass,
  AlertTriangle,
} from "lucide-react";

interface SatelliteStatusPanelProps {
  id?: string;
  name?: string;
  temperature?: {
    value: number;
    status: "normal" | "warning" | "critical";
    unit: string;
  };
  attitude?: {
    status: "normal" | "warning" | "critical";
    deviation?: string;
  };
  downlink?: {
    status: "normal" | "warning" | "critical";
    latency?: string;
  };
  buffer?: {
    percentage: number;
    status: "normal" | "warning" | "critical";
  };
  alerts?: string[];
  onClick?: () => void;
}

const SatelliteStatusPanel = ({
  id = "SAT-1",
  name = "Satellite-1",
  temperature = {
    value: 76.2,
    status: "warning",
    unit: "°C",
  },
  attitude = {
    status: "normal",
    deviation: "0.1°",
  },
  downlink = {
    status: "normal",
    latency: "120ms",
  },
  buffer = {
    percentage: 68,
    status: "normal",
  },
  alerts = ["Imaging task rerouted"],
  onClick = () => {},
}: SatelliteStatusPanelProps) => {
  const getStatusColor = (status: "normal" | "warning" | "critical") => {
    switch (status) {
      case "normal":
        return "bg-green-500";
      case "warning":
        return "bg-amber-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-green-500";
    }
  };

  const getTextColor = (status: "normal" | "warning" | "critical") => {
    switch (status) {
      case "normal":
        return "text-green-500";
      case "warning":
        return "text-amber-500";
      case "critical":
        return "text-red-500";
      default:
        return "text-green-500";
    }
  };

  const getBufferColor = (percentage: number) => {
    if (percentage > 90) return "bg-red-500";
    if (percentage > 70) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <Card
      className={cn(
        "bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer transition-all",
        temperature.status === "critical" && "border-red-500 border-opacity-50",
        temperature.status === "warning" &&
          "border-amber-500 border-opacity-50",
      )}
      onClick={onClick}
    >
      <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              getStatusColor(temperature.status),
            )}
          />
          {name}
          <span className="text-xs text-white font-normal">({id})</span>
        </CardTitle>
        {alerts.length > 0 && (
          <Badge
            variant="outline"
            className="bg-slate-800 text-amber-400 border-amber-400/30 text-xs"
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            {alerts.length}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <Thermometer
              className={cn("h-4 w-4", getTextColor(temperature.status))}
            />
            <span className="text-xs text-white">
              {temperature.value}
              {temperature.unit}
              <span
                className={cn("ml-1 text-xs", getTextColor(temperature.status))}
              >
                {temperature.status === "warning" && "↑"}
                {temperature.status === "critical" && "↑↑"}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Compass className={cn("h-4 w-4", getTextColor(attitude.status))} />
            <span className="text-xs text-white">
              {attitude.status === "normal" ? "Normal" : attitude.deviation}
              {attitude.status !== "normal" && (
                <span
                  className={cn("ml-1 text-xs", getTextColor(attitude.status))}
                >
                  deviation
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className={cn("h-4 w-4", getTextColor(downlink.status))} />
            <span className="text-xs text-white">
              {downlink.status === "normal" ? "Normal" : downlink.latency}
              {downlink.status !== "normal" && (
                <span
                  className={cn("ml-1 text-xs", getTextColor(downlink.status))}
                >
                  latency
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Database className={cn("h-4 w-4", getTextColor(buffer.status))} />
            <span className="text-xs text-white">
              Buffer: {buffer.percentage}%
            </span>
          </div>
        </div>

        <div className="mt-2">
          <Progress
            value={buffer.percentage}
            className="h-1 bg-slate-800"
            indicatorClassName={getBufferColor(buffer.percentage)}
          />
        </div>

        {alerts.length > 0 && (
          <div className="mt-2 text-xs text-white truncate">
            {alerts[0]}
            {alerts.length > 1 && <span> +{alerts.length - 1} more</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SatelliteStatusPanel;

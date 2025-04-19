import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { ArrowRight, Info, RefreshCw, Satellite, Wifi } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

interface SatelliteDownlinkData {
  id: string;
  name: string;
  successProbability: number;
  status: "optimal" | "warning" | "critical";
  recommendedRoute?: {
    via: string;
    to: string;
    improvement: number;
  };
}

interface DownlinkManagementProps {
  satellites?: SatelliteDownlinkData[];
  onApplyRecommendation?: (satelliteId: string) => void;
  onRefresh?: () => void;
}

const DownlinkManagement = ({
  satellites = [
    {
      id: "sat-1",
      name: "Satellite-1",
      successProbability: 78,
      status: "optimal",
    },
    {
      id: "sat-2",
      name: "Satellite-2",
      successProbability: 65,
      status: "warning",
    },
    {
      id: "sat-3",
      name: "Satellite-3",
      successProbability: 92,
      status: "optimal",
    },
    {
      id: "sat-4",
      name: "Satellite-4",
      successProbability: 52,
      status: "critical",
      recommendedRoute: {
        via: "Satellite-6",
        to: "GS-2",
        improvement: 28,
      },
    },
    {
      id: "sat-5",
      name: "Satellite-5",
      successProbability: 81,
      status: "optimal",
    },
    {
      id: "sat-6",
      name: "Satellite-6",
      successProbability: 73,
      status: "warning",
      recommendedRoute: {
        via: "Satellite-3",
        to: "GS-1",
        improvement: 15,
      },
    },
  ],
  onApplyRecommendation = () => {},
  onRefresh = () => {},
}: DownlinkManagementProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-green-500";
      case "warning":
        return "bg-amber-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  const getProgressColor = (probability: number) => {
    if (probability >= 80) return "bg-green-500";
    if (probability >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card className="w-full h-full bg-slate-900 border-slate-800 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
            <Wifi className="h-5 w-5 text-blue-400" />
            Downlink Management
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
            onClick={handleRefresh}
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {satellites.map((satellite) => (
            <div key={satellite.id} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      getStatusColor(satellite.status),
                    )}
                  />
                  <span className="text-sm font-medium text-white">
                    {satellite.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-white">
                  {satellite.successProbability}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={satellite.successProbability}
                  max={100}
                  className={cn("h-2 bg-slate-700")}
                  indicatorClassName={getProgressColor(
                    satellite.successProbability,
                  )}
                />
                {satellite.recommendedRoute && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <Info className="h-4 w-4 text-blue-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-slate-800 border-slate-700 text-white"
                      >
                        <p className="text-xs">Recommended routing available</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              {satellite.recommendedRoute && (
                <div className="mt-1 bg-slate-800 rounded-md p-2 text-xs border border-slate-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-blue-400 font-medium">
                        Recommended:
                      </span>{" "}
                      <span className="text-white">
                        Route via {satellite.recommendedRoute.via} to{" "}
                        {satellite.recommendedRoute.to}
                      </span>
                      <div className="text-green-400 text-xs mt-1">
                        +{satellite.recommendedRoute.improvement}% success
                        probability
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="h-7 bg-blue-600 hover:bg-blue-700 text-xs gap-1"
                      onClick={() => onApplyRecommendation(satellite.id)}
                    >
                      Apply <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DownlinkManagement;

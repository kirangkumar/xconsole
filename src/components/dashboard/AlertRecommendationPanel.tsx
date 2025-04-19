import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
  X,
  Zap,
  Lightbulb,
  Calendar,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type AlertPriority =
  | "critical"
  | "warning"
  | "info"
  | "opportunity"
  | "predictive";
type AlertAction = "implement" | "dismiss" | "snooze";

interface Alert {
  id: string;
  title: string;
  description: string;
  priority: AlertPriority;
  timestamp: string;
  satellite?: string;
  recommendation?: string;
  actions?: AlertAction[];
}

interface AlertRecommendationPanelProps {
  alerts?: Alert[];
  onAlertAction?: (alertId: string, action: AlertAction) => void;
  className?: string;
}

const AlertRecommendationPanel = ({
  alerts = [
    // {
    //   id: "alert-6",
    //   title: "Imaging Opportunity for AOI-2",
    //   description:
    //     "Optimal imaging conditions for AOI-2 available in next pass.",
    //   priority: "opportunity",
    //   timestamp: "2023-06-15T14:25:00Z",
    //   satellite: "Satellite-6",
    //   recommendation:
    //     "Schedule high-resolution imaging of AOI-2 during next orbital pass at 15:10 UTC.",
    //   actions: ["implement", "dismiss"],
    // },
    {
      id: "alert-2",
      title: "Downlink Opportunity",
      description:
        "Optimal downlink window available for Satellite-4 via Ground Station 2.",
      priority: "opportunity",
      timestamp: "2023-06-15T14:20:00Z",
      satellite: "Satellite-4",
      recommendation:
        "Schedule priority data packets for transmission in next 15 minutes.",
      actions: ["implement", "dismiss"],
    },
    {
      id: "alert-1",
      title: "Satellite-1 Temperature Critical",
      description:
        "Temperature has exceeded 80°C threshold in primary sensor array.",
      priority: "critical",
      timestamp: "2023-06-15T14:23:00Z",
      satellite: "Satellite-1",
      recommendation:
        "Reduce power to non-essential systems and rotate satellite to reduce solar exposure.",
      actions: ["implement", "dismiss", "snooze"],
    },
    // {
    //   id: "alert-5",
    //   title: "Imaging Opportunity",
    //   description:
    //     "AOI-1 can be captured with better resolution using Satellite-5.",
    //   priority: "opportunity",
    //   timestamp: "2023-06-15T14:05:00Z",
    //   satellite: "Satellite-5",
    //   recommendation:
    //     "Redirect imaging task from Satellite-1 to Satellite-5 for next pass.",
    //   actions: ["implement", "dismiss"],
    // },
    {
      id: "alert-4",
      title: "Buffer Capacity Warning",
      description: "Data buffer at 92% capacity on Satellite-7.",
      priority: "warning",
      timestamp: "2023-06-15T14:10:00Z",
      satellite: "Satellite-7",
      recommendation:
        "Prioritize anomaly packets for next downlink and pause non-critical data collection.",
      actions: ["implement", "dismiss", "snooze"],
    },
    {
      id: "alert-8",
      title: "Satellite-3 Safe Mode Conflict",
      description:
        "Satellite-3 can't handle the AOI-2 imaging as it needs to be in safe mode at 14:20.",
      priority: "predictive",
      timestamp: "2023-06-15T14:15:00Z",
      satellite: "Satellite-3",
      recommendation:
        "Delegate AOI-2 imaging task to Satellite-6 which has optimal positioning.",
      actions: ["implement", "dismiss", "snooze"],
    },
    {
      id: "alert-3",
      title: "Attitude Anomaly Detected",
      description: "Pitch deviation of 0.3° detected in Satellite-2.",
      priority: "warning",
      timestamp: "2023-06-15T14:15:00Z",
      satellite: "Satellite-2",
      recommendation:
        "Run attitude correction sequence and verify star tracker calibration.",
      actions: ["implement", "dismiss", "snooze"],
    },
  ],
  onAlertAction = () => {},
  className,
}: AlertRecommendationPanelProps) => {
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>(alerts);

  // Sort alerts by priority and timestamp
  const sortedAlerts = useMemo(() => {
    return [...activeAlerts].sort((a, b) => {
      // Priority order: opportunity, predictive, critical, warning, info
      const priorityOrder: Record<AlertPriority, number> = {
        opportunity: 1,
        predictive: 2,
        critical: 3,
        warning: 4,
        info: 5,
      };

      // First sort by priority
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      // Then by timestamp (newest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [activeAlerts]);

  const handleAlertAction = (alertId: string, action: AlertAction) => {
    if (action === "dismiss") {
      setActiveAlerts(activeAlerts.filter((alert) => alert.id !== alertId));
    }
    onAlertAction(alertId, action);
  };

  const getPriorityIcon = (priority: AlertPriority) => {
    switch (priority) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "opportunity":
        return <Lightbulb className="h-5 w-5 text-green-500" />;
      case "predictive":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityBadge = (priority: AlertPriority) => {
    switch (priority) {
      case "critical":
        return (
          <Badge variant="destructive" className="ml-2 text-white">
            Critical
          </Badge>
        );
      case "warning":
        return (
          <Badge
            variant="outline"
            className="ml-2 border-amber-500 text-amber-500"
          >
            Warning
          </Badge>
        );
      case "info":
        return (
          <Badge
            variant="outline"
            className="ml-2 border-blue-500 text-blue-500"
          >
            Info
          </Badge>
        );
      case "opportunity":
        return (
          <Badge
            variant="outline"
            className="ml-2 border-green-500 text-green-500"
          >
            Opportunity
          </Badge>
        );
      case "predictive":
        return (
          <Badge
            variant="outline"
            className="ml-2 border-purple-500 text-purple-500"
          >
            Predictive
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className={cn(
        "w-full h-full bg-slate-900 border-slate-800 shadow-md p-2",
        className,
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center text-white">
          <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
          Alerts & Recommendations
          <Badge className="ml-auto bg-slate-700 text-white">
            {activeAlerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)]">
        <ScrollArea className="h-full pr-4">
          {sortedAlerts.length > 0 ? (
            <div className="space-y-3">
              {sortedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "p-3 rounded-md border",
                    alert.priority === "critical"
                      ? "border-red-900 bg-red-950/30"
                      : alert.priority === "warning"
                        ? "border-amber-900 bg-amber-950/30"
                        : alert.priority === "opportunity"
                          ? "border-green-900 bg-green-950/30"
                          : alert.priority === "predictive"
                            ? "border-purple-900 bg-purple-950/30"
                            : "border-blue-900 bg-blue-950/30",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      {getPriorityIcon(alert.priority)}
                      <div className="ml-2">
                        <div className="flex items-center">
                          <h4 className="font-medium text-sm text-white">
                            {alert.title}
                          </h4>
                          {getPriorityBadge(alert.priority)}
                        </div>
                        <p className="text-xs text-white mt-1">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-white">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                  </div>

                  {alert.recommendation && (
                    <div className="mt-2 pl-7">
                      <div className="flex items-start p-2 rounded bg-slate-800/50 border border-slate-700">
                        <Zap className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <div className="ml-2">
                          <div className="text-xs font-medium text-indigo-400">
                            AI Recommendation
                          </div>
                          <p className="text-xs text-white">
                            {alert.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-2 pl-7 flex space-x-2">
                    {alert.actions?.includes("implement") && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="default"
                              className="h-7 px-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                              onClick={() =>
                                handleAlertAction(alert.id, "implement")
                              }
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              Implement
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-800 text-white">
                            <p>Apply the recommended action</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    {alert.actions?.includes("snooze") && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs border-slate-700 bg-slate-800 hover:bg-slate-700 text-white"
                              onClick={() =>
                                handleAlertAction(alert.id, "snooze")
                              }
                            >
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              Snooze
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-800 text-white">
                            <p>Remind me later</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    {alert.actions?.includes("dismiss") && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs hover:bg-red-950 hover:text-white"
                              onClick={() =>
                                handleAlertAction(alert.id, "dismiss")
                              }
                            >
                              <X className="h-3.5 w-3.5 mr-1" />
                              Dismiss
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-800 text-white">
                            <p>Dismiss this alert</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>

                  {alert.satellite && (
                    <div className="mt-2 pl-7">
                      <Badge
                        variant="outline"
                        className="text-xs px-1.5 py-0 h-5 border-slate-700 text-white"
                      >
                        {alert.satellite}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white py-8">
              <CheckCircle2 className="h-10 w-10 mb-2 text-white" />
              <p className="text-sm">No active alerts</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AlertRecommendationPanel;

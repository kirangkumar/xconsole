import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Calendar,
  Check,
  Clock,
  Download,
  Eye,
  Filter,
  Heart,
  HelpCircle,
  History,
  Info,
  Maximize2,
  MoreHorizontal,
  RefreshCw,
  Search,
  Settings,
  Sliders,
  Thermometer,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface PredictiveHealthMonitoringProps {
  className?: string;
}

interface AnomalyEvent {
  id: string;
  satellite: string;
  subsystem: string;
  component: string;
  severity: "critical" | "warning" | "info";
  timestamp: string;
  description: string;
  predictedImpact: string;
  recommendedAction: string;
  status: "new" | "investigating" | "mitigated" | "resolved";
  confidence: number;
  trend?: "improving" | "stable" | "worsening";
}

interface HealthMetric {
  satellite: string;
  subsystem: string;
  metric: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  trend: "improving" | "stable" | "worsening";
  history: { timestamp: string; value: number }[];
  predictedValues: { timestamp: string; value: number; confidence: number }[];
}

const PredictiveHealthMonitoring = ({
  className,
}: PredictiveHealthMonitoringProps) => {
  const [activeTab, setActiveTab] = useState("anomalies");
  const [selectedSatellite, setSelectedSatellite] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("24h");

  // Mock anomaly events
  const anomalyEvents: AnomalyEvent[] = [
    {
      id: "anomaly-1",
      satellite: "SAT-1",
      subsystem: "Thermal Control",
      component: "Primary Radiator",
      severity: "warning",
      timestamp: "2023-06-15T10:23:45Z",
      description:
        "Thermal radiator efficiency declining faster than expected. Temperature trending upward by 0.5°C/hour.",
      predictedImpact:
        "If trend continues, critical temperature threshold will be reached in approximately 12 hours.",
      recommendedAction:
        "Reduce non-essential power consumption by 20% and reorient satellite to optimize thermal dissipation.",
      status: "investigating",
      confidence: 87,
      trend: "worsening",
    },
    {
      id: "anomaly-2",
      satellite: "SAT-3",
      subsystem: "Power",
      component: "Solar Array Alpha",
      severity: "critical",
      timestamp: "2023-06-15T09:17:22Z",
      description:
        "Sudden 35% drop in power generation from Solar Array Alpha. Voltage fluctuations detected.",
      predictedImpact:
        "Battery reserves will deplete within 8 hours if power generation isn't restored.",
      recommendedAction:
        "Switch to backup power circuit and schedule emergency diagnostic routine.",
      status: "new",
      confidence: 94,
    },
    {
      id: "anomaly-3",
      satellite: "SAT-6",
      subsystem: "Attitude Control",
      component: "Reaction Wheel 2",
      severity: "warning",
      timestamp: "2023-06-15T08:45:10Z",
      description:
        "Increased vibration detected in Reaction Wheel 2. Bearing wear pattern identified.",
      predictedImpact:
        "Potential attitude control degradation within 72 hours if not addressed.",
      recommendedAction:
        "Redistribute momentum management to alternate wheels and schedule maintenance window.",
      status: "mitigated",
      confidence: 82,
      trend: "stable",
    },
    {
      id: "anomaly-4",
      satellite: "SAT-2",
      subsystem: "Communication",
      component: "X-Band Transmitter",
      severity: "info",
      timestamp: "2023-06-15T07:32:18Z",
      description:
        "Minor signal degradation detected in X-Band downlink. SNR reduced by 3dB.",
      predictedImpact:
        "No immediate impact on operations. May affect high-bandwidth data transmission if worsens.",
      recommendedAction:
        "Monitor during next three downlink passes. Schedule diagnostic if trend continues.",
      status: "new",
      confidence: 76,
      trend: "stable",
    },
    {
      id: "anomaly-5",
      satellite: "SAT-4",
      subsystem: "Propulsion",
      component: "Thruster Valve B",
      severity: "warning",
      timestamp: "2023-06-15T06:19:55Z",
      description:
        "Valve response time increased by 15ms. Potential valve stiction developing.",
      predictedImpact:
        "May impact precision of orbital maneuvers if degradation continues.",
      recommendedAction:
        "Perform valve cycling procedure and update thruster calibration parameters.",
      status: "resolved",
      confidence: 89,
      trend: "improving",
    },
  ];

  // Mock health metrics
  const healthMetrics: HealthMetric[] = [
    {
      satellite: "SAT-1",
      subsystem: "Thermal Control",
      metric: "Primary Radiator Temperature",
      value: 78.5,
      unit: "°C",
      status: "warning",
      trend: "worsening",
      history: Array(24)
        .fill(0)
        .map((_, i) => ({
          timestamp: `${23 - i}:00`,
          value: 72 + i * 0.3 + Math.random() * 0.5,
        })),
      predictedValues: Array(12)
        .fill(0)
        .map((_, i) => ({
          timestamp: `+${i + 1}h`,
          value: 78.5 + (i + 1) * 0.4 + Math.random() * 0.3,
          confidence: 95 - i * 2,
        })),
    },
    {
      satellite: "SAT-3",
      subsystem: "Power",
      metric: "Solar Array Alpha Output",
      value: 65.2,
      unit: "W",
      status: "critical",
      trend: "worsening",
      history: Array(24)
        .fill(0)
        .map((_, i) => ({
          timestamp: `${23 - i}:00`,
          value:
            i < 20 ? 100 - i * 0.2 + Math.random() * 2 : 65 + Math.random() * 2,
        })),
      predictedValues: Array(12)
        .fill(0)
        .map((_, i) => ({
          timestamp: `+${i + 1}h`,
          value: 65.2 - i * 0.5 + Math.random() * 0.5,
          confidence: 90 - i * 2,
        })),
    },
    {
      satellite: "SAT-6",
      subsystem: "Attitude Control",
      metric: "Reaction Wheel 2 Vibration",
      value: 0.42,
      unit: "mm/s",
      status: "warning",
      trend: "stable",
      history: Array(24)
        .fill(0)
        .map((_, i) => ({
          timestamp: `${23 - i}:00`,
          value: 0.2 + i * 0.01 + Math.random() * 0.05,
        })),
      predictedValues: Array(12)
        .fill(0)
        .map((_, i) => ({
          timestamp: `+${i + 1}h`,
          value: 0.42 + Math.random() * 0.03,
          confidence: 85 - i * 1.5,
        })),
    },
    {
      satellite: "SAT-2",
      subsystem: "Communication",
      metric: "X-Band SNR",
      value: 12.7,
      unit: "dB",
      status: "normal",
      trend: "stable",
      history: Array(24)
        .fill(0)
        .map((_, i) => ({
          timestamp: `${23 - i}:00`,
          value: 15 - i * 0.1 + Math.random() * 0.5,
        })),
      predictedValues: Array(12)
        .fill(0)
        .map((_, i) => ({
          timestamp: `+${i + 1}h`,
          value: 12.7 - i * 0.05 + Math.random() * 0.3,
          confidence: 80 - i * 1.5,
        })),
    },
    {
      satellite: "SAT-4",
      subsystem: "Propulsion",
      metric: "Thruster Valve B Response Time",
      value: 35.2,
      unit: "ms",
      status: "normal",
      trend: "improving",
      history: Array(24)
        .fill(0)
        .map((_, i) => ({
          timestamp: `${23 - i}:00`,
          value:
            i < 12
              ? 50 - i * 0.5 + Math.random() * 1
              : 40 - (i - 12) * 0.4 + Math.random() * 1,
        })),
      predictedValues: Array(12)
        .fill(0)
        .map((_, i) => ({
          timestamp: `+${i + 1}h`,
          value: 35.2 - i * 0.2 + Math.random() * 0.5,
          confidence: 88 - i * 1.5,
        })),
    },
  ];

  // Filter anomalies based on selected filters
  const filteredAnomalies = anomalyEvents.filter(
    (anomaly) =>
      (selectedSatellite === "all" ||
        anomaly.satellite === selectedSatellite) &&
      (selectedSeverity === "all" || anomaly.severity === selectedSeverity) &&
      (selectedSubsystem === "all" || anomaly.subsystem === selectedSubsystem),
  );

  // Filter health metrics based on selected satellite and subsystem
  const filteredMetrics = healthMetrics.filter(
    (metric) =>
      (selectedSatellite === "all" || metric.satellite === selectedSatellite) &&
      (selectedSubsystem === "all" || metric.subsystem === selectedSubsystem),
  );

  // Calculate health statistics
  const healthStats = {
    normal: healthMetrics.filter((m) => m.status === "normal").length,
    warning: healthMetrics.filter((m) => m.status === "warning").length,
    critical: healthMetrics.filter((m) => m.status === "critical").length,
    improving: healthMetrics.filter((m) => m.trend === "improving").length,
    stable: healthMetrics.filter((m) => m.trend === "stable").length,
    worsening: healthMetrics.filter((m) => m.trend === "worsening").length,
  };

  const pieData = [
    { name: "Normal", value: healthStats.normal, color: "#10B981" },
    { name: "Warning", value: healthStats.warning, color: "#F59E0B" },
    { name: "Critical", value: healthStats.critical, color: "#EF4444" },
  ];

  const trendData = [
    { name: "Improving", value: healthStats.improving, color: "#10B981" },
    { name: "Stable", value: healthStats.stable, color: "#3B82F6" },
    { name: "Worsening", value: healthStats.worsening, color: "#EF4444" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case "warning":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "info":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "investigating":
        return "bg-purple-500/10 text-purple-500 border-purple-500/30";
      case "mitigated":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "resolved":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/30";
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-500";
      case "warning":
        return "text-amber-500";
      case "critical":
        return "text-red-500";
      default:
        return "text-slate-500";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <ArrowDown className="h-3 w-3 text-green-500" />;
      case "stable":
        return <ArrowUp className="h-3 w-3 rotate-90 text-blue-500" />;
      case "worsening":
        return <ArrowUp className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className={cn("w-full h-full bg-gray-950 text-white p-4 mt-16", className)}>
      <div className="flex items-end justify-end mb-4 w-full">
       <div className="flex items-end gap-2">
          <Select
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
          >
            <SelectTrigger className="w-[120px] bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-white">
              <SelectItem value="6h">Last 6 hours</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Health Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[120px]">
              <PieChart width={120} height={120}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="ml-4">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center mb-1">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-white">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Trend Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[120px]">
              <PieChart width={120} height={120}>
                <Pie
                  data={trendData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {trendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="ml-4">
                {trendData.map((entry) => (
                  <div key={entry.name} className="flex items-center mb-1">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-white">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Active Anomalies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 h-[120px] items-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">
                  {
                    anomalyEvents.filter((a) => a.severity === "critical")
                      .length
                  }
                </div>
                <div className="text-xs text-white">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-500">
                  {anomalyEvents.filter((a) => a.severity === "warning").length}
                </div>
                <div className="text-xs text-white">Warning</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">
                  {anomalyEvents.filter((a) => a.severity === "info").length}
                </div>
                <div className="text-xs text-white">Info</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-4 bg-gray-900">
          <TabsTrigger
            value="anomalies"
            className="data-[state=active]:bg-gray-200"
          >
            Anomaly Detection
          </TabsTrigger>
          <TabsTrigger
            value="metrics"
            className="data-[state=active]:bg-gray-200"
          >
            Health Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="anomalies" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Select
                value={selectedSatellite}
                onValueChange={setSelectedSatellite}
              >
                <SelectTrigger className="w-[150px] bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Satellite" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="all">All Satellites</SelectItem>
                  <SelectItem value="SAT-1">SAT-1</SelectItem>
                  <SelectItem value="SAT-2">SAT-2</SelectItem>
                  <SelectItem value="SAT-3">SAT-3</SelectItem>
                  <SelectItem value="SAT-4">SAT-4</SelectItem>
                  <SelectItem value="SAT-5">SAT-5</SelectItem>
                  <SelectItem value="SAT-6">SAT-6</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedSeverity}
                onValueChange={setSelectedSeverity}
              >
                <SelectTrigger className="w-[150px] bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedSubsystem}
                onValueChange={setSelectedSubsystem}
              >
                <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Subsystem" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="all">All Subsystems</SelectItem>
                  <SelectItem value="Thermal Control">
                    Thermal Control
                  </SelectItem>
                  <SelectItem value="Power">Power</SelectItem>
                  <SelectItem value="Attitude Control">
                    Attitude Control
                  </SelectItem>
                  <SelectItem value="Communication">Communication</SelectItem>
                  <SelectItem value="Propulsion">Propulsion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search anomalies..."
                className="w-full bg-gray-900 border-gray-700 text-white text-sm rounded-md pl-8 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {filteredAnomalies.map((anomaly) => (
                    <div
                      key={anomaly.id}
                      className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className="mt-1 mr-3">
                            {getSeverityIcon(anomaly.severity)}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium text-white">
                                {anomaly.subsystem}: {anomaly.component}
                              </h3>
                              {anomaly.trend && (
                                <div className="ml-2 flex items-center">
                                  {getTrendIcon(anomaly.trend)}
                                  <span
                                    className={cn(
                                      "text-xs ml-1",
                                      anomaly.trend === "improving"
                                        ? "text-green-500"
                                        : anomaly.trend === "stable"
                                          ? "text-blue-500"
                                          : "text-red-500",
                                    )}
                                  >
                                    {anomaly.trend}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center mt-1 space-x-2">
                              <Badge
                                className={cn(
                                  "capitalize",
                                  getSeverityColor(anomaly.severity),
                                )}
                                variant="outline"
                              >
                                {anomaly.severity}
                              </Badge>
                              <Badge
                                className={cn(
                                  "capitalize",
                                  getStatusColor(anomaly.status),
                                )}
                                variant="outline"
                              >
                                {anomaly.status}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-gray-700 text-white border-gray-600"
                              >
                                {anomaly.satellite}
                              </Badge>
                              <div className="flex items-center text-xs text-gray-400">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(
                                  anomaly.timestamp,
                                ).toLocaleTimeString()}
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">
                              {anomaly.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right mr-2">
                            <div className="text-sm font-medium text-white">
                              {anomaly.confidence}%
                            </div>
                            <div className="text-xs text-gray-400">
                              confidence
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-white"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-56 bg-gray-900 border-gray-700 text-white"
                            >
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                                <Activity className="mr-2 h-4 w-4" />
                                Run Diagnostics
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                                <Check className="mr-2 h-4 w-4" />
                                Mark as Resolved
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                                <History className="mr-2 h-4 w-4" />
                                View History
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div className="p-2 bg-gray-900 rounded border border-gray-700">
                          <div className="text-xs font-medium text-red-400 mb-1">
                            Predicted Impact
                          </div>
                          <p className="text-xs text-white">
                            {anomaly.predictedImpact}
                          </p>
                        </div>
                        <div className="p-2 bg-gray-900 rounded border border-gray-700">
                          <div className="text-xs font-medium text-green-400 mb-1">
                            Recommended Action
                          </div>
                          <p className="text-xs text-white">
                            {anomaly.recommendedAction}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredMetrics.map((metric) => (
              <Card
                key={`${metric.satellite}-${metric.metric}`}
                className="bg-gray-900 border-gray-800"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between text-white">
                    <div className="flex items-center">
                      {metric.subsystem === "Thermal Control" && (
                        <Thermometer className="mr-2 h-4 w-4 text-red-400" />
                      )}
                      {metric.subsystem === "Power" && (
                        <Zap className="mr-2 h-4 w-4 text-amber-400" />
                      )}
                      {metric.subsystem === "Attitude Control" && (
                        <Activity className="mr-2 h-4 w-4 text-blue-400" />
                      )}
                      {metric.subsystem === "Communication" && (
                        <HelpCircle className="mr-2 h-4 w-4 text-blue-400" />
                      )}
                      {metric.subsystem === "Propulsion" && (
                        <Zap className="mr-2 h-4 w-4 text-purple-400" />
                      )}
                      <span className="text-sm">{metric.metric}</span>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={cn(
                          "text-sm font-bold",
                          getMetricStatusColor(metric.status),
                        )}
                      >
                        {metric.value}
                        <span className="text-xs ml-1">{metric.unit}</span>
                      </span>
                      <div className="ml-2 flex items-center">
                        {getTrendIcon(metric.trend)}
                        <span
                          className={cn(
                            "text-xs ml-1",
                            metric.trend === "improving"
                              ? "text-green-500"
                              : metric.trend === "stable"
                                ? "text-blue-500"
                                : "text-red-500",
                          )}
                        >
                          {metric.trend}
                        </span>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[120px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={metric.history}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#374151"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="timestamp"
                          tick={{ fontSize: 10, fill: "#9CA3AF" }}
                          tickLine={{ stroke: "#4B5563" }}
                          axisLine={{ stroke: "#4B5563" }}
                          minTickGap={15}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: "#9CA3AF" }}
                          tickLine={{ stroke: "#4B5563" }}
                          axisLine={{ stroke: "#4B5563" }}
                          width={25}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            borderColor: "#374151",
                            color: "#F9FAFB",
                          }}
                          itemStyle={{ color: "#F9FAFB" }}
                          labelStyle={{ color: "#F9FAFB" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, fill: "#3B82F6" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="predicted"
                          stroke="#9333EA"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                          activeDot={{ r: 4, fill: "#9333EA" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-medium text-blue-400 mb-1">
                      Prediction (Next 12 hours)
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {metric.predictedValues.slice(0, 4).map((pred, idx) => (
                        <div
                          key={idx}
                          className="p-1 bg-gray-800 rounded border border-gray-700 text-center"
                        >
                          <div className="text-xs text-gray-400">
                            {pred.timestamp}
                          </div>
                          <div className="text-sm font-medium text-white">
                            {pred.value.toFixed(1)}
                            <span className="text-xs">{metric.unit}</span>
                          </div>
                          <div className="text-xs text-blue-400">
                            {pred.confidence}% conf
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveHealthMonitoring;

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
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
  ArrowDown,
  ArrowUp,
  Calendar,
  Clock,
  Download,
  Filter,
  Globe,
  Maximize2,
  MoreHorizontal,
  RefreshCw,
  Router,
  Satellite,
  Server,
  Settings,
  Signal,
  Upload,
  Wifi,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DownlinkingDashboardProps {
  className?: string;
}

interface GroundStation {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "maintenance";
  currentLoad: number;
  availableBandwidth: number;
  satellites: string[];
  nextAvailableWindow: string;
}

interface DownlinkSchedule {
  id: string;
  satellite: string;
  groundStation: string;
  startTime: string;
  endTime: string;
  dataVolume: number;
  priority: "critical" | "high" | "medium" | "low";
  status: "scheduled" | "in-progress" | "completed" | "failed";
  signalStrength: number;
}

const DownlinkingDashboard = ({ className }: DownlinkingDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedGroundStation, setSelectedGroundStation] =
    useState<string>("all");
  const [selectedSatellite, setSelectedSatellite] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Mock data for ground stations
  const groundStations: GroundStation[] = [
    {
      id: "gs-1",
      name: "Alpha Station",
      location: "Houston, TX",
      status: "online",
      currentLoad: 65,
      availableBandwidth: 85,
      satellites: ["SAT-1", "SAT-3", "SAT-5"],
      nextAvailableWindow: "10:30 UTC",
    },
    {
      id: "gs-2",
      name: "Beta Station",
      location: "Madrid, Spain",
      status: "online",
      currentLoad: 42,
      availableBandwidth: 120,
      satellites: ["SAT-2", "SAT-4", "SAT-6"],
      nextAvailableWindow: "11:15 UTC",
    },
    {
      id: "gs-3",
      name: "Gamma Station",
      location: "Canberra, Australia",
      status: "maintenance",
      currentLoad: 10,
      availableBandwidth: 50,
      satellites: ["SAT-7", "SAT-8"],
      nextAvailableWindow: "14:45 UTC",
    },
    {
      id: "gs-4",
      name: "Delta Station",
      location: "Svalbard, Norway",
      status: "online",
      currentLoad: 78,
      availableBandwidth: 65,
      satellites: ["SAT-1", "SAT-2", "SAT-7"],
      nextAvailableWindow: "09:30 UTC",
    },
  ];

  // Mock data for downlink schedules
  const downlinkSchedules: DownlinkSchedule[] = [
    {
      id: "dl-1",
      satellite: "SAT-1",
      groundStation: "Alpha Station",
      startTime: "10:30 UTC",
      endTime: "10:42 UTC",
      dataVolume: 1.8,
      priority: "high",
      status: "scheduled",
      signalStrength: 85,
    },
    {
      id: "dl-2",
      satellite: "SAT-3",
      groundStation: "Alpha Station",
      startTime: "11:15 UTC",
      endTime: "11:30 UTC",
      dataVolume: 2.2,
      priority: "medium",
      status: "scheduled",
      signalStrength: 92,
    },
    {
      id: "dl-3",
      satellite: "SAT-2",
      groundStation: "Beta Station",
      startTime: "09:45 UTC",
      endTime: "10:00 UTC",
      dataVolume: 1.5,
      priority: "critical",
      status: "in-progress",
      signalStrength: 78,
    },
    {
      id: "dl-4",
      satellite: "SAT-5",
      groundStation: "Alpha Station",
      startTime: "12:30 UTC",
      endTime: "12:45 UTC",
      dataVolume: 0.9,
      priority: "low",
      status: "scheduled",
      signalStrength: 88,
    },
    {
      id: "dl-5",
      satellite: "SAT-7",
      groundStation: "Delta Station",
      startTime: "09:30 UTC",
      endTime: "09:45 UTC",
      dataVolume: 1.2,
      priority: "high",
      status: "scheduled",
      signalStrength: 75,
    },
  ];

  // Mock data for bandwidth usage over time
  const bandwidthData = Array(24)
    .fill(0)
    .map((_, i) => ({
      time: `${i}:00`,
      downlink: Math.abs(150 + Math.sin(i / 4) * 100 + Math.random() * 30),
      uplink: Math.abs(50 + Math.cos(i / 3) * 30 + Math.random() * 10),
    }));

  // Filter downlink schedules based on selected ground station and satellite
  const filteredSchedules = downlinkSchedules.filter(
    (schedule) =>
      (selectedGroundStation === "all" ||
        schedule.groundStation.includes(selectedGroundStation)) &&
      (selectedSatellite === "all" || schedule.satellite === selectedSatellite),
  );

  // Filter ground stations based on selected satellite
  const filteredGroundStations = groundStations.filter(
    (station) =>
      selectedSatellite === "all" ||
      station.satellites.includes(selectedSatellite),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "offline":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case "maintenance":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "scheduled":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "in-progress":
        return "bg-purple-500/10 text-purple-500 border-purple-500/30";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case "high":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "medium":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/30";
    }
  };

  return (
    <div className={cn("w-full h-full bg-gray-950 text-white p-4 mt-16", className)}>
      <div className="flex items-end justify-between mb-4 w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-end justify-between w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md bg-gray-900">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gray-200"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="ground-stations"
                className="data-[state=active]:bg-gray-200"
              >
                Ground Stations
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className="data-[state=active]:bg-gray-200"
              >
                Schedule
              </TabsTrigger>
            </TabsList>
            <div className="flex items-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
                onClick={handleRefresh}
              >
                <RefreshCw
                  className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")}
                />
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

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gray-900 border-gray-400">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-white">
                    <Router className="mr-2 h-4 w-4 text-blue-400" />
                    Ground Stations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {groundStations.length}
                  </div>
                  <p className="text-xs text-white mt-1">
                    {groundStations.filter((gs) => gs.status === "online").length}{" "}
                    online,{" "}
                    {
                      groundStations.filter((gs) => gs.status === "maintenance")
                        .length
                    }{" "}
                    in maintenance
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-white">
                    <Download className="mr-2 h-4 w-4 text-green-400" />
                    Scheduled Downlinks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {downlinkSchedules.length}
                  </div>
                  <p className="text-xs text-white mt-1">
                    Next: {downlinkSchedules[0].satellite} at{" "}
                    {downlinkSchedules[0].startTime}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-white">
                    <Server className="mr-2 h-4 w-4 text-purple-400" />
                    Data Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {downlinkSchedules
                      .reduce((sum, schedule) => sum + schedule.dataVolume, 0)
                      .toFixed(1)}{" "}
                    GB
                  </div>
                  <p className="text-xs text-white mt-1">
                    Scheduled for downlink today
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-white">
                    <AlertCircle className="mr-2 h-4 w-4 text-red-400" />
                    Signal Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {
                      downlinkSchedules.filter((dl) => dl.signalStrength < 80)
                        .length
                    }
                  </div>
                  <p className="text-xs text-white mt-1">
                    Downlinks with weak signal
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between text-white">
                    <div className="flex items-center">
                      <Activity className="mr-2 h-4 w-4 text-blue-400" />
                      Bandwidth Usage
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-white"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={bandwidthData.slice(-12)}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#374151"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="time"
                          stroke="#6B7280"
                          tick={{ fill: "#E5E7EB" }}
                        />
                        <YAxis stroke="#6B7280" tick={{ fill: "#E5E7EB" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            borderColor: "#374151",
                            color: "#F9FAFB",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="downlink"
                          name="Downlink (Mbps)"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="uplink"
                          name="Uplink (Mbps)"
                          stroke="#10B981"
                          fill="#10B981"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between text-white">
                    <div className="flex items-center">
                      <Wifi className="mr-2 h-4 w-4 text-green-400" />
                      Signal Strength
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-white"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {downlinkSchedules.slice(0, 5).map((schedule) => (
                      <div key={schedule.id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Satellite className="h-4 w-4 text-blue-400 mr-2" />
                            <span className="text-sm text-white">
                              {schedule.satellite} → {schedule.groundStation}
                            </span>
                          </div>
                          <span
                            className={cn(
                              "text-sm",
                              schedule.signalStrength >= 85
                                ? "text-green-500"
                                : schedule.signalStrength >= 70
                                  ? "text-amber-500"
                                  : "text-red-500",
                            )}
                          >
                            {schedule.signalStrength}%
                          </span>
                        </div>
                        <Progress
                          value={schedule.signalStrength}
                          className="h-1.5 bg-gray-700"
                          indicatorClassName={cn(
                            schedule.signalStrength >= 85
                              ? "bg-green-500"
                              : schedule.signalStrength >= 70
                                ? "bg-amber-500"
                                : "bg-red-500",
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ground-stations" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Select
                  value={selectedSatellite}
                  onValueChange={setSelectedSatellite}
                >
                  <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Filter by Satellite" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white">
                    <SelectItem value="all">All Satellites</SelectItem>
                    <SelectItem value="SAT-1">SAT-1</SelectItem>
                    <SelectItem value="SAT-2">SAT-2</SelectItem>
                    <SelectItem value="SAT-3">SAT-3</SelectItem>
                    <SelectItem value="SAT-4">SAT-4</SelectItem>
                    <SelectItem value="SAT-5">SAT-5</SelectItem>
                    <SelectItem value="SAT-6">SAT-6</SelectItem>
                    <SelectItem value="SAT-7">SAT-7</SelectItem>
                    <SelectItem value="SAT-8">SAT-8</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Add Ground Station
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGroundStations.map((station) => (
                <Card
                  key={station.id}
                  className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white">{station.name}</h3>
                        <div className="flex items-center mt-1">
                          <Globe className="h-3.5 w-3.5 text-blue-400 mr-1" />
                          <span className="text-xs text-gray-300">
                            {station.location}
                          </span>
                        </div>
                        <div className="flex items-center mt-2 space-x-2">
                          <Badge
                            className={cn(
                              "capitalize",
                              getStatusColor(station.status),
                            )}
                            variant="outline"
                          >
                            {station.status}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            Next available: {station.nextAvailableWindow}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                        >
                          Schedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                        >
                          Details
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs text-white mb-1">
                          <span>Current Load</span>
                          <span>{station.currentLoad}%</span>
                        </div>
                        <Progress
                          value={station.currentLoad}
                          className="h-1.5 bg-gray-700"
                          indicatorClassName={cn(
                            station.currentLoad > 80
                              ? "bg-red-500"
                              : station.currentLoad > 60
                                ? "bg-amber-500"
                                : "bg-green-500",
                          )}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-white mb-1">
                          <span>Available Bandwidth</span>
                          <span>{station.availableBandwidth} Mbps</span>
                        </div>
                        <Progress
                          value={(station.availableBandwidth / 150) * 100}
                          className="h-1.5 bg-gray-700"
                          indicatorClassName="bg-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-xs text-gray-400 mb-2">
                        Connected Satellites
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {station.satellites.map((sat) => (
                          <Badge
                            key={sat}
                            variant="outline"
                            className="bg-gray-800 text-white border-gray-700 text-xs"
                          >
                            {sat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Select
                  value={selectedGroundStation}
                  onValueChange={setSelectedGroundStation}
                >
                  <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Ground Station" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white">
                    <SelectItem value="all">All Stations</SelectItem>
                    {groundStations.map((station) => (
                      <SelectItem key={station.id} value={station.name}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedSatellite}
                  onValueChange={setSelectedSatellite}
                >
                  <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-white">
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
                    <SelectItem value="SAT-7">SAT-7</SelectItem>
                    <SelectItem value="SAT-8">SAT-8</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Schedule Downlink
              </Button>
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {filteredSchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium text-white">
                                {schedule.satellite} → {schedule.groundStation}
                              </h3>
                            </div>
                            <div className="flex items-center mt-1 space-x-2">
                              <Badge
                                className={cn(
                                  "capitalize",
                                  getPriorityColor(schedule.priority),
                                )}
                                variant="outline"
                              >
                                {schedule.priority}
                              </Badge>
                              <Badge
                                className={cn(
                                  "capitalize",
                                  getStatusColor(schedule.status),
                                )}
                                variant="outline"
                              >
                                {schedule.status.replace("-", " ")}
                              </Badge>
                              <div className="flex items-center text-xs text-gray-400">
                                <Server className="h-3 w-3 mr-1" />
                                {schedule.dataVolume} GB
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="text-right mr-4">
                              <div className="text-sm font-medium text-white">
                                {schedule.startTime}
                              </div>
                              <div className="text-xs text-gray-400">
                                to {schedule.endTime}
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
                                  Edit Schedule
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                                  Reschedule
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gray-700" />
                                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer text-red-500">
                                  Cancel Downlink
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-white mb-1">
                            <span>Signal Strength</span>
                            <span
                              className={cn(
                                schedule.signalStrength >= 85
                                  ? "text-green-500"
                                  : schedule.signalStrength >= 70
                                    ? "text-amber-500"
                                    : "text-red-500",
                              )}
                            >
                              {schedule.signalStrength}%
                            </span>
                          </div>
                          <Progress
                            value={schedule.signalStrength}
                            className="h-1.5 bg-gray-700"
                            indicatorClassName={cn(
                              schedule.signalStrength >= 85
                                ? "bg-green-500"
                                : schedule.signalStrength >= 70
                                  ? "bg-amber-500"
                                  : "bg-red-500",
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DownlinkingDashboard;

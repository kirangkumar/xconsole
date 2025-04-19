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
} from "recharts";
import {
  Activity,
  AlertCircle,
  Calendar,
  Clock,
  Command,
  Download,
  Globe,
  LayoutDashboard,
  Maximize2,
  RefreshCw,
  Satellite,
  Server,
  Settings,
  Upload,
} from "lucide-react";

interface MissionControlDashboardProps {
  className?: string;
}

const MissionControlDashboard = ({
  className,
}: MissionControlDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Mock data for telemetry
  const telemetryData = Array(24)
    .fill(0)
    .map((_, i) => ({
      time: `${i}:00`,
      temperature: 65 + Math.sin(i / 3) * 15 + Math.random() * 5,
      signalStrength: 75 + Math.sin(i / 4) * 20 + Math.random() * 5,
      powerConsumption: 50 + Math.cos(i / 2) * 10 + Math.random() * 5,
      dataTransmitted: Math.abs(
        200 + Math.sin(i / 6) * 150 + Math.random() * 50,
      ),
    }));

  // Mock mission data
  const missionData = [
    {
      id: "mission-1",
      name: "Earth Observation Alpha",
      status: "active",
      progress: 68,
      satellites: ["SAT-1", "SAT-3", "SAT-5"],
      startDate: "2023-06-10",
      endDate: "2023-07-15",
      priority: "high",
    },
    {
      id: "mission-2",
      name: "Communication Relay Beta",
      status: "active",
      progress: 42,
      satellites: ["SAT-2", "SAT-4"],
      startDate: "2023-06-15",
      endDate: "2023-08-01",
      priority: "medium",
    },
    {
      id: "mission-3",
      name: "Atmospheric Study Gamma",
      status: "scheduled",
      progress: 0,
      satellites: ["SAT-6", "SAT-7"],
      startDate: "2023-07-01",
      endDate: "2023-08-15",
      priority: "medium",
    },
    {
      id: "mission-4",
      name: "Orbital Debris Mapping",
      status: "paused",
      progress: 75,
      satellites: ["SAT-8"],
      startDate: "2023-05-20",
      endDate: "2023-06-30",
      priority: "low",
    },
    {
      id: "mission-5",
      name: "Solar Radiation Monitoring",
      status: "completed",
      progress: 100,
      satellites: ["SAT-1", "SAT-2"],
      startDate: "2023-04-15",
      endDate: "2023-06-01",
      priority: "high",
    },
  ];

  // Mock events data
  const eventsData = [
    {
      id: "event-1",
      type: "downlink",
      satellite: "SAT-1",
      time: "10:15 UTC",
      duration: "12 minutes",
      status: "scheduled",
    },
    {
      id: "event-2",
      type: "maneuver",
      satellite: "SAT-3",
      time: "11:30 UTC",
      duration: "8 minutes",
      status: "scheduled",
    },
    {
      id: "event-3",
      type: "imaging",
      satellite: "SAT-5",
      time: "12:45 UTC",
      duration: "15 minutes",
      status: "scheduled",
    },
    {
      id: "event-4",
      type: "downlink",
      satellite: "SAT-2",
      time: "14:00 UTC",
      duration: "10 minutes",
      status: "scheduled",
    },
    {
      id: "event-5",
      type: "maintenance",
      satellite: "SAT-6",
      time: "15:15 UTC",
      duration: "30 minutes",
      status: "scheduled",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 text-green-500";
      case "scheduled":
        return "bg-blue-500 text-blue-500";
      case "paused":
        return "bg-amber-500 text-amber-500";
      case "completed":
        return "bg-purple-500 text-purple-500";
      default:
        return "bg-slate-500 text-slate-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case "medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/30";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "downlink":
        return <Download className="h-4 w-4 text-blue-400" />;
      case "maneuver":
        return <Activity className="h-4 w-4 text-purple-400" />;
      case "imaging":
        return <Globe className="h-4 w-4 text-green-400" />;
      case "maintenance":
        return <Settings className="h-4 w-4 text-amber-400" />;
      default:
        return <Satellite className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className={cn("w-full h-full bg-gray-950 text-white p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <LayoutDashboard className="h-6 w-6 mr-2 text-blue-400" />
          <h1 className="text-2xl font-bold">Mission Control Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-4 bg-gray-900">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gray-800"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="missions"
            className="data-[state=active]:bg-gray-800"
          >
            Missions
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className="data-[state=active]:bg-gray-800"
          >
            Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-white">
                  <Satellite className="mr-2 h-4 w-4 text-blue-400" />
                  Active Satellites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">8</div>
                <p className="text-xs text-white mt-1">2 in maintenance mode</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-white">
                  <Command className="mr-2 h-4 w-4 text-green-400" />
                  Active Missions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">3</div>
                <p className="text-xs text-white mt-1">2 scheduled, 1 paused</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-white">
                  <Clock className="mr-2 h-4 w-4 text-purple-400" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">5</div>
                <p className="text-xs text-white mt-1">
                  Next: Downlink at 10:15
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-white">
                  <AlertCircle className="mr-2 h-4 w-4 text-red-400" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">2</div>
                <p className="text-xs text-white mt-1">1 critical, 1 warning</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <Activity className="mr-2 h-4 w-4 text-blue-400" />
                    Telemetry Overview
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
                    <LineChart data={telemetryData.slice(-12)}>
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
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        name="Temperature (°C)"
                        stroke="#EF4444"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="signalStrength"
                        name="Signal Strength (%)"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="powerConsumption"
                        name="Power (W)"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <Server className="mr-2 h-4 w-4 text-purple-400" />
                    Data Transmission
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
                    <AreaChart data={telemetryData.slice(-12)}>
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
                        dataKey="dataTransmitted"
                        name="Data (MB)"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between mt-2">
                  <div className="flex items-center">
                    <Upload className="h-4 w-4 text-blue-400 mr-1" />
                    <span className="text-xs text-white">
                      Uplink: 1.2 GB/day
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Download className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-xs text-white">
                      Downlink: 3.8 GB/day
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="missions" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium text-white">
                  Active Missions
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                >
                  New Mission
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {missionData.map((mission) => (
                    <Card
                      key={mission.id}
                      className="bg-gray-800 border-gray-700 hover:border-gray-600 cursor-pointer transition-all"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-white">
                              {mission.name}
                            </h3>
                            <div className="flex items-center mt-1 space-x-2">
                              <Badge
                                className={cn(
                                  "capitalize",
                                  getStatusColor(mission.status),
                                  "bg-opacity-10 border border-opacity-30",
                                )}
                                variant="outline"
                              >
                                {mission.status}
                              </Badge>
                              <Badge
                                className={cn(
                                  "capitalize",
                                  getPriorityColor(mission.priority),
                                )}
                                variant="outline"
                              >
                                {mission.priority} priority
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-400">
                              {mission.startDate} to {mission.endDate}
                            </div>
                            <div className="flex items-center mt-1 justify-end">
                              <Calendar className="h-3 w-3 text-blue-400 mr-1" />
                              <span className="text-xs text-white">
                                {mission.satellites.length} satellites
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-white mb-1">
                            <span>Progress</span>
                            <span>{mission.progress}%</span>
                          </div>
                          <Progress
                            value={mission.progress}
                            className="h-2 bg-gray-700"
                          />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {mission.satellites.map((sat) => (
                            <Badge
                              key={sat}
                              variant="outline"
                              className="bg-gray-700 text-white border-gray-600 text-xs"
                            >
                              {sat}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium text-white">
                  Today's Schedule
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    Day
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    Week
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                  >
                    Add Event
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {eventsData.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start p-3 bg-gray-800 rounded-md border border-gray-700 hover:border-gray-600 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-700 mr-3">
                        {getEventTypeIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-white capitalize">
                            {event.type} Event
                          </h4>
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-500 border-blue-500/30"
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">
                          {event.satellite} • {event.duration}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm font-medium text-white">
                          {event.time}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Today</div>
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
  );
};

export default MissionControlDashboard;

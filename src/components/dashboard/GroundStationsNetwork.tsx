import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "@/lib/utils";
import {
  Server,
  Globe,
  Wifi,
  Clock,
  AlertTriangle,
  Settings,
  RefreshCw,
  Download,
  BarChart3,
  Calendar,
  Satellite,
  ArrowDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface GroundStation {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: "online" | "offline" | "maintenance" | "degraded";
  uptime: number;
  bandwidth: {
    current: number;
    max: number;
    unit: string;
  };
  nextPass: {
    satellite: string;
    time: string;
    duration: string;
  }[];
  contacts: {
    satellite: string;
    startTime: string;
    endTime: string;
    status: "scheduled" | "active" | "completed" | "failed";
    dataVolume?: number;
  }[];
}

interface GroundStationsNetworkProps {
  className?: string;
}

const GroundStationsNetwork: React.FC<GroundStationsNetworkProps> = ({
  className,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("24h");

  // Mock data for ground stations
  const groundStations: GroundStation[] = [
    {
      id: "gs-001",
      name: "Svalbard",
      location: "Norway",
      coordinates: {
        lat: 78.2297,
        lng: 15.3975,
      },
      status: "online",
      uptime: 99.8,
      bandwidth: {
        current: 120,
        max: 150,
        unit: "Mbps",
      },
      nextPass: [
        {
          satellite: "SAT-1",
          time: "14:32 UTC",
          duration: "12 min",
        },
        {
          satellite: "SAT-3",
          time: "15:47 UTC",
          duration: "9 min",
        },
      ],
      contacts: [
        {
          satellite: "SAT-2",
          startTime: "12:15 UTC",
          endTime: "12:28 UTC",
          status: "completed",
          dataVolume: 4.2,
        },
        {
          satellite: "SAT-1",
          startTime: "10:03 UTC",
          endTime: "10:15 UTC",
          status: "completed",
          dataVolume: 3.8,
        },
      ],
    },
    {
      id: "gs-002",
      name: "Santiago",
      location: "Chile",
      coordinates: {
        lat: -33.4489,
        lng: -70.6693,
      },
      status: "online",
      uptime: 99.2,
      bandwidth: {
        current: 110,
        max: 150,
        unit: "Mbps",
      },
      nextPass: [
        {
          satellite: "SAT-4",
          time: "13:15 UTC",
          duration: "8 min",
        },
      ],
      contacts: [
        {
          satellite: "SAT-6",
          startTime: "11:42 UTC",
          endTime: "11:53 UTC",
          status: "completed",
          dataVolume: 2.7,
        },
      ],
    },
    {
      id: "gs-003",
      name: "Fairbanks",
      location: "Alaska, USA",
      coordinates: {
        lat: 64.8378,
        lng: -147.7164,
      },
      status: "degraded",
      uptime: 94.3,
      bandwidth: {
        current: 85,
        max: 150,
        unit: "Mbps",
      },
      nextPass: [
        {
          satellite: "SAT-2",
          time: "16:08 UTC",
          duration: "11 min",
        },
        {
          satellite: "SAT-5",
          time: "18:22 UTC",
          duration: "7 min",
        },
      ],
      contacts: [
        {
          satellite: "SAT-3",
          startTime: "09:17 UTC",
          endTime: "09:29 UTC",
          status: "completed",
          dataVolume: 3.1,
        },
      ],
    },
    {
      id: "gs-004",
      name: "Canberra",
      location: "Australia",
      coordinates: {
        lat: -35.3075,
        lng: 149.1244,
      },
      status: "maintenance",
      uptime: 78.5,
      bandwidth: {
        current: 0,
        max: 150,
        unit: "Mbps",
      },
      nextPass: [
        {
          satellite: "SAT-1",
          time: "19:45 UTC",
          duration: "10 min",
        },
      ],
      contacts: [
        {
          satellite: "SAT-5",
          startTime: "08:30 UTC",
          endTime: "08:42 UTC",
          status: "failed",
          dataVolume: 0.8,
        },
      ],
    },
    {
      id: "gs-005",
      name: "Kourou",
      location: "French Guiana",
      coordinates: {
        lat: 5.1522,
        lng: -52.6505,
      },
      status: "online",
      uptime: 99.5,
      bandwidth: {
        current: 142,
        max: 150,
        unit: "Mbps",
      },
      nextPass: [
        {
          satellite: "SAT-3",
          time: "14:05 UTC",
          duration: "9 min",
        },
        {
          satellite: "SAT-6",
          time: "16:38 UTC",
          duration: "12 min",
        },
      ],
      contacts: [
        {
          satellite: "SAT-4",
          startTime: "11:10 UTC",
          endTime: "11:22 UTC",
          status: "completed",
          dataVolume: 3.5,
        },
      ],
    },
  ];

  // Network statistics
  const networkStats = {
    totalStations: groundStations.length,
    onlineStations: groundStations.filter((s) => s.status === "online").length,
    degradedStations: groundStations.filter((s) => s.status === "degraded")
      .length,
    maintenanceStations: groundStations.filter(
      (s) => s.status === "maintenance",
    ).length,
    offlineStations: groundStations.filter((s) => s.status === "offline")
      .length,
    totalBandwidth: groundStations.reduce(
      (sum, station) => sum + station.bandwidth.current,
      0,
    ),
    maxBandwidth: groundStations.reduce(
      (sum, station) => sum + station.bandwidth.max,
      0,
    ),
    scheduledPasses: groundStations.reduce(
      (sum, station) => sum + station.nextPass.length,
      0,
    ),
  };

  // Status distribution data for pie chart
  const statusData = [
    {
      name: "Online",
      value: networkStats.onlineStations,
      color: "#10b981",
    },
    {
      name: "Degraded",
      value: networkStats.degradedStations,
      color: "#f59e0b",
    },
    {
      name: "Maintenance",
      value: networkStats.maintenanceStations,
      color: "#6366f1",
    },
    {
      name: "Offline",
      value: networkStats.offlineStations,
      color: "#ef4444",
    },
  ];

  // Mock data for bandwidth usage over time
  const bandwidthData = Array(24)
    .fill(0)
    .map((_, i) => ({
      time: `${i}:00`,
      bandwidth: Math.floor(
        (networkStats.totalBandwidth / networkStats.totalStations) *
          (0.7 + 0.3 * Math.sin(i / 3)) +
          Math.random() * 20,
      ),
    }));

  // Mock data for contacts per day
  const contactsData = Array(7)
    .fill(0)
    .map((_, i) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      contacts: Math.floor(15 + Math.random() * 10),
      dataVolume: Math.floor(30 + Math.random() * 20),
    }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "degraded":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "maintenance":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/30";
      case "offline":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case "scheduled":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "maintenance":
        return <Settings className="h-4 w-4 text-indigo-500" />;
      case "offline":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("w-full h-full bg-gray-950 text-white p-4 max-h-[calc(100vh-4rem)] overflow-y-auto mt-16", className)}>
      <div className="flex items-end justify-end mb-4 w-full">
        <div className="flex items-end gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Network Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">
                {networkStats.onlineStations}/{networkStats.totalStations}
              </div>
              <Badge
                className={cn(
                  networkStats.offlineStations > 0
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                    : "bg-green-500/10 text-green-500 border-green-500/30",
                )}
              >
                {networkStats.offlineStations > 0 ? "DEGRADED" : "OPERATIONAL"}
              </Badge>
            </div>
            <div className="flex items-center justify-center mt-2">
              <PieChart width={120} height={120}>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="ml-4">
                {statusData.map((entry) => (
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
              Network Bandwidth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-1">
              <div className="text-2xl font-bold text-white">
                {networkStats.totalBandwidth} Mbps
              </div>
              <span className="text-xs text-gray-400">
                {Math.round(
                  (networkStats.totalBandwidth / networkStats.maxBandwidth) *
                    100,
                )}
                % capacity
              </span>
            </div>
            <Progress
              value={
                (networkStats.totalBandwidth / networkStats.maxBandwidth) * 100
              }
              className="h-2 mb-2"
            />
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bandwidthData.slice(-12)}>
                  <Line
                    type="monotone"
                    dataKey="bandwidth"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                  <XAxis
                    dataKey="time"
                    tick={false}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide domain={[0, 200]} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Upcoming Passes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-white">
                {networkStats.scheduledPasses}
              </div>
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                SCHEDULED
              </Badge>
            </div>
            <div className="mt-2 space-y-2">
              {groundStations
                .flatMap((station) =>
                  station.nextPass.map((pass) => ({
                    ...pass,
                    station: station.name,
                  })),
                )
                .sort((a, b) => {
                  const timeA = a.time.split(":").map(Number);
                  const timeB = b.time.split(":").map(Number);
                  return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
                })
                .slice(0, 3)
                .map((pass, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center">
                      <Satellite className="h-3 w-3 mr-1 text-blue-400" />
                      <span>
                        {pass.satellite} @ {pass.station}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-gray-400" />
                      <span>
                        {pass.time} ({pass.duration})
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Data Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-white">142.8 GB</div>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/30">
                <ArrowDown className="h-3 w-3 mr-1" />
                TODAY
              </Badge>
            </div>
            <div className="h-[80px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={contactsData}>
                  <Line
                    type="monotone"
                    dataKey="dataVolume"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#10b981" }}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: "#9CA3AF" }}
                    axisLine={{ stroke: "#374151" }}
                    tickLine={{ stroke: "#374151" }}
                  />
                  <YAxis hide domain={[0, 60]} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-4 bg-gray-900">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gray-200"
          >
            Station Overview
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className="data-[state=active]:bg-gray-200"
          >
            Contact Schedule
          </TabsTrigger>
          <TabsTrigger value="map" className="data-[state=active]:bg-gray-200">
            Network Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groundStations.map((station) => (
              <Card
                key={station.id}
                className={cn(
                  "bg-gray-900 border-gray-800 hover:border-gray-700 cursor-pointer transition-all",
                  selectedStation === station.id && "ring-2 ring-blue-500",
                )}
                onClick={() => setSelectedStation(station.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between text-white">
                    <div className="flex items-center">
                      <Server className="h-4 w-4 mr-2 text-blue-400" />
                      {station.name}
                    </div>
                    <Badge className={cn(getStatusColor(station.status))}>
                      <span className="flex items-center">
                        {getStatusIcon(station.status)}
                        <span className="ml-1 uppercase">{station.status}</span>
                      </span>
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <div className="text-xs text-gray-400">Location</div>
                      <div className="text-sm text-white">
                        {station.location}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Uptime</div>
                      <div className="text-sm text-white">
                        {station.uptime}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Bandwidth</div>
                      <div className="text-sm text-white">
                        {station.bandwidth.current}/{station.bandwidth.max}{" "}
                        {station.bandwidth.unit}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Next Pass</div>
                      <div className="text-sm text-white">
                        {station.nextPass.length > 0
                          ? station.nextPass[0].time
                          : "None scheduled"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="text-xs text-gray-400 mb-1">
                      Bandwidth Usage
                    </div>
                    <Progress
                      value={
                        (station.bandwidth.current / station.bandwidth.max) *
                        100
                      }
                      className="h-1"
                    />
                  </div>

                  {station.nextPass.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-400 mb-1">
                        Upcoming Passes
                      </div>
                      <div className="space-y-1">
                        {station.nextPass.map((pass, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-xs"
                          >
                            <span className="text-white">{pass.satellite}</span>
                            <span className="text-gray-400">
                              {pass.time} ({pass.duration})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-400" />
                Contact Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Select value="all" onValueChange={() => {}}>
                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="All Stations" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="all">All Stations</SelectItem>
                      {groundStations.map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value="all" onValueChange={() => {}}>
                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="All Satellites" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="all">All Satellites</SelectItem>
                      <SelectItem value="SAT-1">SAT-1</SelectItem>
                      <SelectItem value="SAT-2">SAT-2</SelectItem>
                      <SelectItem value="SAT-3">SAT-3</SelectItem>
                      <SelectItem value="SAT-4">SAT-4</SelectItem>
                      <SelectItem value="SAT-5">SAT-5</SelectItem>
                      <SelectItem value="SAT-6">SAT-6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="rounded-md border border-gray-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-800">
                    <TableRow>
                      <TableHead className="text-gray-300">Satellite</TableHead>
                      <TableHead className="text-gray-300">Station</TableHead>
                      <TableHead className="text-gray-300">
                        Start Time
                      </TableHead>
                      <TableHead className="text-gray-300">End Time</TableHead>
                      <TableHead className="text-gray-300">Duration</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300 text-right">
                        Data Volume
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="">
                    {groundStations
                      .flatMap((station) =>
                        station.contacts.map((contact) => ({
                          ...contact,
                          station: station.name,
                        })),
                      )
                      .sort((a, b) => {
                        const timeA = a.startTime.split(":").map(Number);
                        const timeB = b.startTime.split(":").map(Number);
                        return (
                          timeB[0] * 60 + timeB[1] - (timeA[0] * 60 + timeA[1])
                        );
                      })
                      .map((contact, index) => {
                        // Calculate duration in minutes
                        const startParts = contact.startTime
                          .split(":")
                          .map(Number);
                        const endParts = contact.endTime.split(":").map(Number);
                        const startMins = startParts[0] * 60 + startParts[1];
                        const endMins = endParts[0] * 60 + endParts[1];
                        const durationMins = endMins - startMins;

                        return (
                          <TableRow
                            key={index}
                            className="border-t border-gray-800"
                          >
                            <TableCell className="font-medium text-white">
                              {contact.satellite}
                            </TableCell>
                            <TableCell className="font-medium text-white">{contact.station}</TableCell>
                            <TableCell className="font-medium text-white">{contact.startTime}</TableCell>
                            <TableCell className="font-medium text-white">{contact.endTime}</TableCell>
                            <TableCell className="font-medium text-white">{durationMins} min</TableCell>
                            <TableCell className="font-medium text-white">
                              <Badge
                                className={cn(
                                  getStatusColor(contact.status),
                                  "uppercase",
                                )}
                              >
                                {contact.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {contact.dataVolume
                                ? `${contact.dataVolume} GB`
                                : "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="mr-2 h-5 w-5 text-blue-400" />
                Global Network Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800 rounded-md h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-16 w-16 text-blue-400 mx-auto mb-4 opacity-50" />
                  <p className="text-lg text-gray-300">
                    Global Ground Station Network
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Interactive map visualization coming soon
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {groundStations.map((station) => (
                      <Badge
                        key={station.id}
                        className={cn(
                          "flex items-center gap-1 px-3 py-1.5",
                          getStatusColor(station.status),
                        )}
                      >
                        <Server className="h-3 w-3" />
                        <span>
                          {station.name} ({station.location})
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroundStationsNetwork;

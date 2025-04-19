import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "../../lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  AlertCircle,
  ArrowLeft,
  Battery,
  Cpu,
  Download,
  RotateCw,
  Thermometer,
  Upload,
  Wifi,
} from "lucide-react";
import CommandCenter from "./CommandCenter";

interface SatelliteDetailViewProps {
  satelliteId?: string;
  satelliteName?: string;
  onBack?: () => void;
}

const SatelliteDetailView = ({
  satelliteId: propSatelliteId,
  satelliteName: propSatelliteName,
  onBack,
}: SatelliteDetailViewProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Use the ID from URL params if available, otherwise use the prop
  const satelliteId = id || propSatelliteId || "SAT-001";
  
  // Mock satellite data lookup based on ID
  const getSatelliteName = (id: string) => {
    const satelliteMap: Record<string, string> = {
      "OPT-1": "Optical-1",
      "SAR-1": "Radar-1",
      "COM-1": "Varuna-1",
      "WTH-1": "Meteo-1",
      "OPT-2": "Optical-2",
      "SAR-2": "Radar-2",
      "COM-2": "Varuna-2",
      "WTH-2": "Meteo-2",
      "SAT-001": "Bhuvista Explorer-1",
    };
    return satelliteMap[id] || "Unknown Satellite";
  };
  
  const satelliteName = propSatelliteName || getSatelliteName(satelliteId);
  
  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // Mock data for the satellite
  const satelliteData = {
    status: "warning",
    temperature: 76.2,
    tempStatus: "warning",
    attitude: {
      roll: 0.1,
      pitch: 0.3,
      yaw: 0.05,
    },
    attitudeStatus: "warning",
    downlink: {
      status: "warning",
      latency: 320,
      linkMargin: 3.2,
      nextWindow: "12:45 UTC",
      duration: "18 minutes",
    },
    buffer: {
      used: 92,
      total: 100,
      status: "warning",
    },
    power: {
      batteryLevel: 78,
      solarPanelOutput: 24.5,
      consumption: 18.2,
      status: "normal",
    },
    subsystems: [
      { name: "Attitude Control", status: "warning", health: 87 },
      { name: "Power Management", status: "normal", health: 96 },
      { name: "Thermal Control", status: "warning", health: 82 },
      { name: "Communication", status: "warning", health: 78 },
      { name: "Data Handling", status: "normal", health: 94 },
      { name: "Payload", status: "normal", health: 91 },
    ],
    alerts: [
      {
        id: 1,
        severity: "warning",
        message: "Temperature rising above nominal range",
        timestamp: "10:32:45 UTC",
      },
      {
        id: 2,
        severity: "warning",
        message: "Pitch deviation exceeding threshold",
        timestamp: "10:28:12 UTC",
      },
      {
        id: 3,
        severity: "warning",
        message: "Downlink latency increasing",
        timestamp: "10:15:33 UTC",
      },
      {
        id: 4,
        severity: "info",
        message: "Imaging task rerouted to optimize coverage",
        timestamp: "09:58:21 UTC",
      },
      {
        id: 5,
        severity: "warning",
        message: "Data buffer approaching capacity",
        timestamp: "09:45:07 UTC",
      },
    ],
  };

  // Mock telemetry data for charts
  const temperatureData = Array(24)
    .fill(0)
    .map((_, i) => ({
      time: `${i}:00`,
      temperature: 65 + Math.sin(i / 3) * 15 + Math.random() * 5,
    }));

  const attitudeData = Array(24)
    .fill(0)
    .map((_, i) => ({
      time: `${i}:00`,
      roll: Math.sin(i / 2) * 0.2 + Math.random() * 0.1,
      pitch: Math.cos(i / 3) * 0.3 + Math.random() * 0.1,
      yaw: Math.sin(i / 4) * 0.15 + Math.random() * 0.05,
    }));

  const powerData = Array(24)
    .fill(0)
    .map((_, i) => ({
      time: `${i}:00`,
      battery: Math.max(
        60,
        Math.min(100, 80 - Math.sin(i / 6) * 20 + Math.random() * 5),
      ),
      solar: Math.max(
        0,
        25 * Math.sin(((i - 6) / 12) * Math.PI) + Math.random() * 3,
      ),
      consumption: 15 + Math.sin(i / 4) * 5 + Math.random() * 2,
    }));

  const bufferData = Array(24)
    .fill(0)
    .map((_, i) => ({
      time: `${i}:00`,
      used: Math.min(100, 50 + i * 2 + Math.random() * 10),
    }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-500 bg-red-500/10";
      case "warning":
        return "text-amber-500 bg-amber-500/10";
      case "normal":
      default:
        return "text-emerald-500 bg-emerald-500/10";
    }
  };

  return (
    <div className="w-full h-full bg-gray-950 text-white p-4 overflow-auto mt-16">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{satelliteName}</h1>
        <Badge className={cn("ml-3", getStatusColor(satelliteData.status))}>
          {satelliteData.status.toUpperCase()}
        </Badge>
        <div className="ml-auto flex gap-2 text-black">
          <Button variant="outline" size="sm">
            <RotateCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            Command Center
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-md mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
          <TabsTrigger value="subsystems">Subsystems</TabsTrigger>
          <TabsTrigger value="commands">Commands</TabsTrigger>
          <TabsTrigger value="trajectory">Trajectory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Temperature Card */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-white">
                  <Thermometer className="mr-2 h-4 w-4 text-red-400" />
                  Temperature
                  <Badge
                    className={cn(
                      "ml-auto",
                      getStatusColor(satelliteData.tempStatus),
                    )}
                  >
                    {satelliteData.tempStatus.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {satelliteData.temperature}°C
                </div>
                <p className="text-xs text-white mt-1">
                  Nominal range: 65°C - 75°C
                </p>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart
                    data={temperatureData.slice(-12)}
                    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                  >
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#f87171"
                      strokeWidth={2}
                      dot={false}
                    />
                    <XAxis
                      dataKey="time"
                      tick={false}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis domain={[50, 90]} hide />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Attitude Card */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-white">
                  <RotateCw className="mr-2 h-4 w-4 text-blue-400" />
                  Attitude
                  <Badge
                    className={cn(
                      "ml-auto",
                      getStatusColor(satelliteData.attitudeStatus),
                    )}
                  >
                    {satelliteData.attitudeStatus.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-xs text-white">Roll</div>
                    <div className="text-lg font-semibold text-white">
                      {satelliteData.attitude.roll}°
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white">Pitch</div>
                    <div className="text-lg font-semibold text-white">
                      {satelliteData.attitude.pitch}°
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white">Yaw</div>
                    <div className="text-lg font-semibold text-white">
                      {satelliteData.attitude.yaw}°
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart
                    data={attitudeData.slice(-12)}
                    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                  >
                    <Line
                      type="monotone"
                      dataKey="roll"
                      stroke="#60a5fa"
                      strokeWidth={1.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="pitch"
                      stroke="#34d399"
                      strokeWidth={1.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="yaw"
                      stroke="#a78bfa"
                      strokeWidth={1.5}
                      dot={false}
                    />
                    <XAxis
                      dataKey="time"
                      tick={false}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis domain={[-0.5, 0.5]} hide />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Downlink Card */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-white">
                  <Wifi className="mr-2 h-4 w-4 text-purple-400" />
                  Downlink
                  <Badge
                    className={cn(
                      "ml-auto",
                      getStatusColor(satelliteData.downlink.status),
                    )}
                  >
                    {satelliteData.downlink.status.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-white">Latency</div>
                    <div className="text-lg font-semibold text-white">
                      {satelliteData.downlink.latency} ms
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white">Link Margin</div>
                    <div className="text-lg font-semibold text-white">
                      {satelliteData.downlink.linkMargin} dB
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xs text-white">Next Window</div>
                  <div className="text-sm text-white">
                    {satelliteData.downlink.nextWindow} (
                    {satelliteData.downlink.duration})
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <Download className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-xs text-white">2.4 MB/s</span>
                  </div>
                  <div className="flex items-center">
                    <Upload className="h-4 w-4 text-blue-400 mr-1" />
                    <span className="text-xs text-white">0.8 MB/s</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Buffer Card */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-white">
                  <Cpu className="mr-2 h-4 w-4 text-amber-400" />
                  Data Buffer
                  <Badge
                    className={cn(
                      "ml-auto",
                      getStatusColor(satelliteData.buffer.status),
                    )}
                  >
                    {satelliteData.buffer.status.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white">
                    {satelliteData.buffer.used}% Used
                  </span>
                  <span className="text-xs text-white">
                    {satelliteData.buffer.used} / {satelliteData.buffer.total}{" "}
                    GB
                  </span>
                </div>
                <Progress value={satelliteData.buffer.used} className="h-2" />
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart
                    data={bufferData.slice(-12)}
                    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                  >
                    <Line
                      type="monotone"
                      dataKey="used"
                      stroke="#fbbf24"
                      strokeWidth={2}
                      dot={false}
                    />
                    <XAxis
                      dataKey="time"
                      tick={false}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis domain={[0, 100]} hide />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Power Card */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-white">
                  <Battery className="mr-2 h-4 w-4 text-green-400" />
                  Power
                  <Badge
                    className={cn(
                      "ml-auto",
                      getStatusColor(satelliteData.power.status),
                    )}
                  >
                    {satelliteData.power.status.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-xs text-white">Battery</div>
                    <div className="text-lg font-semibold text-white">
                      {satelliteData.power.batteryLevel}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white">Solar</div>
                    <div className="text-lg font-semibold text-white">
                      {satelliteData.power.solarPanelOutput}W
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white">Usage</div>
                    <div className="text-lg font-semibold text-white">
                      {satelliteData.power.consumption}W
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart
                    data={powerData.slice(-12)}
                    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                  >
                    <Line
                      type="monotone"
                      dataKey="battery"
                      stroke="#34d399"
                      strokeWidth={1.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="solar"
                      stroke="#fbbf24"
                      strokeWidth={1.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="consumption"
                      stroke="#f87171"
                      strokeWidth={1.5}
                      dot={false}
                    />
                    <XAxis
                      dataKey="time"
                      tick={false}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis domain={[0, 100]} hide />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Alerts Card */}
            <Card className="bg-gray-900 border-gray-800 md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-white">
                  <AlertCircle className="mr-2 h-4 w-4 text-red-400" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[180px] pr-4">
                  {satelliteData.alerts.map((alert) => (
                    <div key={alert.id} className="mb-3 last:mb-0">
                      <div className="flex items-start">
                        <Badge
                          className={cn(
                            "mr-2",
                            alert.severity === "critical"
                              ? "bg-red-500/10 text-red-500"
                              : alert.severity === "warning"
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-blue-500/10 text-blue-500",
                          )}
                        >
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <div>
                          <p className="text-sm text-white">{alert.message}</p>
                          <p className="text-xs text-white">
                            {alert.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="telemetry" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Telemetry Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        borderRadius: "0.375rem",
                        color: "#ffffff",
                      }}
                      itemStyle={{ color: "#ffffff" }}
                      labelStyle={{ color: "#ffffff" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      name="Temperature (°C)"
                      stroke="#f87171"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <Separator className="my-4" />
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attitudeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        borderRadius: "0.375rem",
                        color: "#ffffff",
                      }}
                      itemStyle={{ color: "#ffffff" }}
                      labelStyle={{ color: "#ffffff" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="roll"
                      name="Roll (°)"
                      stroke="#60a5fa"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pitch"
                      name="Pitch (°)"
                      stroke="#34d399"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="yaw"
                      name="Yaw (°)"
                      stroke="#a78bfa"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <Separator className="my-4" />
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={powerData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        borderRadius: "0.375rem",
                        color: "#ffffff",
                      }}
                      itemStyle={{ color: "#ffffff" }}
                      labelStyle={{ color: "#ffffff" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="battery"
                      name="Battery (%)"
                      stroke="#34d399"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="solar"
                      name="Solar Output (W)"
                      stroke="#fbbf24"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="consumption"
                      name="Power Consumption (W)"
                      stroke="#f87171"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subsystems" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {satelliteData.subsystems.map((subsystem, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-white">
                    {subsystem.name}
                    <Badge
                      className={cn(
                        "ml-auto",
                        getStatusColor(subsystem.status),
                      )}
                    >
                      {subsystem.status.toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-white">
                      Health: {subsystem.health}%
                    </span>
                  </div>
                  <Progress value={subsystem.health} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button variant="outline" size="sm">
                      Diagnostics
                    </Button>
                    <Button variant="outline" size="sm">
                      Parameters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="commands" className="space-y-4">
          <CommandCenter satelliteId={satelliteId} />
        </TabsContent>

        <TabsContent value="trajectory" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">
                Trajectory Simulation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white text-center p-8">
                <p>
                  Trajectory simulation will be implemented in the next phase.
                </p>
                <p className="text-sm text-gray-400 mt-2">Coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SatelliteDetailView;

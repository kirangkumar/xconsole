import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "@/lib/utils";
import {
  Database,
  HardDrive,
  BarChart3,
  AlertTriangle,
  RefreshCw,
  Download,
  Trash2,
  FileText,
  Image,
  Film,
  File,
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Cloud,
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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import CloudStorageConfigForm from "./CloudStorageConfig";
import CloudStorageModal from "./CloudStorageModal";

interface StorageFile {
  id: string;
  name: string;
  type: "image" | "video" | "telemetry" | "document" | "other";
  size: number; // in MB
  satellite: string;
  timestamp: string;
  status: "available" | "processing" | "archived" | "corrupted";
  priority: "high" | "medium" | "low";
}

interface StorageSystem {
  id: string;
  name: string;
  type: "primary" | "backup" | "archive";
  capacity: number; // in GB
  used: number; // in GB
  status: "online" | "degraded" | "offline" | "maintenance";
  location: string;
  health: number; // percentage
}

interface CloudStorageConfig {
  provider: string;
  accessKey: string;
  secretKey: string;
  region: string;
  bucket: string;
  endpoint?: string;
}

interface ClientStorageProps {
  className?: string;
}

const ClientStorage: React.FC<ClientStorageProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFileType, setSelectedFileType] = useState<string>("all");
  const [selectedSatellite, setSelectedSatellite] = useState<string>("all");
  const [timeRange, setTimeRange] = useState("7d");
  const [cloudConfig, setCloudConfig] = useState<CloudStorageConfig | null>(null);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  // Mock data for storage systems
  const storageSystems: StorageSystem[] = [
    {
      id: "storage-001",
      name: "Primary Storage Array",
      type: "primary",
      capacity: 2048,
      used: 1280,
      status: "online",
      location: "Mission Control Center",
      health: 98,
    },
    {
      id: "storage-002",
      name: "Backup Storage Array",
      type: "backup",
      capacity: 2048,
      used: 1024,
      status: "online",
      location: "Mission Control Center",
      health: 99,
    },
    {
      id: "storage-003",
      name: "Long-term Archive",
      type: "archive",
      capacity: 8192,
      used: 5734,
      status: "online",
      location: "Data Center",
      health: 100,
    },
    {
      id: "storage-004",
      name: "Disaster Recovery",
      type: "backup",
      capacity: 4096,
      used: 2048,
      status: "maintenance",
      location: "Backup Facility",
      health: 85,
    },
  ];

  // Mock data for files
  const files: StorageFile[] = [
    {
      id: "file-001",
      name: "SAT1_20230615_123045_THERMAL.jpg",
      type: "image",
      size: 24.5,
      satellite: "SAT-1",
      timestamp: "2023-06-15 12:30:45",
      status: "available",
      priority: "high",
    },
    {
      id: "file-002",
      name: "SAT3_20230615_091722_TELEMETRY.dat",
      type: "telemetry",
      size: 128.3,
      satellite: "SAT-3",
      timestamp: "2023-06-15 09:17:22",
      status: "available",
      priority: "high",
    },
    {
      id: "file-003",
      name: "SAT2_20230615_103012_MULTISPECTRAL.tif",
      type: "image",
      size: 512.7,
      satellite: "SAT-2",
      timestamp: "2023-06-15 10:30:12",
      status: "processing",
      priority: "medium",
    },
    {
      id: "file-004",
      name: "SAT4_20230615_083045_RADAR.mp4",
      type: "video",
      size: 1024.0,
      satellite: "SAT-4",
      timestamp: "2023-06-15 08:30:45",
      status: "available",
      priority: "medium",
    },
    {
      id: "file-005",
      name: "SAT1_20230614_235922_REPORT.pdf",
      type: "document",
      size: 3.2,
      satellite: "SAT-1",
      timestamp: "2023-06-14 23:59:22",
      status: "archived",
      priority: "low",
    },
    {
      id: "file-006",
      name: "SAT5_20230615_051233_TELEMETRY.dat",
      type: "telemetry",
      size: 98.6,
      satellite: "SAT-5",
      timestamp: "2023-06-15 05:12:33",
      status: "available",
      priority: "high",
    },
    {
      id: "file-007",
      name: "SAT6_20230614_224517_MULTISPECTRAL.tif",
      type: "image",
      size: 487.3,
      satellite: "SAT-6",
      timestamp: "2023-06-14 22:45:17",
      status: "corrupted",
      priority: "high",
    },
    {
      id: "file-008",
      name: "SAT2_20230615_031245_CONFIG.xml",
      type: "document",
      size: 0.8,
      satellite: "SAT-2",
      timestamp: "2023-06-15 03:12:45",
      status: "available",
      priority: "low",
    },
  ];

  // Calculate storage statistics
  const storageStats = {
    totalCapacity: storageSystems.reduce(
      (sum, system) => sum + system.capacity,
      0,
    ),
    totalUsed: storageSystems.reduce((sum, system) => sum + system.used, 0),
    availableSystems: storageSystems.filter(
      (system) => system.status === "online",
    ).length,
    totalSystems: storageSystems.length,
    filesByType: {
      image: files.filter((file) => file.type === "image").length,
      video: files.filter((file) => file.type === "video").length,
      telemetry: files.filter((file) => file.type === "telemetry").length,
      document: files.filter((file) => file.type === "document").length,
      other: files.filter((file) => file.type === "other").length,
    },
    totalFiles: files.length,
    totalFileSize: files.reduce((sum, file) => sum + file.size, 0),
    filesByStatus: {
      available: files.filter((file) => file.status === "available").length,
      processing: files.filter((file) => file.status === "processing").length,
      archived: files.filter((file) => file.status === "archived").length,
      corrupted: files.filter((file) => file.status === "corrupted").length,
    },
  };

  // Filter files based on selected criteria
  const filteredFiles = files.filter(
    (file) =>
      (selectedFileType === "all" || file.type === selectedFileType) &&
      (selectedSatellite === "all" || file.satellite === selectedSatellite),
  );

  // Data for storage type pie chart
  const storageTypeData = [
    {
      name: "Images",
      value: files
        .filter((file) => file.type === "image")
        .reduce((sum, file) => sum + file.size, 0),
      color: "#3b82f6",
    },
    {
      name: "Videos",
      value: files
        .filter((file) => file.type === "video")
        .reduce((sum, file) => sum + file.size, 0),
      color: "#ef4444",
    },
    {
      name: "Telemetry",
      value: files
        .filter((file) => file.type === "telemetry")
        .reduce((sum, file) => sum + file.size, 0),
      color: "#10b981",
    },
    {
      name: "Documents",
      value: files
        .filter((file) => file.type === "document")
        .reduce((sum, file) => sum + file.size, 0),
      color: "#f59e0b",
    },
    {
      name: "Other",
      value: files
        .filter((file) => file.type === "other")
        .reduce((sum, file) => sum + file.size, 0),
      color: "#8b5cf6",
    },
  ];

  // Data for storage usage over time
  const storageUsageData = Array(7)
    .fill(0)
    .map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      return {
        day,
        used: Math.floor(
          storageStats.totalUsed * 0.85 +
            (i / 6) * storageStats.totalUsed * 0.15,
        ),
        incoming: Math.floor(50 + Math.random() * 30),
      };
    });

  // Data for file count by satellite
  const filesBySatelliteData = [
    {
      satellite: "SAT-1",
      count: files.filter((file) => file.satellite === "SAT-1").length,
      size: files
        .filter((file) => file.satellite === "SAT-1")
        .reduce((sum, file) => sum + file.size, 0),
    },
    {
      satellite: "SAT-2",
      count: files.filter((file) => file.satellite === "SAT-2").length,
      size: files
        .filter((file) => file.satellite === "SAT-2")
        .reduce((sum, file) => sum + file.size, 0),
    },
    {
      satellite: "SAT-3",
      count: files.filter((file) => file.satellite === "SAT-3").length,
      size: files
        .filter((file) => file.satellite === "SAT-3")
        .reduce((sum, file) => sum + file.size, 0),
    },
    {
      satellite: "SAT-4",
      count: files.filter((file) => file.satellite === "SAT-4").length,
      size: files
        .filter((file) => file.satellite === "SAT-4")
        .reduce((sum, file) => sum + file.size, 0),
    },
    {
      satellite: "SAT-5",
      count: files.filter((file) => file.satellite === "SAT-5").length,
      size: files
        .filter((file) => file.satellite === "SAT-5")
        .reduce((sum, file) => sum + file.size, 0),
    },
    {
      satellite: "SAT-6",
      count: files.filter((file) => file.satellite === "SAT-6").length,
      size: files
        .filter((file) => file.satellite === "SAT-6")
        .reduce((sum, file) => sum + file.size, 0),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "degraded":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "maintenance":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "offline":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case "available":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "processing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "archived":
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
      case "corrupted":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case "medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="h-4 w-4 text-blue-400" />;
      case "video":
        return <Film className="h-4 w-4 text-red-400" />;
      case "telemetry":
        return <BarChart3 className="h-4 w-4 text-green-400" />;
      case "document":
        return <FileText className="h-4 w-4 text-amber-400" />;
      default:
        return <File className="h-4 w-4 text-purple-400" />;
    }
  };

  const handleCloudConfigSave = (config: CloudStorageConfig) => {
    setCloudConfig(config);
    setIsCloudModalOpen(false);
    // Here you would typically make an API call to save the configuration
    // and update the storage system to use the cloud provider
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
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
            onClick={() => setIsCloudModalOpen(true)}
          >
            <Cloud className="mr-2 h-4 w-4" />
            Configure Cloud Storage
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Storage Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-1">
              <div className="text-2xl font-bold text-white">
                {Math.round(
                  (storageStats.totalUsed / storageStats.totalCapacity) * 100,
                )}
                %
              </div>
              <span className="text-xs text-gray-400">
                {storageStats.totalUsed.toFixed(1)} /{" "}
                {storageStats.totalCapacity.toFixed(0)} TB
              </span>
            </div>
            <Progress
              value={
                (storageStats.totalUsed / storageStats.totalCapacity) * 100
              }
              className="h-2 mb-2"
            />
            <div className="text-xs text-gray-400 mt-2">
              {(storageStats.totalCapacity - storageStats.totalUsed).toFixed(1)}{" "}
              TB available
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Storage Systems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-white">
                {storageStats.availableSystems}/{storageStats.totalSystems}
              </div>
              <Badge
                className={
                  storageStats.availableSystems === storageStats.totalSystems
                    ? "bg-green-500/10 text-green-500 border-green-500/30"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                }
              >
                {storageStats.availableSystems === storageStats.totalSystems
                  ? "ALL ONLINE"
                  : "ATTENTION NEEDED"}
              </Badge>
            </div>
            <div className="mt-2 space-y-2">
              {storageSystems.map((system) => (
                <div
                  key={system.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <HardDrive className="h-3 w-3 mr-1 text-gray-400" />
                    <span className="text-xs text-white">{system.name}</span>
                  </div>
                  <Badge
                    className={cn("text-xs", getStatusColor(system.status))}
                  >
                    {system.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Storage by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[100px]">
              <PieChart width={100} height={100}>
                <Pie
                  data={storageTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {storageTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="ml-4 space-y-1">
                {storageTypeData.map((entry) => (
                  <div key={entry.name} className="flex items-center">
                    <div
                      className="w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-white">
                      {entry.name}: {Math.round(entry.value)} GB
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
              File Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">
              {storageStats.totalFiles} Files
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1" />
                  Available
                </span>
                <span className="text-xs text-white">
                  {storageStats.filesByStatus.available}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
                  Processing
                </span>
                <span className="text-xs text-white">
                  {storageStats.filesByStatus.processing}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white flex items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-500 mr-1" />
                  Archived
                </span>
                <span className="text-xs text-white">
                  {storageStats.filesByStatus.archived}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-1" />
                  Corrupted
                </span>
                <span className="text-xs text-white">
                  {storageStats.filesByStatus.corrupted}
                </span>
              </div>
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
            Storage Overview
          </TabsTrigger>
          <TabsTrigger
            value="files"
            className="data-[state=active]:bg-gray-200"
          >
            File Browser
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-gray-200"
          >
            Storage Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <HardDrive className="mr-2 h-5 w-5 text-blue-400" />
                  Storage Systems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {storageSystems.map((system) => (
                    <div
                      key={system.id}
                      className="p-4 bg-gray-800 rounded-md border border-gray-700"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-white flex items-center">
                            {system.name}
                            <Badge
                              className={cn(
                                "ml-2",
                                getStatusColor(system.status),
                              )}
                            >
                              {system.status.toUpperCase()}
                            </Badge>
                          </h3>
                          <p className="text-xs text-gray-400">
                            {system.type.charAt(0).toUpperCase() +
                              system.type.slice(1)}{" "}
                            Storage • {system.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-white">
                            {system.health}%
                          </div>
                          <div className="text-xs text-gray-400">Health</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-400">
                              Storage Usage
                            </span>
                            <span className="text-xs text-white">
                              {system.used} / {system.capacity} GB
                            </span>
                          </div>
                          <Progress
                            value={(system.used / system.capacity) * 100}
                            className="h-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-blue-400" />
                  Storage Usage Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={storageUsageData}>
                      <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                      <YAxis
                        stroke="#9ca3af"
                        fontSize={12}
                        tickFormatter={(value) => `${value} GB`}
                      />
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
                      <Bar
                        dataKey="used"
                        name="Used Storage (GB)"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="incoming"
                        name="New Data (GB)"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-white mb-2">
                    Storage by Satellite
                  </h3>
                  <div className="space-y-2">
                    {filesBySatelliteData.map((item) => (
                      <div key={item.satellite}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-white">
                            {item.satellite}
                          </span>
                          <span className="text-xs text-gray-400">
                            {item.count} files ({Math.round(item.size)} GB)
                          </span>
                        </div>
                        <Progress
                          value={(item.size / storageStats.totalFileSize) * 100}
                          className="h-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-400" />
                File Browser
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search files..."
                      className="w-full bg-gray-800 border-gray-700 text-white text-sm rounded-md pl-8 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <Select
                    value={selectedFileType}
                    onValueChange={setSelectedFileType}
                  >
                    <SelectTrigger className="w-[150px] bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="File Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                      <SelectItem value="telemetry">Telemetry</SelectItem>
                      <SelectItem value="document">Documents</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedSatellite}
                    onValueChange={setSelectedSatellite}
                  >
                    <SelectTrigger className="w-[150px] bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Satellite" />
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
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="rounded-md border border-gray-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-800">
                    <TableRow>
                      <TableHead className="text-gray-300 w-[300px]">
                        <div className="flex items-center">
                          Filename
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-300">
                        <div className="flex items-center">
                          Type
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-300">
                        <div className="flex items-center">
                          Satellite
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-300">
                        <div className="flex items-center">
                          Date
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-300">
                        <div className="flex items-center">
                          Size
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Priority</TableHead>
                      <TableHead className="text-gray-300 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.map((file) => (
                      <TableRow
                        key={file.id}
                        className="border-t border-gray-800"
                      >
                        <TableCell className="font-medium text-white">
                          <div className="flex items-center">
                            {getFileTypeIcon(file.type)}
                            <span className="ml-2 truncate max-w-[250px]">
                              {file.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">
                          {file.type}
                        </TableCell>
                        <TableCell>{file.satellite}</TableCell>
                        <TableCell>{file.timestamp}</TableCell>
                        <TableCell>
                          {file.size < 1000
                            ? `${file.size.toFixed(1)} MB`
                            : `${(file.size / 1024).toFixed(2)} GB`}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              getStatusColor(file.status),
                              "uppercase",
                            )}
                          >
                            {file.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              getStatusColor(file.priority),
                              "uppercase",
                            )}
                          >
                            {file.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
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
                              className="w-40 bg-gray-800 border-gray-700 text-white"
                            >
                              <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                                <FileText className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer text-red-400">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-blue-400" />
                  Storage Growth Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={storageUsageData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#374151"
                        vertical={false}
                      />
                      <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                      <YAxis
                        stroke="#9ca3af"
                        fontSize={12}
                        tickFormatter={(value) => `${value} GB`}
                      />
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
                        dataKey="used"
                        name="Total Storage Used (GB)"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 p-4 bg-gray-800 rounded-md border border-gray-700">
                  <h3 className="text-sm font-medium text-white mb-2">
                    Storage Forecast
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-white">Current Usage</span>
                      <span className="text-sm text-white">
                        {storageStats.totalUsed.toFixed(1)} TB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-white">
                        30-Day Forecast
                      </span>
                      <span className="text-sm text-white">
                        {(storageStats.totalUsed * 1.15).toFixed(1)} TB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-white">
                        90-Day Forecast
                      </span>
                      <span className="text-sm text-white">
                        {(storageStats.totalUsed * 1.45).toFixed(1)} TB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-white">
                        Storage Capacity
                      </span>
                      <span className="text-sm text-white">
                        {storageStats.totalCapacity.toFixed(0)} TB
                      </span>
                    </div>

                    <div className="mt-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">
                          Projected Capacity Usage (90 days)
                        </span>
                        <span className="text-xs text-white">
                          {Math.round(
                            ((storageStats.totalUsed * 1.45) /
                              storageStats.totalCapacity) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          ((storageStats.totalUsed * 1.45) /
                            storageStats.totalCapacity) *
                          100
                        }
                        className="h-1"
                      />
                    </div>

                    {(storageStats.totalUsed * 1.45) /
                      storageStats.totalCapacity >
                      0.8 && (
                      <div className="flex items-start mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
                        <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          Warning: Storage capacity projected to exceed 80%
                          within 90 days. Consider archiving older data or
                          expanding storage capacity.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-400" />
                  Data Acquisition by Satellite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={filesBySatelliteData}
                      layout="vertical"
                      margin={{ left: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#374151"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        stroke="#9ca3af"
                        fontSize={12}
                        tickFormatter={(value) => `${value} GB`}
                      />
                      <YAxis
                        dataKey="satellite"
                        type="category"
                        stroke="#9ca3af"
                        fontSize={12}
                        width={50}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "none",
                          borderRadius: "0.375rem",
                          color: "#ffffff",
                        }}
                        itemStyle={{ color: "#ffffff" }}
                        labelStyle={{ color: "#ffffff" }}
                        formatter={(value) => `${Number(value).toFixed(1)} GB`}
                      />
                      <Legend />
                      <Bar
                        dataKey="size"
                        name="Data Volume (GB)"
                        fill="#3b82f6"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-white mb-2">
                    Data Acquisition Statistics
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-800 rounded-md border border-gray-700">
                      <div className="text-xs text-gray-400">Total Files</div>
                      <div className="text-xl font-bold text-white">
                        {storageStats.totalFiles}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Across all satellites
                      </div>
                    </div>

                    <div className="p-3 bg-gray-800 rounded-md border border-gray-700">
                      <div className="text-xs text-gray-400">Total Data</div>
                      <div className="text-xl font-bold text-white">
                        {(storageStats.totalFileSize / 1024).toFixed(2)} TB
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {Math.round(
                          (storageStats.totalFileSize /
                            (storageStats.totalCapacity * 1024)) *
                            100,
                        )}
                        % of capacity
                      </div>
                    </div>

                    <div className="p-3 bg-gray-800 rounded-md border border-gray-700">
                      <div className="text-xs text-gray-400">
                        Most Active Satellite
                      </div>
                      <div className="text-xl font-bold text-white">
                        {
                          filesBySatelliteData.sort(
                            (a, b) => b.size - a.size,
                          )[0].satellite
                        }
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {filesBySatelliteData
                          .sort((a, b) => b.size - a.size)[0]
                          .count.toString()}{" "}
                        files (
                        {Math.round(
                          filesBySatelliteData.sort(
                            (a, b) => b.size - a.size,
                          )[0].size,
                        )}{" "}
                        GB)
                      </div>
                    </div>

                    <div className="p-3 bg-gray-800 rounded-md border border-gray-700">
                      <div className="text-xs text-gray-400">
                        Average File Size
                      </div>
                      <div className="text-xl font-bold text-white">
                        {(
                          storageStats.totalFileSize / storageStats.totalFiles
                        ).toFixed(1)}{" "}
                        MB
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Across all satellites
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <CloudStorageModal
        open={isCloudModalOpen}
        onOpenChange={setIsCloudModalOpen}
        onSave={handleCloudConfigSave}
      />
    </div>
  );
};

export default ClientStorage;

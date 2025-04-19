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
  Calendar,
  Camera,
  Check,
  Clock,
  Command,
  Download,
  Filter,
  Globe,
  Layers,
  Maximize2,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Satellite,
  Search,
  Server,
  Settings,
  Sliders,
  Sparkles,
  Target,
  Upload,
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
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface TaskingDashboardProps {
  className?: string;
}

interface Task {
  id: string;
  title: string;
  satellite: string;
  type: "imaging" | "communication" | "science" | "maintenance";
  priority: "critical" | "high" | "medium" | "low";
  status: "scheduled" | "in-progress" | "completed" | "failed" | "cancelled";
  scheduledTime: string;
  duration: string;
  targetLocation?: string;
  resourceUsage: {
    power: number;
    storage: number;
    bandwidth: number;
  };
  aiRecommended?: boolean;
  aiConfidence?: number;
  conflictsWith?: string[];
}

interface AreaOfInterest {
  id: string;
  name: string;
  type: "imaging" | "science" | "monitoring";
  priority: "critical" | "high" | "medium" | "low";
  coordinates: string;
  satellites: string[];
  lastCaptured?: string;
  nextScheduled?: string;
  coveragePercentage?: number;
}

const TaskingDashboard = ({ className }: TaskingDashboardProps) => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [selectedSatellite, setSelectedSatellite] = useState<string>("all");
  const [selectedTaskType, setSelectedTaskType] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Mock data for tasks
  const tasks: Task[] = [
    {
      id: "task-1",
      title: "High-Resolution Imaging of AOI-1",
      satellite: "SAT-1",
      type: "imaging",
      priority: "high",
      status: "scheduled",
      scheduledTime: "10:30 UTC",
      duration: "15 minutes",
      targetLocation: "35.6895° N, 139.6917° E",
      resourceUsage: {
        power: 75,
        storage: 85,
        bandwidth: 60,
      },
      aiRecommended: true,
      aiConfidence: 92,
    },
    {
      id: "task-2",
      title: "Atmospheric Data Collection",
      satellite: "SAT-3",
      type: "science",
      priority: "medium",
      status: "in-progress",
      scheduledTime: "09:45 UTC",
      duration: "30 minutes",
      targetLocation: "Global",
      resourceUsage: {
        power: 45,
        storage: 50,
        bandwidth: 30,
      },
    },
    {
      id: "task-3",
      title: "Communication Relay Test",
      satellite: "SAT-2",
      type: "communication",
      priority: "low",
      status: "scheduled",
      scheduledTime: "11:15 UTC",
      duration: "20 minutes",
      resourceUsage: {
        power: 35,
        storage: 20,
        bandwidth: 80,
      },
      conflictsWith: ["task-5"],
    },
    {
      id: "task-4",
      title: "Thermal Sensor Calibration",
      satellite: "SAT-6",
      type: "maintenance",
      priority: "critical",
      status: "scheduled",
      scheduledTime: "12:00 UTC",
      duration: "10 minutes",
      resourceUsage: {
        power: 60,
        storage: 10,
        bandwidth: 15,
      },
      aiRecommended: true,
      aiConfidence: 88,
    },
    {
      id: "task-5",
      title: "Downlink Stored Science Data",
      satellite: "SAT-2",
      type: "communication",
      priority: "high",
      status: "scheduled",
      scheduledTime: "11:30 UTC",
      duration: "25 minutes",
      resourceUsage: {
        power: 50,
        storage: 40,
        bandwidth: 95,
      },
      conflictsWith: ["task-3"],
    },
    {
      id: "task-6",
      title: "Solar Panel Efficiency Test",
      satellite: "SAT-4",
      type: "maintenance",
      priority: "medium",
      status: "completed",
      scheduledTime: "08:15 UTC",
      duration: "15 minutes",
      resourceUsage: {
        power: 30,
        storage: 15,
        bandwidth: 25,
      },
    },
    {
      id: "task-7",
      title: "Wildfire Monitoring",
      satellite: "SAT-5",
      type: "imaging",
      priority: "high",
      status: "scheduled",
      scheduledTime: "13:45 UTC",
      duration: "18 minutes",
      targetLocation: "34.0522° N, 118.2437° W",
      resourceUsage: {
        power: 70,
        storage: 75,
        bandwidth: 55,
      },
    },
  ];

  // Mock data for areas of interest
  const areasOfInterest: AreaOfInterest[] = [
    {
      id: "aoi-1",
      name: "Tokyo Metropolitan Area",
      type: "imaging",
      priority: "high",
      coordinates: "35.6895° N, 139.6917° E",
      satellites: ["SAT-1", "SAT-5"],
      lastCaptured: "2023-06-14 08:30 UTC",
      nextScheduled: "2023-06-15 10:30 UTC",
      coveragePercentage: 85,
    },
    {
      id: "aoi-2",
      name: "Amazon Rainforest Sector B",
      type: "monitoring",
      priority: "medium",
      coordinates: "3.4653° S, 62.2159° W",
      satellites: ["SAT-3", "SAT-7"],
      lastCaptured: "2023-06-13 14:15 UTC",
      nextScheduled: "2023-06-16 09:45 UTC",
      coveragePercentage: 62,
    },
    {
      id: "aoi-3",
      name: "Arctic Ice Sheet",
      type: "science",
      priority: "high",
      coordinates: "78.2332° N, 15.6267° E",
      satellites: ["SAT-2", "SAT-4"],
      lastCaptured: "2023-06-12 11:20 UTC",
      nextScheduled: "2023-06-15 13:10 UTC",
      coveragePercentage: 70,
    },
    {
      id: "aoi-4",
      name: "Los Angeles County",
      type: "monitoring",
      priority: "critical",
      coordinates: "34.0522° N, 118.2437° W",
      satellites: ["SAT-5", "SAT-8"],
      lastCaptured: "2023-06-14 16:40 UTC",
      nextScheduled: "2023-06-15 13:45 UTC",
      coveragePercentage: 90,
    },
    {
      id: "aoi-5",
      name: "Great Barrier Reef",
      type: "science",
      priority: "medium",
      coordinates: "16.7834° S, 145.6700° E",
      satellites: ["SAT-3", "SAT-6"],
      lastCaptured: "2023-06-13 05:30 UTC",
      nextScheduled: "2023-06-16 04:15 UTC",
      coveragePercentage: 45,
    },
  ];

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter(
    (task) =>
      (selectedSatellite === "all" || task.satellite === selectedSatellite) &&
      (selectedTaskType === "all" || task.type === selectedTaskType) &&
      (selectedPriority === "all" || task.priority === selectedPriority),
  );

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    scheduled: tasks.filter((t) => t.status === "scheduled").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    failed: tasks.filter((t) => t.status === "failed").length,
    imaging: tasks.filter((t) => t.type === "imaging").length,
    communication: tasks.filter((t) => t.type === "communication").length,
    science: tasks.filter((t) => t.type === "science").length,
    maintenance: tasks.filter((t) => t.type === "maintenance").length,
  };

  const taskTypeData = [
    { name: "Imaging", value: taskStats.imaging, color: "#3B82F6" },
    { name: "Communication", value: taskStats.communication, color: "#10B981" },
    { name: "Science", value: taskStats.science, color: "#8B5CF6" },
    { name: "Maintenance", value: taskStats.maintenance, color: "#F59E0B" },
  ];

  const taskStatusData = [
    { name: "Scheduled", value: taskStats.scheduled, color: "#3B82F6" },
    { name: "In Progress", value: taskStats.inProgress, color: "#8B5CF6" },
    { name: "Completed", value: taskStats.completed, color: "#10B981" },
    { name: "Failed", value: taskStats.failed, color: "#EF4444" },
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "in-progress":
        return "bg-purple-500/10 text-purple-500 border-purple-500/30";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case "cancelled":
        return "bg-slate-500/10 text-slate-500 border-slate-500/30";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/30";
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "imaging":
        return <Camera className="h-4 w-4 text-blue-400" />;
      case "communication":
        return <Globe className="h-4 w-4 text-green-400" />;
      case "science":
        return <Layers className="h-4 w-4 text-purple-400" />;
      case "maintenance":
        return <Settings className="h-4 w-4 text-amber-400" />;
      case "monitoring":
        return <Activity className="h-4 w-4 text-red-400" />;
      default:
        return <Command className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className={cn("w-full h-full bg-gray-950 text-white p-4 mt-16", className)}>
      <div className="flex items-end justify-between mb-4 w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-end justify-between w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md bg-gray-900">
              <TabsTrigger
                value="tasks"
                className="data-[state=active]:bg-gray-200"
              >
                Tasks
              </TabsTrigger>
              <TabsTrigger
                value="areas"
                className="data-[state=active]:bg-gray-200"
              >
                Areas of Interest
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-gray-200"
              >
                Analytics
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

          <TabsContent value="tasks" className="space-y-4 mt-4">
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
                  value={selectedTaskType}
                  onValueChange={setSelectedTaskType}
                >
                  <SelectTrigger className="w-[150px] bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Task Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="imaging">Imaging</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedPriority}
                  onValueChange={setSelectedPriority}
                >
                  <SelectTrigger className="w-[150px] bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white">
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
                      >
                        <Filter className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 border-gray-700 text-white">
                      <p>More filters</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium text-white">
                                {task.title}
                              </h3>
                              {task.aiRecommended && (
                                <TooltipProvider>
                                  <UITooltip>
                                    <TooltipTrigger asChild>
                                      <div className="ml-2">
                                        <Sparkles className="h-4 w-4 text-purple-400" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-900 border-gray-700 text-white">
                                      <p>
                                        AI Recommended (Confidence:{" "}
                                        {task.aiConfidence}%)
                                      </p>
                                    </TooltipContent>
                                  </UITooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            <div className="flex items-center mt-1 space-x-2">
                              <Badge
                                className={cn(
                                  "capitalize",
                                  getPriorityColor(task.priority),
                                )}
                                variant="outline"
                              >
                                {task.priority}
                              </Badge>
                              <Badge
                                className={cn(
                                  "capitalize",
                                  getStatusColor(task.status),
                                )}
                                variant="outline"
                              >
                                {task.status.replace("-", " ")}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-gray-700 text-white border-gray-600 flex items-center"
                              >
                                {getTaskTypeIcon(task.type)}
                                <span className="ml-1 capitalize">
                                  {task.type}
                                </span>
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-gray-700 text-white border-gray-600"
                              >
                                {task.satellite}
                              </Badge>
                            </div>
                            {task.targetLocation && (
                              <div className="flex items-center mt-1 text-xs text-gray-400">
                                <Target className="h-3 w-3 mr-1" />
                                {task.targetLocation}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center">
                            <div className="text-right mr-4">
                              <div className="text-sm font-medium text-white">
                                {task.scheduledTime}
                              </div>
                              <div className="text-xs text-gray-400">
                                {task.duration}
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
                                  Edit Task
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                                  Reschedule
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gray-700" />
                                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer text-red-500">
                                  Cancel Task
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <div>
                            <div className="flex justify-between text-xs text-white mb-1">
                              <span>Power</span>
                              <span>{task.resourceUsage.power}%</span>
                            </div>
                            <Progress
                              value={task.resourceUsage.power}
                              className="h-1.5 bg-gray-700"
                              indicatorClassName={cn(
                                task.resourceUsage.power > 80
                                  ? "bg-red-500"
                                  : task.resourceUsage.power > 60
                                    ? "bg-amber-500"
                                    : "bg-green-500",
                              )}
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs text-white mb-1">
                              <span>Storage</span>
                              <span>{task.resourceUsage.storage}%</span>
                            </div>
                            <Progress
                              value={task.resourceUsage.storage}
                              className="h-1.5 bg-gray-700"
                              indicatorClassName={cn(
                                task.resourceUsage.storage > 80
                                  ? "bg-red-500"
                                  : task.resourceUsage.storage > 60
                                    ? "bg-amber-500"
                                    : "bg-green-500",
                              )}
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs text-white mb-1">
                              <span>Bandwidth</span>
                              <span>{task.resourceUsage.bandwidth}%</span>
                            </div>
                            <Progress
                              value={task.resourceUsage.bandwidth}
                              className="h-1.5 bg-gray-700"
                              indicatorClassName={cn(
                                task.resourceUsage.bandwidth > 80
                                  ? "bg-red-500"
                                  : task.resourceUsage.bandwidth > 60
                                    ? "bg-amber-500"
                                    : "bg-green-500",
                              )}
                            />
                          </div>
                        </div>

                        {task.conflictsWith && task.conflictsWith.length > 0 && (
                          <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-white">
                            <div className="flex items-start">
                              <Command className="h-4 w-4 text-red-400 mr-1 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium text-red-400">
                                  Scheduling Conflict:
                                </span>{" "}
                                This task conflicts with{" "}
                                {task.conflictsWith.map((conflictId) => {
                                  const conflictTask = tasks.find(
                                    (t) => t.id === conflictId,
                                  );
                                  return conflictTask
                                    ? conflictTask.title
                                    : "Unknown Task";
                                })}
                                . Consider rescheduling.
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="areas" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search areas of interest..."
                  className="w-full bg-gray-900 border-gray-700 text-white text-sm rounded-md pl-8 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                New Area of Interest
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {areasOfInterest.map((aoi) => (
                <Card
                  key={aoi.id}
                  className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white">{aoi.name}</h3>
                        <div className="flex items-center mt-1">
                          <Target className="h-3.5 w-3.5 text-blue-400 mr-1" />
                          <span className="text-xs text-gray-300">
                            {aoi.coordinates}
                          </span>
                        </div>
                        <div className="flex items-center mt-2 space-x-2">
                          <Badge
                            className={cn(
                              "capitalize",
                              getPriorityColor(aoi.priority),
                            )}
                            variant="outline"
                          >
                            {aoi.priority}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-gray-700 text-white border-gray-600 flex items-center"
                          >
                            {getTaskTypeIcon(aoi.type)}
                            <span className="ml-1 capitalize">{aoi.type}</span>
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                        >
                          Schedule Task
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

                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-white mb-1">
                        <span>Coverage</span>
                        <span>{aoi.coveragePercentage}%</span>
                      </div>
                      <Progress
                        value={aoi.coveragePercentage}
                        className="h-1.5 bg-gray-700"
                        indicatorClassName={cn(
                          aoi.coveragePercentage! < 50
                            ? "bg-red-500"
                            : aoi.coveragePercentage! < 75
                              ? "bg-amber-500"
                              : "bg-green-500",
                        )}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-xs text-gray-400">
                        <div className="mb-1">Last Captured:</div>
                        <div className="text-white">{aoi.lastCaptured}</div>
                      </div>
                      <div className="text-xs text-gray-400">
                        <div className="mb-1">Next Scheduled:</div>
                        <div className="text-white">{aoi.nextScheduled}</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-xs text-gray-400 mb-2">
                        Assigned Satellites
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {aoi.satellites.map((sat) => (
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

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Task Distribution by Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[200px]">
                    <PieChart width={160} height={160}>
                      <Pie
                        data={taskTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {taskTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                    <div className="ml-4">
                      {taskTypeData.map((entry) => (
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
                    Task Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[200px]">
                    <PieChart width={160} height={160}>
                      <Pie
                        data={taskStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {taskStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                    <div className="ml-4">
                      {taskStatusData.map((entry) => (
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

              <Card className="bg-gray-900 border-gray-800 col-span-1 md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between text-white">
                    <div className="flex items-center">
                      <Activity className="mr-2 h-4 w-4 text-blue-400" />
                      Resource Utilization by Satellite
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
                      <AreaChart
                        data={[
                          {
                            name: "SAT-1",
                            power: 75,
                            storage: 60,
                            bandwidth: 45,
                          },
                          {
                            name: "SAT-2",
                            power: 60,
                            storage: 80,
                            bandwidth: 70,
                          },
                          {
                            name: "SAT-3",
                            power: 45,
                            storage: 50,
                            bandwidth: 30,
                          },
                          {
                            name: "SAT-4",
                            power: 30,
                            storage: 40,
                            bandwidth: 25,
                          },
                          {
                            name: "SAT-5",
                            power: 70,
                            storage: 75,
                            bandwidth: 55,
                          },
                          {
                            name: "SAT-6",
                            power: 60,
                            storage: 35,
                            bandwidth: 40,
                          },
                          {
                            name: "SAT-7",
                            power: 50,
                            storage: 60,
                            bandwidth: 65,
                          },
                          {
                            name: "SAT-8",
                            power: 55,
                            storage: 45,
                            bandwidth: 50,
                          },
                        ]}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#374151"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="name"
                          stroke="#6B7280"
                          tick={{ fill: "#E5E7EB" }}
                        />
                        <YAxis stroke="#6B7280" tick={{ fill: "#E5E7EB" }} />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-gray-900 border border-gray-700 p-2 rounded shadow-lg">
                                  <p className="text-white font-medium">{label}</p>
                                  {payload.map((entry, index) => (
                                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                                      {entry.name}: {entry.value}%
                                    </p>
                                  ))}
                                </div>
                              );
                            }
                            return null;
                          }}
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            borderColor: "#374151",
                            color: "#F9FAFB",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="power"
                          name="Power (%)"
                          stroke="#EF4444"
                          fill="#EF4444"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="storage"
                          name="Storage (%)"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="bandwidth"
                          name="Bandwidth (%)"
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TaskingDashboard;

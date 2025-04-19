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
  Brain,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Command,
  Cpu,
  Download,
  Filter,
  Lightbulb,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Satellite,
  Settings,
  Sparkles,
  ThumbsUp,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface AICoPilotModuleProps {
  className?: string;
}

interface Task {
  id: string;
  title: string;
  satellite: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "scheduled" | "in-progress" | "completed" | "failed";
  scheduledTime: string;
  duration: string;
  aiRecommended?: boolean;
  aiConfidence?: number;
  conflictsWith?: string[];
  resourceUsage?: {
    power: number;
    bandwidth: number;
    storage: number;
  };
}

interface Recommendation {
  id: string;
  type: "optimization" | "rescheduling" | "resource" | "conflict";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  affectedTasks: string[];
  confidence: number;
  applied: boolean;
}

const AICoPilotModule = ({ className }: AICoPilotModuleProps) => {
  const [activeTab, setActiveTab] = useState("recommendations");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedSatellite, setSelectedSatellite] = useState<string>("all");

  // Mock tasks data
  const tasks: Task[] = [
    {
      id: "task-1",
      title: "High-Resolution Imaging of AOI-1",
      satellite: "SAT-1",
      priority: "high",
      status: "scheduled",
      scheduledTime: "10:30 UTC",
      duration: "15 minutes",
      aiRecommended: true,
      aiConfidence: 92,
      resourceUsage: {
        power: 75,
        bandwidth: 60,
        storage: 85,
      },
    },
    {
      id: "task-2",
      title: "Atmospheric Data Collection",
      satellite: "SAT-3",
      priority: "medium",
      status: "in-progress",
      scheduledTime: "09:45 UTC",
      duration: "30 minutes",
      resourceUsage: {
        power: 45,
        bandwidth: 30,
        storage: 50,
      },
    },
    {
      id: "task-3",
      title: "Communication Relay Test",
      satellite: "SAT-2",
      priority: "low",
      status: "scheduled",
      scheduledTime: "11:15 UTC",
      duration: "20 minutes",
      conflictsWith: ["task-5"],
      resourceUsage: {
        power: 35,
        bandwidth: 80,
        storage: 20,
      },
    },
    {
      id: "task-4",
      title: "Thermal Sensor Calibration",
      satellite: "SAT-6",
      priority: "critical",
      status: "scheduled",
      scheduledTime: "12:00 UTC",
      duration: "10 minutes",
      aiRecommended: true,
      aiConfidence: 88,
      resourceUsage: {
        power: 60,
        bandwidth: 15,
        storage: 10,
      },
    },
    {
      id: "task-5",
      title: "Downlink Stored Science Data",
      satellite: "SAT-2",
      priority: "high",
      status: "scheduled",
      scheduledTime: "11:30 UTC",
      duration: "25 minutes",
      conflictsWith: ["task-3"],
      resourceUsage: {
        power: 50,
        bandwidth: 95,
        storage: 40,
      },
    },
    {
      id: "task-6",
      title: "Solar Panel Efficiency Test",
      satellite: "SAT-4",
      priority: "medium",
      status: "completed",
      scheduledTime: "08:15 UTC",
      duration: "15 minutes",
      resourceUsage: {
        power: 30,
        bandwidth: 25,
        storage: 15,
      },
    },
    {
      id: "task-7",
      title: "Attitude Control System Check",
      satellite: "SAT-5",
      priority: "medium",
      status: "failed",
      scheduledTime: "07:30 UTC",
      duration: "12 minutes",
      resourceUsage: {
        power: 40,
        bandwidth: 20,
        storage: 5,
      },
    },
  ];

  // Mock recommendations data
  const recommendations: Recommendation[] = [
    {
      id: "rec-1",
      type: "conflict",
      title: "Resolve scheduling conflict",
      description:
        "Tasks 'Communication Relay Test' and 'Downlink Stored Science Data' on SAT-2 have a 15-minute overlap. Recommend rescheduling Communication Relay Test to 12:30 UTC.",
      impact: "high",
      affectedTasks: ["task-3", "task-5"],
      confidence: 94,
      applied: false,
    },
    {
      id: "rec-2",
      type: "optimization",
      title: "Optimize power usage",
      description:
        "SAT-6 is scheduled for multiple high-power tasks. Recommend redistributing Thermal Sensor Calibration to SAT-8 which has 40% more available power.",
      impact: "medium",
      affectedTasks: ["task-4"],
      confidence: 86,
      applied: false,
    },
    {
      id: "rec-3",
      type: "resource",
      title: "Storage optimization",
      description:
        "SAT-1 storage will reach 92% capacity after imaging task. Recommend scheduling an additional downlink at 13:45 UTC to free up 45% storage.",
      impact: "medium",
      affectedTasks: ["task-1"],
      confidence: 89,
      applied: true,
    },
    {
      id: "rec-4",
      type: "rescheduling",
      title: "Weather-based rescheduling",
      description:
        "Forecast shows cloud cover over AOI-1 at 10:30 UTC. Recommend rescheduling imaging task to 14:15 UTC when cloud cover will be <10%.",
      impact: "high",
      affectedTasks: ["task-1"],
      confidence: 91,
      applied: false,
    },
  ];

  // Filter tasks based on selected priority and satellite
  const filteredTasks = tasks.filter(
    (task) =>
      (selectedPriority === "all" || task.priority === selectedPriority) &&
      (selectedSatellite === "all" || task.satellite === selectedSatellite),
  );

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
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/30";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case "medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/30";
    }
  };

  const getRecommendationTypeIcon = (type: string) => {
    switch (type) {
      case "optimization":
        return <Zap className="h-4 w-4 text-purple-400" />;
      case "rescheduling":
        return <Calendar className="h-4 w-4 text-blue-400" />;
      case "resource":
        return <Cpu className="h-4 w-4 text-green-400" />;
      case "conflict":
        return <Command className="h-4 w-4 text-red-400" />;
      default:
        return <Lightbulb className="h-4 w-4 text-amber-400" />;
    }
  };

  return (
    <div className={cn("w-full h-full bg-gray-950 text-white p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Brain className="h-6 w-6 mr-2 text-purple-400" />
          <h1 className="text-2xl font-bold">AI Co-Pilot</h1>
          <Badge className="ml-2 bg-purple-500/20 text-purple-400 border-purple-500/30">
            Beta
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
          >
            <Settings className="mr-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-4 bg-gray-900">
          <TabsTrigger
            value="recommendations"
            className="data-[state=active]:bg-gray-200"
          >
            AI Recommendations
            
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="data-[state=active]:bg-gray-200"
          >
            Task Scheduling
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
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

              <TooltipProvider>
                <Tooltip>
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
                </Tooltip>
              </TooltipProvider>
            </div>
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
                                <Tooltip>
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
                                </Tooltip>
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
                              className="bg-gray-700 text-white border-gray-600"
                            >
                              {task.satellite}
                            </Badge>
                          </div>
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

                      {task.resourceUsage && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <div>
                            <div className="flex justify-between text-xs text-white mb-1">
                              <span>Power</span>
                              <span>{task.resourceUsage.power}%</span>
                            </div>
                            <Progress
                              value={task.resourceUsage.power}
                              className={cn(
                                "h-1.5 bg-gray-700",
                                task.resourceUsage.power > 80
                                  ? "[&>div]:bg-red-500"
                                  : task.resourceUsage.power > 60
                                    ? "[&>div]:bg-amber-500"
                                    : "[&>div]:bg-green-500"
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
                              className={cn(
                                "h-1.5 bg-gray-700",
                                task.resourceUsage.bandwidth > 80
                                  ? "[&>div]:bg-red-500"
                                  : task.resourceUsage.bandwidth > 60
                                    ? "[&>div]:bg-amber-500"
                                    : "[&>div]:bg-green-500"
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
                              className={cn(
                                "h-1.5 bg-gray-700",
                                task.resourceUsage.storage > 80
                                  ? "[&>div]:bg-red-500"
                                  : task.resourceUsage.storage > 60
                                    ? "[&>div]:bg-amber-500"
                                    : "[&>div]:bg-green-500"
                              )}
                            />
                          </div>
                        </div>
                      )}

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
                              . AI recommends rescheduling.
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

        <TabsContent value="recommendations" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            {/* <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-white flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-purple-400" />
                AI-Generated Recommendations
              </CardTitle>
            </CardHeader> */}
            <CardContent className="p-4">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className={cn(
                        "p-4 rounded-lg border",
                        rec.applied
                          ? "bg-gray-800/50 border-gray-700"
                          : "bg-gray-800 border-gray-700 hover:border-gray-600",
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className="mt-1 mr-3">
                            {getRecommendationTypeIcon(rec.type)}
                          </div>
                          <div>
                            <h3 className="font-medium text-white">
                              {rec.title}
                              {rec.applied && (
                                <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">
                                  Applied
                                </Badge>
                              )}
                            </h3>
                            <div className="flex items-center mt-1 space-x-2">
                              <Badge
                                className={cn(
                                  "capitalize",
                                  getImpactColor(rec.impact),
                                )}
                                variant="outline"
                              >
                                {rec.impact} impact
                              </Badge>
                              <div className="flex items-center text-xs text-gray-400">
                                <Sparkles className="h-3 w-3 mr-1 text-purple-400" />
                                {rec.confidence}% confidence
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">
                              {rec.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pl-7">
                        <div className="text-xs text-gray-400">
                          Affected tasks:{" "}
                          {rec.affectedTasks.map((taskId, index) => {
                            const task = tasks.find((t) => t.id === taskId);
                            return (
                              <span key={taskId}>
                                {task ? task.title : "Unknown Task"}
                                {index < rec.affectedTasks.length - 1 && ", "}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {!rec.applied && (
                        <div className="mt-3 pl-7 flex space-x-2">
                          <Button
                            size="sm"
                            className="h-8 bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Apply Recommendation
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                          >
                            <ThumbsUp className="mr-1 h-4 w-4" />
                            Helpful
                          </Button>
                        </div>
                      )}
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

export default AICoPilotModule;

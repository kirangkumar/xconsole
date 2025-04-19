import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Check,
  Clock,
  RotateCw,
  Send,
  Terminal,
} from "lucide-react";

interface CommandCenterProps {
  satelliteId: string;
  onCommandExecuted?: (command: CommandLog) => void;
}

export interface CommandLog {
  id: string;
  name: string;
  status: "pending" | "success" | "failed";
  timestamp: string;
  details: string;
}

interface CommandOption {
  id: string;
  name: string;
  description: string;
  category: "attitude" | "power" | "payload" | "thermal" | "comms" | "system";
  risk: "low" | "medium" | "high";
}

const CommandCenter = ({
  satelliteId,
  onCommandExecuted = () => {},
}: CommandCenterProps) => {
  const [selectedCommand, setSelectedCommand] = useState<CommandOption | null>(
    null,
  );
  const [commandLogs, setCommandLogs] = useState<CommandLog[]>([
    {
      id: "cmd-001",
      name: "Attitude Adjustment",
      status: "success",
      timestamp: "10:15:33 UTC",
      details: "Pitch correction: -0.2°",
    },
    {
      id: "cmd-002",
      name: "Downlink Schedule Update",
      status: "success",
      timestamp: "09:42:18 UTC",
      details: "Added priority window at 12:45 UTC",
    },
    {
      id: "cmd-003",
      name: "Payload Control",
      status: "success",
      timestamp: "08:37:55 UTC",
      details: "Imaging sequence initiated for AOI-1",
    },
    {
      id: "cmd-004",
      name: "Power Management",
      status: "success",
      timestamp: "07:22:10 UTC",
      details: "Non-essential systems power reduction",
    },
  ]);

  // Command options grouped by category
  const commandOptions: CommandOption[] = [
    // Attitude commands
    {
      id: "att-001",
      name: "Adjust Attitude",
      description: "Modify satellite orientation parameters",
      category: "attitude",
      risk: "medium",
    },
    {
      id: "att-002",
      name: "Stabilize Orientation",
      description: "Reset attitude to nominal parameters",
      category: "attitude",
      risk: "low",
    },
    // Power commands
    {
      id: "pwr-001",
      name: "Power Conservation Mode",
      description: "Reduce power to non-essential systems",
      category: "power",
      risk: "low",
    },
    {
      id: "pwr-002",
      name: "Solar Panel Realignment",
      description: "Optimize solar panel angle for charging",
      category: "power",
      risk: "medium",
    },
    // Payload commands
    {
      id: "pld-001",
      name: "Initiate Imaging Sequence",
      description: "Begin scheduled imaging of target area",
      category: "payload",
      risk: "low",
    },
    {
      id: "pld-002",
      name: "Calibrate Sensors",
      description: "Run calibration routine for all sensors",
      category: "payload",
      risk: "medium",
    },
    // System commands
    {
      id: "sys-001",
      name: "Software Update",
      description: "Deploy new firmware package",
      category: "system",
      risk: "high",
    },
    {
      id: "sys-002",
      name: "Emergency Reset",
      description: "Perform full system restart",
      category: "system",
      risk: "high",
    },
  ];

  const executeCommand = () => {
    if (!selectedCommand) return;

    const now = new Date();
    const hours = now.getUTCHours().toString().padStart(2, "0");
    const minutes = now.getUTCMinutes().toString().padStart(2, "0");
    const seconds = now.getUTCSeconds().toString().padStart(2, "0");
    const timestamp = `${hours}:${minutes}:${seconds} UTC`;

    const newCommandLog: CommandLog = {
      id: `cmd-${Math.floor(Math.random() * 1000)}`,
      name: selectedCommand.name,
      status: "pending",
      timestamp,
      details: `Executing ${selectedCommand.name.toLowerCase()}...`,
    };

    // Add to logs immediately as pending
    setCommandLogs([newCommandLog, ...commandLogs]);

    // Simulate command execution with delay
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      const updatedLog: CommandLog = {
        ...newCommandLog,
        status: success ? "success" : "failed",
        details: success
          ? `Successfully executed ${selectedCommand.name.toLowerCase()}`
          : `Failed to execute ${selectedCommand.name.toLowerCase()} - timeout`,
      };

      setCommandLogs((prevLogs) =>
        prevLogs.map((log) => (log.id === newCommandLog.id ? updatedLog : log)),
      );

      onCommandExecuted(updatedLog);
    }, 2000);

    // Reset selected command
    setSelectedCommand(null);
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-500/10 text-red-500";
      case "medium":
        return "bg-amber-500/10 text-amber-500";
      case "low":
      default:
        return "bg-emerald-500/10 text-emerald-500";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "failed":
        return "bg-red-500/10 text-red-500";
      case "pending":
        return "bg-blue-500/10 text-blue-500";
      case "success":
      default:
        return "bg-emerald-500/10 text-emerald-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "failed":
        return <AlertCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "success":
      default:
        return <Check className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Terminal className="mr-2 h-5 w-5 text-blue-400" />
            Command Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {commandOptions.map((command) => (
              <Button
                key={command.id}
                variant={
                  selectedCommand?.id === command.id ? "default" : "outline"
                }
                className="justify-start h-auto py-3 px-4 text-left flex flex-col items-start"
                onClick={() => setSelectedCommand(command)}
              >
                <div className="flex justify-between w-full items-center">
                  <span className="font-medium">{command.name}</span>
                  <Badge className={cn(getRiskBadgeColor(command.risk))}>
                    {command.risk.toUpperCase()}
                  </Badge>
                </div>
                <span className="text-xs mt-1 text-gray-400">
                  {command.description}
                </span>
              </Button>
            ))}
          </div>

          <div className="flex justify-between items-center mb-4">
            <div>
              {selectedCommand && (
                <div className="text-white">
                  <span className="text-sm font-medium">Selected: </span>
                  <span className="text-sm">{selectedCommand.name}</span>
                </div>
              )}
            </div>
            <Button
              onClick={executeCommand}
              disabled={!selectedCommand}
              className="flex items-center"
            >
              <Send className="mr-2 h-4 w-4" />
              Execute Command
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white flex items-center">
              <RotateCw className="mr-2 h-4 w-4 text-gray-400" />
              Command History
            </h3>
            <ScrollArea className="h-[200px] w-full rounded-md border border-gray-800 p-4 text-white">
              <div className="space-y-3">
                {commandLogs.map((log, index) => (
                  <React.Fragment key={log.id}>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-white flex items-center">
                          {log.name}
                          <Badge
                            className={cn(
                              "ml-2",
                              getStatusBadgeColor(log.status),
                            )}
                          >
                            <span className="flex items-center">
                              {getStatusIcon(log.status)}
                              <span className="ml-1">
                                {log.status.toUpperCase()}
                              </span>
                            </span>
                          </Badge>
                        </span>
                        <span className="text-xs text-white">
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-white">{log.details}</p>
                    </div>
                    {index < commandLogs.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommandCenter;

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { cn } from "../../lib/utils";
import { useCommandCenter } from "./hooks/useCommandCenter";
import { format } from "date-fns";
import {
  Terminal,
  Star,
  Filter,
  Search,
  FileText,
  List,
  Plus,
  Save,
  Send,
  History,
  X,
  Shield,
  Satellite,
  Clock,
  Calendar,
  AlertOctagon,
  AlertTriangle,
  Play,
  Pause,
  Settings,
  Trash2,
  ArrowUp,
  ArrowDown,
  Battery,
  Thermometer,
  Wifi,
  Cpu,
  Radio,
  RotateCw,
  Check
} from "lucide-react";
import type {
  CommandCenterProps,
  TelemetryData,
  CommandOption,
  YamcsCommand,
  QueuedCommand,
  CommandTemplate,
  YamcsParameter,
  CommandSequence,
  YamcsCommandHistory,
  YamcsCommandVerification,
  YamcsCommandConstraintResult,
  CommandLog,
  CommandParameter,
  CommandChain,
  CommandChainItem,
  CommandSequenceItem
} from "./types";

const yamcsNamespaces = [
  "spacecraft",
  "payload",
  "thermal",
  "power",
  "attitude",
  "comms",
  "propulsion",
  "system"
];

const getRiskBadgeColor = (risk: string) => {
  switch (risk.toLowerCase()) {
    case "high":
      return "bg-red-500/10 text-red-400 border-red-500/30";
    case "medium":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    case "low":
      return "bg-green-500/10 text-green-400 border-green-500/30";
    default:
      return "bg-blue-500/10 text-blue-400 border-blue-500/30";
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
      return "bg-green-500/10 text-green-400 border-green-500/30";
    case "failed":
      return "bg-red-500/10 text-red-400 border-red-500/30";
    case "pending":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    case "aborted":
      return "bg-orange-500/10 text-orange-400 border-orange-500/30";
    default:
      return "bg-blue-500/10 text-blue-400 border-blue-500/30";
  }
};

const CommandCenter = ({
  satelliteId,
  onCommandExecuted = () => {},
}: CommandCenterProps) => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedCommand,
    setSelectedCommand,
    selectedYamcsCommand,
    setSelectedYamcsCommand,
    commandParameters,
    setCommandParameters,
    yamcsCommandParameters,
    setYamcsCommandParameters,
    yamcsCommandComments,
    setYamcsCommandComments,
    showYamcsHistory,
    setShowYamcsHistory,
    showYamcsVerification,
    setShowYamcsVerification,
    isExecuting,
    setIsExecuting,
    isYamcsExecuting,
    setIsYamcsExecuting,
    showFavoritesOnly,
    setShowFavoritesOnly,
    showYamcsOnly,
    setShowYamcsOnly,
    yamcsSearchQuery,
    setYamcsSearchQuery,
    showCommandTemplates,
    setShowCommandTemplates,
    showCommandQueue,
    setShowCommandQueue,
    commandQueue,
    setCommandQueue,
    commandTemplates,
    setCommandTemplates,
    newTemplateName,
    setNewTemplateName,
    newTemplateDescription,
    setNewTemplateDescription,
    showNewTemplateDialog,
    setShowNewTemplateDialog,
    showNewCommandDialog,
    setShowNewCommandDialog,
    newCommand,
    setNewCommand,
    newParameter,
    setNewParameter,
    showNewParameterDialog,
    setShowNewParameterDialog,
    executeYamcsCommand,
    executeQueuedCommands,
    addToQueue,
    removeFromQueue,
    saveCommandTemplate
  } = useCommandCenter(satelliteId, onCommandExecuted);

  const [telemetryData, setTelemetryData] = useState<TelemetryData>({
    timestamp: new Date().toISOString(),
    attitude: { pitch: 0, roll: 0, yaw: 0 },
    power: { batteryLevel: 100, solarPanelEfficiency: 95, powerConsumption: 50 },
    thermal: { temperature: 25, heatSinkEfficiency: 90 },
    comms: { signalStrength: 85, dataRate: 100, linkQuality: 95 },
    payload: { status: "nominal", storageUsed: 45, activeInstruments: [] }
  });

  // Mock data for satellite mission operations command templates
  const [yamcsCommands, setYamcsCommands] = useState<YamcsCommand[]>([
    {
      id: "cmd-001",
      name: "Set Attitude Control Mode",
      description: "Changes the attitude control mode of the satellite",
      namespace: "attitude",
      parameters: [
        {
          name: "mode",
          type: "enum",
          description: "The attitude control mode to set",
          required: true,
          enumValues: ["normal", "safe", "detumble", "manual"]
        },
        {
          name: "duration",
          type: "integer",
          description: "Duration in seconds to maintain this mode (0 for indefinite)",
          required: false,
          defaultValue: 0,
          min: 0,
          max: 86400,
          units: "seconds"
        }
      ],
      significance: { consequenceLevel: "normal" },
      constraints: [
        {
          id: "const-001",
          name: "Power Check",
          description: "Ensures sufficient power is available for attitude control",
          type: "pre",
          expression: "power.batteryLevel > 20",
          errorMessage: "Insufficient power for attitude control mode change"
        }
      ],
      verifiers: [
        {
          id: "ver-001",
          name: "Mode Change Verification",
          description: "Verifies the attitude control mode has been changed",
          type: "telemetry",
          timeout: 30,
          condition: "attitude.controlMode == mode",
          errorMessage: "Failed to change attitude control mode"
        }
      ],
      category: "attitude",
      tags: ["attitude", "control", "mode"],
      version: "1.0",
      lastModified: new Date().toISOString(),
      createdBy: "system",
      isFavorite: true
    },
    {
      id: "cmd-002",
      name: "Power System Reset",
      description: "Resets the power management system",
      namespace: "power",
      parameters: [
        {
          name: "resetType",
          type: "enum",
          description: "Type of power system reset to perform",
          required: true,
          enumValues: ["soft", "hard", "full"]
        },
        {
          name: "delay",
          type: "integer",
          description: "Delay in seconds before executing the reset",
          required: false,
          defaultValue: 0,
          min: 0,
          max: 300,
          units: "seconds"
        }
      ],
      significance: { 
        consequenceLevel: "warning",
        reasonForWarning: "This command will temporarily interrupt power to non-essential systems"
      },
      constraints: [
        {
          id: "const-002",
          name: "Critical Systems Check",
          description: "Ensures critical systems are in a safe state before power reset",
          type: "pre",
          expression: "payload.status == 'safe' && attitude.controlMode == 'safe'",
          errorMessage: "Critical systems must be in safe state before power reset"
        }
      ],
      verifiers: [
        {
          id: "ver-002",
          name: "Power System Recovery",
          description: "Verifies power system has recovered after reset",
          type: "telemetry",
          timeout: 60,
          condition: "power.batteryLevel > 0 && power.solarPanelEfficiency > 0",
          errorMessage: "Power system failed to recover after reset"
        }
      ],
      category: "power",
      tags: ["power", "reset", "system"],
      version: "1.0",
      lastModified: new Date().toISOString(),
      createdBy: "system",
      isFavorite: false
    },
    {
      id: "cmd-003",
      name: "Payload Data Collection",
      description: "Initiates data collection from payload instruments",
      namespace: "payload",
      parameters: [
        {
          name: "instrument",
          type: "enum",
          description: "The instrument to collect data from",
          required: true,
          enumValues: ["camera", "spectrometer", "magnetometer", "all"]
        },
        {
          name: "duration",
          type: "integer",
          description: "Duration of data collection in seconds",
          required: true,
          min: 1,
          max: 3600,
          units: "seconds"
        },
        {
          name: "resolution",
          type: "enum",
          description: "Data collection resolution",
          required: false,
          enumValues: ["low", "medium", "high"],
          defaultValue: "medium"
        }
      ],
      significance: { consequenceLevel: "normal" },
      constraints: [
        {
          id: "const-003",
          name: "Power Check",
          description: "Ensures sufficient power is available for payload operation",
          type: "pre",
          expression: "power.batteryLevel > 30",
          errorMessage: "Insufficient power for payload data collection"
        }
      ],
      verifiers: [
        {
          id: "ver-003",
          name: "Data Collection Verification",
          description: "Verifies data collection has started",
          type: "telemetry",
          timeout: 30,
          condition: "payload.activeInstruments.includes(instrument)",
          errorMessage: "Failed to start data collection"
        }
      ],
      category: "payload",
      tags: ["payload", "data", "collection"],
      version: "1.0",
      lastModified: new Date().toISOString(),
      createdBy: "system",
      isFavorite: true
    },
    {
      id: "cmd-004",
      name: "Thermal Control Adjustment",
      description: "Adjusts thermal control system parameters",
      namespace: "thermal",
        parameters: [
          {
          name: "heaterMode",
            type: "enum",
          description: "Heater operation mode",
            required: true,
          enumValues: ["auto", "on", "off"]
        },
        {
          name: "targetTemp",
          type: "float",
          description: "Target temperature in Celsius",
            required: false,
          min: -20,
          max: 50,
          units: "°C"
        }
      ],
      significance: { consequenceLevel: "normal" },
        constraints: [],
      verifiers: [
        {
          id: "ver-004",
          name: "Temperature Verification",
          description: "Verifies temperature is within acceptable range",
          type: "telemetry",
          timeout: 300,
          condition: "thermal.temperature >= targetTemp - 5 && thermal.temperature <= targetTemp + 5",
          errorMessage: "Failed to achieve target temperature"
        }
      ],
      category: "thermal",
      tags: ["thermal", "control", "temperature"],
        version: "1.0",
        lastModified: new Date().toISOString(),
      createdBy: "system",
      isFavorite: false
    },
    {
      id: "cmd-005",
      name: "Communication System Reset",
      description: "Resets the communication system",
      namespace: "comms",
        parameters: [
          {
          name: "resetType",
            type: "enum",
          description: "Type of communication system reset",
            required: true,
          enumValues: ["transceiver", "modem", "full"]
        },
        {
          name: "frequency",
          type: "float",
          description: "Communication frequency in MHz after reset",
            required: false,
          min: 2200,
          max: 2300,
          units: "MHz"
          }
        ],
        significance: {
        consequenceLevel: "warning",
        reasonForWarning: "This command will temporarily interrupt communication with the satellite"
        },
        constraints: [],
      verifiers: [
        {
          id: "ver-005",
          name: "Communication Recovery",
          description: "Verifies communication system has recovered after reset",
          type: "telemetry",
          timeout: 60,
          condition: "comms.signalStrength > 0",
          errorMessage: "Communication system failed to recover after reset"
        }
      ],
      category: "comms",
      tags: ["comms", "reset", "communication"],
        version: "1.0",
        lastModified: new Date().toISOString(),
      createdBy: "system",
      isFavorite: false
    },
    {
      id: "cmd-006",
      name: "Orbit Maneuver",
      description: "Performs an orbital maneuver",
      namespace: "propulsion",
        parameters: [
          {
            name: "maneuverType",
            type: "enum",
          description: "Type of orbital maneuver",
            required: true,
          enumValues: ["raise", "lower", "plane-change", "station-keeping"]
          },
          {
            name: "deltaV",
            type: "float",
          description: "Change in velocity in meters per second",
            required: true,
            min: 0.1,
          max: 10.0,
            units: "m/s"
          },
          {
          name: "direction",
          type: "enum",
          description: "Direction of the maneuver",
            required: true,
          enumValues: ["prograde", "retrograde", "normal", "anti-normal", "radial-in", "radial-out"]
          }
        ],
        significance: {
          consequenceLevel: "critical",
        reasonForWarning: "This command will change the satellite's orbit and requires careful planning"
      },
      constraints: [
        {
          id: "const-006",
          name: "Fuel Check",
          description: "Ensures sufficient fuel is available for the maneuver",
          type: "pre",
          expression: "propulsion.fuelLevel > deltaV * 0.1",
          errorMessage: "Insufficient fuel for orbital maneuver"
        }
      ],
      verifiers: [
        {
          id: "ver-006",
          name: "Maneuver Execution",
          description: "Verifies the maneuver has been executed",
          type: "telemetry",
          timeout: 300,
          condition: "orbit.apoapsis > 0 && orbit.periapsis > 0",
          errorMessage: "Failed to execute orbital maneuver"
        }
      ],
      category: "propulsion",
      tags: ["orbit", "maneuver", "propulsion"],
        version: "1.0",
        lastModified: new Date().toISOString(),
      createdBy: "system",
      isFavorite: true
    }
  ]);

  // Mock data for command sequences
  const [commandSequences, setCommandSequences] = useState<CommandSequence[]>([
    {
      id: "seq-001",
      name: "Payload Calibration Sequence",
      description: "Calibrates all payload instruments",
      commands: [
        {
          commandId: "cmd-002",
          parameters: { resetType: "soft", delay: 5 }
        },
        {
          commandId: "cmd-003",
          parameters: { instrument: "spectrometer", duration: 300, resolution: "high" },
          delayAfter: 60
        },
        {
          commandId: "cmd-003",
          parameters: { instrument: "magnetometer", duration: 300, resolution: "high" },
          delayAfter: 60
        },
        {
          commandId: "cmd-003",
          parameters: { instrument: "camera", duration: 300, resolution: "high" },
          delayAfter: 60
        }
      ],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      isFavorite: true
    },
    {
      id: "seq-002",
      name: "Safe Mode Recovery",
      description: "Recovers the satellite from safe mode",
      commands: [
        {
          commandId: "cmd-001",
          parameters: { mode: "safe" },
          delayAfter: 30
        },
        {
          commandId: "cmd-002",
          parameters: { resetType: "soft", delay: 10 },
          delayAfter: 60
        },
        {
          commandId: "cmd-005",
          parameters: { resetType: "transceiver", frequency: 2250.5 },
          delayAfter: 30
        },
        {
          commandId: "cmd-001",
          parameters: { mode: "normal" },
          delayAfter: 60
        }
      ],
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      isFavorite: false
    },
    {
      id: "seq-003",
      name: "Orbit Adjustment Sequence",
      description: "Performs a series of orbit adjustments",
      commands: [
        {
          commandId: "cmd-006",
          parameters: { maneuverType: "raise", deltaV: 2.5, direction: "prograde" },
          delayAfter: 3600
        },
        {
          commandId: "cmd-006",
          parameters: { maneuverType: "plane-change", deltaV: 1.8, direction: "normal" },
          delayAfter: 7200
        },
        {
          commandId: "cmd-006",
          parameters: { maneuverType: "station-keeping", deltaV: 0.5, direction: "radial-out" },
          delayAfter: 0
        }
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      isFavorite: true
    }
  ]);

  // Mock data for scheduled commands
  const [scheduledCommands, setScheduledCommands] = useState<CommandLog[]>([
    {
      id: "sched-001",
      name: "Daily Health Check",
      status: "pending",
      timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      details: "Scheduled daily health check of all subsystems",
        category: "system",
      risk: "low",
      parameters: {}
    },
    {
      id: "sched-002",
      name: "Payload Data Collection",
      status: "pending",
      timestamp: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      details: "Scheduled data collection from all payload instruments",
      category: "payload",
      risk: "low",
      parameters: { instrument: "all", duration: 1800, resolution: "medium" }
    },
    {
      id: "sched-003",
      name: "Orbit Maneuver",
      status: "pending",
      timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      details: "Scheduled orbit adjustment for station keeping",
      category: "propulsion",
      risk: "medium",
      parameters: { maneuverType: "station-keeping", deltaV: 0.8, direction: "radial-out" }
    }
  ]);

  // Mock data for command history
  const [commandLogs, setCommandLogs] = useState<CommandLog[]>([
    {
      id: "log-001",
      name: "Set Attitude Control Mode",
      status: "success",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      details: "Changed attitude control mode to normal",
      category: "attitude",
      risk: "low",
      parameters: { mode: "normal", duration: 0 }
    },
    {
      id: "log-002",
      name: "Payload Data Collection",
      status: "success",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      details: "Collected data from spectrometer for 10 minutes",
      category: "payload",
      risk: "low",
      parameters: { instrument: "spectrometer", duration: 600, resolution: "high" }
    },
    {
      id: "log-003",
      name: "Power System Reset",
      status: "failed",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      details: "Failed to reset power system due to critical systems not in safe state",
      category: "power",
      risk: "medium",
      parameters: { resetType: "soft", delay: 0 }
    },
    {
      id: "log-004",
      name: "Orbit Maneuver",
      status: "success",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      details: "Successfully performed orbit raising maneuver",
      category: "propulsion",
      risk: "high",
      parameters: { maneuverType: "raise", deltaV: 3.2, direction: "prograde" }
    },
    {
      id: "log-005",
      name: "Communication System Reset",
      status: "success",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      details: "Reset transceiver and updated communication frequency",
      category: "comms",
      risk: "medium",
      parameters: { resetType: "transceiver", frequency: 2250.5 }
    }
  ]);

  // Mock data for command history
  const [yamcsCommandHistory, setYamcsCommandHistory] = useState<YamcsCommandHistory[]>([
      {
        id: "hist-001",
      commandId: "cmd-001",
      commandName: "Set Attitude Control Mode",
        status: "success",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        username: "operator1",
      parameters: { mode: "normal", duration: 0 },
      comments: "Standard attitude control mode setting",
      source: "ground",
      sequenceNumber: 12345,
      generationTime: new Date(Date.now() - 2 * 60 * 60 * 1000 - 5 * 1000).toISOString(),
      origin: "MCC",
      hex: "0x1A2B3C4D",
      verifications: [
        {
          verifierId: "ver-001",
          status: "success",
          message: "Attitude control mode changed successfully",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 1000).toISOString()
        }
      ],
      constraints: [
        {
          constraintId: "const-001",
          passed: true,
          message: "Power level sufficient for attitude control",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 1 * 1000).toISOString()
        }
      ]
      },
      {
        id: "hist-002",
      commandId: "cmd-003",
      commandName: "Payload Data Collection",
        status: "success",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        username: "operator2",
      parameters: { instrument: "spectrometer", duration: 600, resolution: "high" },
      comments: "High-resolution spectral data collection",
      source: "ground",
      sequenceNumber: 12346,
      generationTime: new Date(Date.now() - 5 * 60 * 60 * 1000 - 5 * 1000).toISOString(),
      origin: "MCC",
      hex: "0x1A2B3C4E",
      verifications: [
        {
          verifierId: "ver-003",
          status: "success",
          message: "Data collection started successfully",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000 + 5 * 1000).toISOString()
        }
      ],
      constraints: [
        {
          constraintId: "const-003",
          passed: true,
          message: "Power level sufficient for payload operation",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000 - 1 * 1000).toISOString()
        }
      ]
    },
    {
      id: "hist-003",
      commandId: "cmd-002",
      commandName: "Power System Reset",
      status: "failed",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      username: "operator1",
      parameters: { resetType: "soft", delay: 0 },
      comments: "Attempted soft reset of power system",
      source: "ground",
      sequenceNumber: 12347,
      generationTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 5 * 1000).toISOString(),
      origin: "MCC",
      hex: "0x1A2B3C4F",
        verifications: [],
      constraints: [
        {
          constraintId: "const-002",
          passed: false,
          message: "Critical systems not in safe state",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 1 * 1000).toISOString()
        }
      ]
    }
  ]);

  // State for new sequence dialog
  const [showNewSequenceDialog, setShowNewSequenceDialog] = useState(false);
  const [newSequenceName, setNewSequenceName] = useState("");
  const [newSequenceDescription, setNewSequenceDescription] = useState("");
  const [newSequenceCommands, setNewSequenceCommands] = useState<CommandSequenceItem[]>([]);
  const [selectedCommandForSequence, setSelectedCommandForSequence] = useState<YamcsCommand | null>(null);
  const [selectedCommandParameters, setSelectedCommandParameters] = useState<Record<string, any>>({});
  const [delayAfterCommand, setDelayAfterCommand] = useState(0);

  // Additional state variables for sequence management
  const [isAborting, setIsAborting] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState<CommandSequence | null>(null);
  const [currentSequenceStep, setCurrentSequenceStep] = useState(0);
  const [isSequenceRunning, setIsSequenceRunning] = useState(false);
  const [commandOptions, setCommandOptions] = useState<CommandOption[]>([]);

  // Filter commands based on search query and category
  const [filteredYamcsCommands, setFilteredYamcsCommands] = useState<YamcsCommand[]>([]);

  useEffect(() => {
    // Filter commands based on search query and category
    let filtered = [...yamcsCommands];
    
    if (searchQuery) {
      filtered = filtered.filter(cmd => 
        cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(cmd => cmd.category === selectedCategory);
    }
    
    if (showFavoritesOnly) {
      filtered = filtered.filter(cmd => cmd.isFavorite);
    }
    
    setFilteredYamcsCommands(filtered);
  }, [searchQuery, selectedCategory, showFavoritesOnly, yamcsCommands]);

  // Add a command to the new sequence
  const addCommandToSequence = () => {
    if (selectedCommandForSequence) {
      const newCommand: CommandSequenceItem = {
        commandId: selectedCommandForSequence.id,
        parameters: { ...selectedCommandParameters },
        delayAfter: delayAfterCommand > 0 ? delayAfterCommand : undefined
      };
      
      setNewSequenceCommands([...newSequenceCommands, newCommand]);
      setSelectedCommandForSequence(null);
      setSelectedCommandParameters({});
      setDelayAfterCommand(0);
    }
  };

  // Remove a command from the new sequence
  const removeCommandFromSequence = (index: number) => {
    const updatedCommands = [...newSequenceCommands];
    updatedCommands.splice(index, 1);
    setNewSequenceCommands(updatedCommands);
  };

  // Save the new sequence
  const saveNewSequence = () => {
    if (newSequenceName && newSequenceCommands.length > 0) {
      const newSequence: CommandSequence = {
        id: `seq-${Date.now()}`,
        name: newSequenceName,
        description: newSequenceDescription,
        commands: newSequenceCommands,
        createdAt: new Date().toISOString(),
        isFavorite: false
      };
      
      setCommandSequences([...commandSequences, newSequence]);
      setShowNewSequenceDialog(false);
      setNewSequenceName("");
      setNewSequenceDescription("");
      setNewSequenceCommands([]);
    }
  };

  const handleCommandSelect = (command: CommandOption) => {
    setSelectedCommand(command);
    setCommandParameters({});
  };

  const handleYamcsCommandSelect = (command: YamcsCommand) => {
    setSelectedYamcsCommand(command);
    setYamcsCommandParameters({});
  };

  const handleParameterChange = (paramId: string, value: any) => {
    setCommandParameters(prev => ({
      ...prev,
      [paramId]: value
    }));
  };

  const handleYamcsParameterChange = (paramName: string, value: any) => {
    setYamcsCommandParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleCommentsChange = (comments: string) => {
    setYamcsCommandComments(comments);
  };

  const handleAddToQueue = () => {
    if (selectedYamcsCommand) {
      addToQueue(selectedYamcsCommand, yamcsCommandParameters);
    }
  };

  const handleRemoveFromQueue = (commandId: string) => {
    removeFromQueue(commandId);
  };

  const handleSaveTemplate = () => {
    if (newTemplateName && newTemplateDescription) {
      saveCommandTemplate(newTemplateName, newTemplateDescription);
      setShowNewTemplateDialog(false);
    }
  };

  const toggleFavoriteCommand = (commandId: string) => {
    setFilteredYamcsCommands(prev =>
      prev.map(cmd =>
        cmd.id === commandId ? { ...cmd, isFavorite: !cmd.isFavorite } : cmd
      )
    );
  };

  const toggleFavoriteSequence = (sequenceId: string) => {
    setCommandSequences(prev =>
      prev.map(seq =>
        seq.id === sequenceId ? { ...seq, isFavorite: !seq.isFavorite } : seq
      )
    );
  };

  const deleteCommandSequence = (sequenceId: string) => {
    setCommandSequences(prev => prev.filter(seq => seq.id !== sequenceId));
  };

  const executeCommand = () => {
    if (!selectedCommand) return;
    setIsExecuting(true);
    // Implementation here
    setTimeout(() => {
      setIsExecuting(false);
    }, 1000);
  };

  const abortCommand = () => {
    // Implementation here
    console.log("Aborting command");
  };

  const pauseSequence = () => {
    setIsSequenceRunning(false);
  };

  const resumeSequence = () => {
    setIsSequenceRunning(true);
  };

  const stopSequence = () => {
    setIsSequenceRunning(false);
    setSelectedSequence(null);
    setCurrentSequenceStep(0);
  };

  const runCommandSequence = (sequence: CommandSequence) => {
    setSelectedSequence(sequence);
    setCurrentSequenceStep(0);
    setIsSequenceRunning(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <Check className="h-3 w-3 text-green-400" />;
      case "failed":
        return <X className="h-3 w-3 text-red-400" />;
      case "pending":
        return <Clock className="h-3 w-3 text-yellow-400" />;
      case "aborted":
        return <AlertOctagon className="h-3 w-3 text-orange-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 mt-16 ml-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
            <Terminal className="mr-2 h-5 w-5 text-blue-400" />
            Command Center
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-900 border-gray-700 text-white hover:bg-gray-700"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              >
                <Star className={`h-4 w-4 mr-1 ${showFavoritesOnly ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`} />
                Favorites
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                onClick={() => setSearchQuery("")}
              >
                <Filter className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-md mb-6 bg-gray-800">
              <TabsTrigger value="commands" className="data-[state=active]:bg-gray-200">
                Commands
              </TabsTrigger>
              <TabsTrigger value="sequences" className="data-[state=active]:bg-gray-200">
                Sequences
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="data-[state=active]:bg-gray-200">
                Scheduled
              </TabsTrigger>
              <TabsTrigger value="telemetry" className="data-[state=active]:bg-gray-200">
                Telemetry
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="commands" className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search commands..."
                    className="pl-8 bg-gray-800 border-gray-700 text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="attitude">Attitude</SelectItem>
                    <SelectItem value="power">Power</SelectItem>
                    <SelectItem value="payload">Payload</SelectItem>
                    <SelectItem value="thermal">Thermal</SelectItem>
                    <SelectItem value="comms">Communications</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    {yamcsNamespaces.map(ns => (
                      <SelectItem key={ns} value={ns}>{ns}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  onClick={() => setShowCommandTemplates(true)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Templates
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  onClick={() => setShowCommandQueue(true)}
                >
                  <List className="h-4 w-4 mr-1" />
                  Queue
                </Button>
              </div>

              {/* Command Queue Dialog */}
              <Dialog open={showCommandQueue} onOpenChange={setShowCommandQueue}>
                <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-medium">Command Queue</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Queued Commands</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        onClick={() => setCommandQueue([])}
                      >
                        Clear Queue
                      </Button>
                    </div>
                    <ScrollArea className="h-[300px] w-full rounded-md border border-gray-700 p-4">
                      <div className="space-y-4">
                        {commandQueue.map((cmd: QueuedCommand, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-md">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">{cmd.name}</span>
                              <Badge variant="outline" className="bg-gray-600 text-gray-300 border-gray-500">
                                {cmd.namespace}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                                onClick={() => {
                                  setCommandQueue(queue => queue.filter((_, i) => i !== index));
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-blue-400"
                                onClick={() => {
                                  const newQueue = [...commandQueue];
                                  if (index > 0) {
                                    [newQueue[index], newQueue[index - 1]] = [newQueue[index - 1], newQueue[index]];
                                    setCommandQueue(newQueue);
                                  }
                                }}
                                disabled={index === 0}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-blue-400"
                                onClick={() => {
                                  const newQueue = [...commandQueue];
                                  if (index < newQueue.length - 1) {
                                    [newQueue[index], newQueue[index + 1]] = [newQueue[index + 1], newQueue[index]];
                                    setCommandQueue(newQueue);
                                  }
                                }}
                                disabled={index === commandQueue.length - 1}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowCommandQueue(false)}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        Close
                      </Button>
                      <Button
                        onClick={() => {
                          // Execute queued commands in sequence
                          executeQueuedCommands();
                          setShowCommandQueue(false);
                        }}
                        className="bg-blue-500 hover:bg-blue-600"
                        disabled={commandQueue.length === 0}
                      >
                        Execute Queue
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Command Templates Dialog */}
              <Dialog open={showCommandTemplates} onOpenChange={setShowCommandTemplates}>
                <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-medium">Command Templates</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Saved Templates</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        onClick={() => setShowNewTemplateDialog(true)}
                      >
                        New Template
                      </Button>
                    </div>
                    <ScrollArea className="h-[300px] w-full rounded-md border border-gray-700 p-4">
                      <div className="space-y-4">
                        {commandTemplates.map((template) => (
                          <div key={template.id} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-md">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">{template.name}</span>
                              <Badge variant="outline" className="bg-gray-600 text-gray-300 border-gray-500">
                                {template.namespace}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-blue-400"
                                onClick={() => {
                                  setSelectedYamcsCommand(template.command);
                                  setYamcsCommandParameters(template.parameters);
                                  setShowCommandTemplates(false);
                                }}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                                onClick={() => {
                                  setCommandTemplates(templates => 
                                    templates.filter(t => t.id !== template.id)
                                  );
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </DialogContent>
              </Dialog>

              {/* New Template Dialog */}
              <Dialog open={showNewTemplateDialog} onOpenChange={setShowNewTemplateDialog}>
                <DialogContent className="bg-gray-800 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-medium">New Command Template</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="templateName">Template Name</Label>
                      <Input
                        id="templateName"
                        value={newTemplateName}
                        onChange={(e) => setNewTemplateName(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="templateDescription">Description</Label>
                      <Input
                        id="templateDescription"
                        value={newTemplateDescription}
                        onChange={(e) => setNewTemplateDescription(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowNewTemplateDialog(false)}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          if (selectedYamcsCommand && newTemplateName) {
                            const template: CommandTemplate = {
                              id: `template-${Date.now()}`,
                              name: newTemplateName,
                              description: newTemplateDescription,
                              command: selectedYamcsCommand,
                              parameters: yamcsCommandParameters,
                              namespace: selectedYamcsCommand.namespace,
                              version: "1.0",
                              createdBy: "user",
                              createdAt: new Date().toISOString(),
                              lastModified: new Date().toISOString(),
                              tags: ["new"],
                              isPublic: false
                            };
                            setCommandTemplates(prev => [...prev, template]);
                            setNewTemplateName("");
                            setNewTemplateDescription("");
                            setShowNewTemplateDialog(false);
                          }
                        }}
                        className="bg-blue-500 hover:bg-blue-600"
                        disabled={!newTemplateName || !selectedYamcsCommand}
                      >
                        Save Template
                      </Button>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Add New Command Button */}
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                onClick={() => setShowNewCommandDialog(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                New Command
              </Button>

              {/* New Command Dialog */}
              <Dialog open={showNewCommandDialog} onOpenChange={setShowNewCommandDialog}>
                <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-medium">Create New Command</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="commandName">Command Name</Label>
                      <Input
                        id="commandName"
                        value={newCommand.name}
                        onChange={(e) => setNewCommand({ ...newCommand, name: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="commandDescription">Description</Label>
                      <Input
                        id="commandDescription"
                        value={newCommand.description}
                        onChange={(e) => setNewCommand({ ...newCommand, description: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="commandNamespace">Namespace</Label>
                      <Input
                        id="commandNamespace"
                        value={newCommand.namespace}
                        onChange={(e) => setNewCommand({ ...newCommand, namespace: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Significance Level</Label>
                      <Select
                        value={newCommand.significance?.consequenceLevel}
                        onValueChange={(value) => setNewCommand({
                          ...newCommand,
                          significance: { ...newCommand.significance, consequenceLevel: value as any }
                        })}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select significance level" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="distress">Distress</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Parameters</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                          onClick={() => setShowNewParameterDialog(true)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Parameter
                        </Button>
                      </div>
                      <ScrollArea className="h-[200px] w-full rounded-md border border-gray-700 p-4">
                        <div className="space-y-2">
                          {newCommand.parameters?.map((param, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-md">
                              <div>
                                <span className="font-medium">{param.name}</span>
                                <span className="text-sm text-gray-400 ml-2">({param.type})</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                                onClick={() => {
                                  setNewCommand({
                                    ...newCommand,
                                    parameters: newCommand.parameters?.filter((_, i) => i !== index)
                                  });
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowNewCommandDialog(false)}
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (newCommand.name && newCommand.namespace) {
                          const command: YamcsCommand = {
                            ...newCommand,
                            id: `cmd-${Date.now()}`,
                            version: "1.0",
                            createdBy: "user",
                            lastModified: new Date().toISOString(),
                            parameters: newCommand.parameters || [],
                            constraints: newCommand.constraints || [],
                            verifiers: newCommand.verifiers || []
                          } as YamcsCommand;
                          setYamcsCommands(prev => [...prev, command]);
                          setShowNewCommandDialog(false);
                          setNewCommand({
                            name: "",
                            description: "",
                            namespace: "",
                            parameters: [],
                            significance: { consequenceLevel: "normal" },
                            constraints: [],
                            verifiers: []
                          });
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-600"
                      disabled={!newCommand.name || !newCommand.namespace}
                    >
                      Create Command
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* New Parameter Dialog */}
              <Dialog open={showNewParameterDialog} onOpenChange={setShowNewParameterDialog}>
                <DialogContent className="bg-gray-800 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-medium">Add Parameter</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="paramName">Parameter Name</Label>
                      <Input
                        id="paramName"
                        value={newParameter.name}
                        onChange={(e) => setNewParameter({ ...newParameter, name: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Parameter Type</Label>
                      <Select
                        value={newParameter.type}
                        onValueChange={(value) => setNewParameter({ ...newParameter, type: value as any })}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select parameter type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="integer">Integer</SelectItem>
                          <SelectItem value="float">Float</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="enum">Enum</SelectItem>
                          <SelectItem value="time">Time</SelectItem>
                          <SelectItem value="binary">Binary</SelectItem>
                          <SelectItem value="aggregate">Aggregate</SelectItem>
                          <SelectItem value="array">Array</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paramDescription">Description</Label>
                      <Input
                        id="paramDescription"
                        value={newParameter.description}
                        onChange={(e) => setNewParameter({ ...newParameter, description: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="paramRequired"
                        checked={newParameter.required}
                        onCheckedChange={(checked) => setNewParameter({ ...newParameter, required: checked })}
                      />
                      <Label htmlFor="paramRequired">Required</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowNewParameterDialog(false)}
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (newParameter.name && newParameter.type) {
                          setNewCommand({
                            ...newCommand,
                            parameters: [...(newCommand.parameters || []), newParameter as YamcsParameter]
                          });
                          setShowNewParameterDialog(false);
                          setNewParameter({
                            name: "",
                            type: "string",
                            description: "",
                            required: false
                          });
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-600"
                      disabled={!newParameter.name || !newParameter.type}
                    >
                      Add Parameter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredYamcsCommands.map((command) => {
                  const isYamcsCommand = 'namespace' in command;
                  const risk = isYamcsCommand 
                    ? command.significance?.consequenceLevel?.toUpperCase() || "NORMAL"
                    : (command as CommandOption).risk.toUpperCase();
                  const category = isYamcsCommand ? command.namespace : (command as CommandOption).category;
                  
                  return (
                    <Button
                      key={command.id}
                      variant={
                        (selectedCommand?.id === command.id || selectedYamcsCommand?.id === command.id) ? "default" : "outline"
                      }
                      className="justify-start h-auto py-3 px-4 text-left flex flex-col items-start"
                      onClick={() => {
                        if (isYamcsCommand) {
                          setSelectedYamcsCommand(command as YamcsCommand);
                          setSelectedCommand(null);
                        } else {
                          setSelectedCommand(command as CommandOption);
                          setSelectedYamcsCommand(null);
                        }
                      }}
                    >
                      <div className="flex justify-between w-full items-center">
                        <span className="font-medium">{command.name}</span>
                        <Badge className={cn(
                          isYamcsCommand
                            ? command.significance?.consequenceLevel === "critical" ? "bg-red-500/10 text-red-500" :
                              command.significance?.consequenceLevel === "warning" ? "bg-amber-500/10 text-amber-500" :
                              "bg-emerald-500/10 text-emerald-500"
                            : getRiskBadgeColor((command as CommandOption).risk)
                        )}>
                          {risk}
                        </Badge>
                      </div>
                      <span className="text-xs mt-1 text-gray-400">
                        {command.description}
                      </span>
                      <div className="flex items-center mt-2 w-full justify-between">
                        <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                          {category}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-blue-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isYamcsCommand) {
                                setCommandQueue(queue => [...queue, {
                                  id: `queue-${Date.now()}`,
                                  name: command.name,
                                  namespace: command.namespace,
                                  command: command as YamcsCommand,
                                  parameters: {},
                                  priority: 1,
                                  constraints: command.constraints || [],
                                  verifiers: command.verifiers || [],
                                  comments: ""
                                }]);
                              }
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-yellow-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavoriteCommand(command.id);
                            }}
                          >
                            <Star className={`h-4 w-4 ${command.isFavorite ? "text-yellow-400 fill-yellow-400" : ""}`} />
                          </Button>
                        </div>
                      </div>
                    </Button>
                  );
                })}
          </div>

              {(selectedCommand || selectedYamcsCommand) && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2">{selectedCommand?.name || selectedYamcsCommand?.name}</span>
                        <Badge className={cn(
                          selectedYamcsCommand
                            ? selectedYamcsCommand.significance?.consequenceLevel === "critical" ? "bg-red-500/10 text-red-500" :
                              selectedYamcsCommand.significance?.consequenceLevel === "warning" ? "bg-amber-500/10 text-amber-500" :
                              "bg-emerald-500/10 text-emerald-500"
                            : getRiskBadgeColor(selectedCommand?.risk || "low")
                        )}>
                          {selectedYamcsCommand
                            ? selectedYamcsCommand.significance?.consequenceLevel.toUpperCase() || "NORMAL"
                            : selectedCommand?.risk.toUpperCase() || "LOW"
                          }
                        </Badge>
                      </div>
                      <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
                        {selectedYamcsCommand ? selectedYamcsCommand.namespace : selectedCommand?.category}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 mb-4">{selectedCommand?.description || selectedYamcsCommand?.description}</p>
                    
                    {selectedYamcsCommand?.significance?.reasonForWarning && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-md mb-4">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <div>
                            <h4 className="text-sm font-medium text-amber-500">Warning</h4>
                            <p className="text-xs text-gray-300 mt-1">
                              {selectedYamcsCommand.significance.reasonForWarning}
                            </p>
                          </div>
                        </div>
                </div>
              )}

                    {selectedYamcsCommand && (
                      <div className="space-y-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Add command comments..."
                            className="flex-1 bg-gray-700 border-gray-600 text-white"
                            value={yamcsCommandComments}
                            onChange={(e) => setYamcsCommandComments(e.target.value)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                            onClick={() => setShowYamcsHistory(true)}
                          >
                            <History className="h-4 w-4 mr-1" />
                            History
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                            onClick={() => setShowYamcsVerification(true)}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
            </div>
                        
                        {selectedYamcsCommand.aliases && selectedYamcsCommand.aliases.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {selectedYamcsCommand.aliases.map((alias) => (
                              <Badge key={alias} variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
                                {alias}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {(selectedCommand?.parameters || selectedYamcsCommand?.parameters) && (
                      <div className="space-y-4 mb-4">
                        <h3 className="text-sm font-medium text-white">Parameters</h3>
                        {(selectedCommand?.parameters || selectedYamcsCommand?.parameters)?.map((param) => (
                          <div key={'id' in param ? param.id : param.name} className="space-y-2">
                            <Label htmlFor={'id' in param ? param.id : param.name} className="text-sm text-gray-300">
                              {'id' in param ? param.label : param.name}
                              {param.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            <p className="text-xs text-gray-400">{param.description}</p>
                            
                            {'id' in param && param.type === "number" && (
                              <Input
                                id={param.id}
                                type="number"
                                min={param.min}
                                max={param.max}
                                step={param.step}
                                value={commandParameters[param.id] ?? param.defaultValue}
                                onChange={(e) => setCommandParameters({
                                  ...commandParameters,
                                  [param.id]: parseFloat(e.target.value)
                                })}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            )}
                            
                            {'id' in param && param.type === "boolean" && (
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id={param.id}
                                  checked={commandParameters[param.id] ?? param.defaultValue}
                                  onCheckedChange={(checked: boolean) => setCommandParameters({
                                    ...commandParameters,
                                    [param.id]: checked
                                  })}
                                />
                                <Label htmlFor={param.id} className="text-sm text-gray-300">
                                  {commandParameters[param.id] ?? param.defaultValue ? "Enabled" : "Disabled"}
                                </Label>
                              </div>
                            )}
                            
                            {'id' in param && param.type === "string" && (
                              <Input
                                id={param.id}
                                value={commandParameters[param.id] ?? param.defaultValue}
                                onChange={(e) => setCommandParameters({
                                  ...commandParameters,
                                  [param.id]: e.target.value
                                })}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            )}
                            
                            {'id' in param && param.type === "select" && (
                              <Select
                                value={commandParameters[param.id] ?? param.defaultValue}
                                onValueChange={(value) => setCommandParameters({
                                  ...commandParameters,
                                  [param.id]: value
                                })}
                              >
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                  <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                  {param.options?.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            
                            
                            {'id' in param && param.type === "slider" && (
                              <div className="space-y-2">
                                <Slider
                                  min={param.min}
                                  max={param.max}
                                  step={param.step}
                                  value={[commandParameters[param.id] ?? param.defaultValue]}
                                  onValueChange={(value: number[]) => setCommandParameters({
                                    ...commandParameters,
                                    [param.id]: value[0]
                                  })}
                                  className="py-2"
                                />
                                <div className="flex justify-between text-xs text-gray-400">
                                  <span>{param.min}</span>
                                  <span>{commandParameters[param.id] ?? param.defaultValue}</span>
                                  <span>{param.max}</span>
                                </div>
                              </div>
                            )}
                            
                            {!('id' in param) && param.type === "integer" && (
                              <Input
                                id={param.name}
                                type="number"
                                min={param.min}
                                max={param.max}
                                value={yamcsCommandParameters[param.name] ?? param.defaultValue ?? ""}
                                onChange={(e) => setYamcsCommandParameters({
                                  ...yamcsCommandParameters,
                                  [param.name]: parseInt(e.target.value)
                                })}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            )}
                            
                            {!('id' in param) && param.type === "float" && (
                              <Input
                                id={param.name}
                                type="number"
                                min={param.min}
                                max={param.max}
                                step="0.1"
                                value={yamcsCommandParameters[param.name] ?? param.defaultValue ?? ""}
                                onChange={(e) => setYamcsCommandParameters({
                                  ...yamcsCommandParameters,
                                  [param.name]: parseFloat(e.target.value)
                                })}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            )}
                            
                            {!('id' in param) && param.type === "enum" && (
                              <Select
                                value={yamcsCommandParameters[param.name] ?? param.defaultValue ?? ""}
                                onValueChange={(value) => setYamcsCommandParameters({
                                  ...yamcsCommandParameters,
                                  [param.name]: value
                                })}
                              >
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                  <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                  {param.enumValues?.map((value) => (
                                    <SelectItem key={value} value={value}>
                                      {value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            
                            {'units' in param && param.units && (
                              <p className="text-xs text-gray-400 mt-1">Units: {param.units}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-4">
            <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        onClick={() => {
                          setSelectedCommand(null);
                          setSelectedYamcsCommand(null);
                          setCommandParameters({});
                          setYamcsCommandParameters({});
                          setYamcsCommandComments("");
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                      
                      <div className="flex items-center space-x-2">
                        {selectedYamcsCommand && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                              onClick={() => {
                                setCommandQueue(queue => [...queue, {
                                  id: `queue-${Date.now()}`,
                                  name: selectedYamcsCommand.name,
                                  namespace: selectedYamcsCommand.namespace,
                                  command: selectedYamcsCommand,
                                  parameters: yamcsCommandParameters,
                                  priority: 1,
                                  constraints: selectedYamcsCommand.constraints || [],
                                  verifiers: selectedYamcsCommand.verifiers || [],
                                  comments: yamcsCommandComments || ""
                                }]);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add to Queue
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                              onClick={() => setShowNewTemplateDialog(true)}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save as Template
                            </Button>
                          </>
                        )}
                        <Button
                          onClick={selectedYamcsCommand ? executeYamcsCommand : executeCommand}
                          disabled={isExecuting || isYamcsExecuting}
              className="flex items-center"
            >
              <Send className="mr-2 h-4 w-4" />
                          {isExecuting || isYamcsExecuting ? "Executing..." : "Execute Command"}
            </Button>
          </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {showYamcsHistory && selectedYamcsCommand && (
                <Card className="bg-gray-800 border-gray-700 mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <History className="h-5 w-5 mr-2 text-blue-400" />
                        Command History
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setShowYamcsHistory(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] w-full rounded-md border border-gray-700 p-4">
                      <div className="space-y-4">
                        {yamcsCommandHistory
                          .filter(hist => hist.commandId === selectedYamcsCommand.id)
                          .map((history) => (
                            <div key={history.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Badge className={getStatusBadgeColor(history.status)}>
                                    {history.status.toUpperCase()}
                                  </Badge>
                                  <span className="text-sm text-gray-300">
                                    {format(new Date(history.timestamp), "yyyy-MM-dd HH:mm:ss")}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-400">
                                  by {history.username}
                                </span>
                              </div>
                              {history.comments && (
                                <p className="text-sm text-gray-400">{history.comments}</p>
                              )}
                              <div className="text-xs text-gray-500">
                                <div>Sequence: {history.sequenceNumber}</div>
                                <div>Origin: {history.origin}</div>
                                <div>Hex: {history.hex}</div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {showYamcsVerification && selectedYamcsCommand && (
                <Dialog open={showYamcsVerification} onOpenChange={setShowYamcsVerification}>
                  <DialogContent className="bg-gray-800 border-gray-700 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-medium">Command Verification</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-md">
                        <div className="flex items-start">
                          <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-500">Command Details</h4>
                            <p className="text-xs text-gray-300 mt-1">
                              Please verify the following command details before execution:
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Command:</span>
                          <span className="text-sm text-white">{selectedYamcsCommand.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Namespace:</span>
                          <span className="text-sm text-white">{selectedYamcsCommand.namespace}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Significance:</span>
                          <span className="text-sm text-white">
                            {selectedYamcsCommand.significance?.consequenceLevel.toUpperCase() || "NORMAL"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-white">Parameters</h4>
                        {Object.entries(yamcsCommandParameters).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-sm text-gray-400">{key}:</span>
                            <span className="text-sm text-white">{value}</span>
                          </div>
                        ))}
                      </div>
                      
                      {yamcsCommandComments && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-white">Comments</h4>
                          <p className="text-sm text-gray-300">{yamcsCommandComments}</p>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowYamcsVerification(false)}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          setShowYamcsVerification(false);
                          executeYamcsCommand();
                        }}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Confirm & Execute
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </TabsContent>
            
            <TabsContent value="sequences" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Command Sequences</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  onClick={() => {
                    const name = prompt("Enter new sequence name:");
                    if (name) {
                      const description = prompt("Enter sequence description:");
                      const newSequence: CommandSequence = {
                        id: `seq-${Math.floor(Math.random() * 1000)}`,
                        name,
                        description: description || "",
                        commands: [],
                        createdAt: new Date().toISOString(),
                        isFavorite: false,
                      };
                      setCommandSequences(prev => [...prev, newSequence]);
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Sequence
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commandSequences.map((sequence) => (
                  <Card key={sequence.id} className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium text-white flex items-center justify-between">
                        <div className="flex items-center">
                          <List className="h-5 w-5 mr-2 text-purple-400" />
                          {sequence.name}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-yellow-400"
                            onClick={() => toggleFavoriteSequence(sequence.id)}
                          >
                            <Star className={`h-4 w-4 ${sequence.isFavorite ? "text-yellow-400 fill-yellow-400" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-red-400"
                            onClick={() => deleteCommandSequence(sequence.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300 mb-4">{sequence.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <h4 className="text-sm font-medium text-white">Commands</h4>
                        {sequence.commands.length === 0 ? (
                          <p className="text-xs text-gray-400">No commands in this sequence</p>
                        ) : (
                          <div className="space-y-2">
                            {sequence.commands.map((cmd, index) => {
                              const command = commandOptions.find(c => c.id === cmd.commandId) as CommandOption | undefined;
                              const risk = command?.risk || "low";
                              const category = command?.category || "unknown";
                              return (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                                  <div>
                                    <span className="text-sm font-medium text-white">
                                      {index + 1}. {command?.name || "Unknown Command"}
                                    </span>
                                    {cmd.delayAfter && cmd.delayAfter > 0 && (
                                      <span className="text-xs text-gray-400 ml-2">
                                        +{cmd.delayAfter}s delay
                                      </span>
                                    )}
                                  </div>
                                  <Badge className={cn(getRiskBadgeColor(risk))}>
                                    {risk.toUpperCase()}
                                  </Badge>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                          onClick={() => {
                            setSelectedSequence(sequence);
                            setCurrentSequenceStep(0);
                          }}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        
                        <div className="flex items-center space-x-2">
                          {isSequenceRunning && selectedSequence?.id === sequence.id ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                onClick={pauseSequence}
                              >
                                <Pause className="h-4 w-4 mr-1" />
                                Pause
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-600/20 border-red-600/30 text-red-400 hover:bg-red-600/30"
                                onClick={stopSequence}
                              >
                                <AlertOctagon className="h-4 w-4 mr-1" />
                                Stop
                              </Button>
                            </>
                          ) : selectedSequence?.id === sequence.id && !isSequenceRunning ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                              onClick={resumeSequence}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Resume
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                              onClick={() => runCommandSequence(sequence)}
                              disabled={sequence.commands.length === 0}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Run Sequence
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {isSequenceRunning && selectedSequence?.id === sequence.id && (
                        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-md">
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-blue-500 mr-2" />
                            <div>
                              <h4 className="text-sm font-medium text-blue-500">Sequence Running</h4>
                              <p className="text-xs text-gray-300 mt-1">
                                Step {currentSequenceStep + 1} of {sequence.commands.length}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="scheduled" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Scheduled Commands</h3>
              </div>
              
              {scheduledCommands.length === 0 ? (
                <div className="p-8 text-center bg-gray-800 rounded-lg border border-gray-700">
                  <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Scheduled Commands</h3>
                  <p className="text-sm text-gray-400 max-w-md mx-auto">
                    Schedule commands to be executed at a specific time. Scheduled commands will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scheduledCommands.map((command) => (
                    <Card key={command.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-white">{command.name}</span>
                              <Badge className={cn("ml-2", getRiskBadgeColor(command.risk))}>
                                {command.risk.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-300 mt-1">{command.details}</p>
                          </div>
                          <span className="text-xs text-white">
                            {command.timestamp}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="telemetry" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Real-time Telemetry</h3>
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-400 mr-1"></div>
                    Live
                  </div>
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium text-white flex items-center">
                      <Satellite className="h-4 w-4 mr-2 text-blue-400" />
                      Attitude
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Pitch</span>
                        <span className="text-sm font-medium text-white">{telemetryData.attitude.pitch.toFixed(2)}°</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Roll</span>
                        <span className="text-sm font-medium text-white">{telemetryData.attitude.roll.toFixed(2)}°</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Yaw</span>
                        <span className="text-sm font-medium text-white">{telemetryData.attitude.yaw.toFixed(2)}°</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium text-white flex items-center">
                      <Battery className="h-4 w-4 mr-2 text-green-400" />
                      Power
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Battery Level</span>
                        <span className="text-sm font-medium text-white">{telemetryData.power.batteryLevel.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Solar Panel Efficiency</span>
                        <span className="text-sm font-medium text-white">{telemetryData.power.solarPanelEfficiency.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Power Consumption</span>
                        <span className="text-sm font-medium text-white">{telemetryData.power.powerConsumption.toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium text-white flex items-center">
                      <Thermometer className="h-4 w-4 mr-2 text-amber-400" />
                      Thermal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Temperature</span>
                        <span className="text-sm font-medium text-white">{telemetryData.thermal.temperature.toFixed(1)}°C</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Heat Sink Efficiency</span>
                        <span className="text-sm font-medium text-white">{telemetryData.thermal.heatSinkEfficiency.toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium text-white flex items-center">
                      <Wifi className="h-4 w-4 mr-2 text-purple-400" />
                      Communications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Signal Strength</span>
                        <span className="text-sm font-medium text-white">{telemetryData.comms.signalStrength.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Data Rate</span>
                        <span className="text-sm font-medium text-white">{telemetryData.comms.dataRate.toFixed(0)} kbps</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Link Quality</span>
                        <span className="text-sm font-medium text-white">{telemetryData.comms.linkQuality.toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium text-white flex items-center">
                      <Cpu className="h-4 w-4 mr-2 text-blue-400" />
                      Payload
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Status</span>
                        <Badge className={cn(
                          telemetryData.payload.status === "nominal" ? "bg-green-500/10 text-green-400 border-green-500/30" :
                          telemetryData.payload.status === "degraded" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                          "bg-red-500/10 text-red-400 border-red-500/30"
                        )}>
                          {telemetryData.payload.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Storage Used</span>
                        <span className="text-sm font-medium text-white">{telemetryData.payload.storageUsed.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Active Instruments</span>
                        <span className="text-sm font-medium text-white">
                          {telemetryData.payload.activeInstruments.join(", ")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium text-white flex items-center">
                      <Radio className="h-4 w-4 mr-2 text-blue-400" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Last Update</span>
                        <span className="text-sm font-medium text-white">
                          {format(new Date(telemetryData.timestamp), "HH:mm:ss")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Command Center</span>
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                          ACTIVE
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Emergency Abort</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-600/20 border-red-600/30 text-red-400 hover:bg-red-600/30"
                          onClick={() => setIsAborting(true)}
                        >
                          <AlertOctagon className="h-4 w-4 mr-1" />
                          ABORT
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

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
      
      {/* Emergency Abort Dialog */}
      {isAborting && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-red-500 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-red-500">
                <AlertOctagon className="mr-2 h-5 w-5" />
                Emergency Abort
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white mb-4">
                Are you sure you want to abort all current operations? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  onClick={() => setIsAborting(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    abortCommand();
                    setIsAborting(false);
                  }}
                >
                  Confirm Abort
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CommandCenter;

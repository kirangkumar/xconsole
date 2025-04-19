export interface CommandCenterProps {
  satelliteId: string;
  onCommandExecuted?: (log: CommandLog) => void;
}

export interface CommandLog {
  id: string;
  name: string;
  status: "pending" | "success" | "failed";
  timestamp: string;
  details: string;
  category: string;
  risk: string;
  parameters: Record<string, any>;
}

export interface CommandOption {
  id: string;
  name: string;
  description: string;
  category: string;
  risk: string;
  parameters: CommandParameter[];
  executionTime: number;
  requiresConfirmation: boolean;
  abortable?: boolean;
  isFavorite?: boolean;
}

export interface CommandParameter {
  id: string;
  name: string;
  type: string;
  label: string;
  description: string;
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

export interface YamcsCommand {
  id: string;
  name: string;
  description: string;
  namespace: string;
  parameters: YamcsParameter[];
  aliases?: string[];
  shortDescription?: string;
  longDescription?: string;
  significance?: YamcsSignificance;
  abstract?: boolean;
  deprecated?: boolean;
  constraints?: YamcsCommandConstraint[];
  verifiers?: YamcsCommandVerifier[];
  category?: string;
  tags?: string[];
  version?: string;
  lastModified?: string;
  createdBy?: string;
  isFavorite?: boolean;
}

export interface YamcsParameter {
  name: string;
  type: YamcsParameterType;
  description?: string;
  required?: boolean;
  defaultValue?: any;
  units?: string;
  min?: number;
  max?: number;
  enumValues?: string[];
  array?: boolean;
  arrayCount?: number;
  arrayMinSize?: number;
  arrayMaxSize?: number;
  deprecated?: boolean;
}

export type YamcsParameterType = 
  | "string" 
  | "integer" 
  | "float" 
  | "boolean" 
  | "enum" 
  | "time" 
  | "binary" 
  | "aggregate" 
  | "array";

export interface YamcsSignificance {
  consequenceLevel: "normal" | "warning" | "distress" | "critical" | "severe";
  reasonForWarning?: string;
}

export interface YamcsCommandConstraint {
  id: string;
  name: string;
  description: string;
  type: "pre" | "post" | "both";
  expression: string;
  errorMessage: string;
}

export interface YamcsCommandVerifier {
  id: string;
  name: string;
  description: string;
  type: "telemetry" | "command" | "timeout";
  timeout?: number;
  condition: string;
  errorMessage: string;
}

export interface YamcsCommandHistory {
  id: string;
  commandId: string;
  commandName: string;
  status: "pending" | "success" | "failed" | "aborted" | "rejected" | "expired";
  timestamp: string;
  username: string;
  parameters: Record<string, any>;
  comments?: string;
  source: string;
  sequenceNumber: number;
  generationTime: string;
  origin: string;
  hex: string;
  verifications: YamcsCommandVerification[];
  constraints: YamcsCommandConstraintResult[];
}

export interface YamcsCommandVerification {
  verifierId: string;
  status: "success" | "failed" | "timeout";
  message: string;
  timestamp: string;
}

export interface YamcsCommandConstraintResult {
  constraintId: string;
  passed: boolean;
  message: string;
  timestamp: string;
}

export interface CommandTemplate {
  id: string;
  name: string;
  description: string;
  command: YamcsCommand;
  parameters: Record<string, any>;
  namespace: string;
  version: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  tags?: string[];
  isPublic: boolean;
}

export interface QueuedCommand {
  id: string;
  name: string;
  namespace: string;
  command: YamcsCommand;
  parameters: Record<string, any>;
  priority: number;
  scheduledTime?: string;
}

export interface CommandChain {
  id: string;
  name: string;
  description: string;
  commands: CommandChainItem[];
  abortOnFailure?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

export interface CommandChainItem {
  commandId: string;
  parameters?: Record<string, any>;
  delayAfter?: number;
  constraints?: YamcsCommandConstraint[];
  verifiers?: YamcsCommandVerifier[];
  retryCount?: number;
  retryDelay?: number;
}

export interface TelemetryData {
  timestamp: string;
  attitude: {
    pitch: number;
    roll: number;
    yaw: number;
  };
  power: {
    batteryLevel: number;
    solarPanelEfficiency: number;
    powerConsumption: number;
  };
  thermal: {
    temperature: number;
    heatSinkEfficiency: number;
  };
  comms: {
    signalStrength: number;
    dataRate: number;
    linkQuality: number;
  };
  payload: {
    status: string;
    storageUsed: number;
    activeInstruments: string[];
  };
}

export interface CommandSequenceItem {
  commandId: string;
  parameters?: Record<string, any>;
  delayAfter?: number;
}

export interface CommandSequence {
  id: string;
  name: string;
  description: string;
  commands: CommandSequenceItem[];
  createdAt: string;
  isFavorite: boolean;
} 
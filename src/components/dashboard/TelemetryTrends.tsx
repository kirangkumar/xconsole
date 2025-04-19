import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RefreshCw, ZoomIn, Download, Filter } from "lucide-react";

interface TelemetryData {
  timestamp: string;
  [key: string]: number | string;
}

interface TelemetryTrendsProps {
  data?: TelemetryData[];
  satellites?: string[];
  metrics?: string[];
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  onRefresh?: () => void;
  onSatelliteFilter?: (satellite: string) => void;
  onMetricChange?: (metric: string) => void;
  className?: string;
}

const defaultSatellites = [
  "Optical-1",
  "Radar-1",
  "Varuna-1",
  "Meteo-1",
  "Optical-2",
  "Radar-2",
  "Varuna-2",
  "Meteo-2",
];

const defaultMetrics = [
  "temperature",
  "bufferCapacity",
  "linkMargin",
  "pitchDeviation",
  "batteryLevel",
];

const defaultTimeRanges = [
  "Last 15 minutes",
  "Last hour",
  "Last 6 hours",
  "Last 24 hours",
  "Last 7 days",
];

// Generate mock data
const generateMockData = (): TelemetryData[] => {
  const data: TelemetryData[] = [];
  const now = new Date();

  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(
      now.getTime() - (23 - i) * 15 * 60000,
    ).toISOString();
    const entry: TelemetryData = { timestamp: timestamp.substring(11, 16) }; // HH:MM format

    defaultSatellites.forEach((sat) => {
      // Temperature: 60-85°C with some variation
      entry[`${sat}_temperature`] =
        60 + Math.random() * 25 + (sat === "Optical-1" ? 5 : 0);

      // Buffer capacity: 30-95%
      entry[`${sat}_bufferCapacity`] =
        30 + Math.random() * 65 + (sat === "Meteo-1" ? 15 : 0);

      // Link margin: 40-90%
      entry[`${sat}_linkMargin`] =
        40 + Math.random() * 50 + (sat === "Varuna-1" ? -15 : 0);

      // Pitch deviation: 0-0.5°
      entry[`${sat}_pitchDeviation`] =
        Math.random() * 0.5 + (sat === "Radar-1" ? 0.2 : 0);

      // Battery level: 60-100%
      entry[`${sat}_batteryLevel`] = 60 + Math.random() * 40;
    });

    data.push(entry);
  }

  return data;
};

const defaultData = generateMockData();

const TelemetryTrends: React.FC<TelemetryTrendsProps> = ({
  data = defaultData,
  satellites = defaultSatellites,
  metrics = defaultMetrics,
  timeRange = "Last hour",
  onTimeRangeChange = () => {},
  onRefresh = () => {},
  onSatelliteFilter = () => {},
  onMetricChange = () => {},
  className,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>(metrics[0]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>(timeRange);
  const [highlightedSatellite, setHighlightedSatellite] = useState<string | null>(
    null
  );
  const [filteredSatellites, setFilteredSatellites] =
    useState<string[]>(satellites);

  const handleMetricChange = (value: string) => {
    setSelectedMetric(value);
    onMetricChange(value);
  };

  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value);
    onTimeRangeChange(value);
  };

  const handleRefresh = () => {
    onRefresh();
  };

  const handleLineClick = (satellite: string) => {
    onSatelliteFilter(satellite);
    if (filteredSatellites.length === satellites.length) {
      setFilteredSatellites([satellite]);
    } else if (
      filteredSatellites.length === 1 &&
      filteredSatellites[0] === satellite
    ) {
      setFilteredSatellites(satellites);
    } else {
      setFilteredSatellites([satellite]);
    }
  };

  const handleLineMouseOver = (satellite: string) => {
    setHighlightedSatellite(satellite);
  };

  const handleLineMouseOut = () => {
    setHighlightedSatellite(null);
  };

  // Color palette for satellites
  const satelliteColors = {
    "Optical-1": "#FF5733", // Orange-red
    "Radar-1": "#33FF57", // Green
    "Varuna-1": "#3357FF", // Blue
    "Meteo-1": "#F033FF", // Purple
    "Optical-2": "#FF33A8", // Pink
    "Radar-2": "#33FFF0", // Cyan
    "Varuna-2": "#FFF033", // Yellow
    "Meteo-2": "#FF8C33", // Light Orange
  };

  // Units for different metrics
  const metricUnits = {
    temperature: "°C",
    bufferCapacity: "%",
    linkMargin: "%",
    pitchDeviation: "°",
    batteryLevel: "%",
  };

  // Metric display names
  const metricDisplayNames = {
    temperature: "Temperature",
    bufferCapacity: "Buffer Capacity",
    linkMargin: "Link Margin",
    pitchDeviation: "Pitch Deviation",
    batteryLevel: "Battery Level",
  };

  return (
    <Card
      className={cn(
        "w-full h-full bg-[#151B2B] border-slate-800 text-white",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-white">
            Telemetry Trends
          </CardTitle>
          <div className="flex space-x-2">
            <Select value={selectedMetric} onValueChange={handleMetricChange}>
              <SelectTrigger className="w-[180px] bg-[#1A2235] border-slate-700 text-sm text-white">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A2235] border-slate-700 text-white">
                {metrics.map((metric) => (
                  <SelectItem
                    key={metric}
                    value={metric}
                    className="text-white hover:bg-slate-700"
                  >
                    {metricDisplayNames[metric as keyof typeof metricDisplayNames]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedTimeRange}
              onValueChange={handleTimeRangeChange}
            >
              <SelectTrigger className="w-[180px] bg-[#1A2235] border-slate-700 text-sm text-white">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A2235] border-slate-700 text-white">
                {defaultTimeRanges.map((range) => (
                  <SelectItem
                    key={range}
                    value={range}
                    className="text-white hover:bg-slate-700"
                  >
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-[#1A2235] border-slate-700 hover:bg-slate-700"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1A2235] text-white">
                  <p>Refresh data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-[#1A2235] border-slate-700 hover:bg-slate-700"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1A2235] text-white">
                  <p>Zoom in</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-[#1A2235] border-slate-700 hover:bg-slate-700"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1A2235] text-white">
                  <p>Export data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "bg-[#1A2235] border-slate-700 hover:bg-slate-700",
                      filteredSatellites.length !== satellites.length &&
                        "bg-blue-900 border-blue-700"
                    )}
                    onClick={() => setFilteredSatellites(satellites)}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1A2235] text-white">
                  <p>Reset filters</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
              <XAxis
                dataKey="timestamp"
                stroke="#718096"
                tick={{ fill: "#E2E8F0" }}
                tickLine={{ stroke: "#718096" }}
              />
              <YAxis
                stroke="#718096"
                tick={{ fill: "#E2E8F0" }}
                tickLine={{ stroke: "#718096" }}
                domain={["auto", "auto"]}
                label={{
                  value: `${
                    metricDisplayNames[selectedMetric as keyof typeof metricDisplayNames]
                  } (${metricUnits[selectedMetric as keyof typeof metricUnits] || ""})`,
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#E2E8F0" },
                }}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "#1A2235",
                  border: "1px solid #2D3748",
                  color: "white",
                }}
                labelStyle={{ color: "white" }}
                formatter={(value: number, name: string) => {
                  const satellite = name.split("_")[0];
                  return [
                    `${value.toFixed(2)} ${
                      metricUnits[selectedMetric as keyof typeof metricUnits] || ""
                    }`,
                    satellite,
                  ];
                }}
              />
              <Legend
                formatter={(value: any) => {
                  if (typeof value === "string") {
                    return value.split("_")[0];
                  }
                  return value;
                }}
                onClick={(e: any) => handleLineClick(e.dataKey.toString().split("_")[0])}
              />
              {filteredSatellites.map((satellite) => (
                <Line
                  key={satellite}
                  type="monotone"
                  dataKey={`${satellite}_${selectedMetric}`}
                  stroke={
                    satelliteColors[satellite as keyof typeof satelliteColors]
                  }
                  strokeWidth={
                    highlightedSatellite === satellite
                      ? 3
                      : highlightedSatellite
                      ? 1
                      : 2
                  }
                  dot={false}
                  activeDot={{ r: 6 }}
                  opacity={
                    highlightedSatellite === null ||
                    highlightedSatellite === satellite
                      ? 1
                      : 0.3
                  }
                  onMouseOver={() => handleLineMouseOver(satellite)}
                  onMouseOut={handleLineMouseOut}
                  onClick={() => handleLineClick(satellite)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelemetryTrends;

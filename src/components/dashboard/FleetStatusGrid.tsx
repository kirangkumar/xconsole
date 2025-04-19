import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import SatelliteStatusPanel from "./SatelliteStatusPanel";

interface FleetStatusGridProps {
  satellites?: SatelliteData[];
  onSatelliteClick?: (id: string) => void;
  className?: string;
}

interface SatelliteData {
  id: string;
  name: string;
  temperature: {
    value: number;
    status: "normal" | "warning" | "critical";
    unit: string;
  };
  attitude: {
    status: "normal" | "warning" | "critical";
    deviation?: string;
  };
  downlink: {
    status: "normal" | "warning" | "critical";
    latency?: string;
  };
  buffer: {
    percentage: number;
    status: "normal" | "warning" | "critical";
  };
  alerts: string[];
}

const defaultSatellites: SatelliteData[] = [
  {
    id: "OPT-1",
    name: "Optical-1",
    temperature: {
      value: 76.2,
      status: "warning",
      unit: "°C",
    },
    attitude: {
      status: "normal",
      deviation: "0.1°",
    },
    downlink: {
      status: "normal",
      latency: "120ms",
    },
    buffer: {
      percentage: 68,
      status: "normal",
    },
    alerts: ["Temperature rising", "Imaging task rerouted"],
  },
  {
    id: "SAR-1",
    name: "Radar-1",
    temperature: {
      value: 65.4,
      status: "normal",
      unit: "°C",
    },
    attitude: {
      status: "warning",
      deviation: "0.3°",
    },
    downlink: {
      status: "normal",
      latency: "105ms",
    },
    buffer: {
      percentage: 42,
      status: "normal",
    },
    alerts: ["Attitude anomaly detected"],
  },
  {
    id: "COM-1",
    name: "Varuna-1",
    temperature: {
      value: 68.7,
      status: "normal",
      unit: "°C",
    },
    attitude: {
      status: "normal",
      deviation: "0.1°",
    },
    downlink: {
      status: "warning",
      latency: "320ms",
    },
    buffer: {
      percentage: 55,
      status: "normal",
    },
    alerts: ["Downlink latency increasing", "Link margin low"],
  },
  {
    id: "WTH-1",
    name: "Meteo-1",
    temperature: {
      value: 71.3,
      status: "normal",
      unit: "°C",
    },
    attitude: {
      status: "normal",
      deviation: "0.1°",
    },
    downlink: {
      status: "normal",
      latency: "110ms",
    },
    buffer: {
      percentage: 92,
      status: "warning",
    },
    alerts: ["Data buffer 92% full", "Prioritizing anomaly packets"],
  },
  {
    id: "OPT-2",
    name: "Optical-2",
    temperature: {
      value: 67.8,
      status: "normal",
      unit: "°C",
    },
    attitude: {
      status: "normal",
      deviation: "0.1°",
    },
    downlink: {
      status: "normal",
      latency: "115ms",
    },
    buffer: {
      percentage: 38,
      status: "normal",
    },
    alerts: [],
  },
  {
    id: "SAR-2",
    name: "Radar-2",
    temperature: {
      value: 69.5,
      status: "normal",
      unit: "°C",
    },
    attitude: {
      status: "normal",
      deviation: "0.1°",
    },
    downlink: {
      status: "normal",
      latency: "125ms",
    },
    buffer: {
      percentage: 45,
      status: "normal",
    },
    alerts: [],
  },
  {
    id: "COM-2",
    name: "Varuna-2",
    temperature: {
      value: 82.1,
      status: "critical",
      unit: "°C",
    },
    attitude: {
      status: "normal",
      deviation: "0.1°",
    },
    downlink: {
      status: "normal",
      latency: "130ms",
    },
    buffer: {
      percentage: 60,
      status: "normal",
    },
    alerts: ["Critical temperature alert", "Thermal management active"],
  },
  {
    id: "WTH-2",
    name: "Meteo-2",
    temperature: {
      value: 66.9,
      status: "normal",
      unit: "°C",
    },
    attitude: {
      status: "normal",
      deviation: "0.1°",
    },
    downlink: {
      status: "normal",
      latency: "118ms",
    },
    buffer: {
      percentage: 72,
      status: "warning",
    },
    alerts: ["Buffer capacity warning"],
  },
];

const FleetStatusGrid = ({
  satellites = defaultSatellites,
  onSatelliteClick = () => {},
  className,
}: FleetStatusGridProps) => {
  const [filter, setFilter] = useState<string>("");

  // Filter satellites based on search input
  const filteredSatellites = satellites.filter(
    (sat) =>
      sat.id.toLowerCase().includes(filter.toLowerCase()) ||
      sat.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <Card
      className={cn(
        "bg-slate-900 border-slate-800 w-full h-fit",
        className,
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">
            Constellation Health
          </h2>
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search satellites..."
              className="w-full bg-slate-800 border-slate-700 text-white text-sm rounded-md pl-8 pr-4 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-auto h-fit pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSatellites.map((satellite) => (
              <SatelliteStatusPanel
                key={satellite.id}
                id={satellite.id}
                name={satellite.name}
                temperature={satellite.temperature}
                attitude={satellite.attitude}
                downlink={satellite.downlink}
                buffer={satellite.buffer}
                alerts={satellite.alerts}
                onClick={() => onSatelliteClick(satellite.id)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FleetStatusGrid;

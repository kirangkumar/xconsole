import React from 'react';
import { cn } from "@/lib/utils";

interface Satellite {
  name: string;
  type: string;
  status: 'critical' | 'degraded' | 'nominal';
  health: number;
}

interface SatelliteTableProps {
  satellites: Satellite[];
  className?: string;
}

const SatelliteTable: React.FC<SatelliteTableProps> = ({
  satellites,
  className
}) => {
  return (
    <div className={cn("bg-[#151B2B] rounded-lg p-4 w-full", className)}>
      <h2 className="text-lg font-semibold mb-4">Satellite Status</h2>
      <table className="w-full">
        <thead>
          <tr className="text-gray-400 text-sm">
            <th className="text-left pb-4">NAME</th>
            <th className="text-left pb-4">TYPE</th>
            <th className="text-left pb-4">STATUS</th>
            <th className="text-left pb-4">HEALTH</th>
          </tr>
        </thead>
        <tbody>
          {satellites.map((satellite) => (
            <tr key={satellite.name} className="border-t border-gray-800">
              <td className="py-4">{satellite.name}</td>
              <td className="py-4">{satellite.type}</td>
              <td className="py-4">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs",
                  satellite.status === "critical" && "bg-red-400/10 text-red-400",
                  satellite.status === "degraded" && "bg-yellow-400/10 text-yellow-400",
                  satellite.status === "nominal" && "bg-green-400/10 text-green-400"
                )}>
                  {satellite.status}
                </span>
              </td>
              <td className="py-4">
                <div className="w-24 bg-gray-800 rounded-full h-2">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      satellite.health > 80 && "bg-green-400",
                      satellite.health > 40 && satellite.health <= 80 && "bg-yellow-400",
                      satellite.health <= 40 && "bg-red-400"
                    )}
                    style={{ width: `${satellite.health}%` }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SatelliteTable; 
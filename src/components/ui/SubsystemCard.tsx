import React from 'react';
import { cn } from "@/lib/utils";

interface SubsystemStats {
  Nominal: number;
  Degraded: number;
  Critical: number;
  Offline: number;
}

interface SubsystemCardProps {
  name: string;
  icon: string;
  stats: SubsystemStats;
  className?: string;
}

const SubsystemCard: React.FC<SubsystemCardProps> = ({
  name,
  icon,
  stats,
  className
}) => {
  return (
    <div className={cn(
      "bg-[#1A2235] rounded-lg p-4 transition-all duration-200 hover:bg-[#1E2639]",
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        <span>{icon}</span>
        <h3 className="font-medium">{name}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {Object.entries(stats).map(([status, count]) => (
          <div key={status} className="flex justify-between">
            <span className="text-gray-400">{status}</span>
            <span>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubsystemCard; 
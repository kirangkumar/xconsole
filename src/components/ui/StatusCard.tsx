import React from 'react';
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const StatusCard = ({ title, value, subtitle, icon, onClick }: StatusCardProps) => {
  return (
    <div 
      className={cn(
        "bg-[#151B2B] rounded-lg p-4 cursor-pointer hover:bg-[#1A2235] transition-colors",
        "border border-slate-800"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="bg-[#1A2235] p-3 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatusCard; 
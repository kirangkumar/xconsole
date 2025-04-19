import React, { useState } from "react";
import { Bell, Settings, HelpCircle, Menu, BarChart, Brain, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import AICoPilotModule from "./AICoPilotModule";

interface HeaderProps {
  title?: string;
  icon?: React.ReactNode;
  notificationCount?: number;
  onToggleSidebar?: () => void;
}

const Header = ({
  title = "Mission Overview",
  icon = <LayoutDashboard className="h-5 w-5 text-blue-400" />,
  notificationCount = 3,
  onToggleSidebar,
}: HeaderProps) => {
  const [showAICopilot, setShowAICopilot] = useState(false);

  return (
    <>
      <header className="fixed top-0 right-0 bg-[#0B1120] border-b border-gray-800 h-16 flex items-center justify-between px-4 w-full z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            {icon}
            <h1 className="text-xl font-semibold text-white ml-2">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => setShowAICopilot(!showAICopilot)}
          >
            <Brain className="h-5 w-5 text-purple-400" />
            {showAICopilot && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-purple-500 rounded-full"></span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
                {notificationCount}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <BarChart className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* AI Copilot Floating Panel */}
      {showAICopilot && (
        <div className="fixed top-16 right-5 w-1/3 h-[96vh] bg-[#0B1120] border border-gray-800 rounded-lg shadow-lg z-20 overflow-hidden transition-all duration-300 ease-in-out">
          <div className="absolute top-0 right-0 p-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={() => setShowAICopilot(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="h-full overflow-auto">
            <AICoPilotModule className="h-full" />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

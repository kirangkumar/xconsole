import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import { QueuedCommand } from '../types';
import { Play, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface CommandQueueProps {
  queue: QueuedCommand[];
  onExecute: () => void;
  onRemove: (commandId: string) => void;
  onMoveUp: (commandId: string) => void;
  onMoveDown: (commandId: string) => void;
}

export const CommandQueue: React.FC<CommandQueueProps> = ({
  queue,
  onExecute,
  onRemove,
  onMoveUp,
  onMoveDown
}) => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Command Queue</CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
          onClick={onExecute}
          disabled={queue.length === 0}
        >
          <Play className="h-4 w-4 mr-2" />
          Execute Queue
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {queue.map((cmd, index) => (
              <div
                key={cmd.id}
                className="p-3 bg-gray-800 rounded-lg flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{cmd.name}</span>
                    <span className="text-xs text-gray-400">({cmd.namespace})</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Priority: {cmd.priority}
                    {cmd.scheduledTime && (
                      <span className="ml-2">
                        Scheduled: {new Date(cmd.scheduledTime).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={() => onMoveUp(cmd.id)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={() => onMoveDown(cmd.id)}
                    disabled={index === queue.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                    onClick={() => onRemove(cmd.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {queue.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No commands in queue
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}; 
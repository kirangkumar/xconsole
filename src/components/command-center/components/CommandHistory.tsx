import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { ScrollArea } from '../../ui/scroll-area';
import { CommandLog, YamcsCommandHistory } from '../types';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface CommandHistoryProps {
  commandLogs: CommandLog[];
  yamcsCommandHistory: YamcsCommandHistory[];
  showYamcsHistory: boolean;
}

export const CommandHistory: React.FC<CommandHistoryProps> = ({
  commandLogs,
  yamcsCommandHistory,
  showYamcsHistory
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Command History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {!showYamcsHistory && commandLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-gray-800 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(log.status)}
                    <span className={`font-medium ${getStatusColor(log.status)}`}>
                      {log.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{log.timestamp}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{log.details}</p>
                {Object.keys(log.parameters).length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Parameters:</span>
                    <pre className="text-xs text-gray-400 mt-1 bg-gray-900 p-2 rounded">
                      {JSON.stringify(log.parameters, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}

            {showYamcsHistory && yamcsCommandHistory.map((history) => (
              <div
                key={history.id}
                className="p-3 bg-gray-800 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(history.status)}
                    <span className={`font-medium ${getStatusColor(history.status)}`}>
                      {history.commandName}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{history.timestamp}</span>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  <div>User: {history.username}</div>
                  <div>Source: {history.source}</div>
                  <div>Sequence: {history.sequenceNumber}</div>
                </div>
                {Object.keys(history.parameters).length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Parameters:</span>
                    <pre className="text-xs text-gray-400 mt-1 bg-gray-900 p-2 rounded">
                      {JSON.stringify(history.parameters, null, 2)}
                    </pre>
                  </div>
                )}
                {history.comments && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Comments:</span>
                    <p className="text-sm text-gray-400 mt-1">{history.comments}</p>
                  </div>
                )}
                {history.verifications.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Verifications:</span>
                    <div className="space-y-1 mt-1">
                      {history.verifications.map((verification) => (
                        <div
                          key={verification.verifierId}
                          className={`text-xs ${
                            verification.status === 'success' ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {verification.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}; 
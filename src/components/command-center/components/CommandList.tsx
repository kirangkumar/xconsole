import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';
import { CommandOption, YamcsCommand } from '../types';
import { Search, Star, Filter } from 'lucide-react';

interface CommandListProps {
  commands: CommandOption[];
  yamcsCommands: YamcsCommand[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  showYamcsOnly: boolean;
  setShowYamcsOnly: (show: boolean) => void;
  onSelectCommand: (command: CommandOption) => void;
  onSelectYamcsCommand: (command: YamcsCommand) => void;
}

export const CommandList: React.FC<CommandListProps> = ({
  commands,
  yamcsCommands,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  showFavoritesOnly,
  setShowFavoritesOnly,
  showYamcsOnly,
  setShowYamcsOnly,
  onSelectCommand,
  onSelectYamcsCommand,
}) => {
  // Get unique categories
  const categories = ['all', ...new Set(commands.map(cmd => cmd.category))];

  // Filter commands based on search and category
  const filteredCommands = commands.filter(cmd => {
    const matchesSearch = cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cmd.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter YAMCS commands
  const filteredYamcsCommands = yamcsCommands.filter(cmd => {
    const matchesSearch = cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cmd.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <Star className={`h-4 w-4 mr-1 ${showFavoritesOnly ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`} />
            Favorites
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            onClick={() => setShowYamcsOnly(!showYamcsOnly)}
          >
            <Filter className="h-4 w-4 mr-1" />
            YAMCS
          </Button>
        </div>

        <div className="flex space-x-2 mb-4">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={`${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {!showYamcsOnly && filteredCommands.map(cmd => (
              <div
                key={cmd.id}
                className="p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
                onClick={() => onSelectCommand(cmd)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">{cmd.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    cmd.risk === 'high' ? 'bg-red-900 text-red-200' :
                    cmd.risk === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                    'bg-green-900 text-green-200'
                  }`}>
                    {cmd.risk}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{cmd.description}</p>
              </div>
            ))}

            {showYamcsOnly && filteredYamcsCommands.map(cmd => (
              <div
                key={cmd.id}
                className="p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
                onClick={() => onSelectYamcsCommand(cmd)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">{cmd.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    cmd.significance?.consequenceLevel === 'critical' ? 'bg-red-900 text-red-200' :
                    cmd.significance?.consequenceLevel === 'warning' ? 'bg-yellow-900 text-yellow-200' :
                    'bg-green-900 text-green-200'
                  }`}>
                    {cmd.significance?.consequenceLevel || 'normal'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{cmd.description}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Namespace: {cmd.namespace}</span>
                  {cmd.category && (
                    <span className="text-xs text-gray-500">Category: {cmd.category}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}; 
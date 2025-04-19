import React, { useState, useEffect } from 'react';
import { fetchSatelliteData, SATELLITE_CATEGORIES, SAMPLE_SATELLITES, SatelliteData } from '../utils/satelliteData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

interface SatelliteControlProps {
  onSatellitesChange: (satellites: SatelliteData[]) => void;
  onViewModeChange: (mode: string) => void;
  onShowLabelsChange: (show: boolean) => void;
  onShowOrbitsChange: (show: boolean) => void;
  onShowGroundTracksChange: (show: boolean) => void;
  onTimeScaleChange: (scale: number) => void;
  onPlayPauseToggle: (isPlaying: boolean) => void;
}

const ORBIT_TYPES = ['LEO', 'MEO', 'GEO', 'OTHER'] as const;

const SatelliteControl: React.FC<SatelliteControlProps> = ({
  onSatellitesChange,
  onViewModeChange,
  onShowLabelsChange,
  onShowOrbitsChange,
  onShowGroundTracksChange,
  onTimeScaleChange,
  onPlayPauseToggle,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['STATIONS']);
  const [selectedOrbitTypes, setSelectedOrbitTypes] = useState<string[]>(['LEO']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeScale, setTimeScale] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showGroundTracks, setShowGroundTracks] = useState(true);
  const [allSatellites, setAllSatellites] = useState<SatelliteData[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [viewMode, setViewMode] = useState('3d');

  // Load initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const issData = await fetchSatelliteData('stations');
        if (issData.length > 0) {
          setAllSatellites(issData);
          filterAndUpdateSatellites(issData, selectedOrbitTypes);
          console.log('Successfully loaded ISS data:', issData);
        } else {
          throw new Error('No ISS data received');
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load ISS data. Using sample data.');
        setAllSatellites(SAMPLE_SATELLITES);
        filterAndUpdateSatellites(SAMPLE_SATELLITES, selectedOrbitTypes);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filter satellites based on orbit types
  const filterAndUpdateSatellites = (satellites: SatelliteData[], orbitTypes: string[]) => {
    const filteredSatellites = satellites.filter(sat => orbitTypes.includes(sat.type));
    onSatellitesChange(filteredSatellites);
  };

  // Handle orbit type selection changes
  const handleOrbitTypeChange = (value: string[]) => {
    setSelectedOrbitTypes(value);
    filterAndUpdateSatellites(allSatellites, value);
  };

  // Handle category selection changes
  const handleCategoryChange = (value: string[]) => {
    setSelectedCategories(value);
    setLastUpdateTime(Date.now());
  };

  // Fetch satellite data when categories change
  useEffect(() => {
    const fetchData = async () => {
      if (selectedCategories.length === 0) {
        setAllSatellites([]);
        onSatellitesChange([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const promises = selectedCategories.map(category => 
          fetchSatelliteData(SATELLITE_CATEGORIES[category as keyof typeof SATELLITE_CATEGORIES])
        );
        const results = await Promise.all(promises);
        const newSatellites = results.flat().filter(sat => sat && sat.name && sat.tle1 && sat.tle2);
        
        if (newSatellites.length === 0) {
          throw new Error('No valid satellite data received');
        }

        setAllSatellites(newSatellites);
        filterAndUpdateSatellites(newSatellites, selectedOrbitTypes);
        console.log(`Loaded ${newSatellites.length} satellites from ${selectedCategories.join(', ')}`);
      } catch (err) {
        console.error('Error fetching satellite data:', err);
        setError('Failed to fetch satellite data. Using sample data.');
        setAllSatellites(SAMPLE_SATELLITES);
        filterAndUpdateSatellites(SAMPLE_SATELLITES, selectedOrbitTypes);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategories, lastUpdateTime]);

  const handleTimeScaleChange = (value: number) => {
    setTimeScale(value);
    onTimeScaleChange(value);
  };

  const handlePlayPauseToggle = () => {
    setIsPlaying(!isPlaying);
    onPlayPauseToggle(!isPlaying);
  };


  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="text-xs text-blue-400 mb-1 block">Satellite Categories</label>
          <Select
            value={selectedCategories.join(',')}
            onValueChange={(value) => handleCategoryChange(value.split(','))}
          >
            <SelectTrigger className="w-full bg-gray-800/50 border-gray-700 text-white">
              <SelectValue placeholder="Select categories" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {Object.keys(SATELLITE_CATEGORIES).map(category => (
                <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-blue-400 mb-1 block">Orbit Types</label>
          <Select
            value={selectedOrbitTypes.join(',')}
            onValueChange={(value) => handleOrbitTypeChange(value.split(','))}
          >
            <SelectTrigger className="w-full bg-gray-800/50 border-gray-700 text-white">
              <SelectValue placeholder="Select orbit types" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {ORBIT_TYPES.map(orbitType => (
                <SelectItem key={orbitType} value={orbitType} className="text-white hover:bg-gray-700">
                  {orbitType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-blue-400 mb-1 block">Display Options</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full bg-gray-800/50 border-gray-700 text-white justify-between">
                Display Options
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-white">
              <DropdownMenuLabel>Display Settings</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuCheckboxItem 
                checked={showLabels}
                onCheckedChange={(checked) => {
                  setShowLabels(!!checked);
                  onShowLabelsChange(!!checked);
                }}
                className="text-white hover:bg-gray-700"
              >
                Labels
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={showOrbits}
                onCheckedChange={(checked) => {
                  setShowOrbits(!!checked);
                  onShowOrbitsChange(!!checked);
                }}
                className="text-white hover:bg-gray-700"
              >
                Orbits
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={showGroundTracks}
                onCheckedChange={(checked) => {
                  setShowGroundTracks(!!checked);
                  onShowGroundTracksChange(!!checked);
                }}
                className="text-white hover:bg-gray-700"
              >
                Ground Tracks
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <label className="text-xs text-blue-400 mb-1 block">Time Scale</label>
          <div className="flex items-center space-x-2 h-10">
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={timeScale}
              onChange={(e) => handleTimeScaleChange(Number(e.target.value))}
              className="flex-1 accent-blue-500"
            />
            <span className="text-xs w-12 text-right text-white">{timeScale}x</span>
          </div>
        </div>
      </div>

      {(isLoading || error) && (
        <div className="flex items-center justify-between text-xs">
          {isLoading && (
            <div className="text-blue-300 flex items-center">
              Updating satellite data...
              <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-blue-500 ml-2"></div>
            </div>
          )}
          {error && (
            <div className="text-red-300">{error}</div>
          )}
          <div className="text-gray-400">
            Satellites: {allSatellites.length} total, {allSatellites.filter(sat => selectedOrbitTypes.includes(sat.type)).length} visible
          </div>
        </div>
      )}
    </div>
  );
};

export default SatelliteControl; 
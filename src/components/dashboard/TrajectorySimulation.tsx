import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Globe,
  Play,
  Pause,
  RotateCw,
  Download,
  Maximize2,
  AlertCircle,
} from "lucide-react";
import SatelliteTracker from "../SatelliteTracker";
import SatelliteControl from '../SatelliteControl';
import { SatelliteData } from '../../utils/satelliteData';

interface TrajectorySimulationProps {
  satelliteId?: string;
}

const TrajectorySimulation = ({
  satelliteId = "SAT-001",
}: TrajectorySimulationProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeScale, setTimeScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [viewMode, setViewMode] = useState("3d");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [satellites, setSatellites] = useState<SatelliteData[]>([]);
  const [showLabels, setShowLabels] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showGroundTracks, setShowGroundTracks] = useState(true);

  // Example TLE data for the International Space Station (ISS)
  // In a real application, you would fetch this data from an API
  const [tleData, setTleData] = useState({
    line1: "1 25544U 98067A   24019.53403196  .00016717  00000+0  30571-4 0  9993",
    line2: "2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.49555390429652",
    name: "ISS"
  });

  // Initialize the component
  useEffect(() => {
    let isMounted = true;
    
    const initializeComponent = async () => {
      try {
        console.log("Initializing TrajectorySimulation component");
        if (isMounted) {
          setIsInitialized(true);
          setIsLoading(false);
          console.log("TrajectorySimulation initialized successfully");
        }
      } catch (error) {
        console.error("Error initializing TrajectorySimulation:", error);
        if (isMounted) {
          setError(`Error initializing: ${error instanceof Error ? error.message : String(error)}`);
          setIsLoading(false);
        }
      }
    };

    initializeComponent();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Function to toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Function to reset the simulation
  const resetSimulation = () => {
    setTimeScale(1);
    setIsPlaying(false);
  };

  // Function to export data
  const exportData = () => {
    console.log("Exporting trajectory data...");
  };

  // Handle errors from the SatelliteTracker component
  const handleSatelliteTrackerError = (errorMessage: string) => {
    console.error("SatelliteTracker error:", errorMessage);
    setError(errorMessage);
  };

  return (
  <section className="flex-1 h-[calc(100vh-3rem)] mt-12">
    <div className="h-full p-4 overflow-y-auto">
      <Card className="bg-gray-900 border-none shadow-none">
        <CardHeader className="pb-2 top-0 z-10">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium flex items-center text-white">
              <Globe className="mr-2 h-5 w-5 text-blue-400" />
              Filters
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Play
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                onClick={resetSimulation}
              >
                <RotateCw className="mr-2 h-4 w-4" /> Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                onClick={exportData}
              >
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-white p-4 rounded-md mb-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium">Error</h3>
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          )}

          {/* Controls Section */}
          <div className="mb-4">
            <SatelliteControl
              onSatellitesChange={setSatellites}
              onShowLabelsChange={setShowLabels}
              onShowOrbitsChange={setShowOrbits}
              onShowGroundTracksChange={setShowGroundTracks}
              onTimeScaleChange={setTimeScale}
              onPlayPauseToggle={setIsPlaying}
              onViewModeChange={setViewMode}
            />
          </div>
          
          {/* Visualization Container */}
          <div className="h-[calc(100vh-16rem)] bg-black">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-lg text-gray-300">Loading 3D visualization...</p>
                </div>
              </div>
            ) : isInitialized ? (
              <div className="relative h-full [&_.cesium-viewer-cesiumWidgetContainer]:outline-none">
                <SatelliteTracker
                  satellites={satellites}
                  isPlaying={isPlaying}
                  timeScale={timeScale}
                  showLabels={showLabels}
                  showOrbits={showOrbits}
                  showGroundTracks={showGroundTracks}
                  viewMode={viewMode}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-white p-4 bg-yellow-900/50 rounded-md max-w-md">
                  <h3 className="font-medium text-yellow-300 mb-2">Initialization Failed</h3>
                  <p className="text-sm">The 3D visualization could not be initialized. Please check your browser console for errors.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </section>
  );
};

export default TrajectorySimulation;

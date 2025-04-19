import React, { useState } from 'react';
import SatelliteTracker from './SatelliteTracker';
import SatelliteControl from './SatelliteControl';
import { SatelliteData } from '../utils/satelliteData';

const SatelliteViewer: React.FC = () => {
  const [satellites, setSatellites] = useState<SatelliteData[]>([]);
  const [viewMode, setViewMode] = useState('3d');
  const [showLabels, setShowLabels] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showGroundTracks, setShowGroundTracks] = useState(true);
  const [timeScale, setTimeScale] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="relative w-full h-screen bg-black">
      <SatelliteTracker
        satellites={satellites}
        isPlaying={isPlaying}
        timeScale={timeScale}
        viewMode={viewMode}
        showLabels={showLabels}
        showOrbits={showOrbits}
        showGroundTracks={showGroundTracks}
      />
      <SatelliteControl
        onSatellitesChange={setSatellites}
        onViewModeChange={setViewMode}
        onShowLabelsChange={setShowLabels}
        onShowOrbitsChange={setShowOrbits}
        onShowGroundTracksChange={setShowGroundTracks}
        onTimeScaleChange={setTimeScale}
        onPlayPauseToggle={setIsPlaying}
      />
    </div>
  );
};

export default SatelliteViewer; 
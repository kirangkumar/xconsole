import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import * as satellite from 'satellite.js';

// Extend Window interface to include Cesium properties
declare global {
  interface Window {
    CESIUM_BASE_URL?: string;
    Cesium?: typeof Cesium;
  }
}

// Your default access token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyMjY0NDE0OH0.XcKpgANiY19MC4bdFUXMVEBToBmqS8kuYpUlxJHYZxk';

interface SatelliteData {
  name: string;
  tle1: string;
  tle2: string;
  type: 'LEO' | 'MEO' | 'GEO' | 'OTHER';
}

interface SatelliteTrackerProps {
  satellites: SatelliteData[];
  isPlaying?: boolean;
  timeScale?: number;
  viewMode?: string;
  showLabels?: boolean;
  showOrbits?: boolean;
  showGroundTracks?: boolean;
}

const SATELLITE_COLORS: { [key: string]: Cesium.Color } = {
  LEO: Cesium.Color.CORNFLOWERBLUE,
  MEO: Cesium.Color.SPRINGGREEN,
  GEO: Cesium.Color.GOLD,
  OTHER: Cesium.Color.WHITE,
};

const SatelliteTracker: React.FC<SatelliteTrackerProps> = ({
  satellites = [],
  isPlaying = true,
  timeScale = 1,
  viewMode = '3d',
  showLabels = true,
  showOrbits = true,
  showGroundTracks = true,
}) => {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const animationFrameRef = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [satelliteEntities, setSatelliteEntities] = useState<Cesium.Entity[]>([]);

  // Initialize Cesium viewer
  useEffect(() => {
    const initTimeout = setTimeout(async () => {
      if (!cesiumContainer.current) {
        console.error("No container element found");
        setError("Container element not found");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Creating viewer...");
        
        const viewer = new Cesium.Viewer(cesiumContainer.current, {
          terrainProvider: new Cesium.EllipsoidTerrainProvider(),
          baseLayerPicker: false,
          animation: false,
          fullscreenButton: false,
          vrButton: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          sceneModePicker: false,
          selectionIndicator: false,
          timeline: false,
          navigationHelpButton: false,
          requestRenderMode: true,
          maximumRenderTimeChange: Infinity,
        });

        // Add OpenStreetMap imagery layer
        viewer.imageryLayers.addImageryProvider(
          new Cesium.OpenStreetMapImageryProvider({
            url: 'https://tile.openstreetmap.org/'
          })
        );

        // Enable lighting and atmosphere
        viewer.scene.globe.enableLighting = true;
        viewer.scene.globe.depthTestAgainstTerrain = true;
        viewer.scene.skyAtmosphere.show = true;
        viewer.scene.globe.showGroundAtmosphere = true;

        // Set initial camera position
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(0.0, 0.0, 40000000.0),
          orientation: {
            heading: 0.0,
            pitch: -Cesium.Math.PI_OVER_TWO,
            roll: 0.0,
          },
        });

        console.log("Viewer created successfully");
        setViewer(viewer);
        setIsLoading(false);
        setIsInitialized(true);

        return () => {
          console.log("Cleaning up viewer");
          viewer.destroy();
        };
      } catch (err) {
        console.error("Error creating viewer:", err);
        setError(err instanceof Error ? err.message : "Failed to create viewer");
        setIsLoading(false);
      }
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      if (viewer) {
        viewer.destroy();
      }
    };
  }, []);

  // Handle animation and time updates
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setCurrentTime(prevTime => {
          const newTime = new Date(prevTime.getTime() + 1000 * timeScale);
          return newTime;
        });
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying, timeScale]);

  // Create satellite entities
  useEffect(() => {
    if (!viewer || !Array.isArray(satellites)) return;

    const entities: Cesium.Entity[] = [];

    satellites.forEach((satData) => {
      if (!satData?.tle1 || !satData?.tle2 || !satData?.name) {
        console.error('Invalid satellite data:', satData);
        return;
      }

      try {
        const satrec = satellite.twoline2satrec(satData.tle1, satData.tle2);
        if (!satrec) {
          console.error(`Failed to create satellite object for ${satData.name}`);
          return;
        }

        const color = SATELLITE_COLORS[satData.type] || SATELLITE_COLORS.OTHER;

        // Create satellite entity
        const satelliteEntity = viewer.entities.add({
          name: satData.name,
          position: new Cesium.SampledPositionProperty(Cesium.ReferenceFrame.FIXED),
          billboard: {
            image: '/satellite.svg',
            scale: 0.5,
            color: color,
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.3),
            translucencyByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.5),
          },
          label: {
            text: satData.name,
            font: '12px sans-serif',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -10),
            fillColor: color,
            outlineColor: Cesium.Color.BLACK,
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
            backgroundPadding: new Cesium.Cartesian2(5, 5),
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.4),
            translucencyByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.5),
            show: showLabels,
          },
        });

        // Update satellite position
        const updatePosition = () => {
          try {
            const positionAndVelocity = satellite.propagate(satrec, currentTime);
            if (positionAndVelocity) {
              const gmst = satellite.gstime(currentTime);
              const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
              const cartesian = Cesium.Cartesian3.fromDegrees(
                position.longitude * 180 / Math.PI,
                position.latitude * 180 / Math.PI,
                position.height * 1000
              );
              (satelliteEntity.position as Cesium.SampledPositionProperty).addSample(
                Cesium.JulianDate.fromDate(currentTime),
                cartesian
              );
            }
          } catch (error) {
            console.error(`Error updating position for ${satData.name}:`, error);
          }
        };

        // Initial position update
        updatePosition();

        if (showOrbits) {
          // Add orbit path with sampled positions
          const pathEntity = viewer.entities.add({
            name: `${satData.name} Path`,
            path: {
              resolution: 120,
              material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.2,
                color: color.withAlpha(0.5),
              }),
              width: 2,
              leadTime: 3600,
              trailTime: 3600,
            },
            position: new Cesium.SampledPositionProperty(Cesium.ReferenceFrame.FIXED),
          });

          // Update path positions
          for (let i = -60; i <= 60; i++) {
            const time = new Date(currentTime.getTime() + i * 60000);
            try {
              const positionAndVelocity = satellite.propagate(satrec, time);
              if (positionAndVelocity) {
                const gmst = satellite.gstime(time);
                const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
                const cartesian = Cesium.Cartesian3.fromDegrees(
                  position.longitude * 180 / Math.PI,
                  position.latitude * 180 / Math.PI,
                  position.height * 1000
                );
                (pathEntity.position as Cesium.SampledPositionProperty).addSample(
                  Cesium.JulianDate.fromDate(time),
                  cartesian
                );
              }
            } catch (error) {
              console.error(`Error calculating path for ${satData.name}:`, error);
            }
          }
          entities.push(pathEntity);
        }

        if (showGroundTracks) {
          // Add ground track
          const groundTrackEntity = viewer.entities.add({
            name: `${satData.name} Ground Track`,
            polyline: {
              positions: new Cesium.CallbackProperty(() => {
                try {
                  const positions = [];
                  for (let i = -30; i <= 90; i += 10) {
                    const time = new Date(currentTime.getTime() + i * 60000);
                    const positionAndVelocity = satellite.propagate(satrec, time);
                    if (positionAndVelocity) {
                      const gmst = satellite.gstime(time);
                      const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
                      positions.push(
                        Cesium.Cartesian3.fromDegrees(
                          position.longitude * 180 / Math.PI,
                          position.latitude * 180 / Math.PI,
                          1000
                        )
                      );
                    }
                  }
                  return positions;
                } catch (error) {
                  console.error(`Error calculating ground track for ${satData.name}:`, error);
                  return [];
                }
              }, false),
              width: 1,
              material: color.withAlpha(0.3),
            },
          });
          entities.push(groundTrackEntity);
        }

        entities.push(satelliteEntity);
      } catch (error) {
        console.error(`Error creating entities for ${satData.name}:`, error);
      }
    });

    setSatelliteEntities(entities);

    return () => {
      entities.forEach(entity => {
        if (viewer.entities.contains(entity)) {
          viewer.entities.remove(entity);
        }
      });
    };
  }, [viewer, satellites, currentTime, showLabels, showOrbits, showGroundTracks]);

  // Handle view mode changes
  useEffect(() => {
    if (viewer) {
      try {
        switch (viewMode) {
          case '3d':
            viewer.camera.setView({
              destination: Cesium.Cartesian3.fromDegrees(0.0, 0.0, 40000000.0),
              orientation: {
                heading: 0.0,
                pitch: -Cesium.Math.PI_OVER_TWO,
                roll: 0.0,
              },
            });
            break;
          case 'top':
            viewer.camera.setView({
              destination: Cesium.Cartesian3.fromDegrees(0.0, 90.0, 40000000.0),
              orientation: {
                heading: 0.0,
                pitch: -Cesium.Math.PI_OVER_TWO,
                roll: 0.0,
              },
            });
            break;
        }
      } catch (error) {
        console.error("Error setting view mode:", error);
      }
    }
  }, [viewMode, viewer]);

  return (
    <div className="relative h-[500px] border-2 border-green-500 bg-gray-900">
      <div
        ref={cesiumContainer}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading Cesium...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
          <div className="text-center text-white p-4 bg-red-900/50 rounded-md max-w-md">
            <h3 className="font-medium text-red-300 mb-2">Error</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-2 rounded space-y-1">
        <div>Satellites: {Array.isArray(satellites) ? satellites.length : 0}</div>
        <div>Time: {currentTime.toISOString()}</div>
      </div>
    </div>
  );
};

export default SatelliteTracker; 
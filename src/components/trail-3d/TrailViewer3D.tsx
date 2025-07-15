import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Trail, Waypoint } from '@/types/trails';
import TerrainMesh from './TerrainMesh';
import TrailPath from './TrailPath';
import WaypointMarkers from './WaypointMarkers';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play, Pause, Info } from 'lucide-react';

interface TrailViewer3DProps {
  trail: Trail;
  className?: string;
  onStartNavigation?: () => void;
}

const TrailViewer3D: React.FC<TrailViewer3DProps> = ({ 
  trail, 
  className = '', 
  onStartNavigation 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const controlsRef = useRef<any>();

  // Generate sample elevation profile if not available
  const elevationProfile = trail.elevation_profile || generateSampleElevation(trail);
  
  // Generate sample waypoints if not available
  const waypoints = trail.waypoints || generateSampleWaypoints(trail);

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const togglePlaythrough = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement flythrough animation
  };

  return (
    <div className={`relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {/* 3D Canvas */}
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 50, 100]} fov={60} />
        <OrbitControls 
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={20}
          maxDistance={200}
          maxPolarAngle={Math.PI / 2.2}
        />
        
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[50, 50, 25]} 
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        <Environment preset="dawn" />
        
        <Suspense fallback={null}>
          <TerrainMesh 
            elevationProfile={elevationProfile}
            trailBounds={getTrailBounds(trail)}
          />
          <TrailPath 
            coordinates={generateTrailCoordinates(trail)}
            difficulty={trail.difficulty}
          />
          <WaypointMarkers 
            waypoints={waypoints}
            isAnimating={isPlaying}
          />
        </Suspense>
      </Canvas>

      {/* Loading Fallback */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 pointer-events-none">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p className="text-sm">Loading 3D View...</p>
        </div>
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={resetView}
          className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          onClick={togglePlaythrough}
          className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => setShowInfo(!showInfo)}
          className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white max-w-xs">
          <h3 className="font-semibold mb-2">{trail.name}</h3>
          <div className="text-sm space-y-1">
            <p><span className="text-gray-300">Length:</span> {trail.length} miles</p>
            <p><span className="text-gray-300">Elevation:</span> {trail.elevation_gain} ft</p>
            <p><span className="text-gray-300">Difficulty:</span> {trail.difficulty}</p>
            {trail.estimated_time && (
              <p><span className="text-gray-300">Time:</span> {trail.estimated_time}</p>
            )}
          </div>
          
          {onStartNavigation && (
            <Button 
              onClick={onStartNavigation}
              className="w-full mt-3 bg-greentrail-600 hover:bg-greentrail-700"
              size="sm"
            >
              Start Navigation
            </Button>
          )}
        </div>
      )}

      {/* Waypoint Count Indicator */}
      {waypoints.length > 0 && (
        <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
          {waypoints.length} Waypoints
        </div>
      )}
    </div>
  );
};

// Helper functions
function generateSampleElevation(trail: Trail): number[] {
  const points = 50;
  const profile: number[] = [];
  const baseElevation = 1000;
  const maxGain = trail.elevation_gain;
  
  for (let i = 0; i <= points; i++) {
    const progress = i / points;
    // Create a realistic elevation curve
    const elevation = baseElevation + (Math.sin(progress * Math.PI) * maxGain * 0.7) + 
                     (Math.random() - 0.5) * 100; // Add some noise
    profile.push(Math.max(elevation, baseElevation));
  }
  
  return profile;
}

function generateSampleWaypoints(trail: Trail): Waypoint[] {
  const waypoints: Waypoint[] = [
    {
      id: '1',
      name: 'Trailhead',
      type: 'trailhead',
      coordinates: [trail.longitude, trail.latitude, 1000],
      distance_from_start: 0
    }
  ];

  // Add a viewpoint at roughly the midpoint
  if (trail.length > 2) {
    waypoints.push({
      id: '2',
      name: 'Scenic Overlook',
      type: 'viewpoint',
      coordinates: [trail.longitude + 0.01, trail.latitude + 0.01, 1000 + trail.elevation_gain * 0.7],
      distance_from_start: trail.length * 0.6
    });
  }

  return waypoints;
}

function generateTrailCoordinates(trail: Trail): [number, number, number][] {
  // If we have geojson, use it, otherwise generate a simple path
  if (trail.geojson?.coordinates) {
    return trail.geojson.coordinates.map((coord: number[], i: number) => [
      coord[0], 
      coord[1], 
      1000 + (trail.elevation_gain * i / trail.geojson.coordinates.length)
    ]);
  }

  // Generate a simple zigzag path for demo
  const coordinates: [number, number, number][] = [];
  const steps = 20;
  
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const x = trail.longitude + (progress * 0.02) + (Math.sin(progress * 8) * 0.005);
    const y = trail.latitude + (progress * 0.02) + (Math.cos(progress * 6) * 0.003);
    const z = 1000 + (progress * trail.elevation_gain);
    coordinates.push([x, y, z]);
  }
  
  return coordinates;
}

function getTrailBounds(trail: Trail) {
  return {
    minLat: trail.latitude - 0.02,
    maxLat: trail.latitude + 0.02,
    minLng: trail.longitude - 0.02,
    maxLng: trail.longitude + 0.02
  };
}

export default TrailViewer3D;
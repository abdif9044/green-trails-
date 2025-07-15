import React, { useState, useEffect, useCallback } from 'react';
import { Trail, Waypoint, NavigationState } from '@/types/trails';
import { useGPSTracking, GPSPosition } from '@/hooks/use-gps-tracking';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Navigation, 
  Play, 
  Pause, 
  Square, 
  MapPin, 
  Clock, 
  Route,
  AlertTriangle,
  Volume2,
  VolumeX
} from 'lucide-react';

interface NavigationEngineProps {
  trail: Trail;
  onNavigationEnd?: (stats: NavigationStats) => void;
  className?: string;
}

interface NavigationStats {
  distance: number;
  duration: number;
  elevationGain: number;
  wayPointsReached: number;
  averageSpeed: number;
}

const NavigationEngine: React.FC<NavigationEngineProps> = ({ 
  trail, 
  onNavigationEnd, 
  className = '' 
}) => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isNavigating: false
  });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [wayPointsReached, setWayPointsReached] = useState<string[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentInstruction, setCurrentInstruction] = useState<string>('');

  const { position, isTracking, error, startTracking, stopTracking } = useGPSTracking({
    enableHighAccuracy: true,
    trackingInterval: 5000 // Update every 5 seconds
  });

  const waypoints = trail.waypoints || [];

  // Calculate distance between two GPS points
  const calculateDistance = useCallback((pos1: GPSPosition, pos2: { latitude: number; longitude: number }) => {
    const R = 6371; // Earth's radius in km
    const dLat = (pos2.latitude - pos1.latitude) * Math.PI / 180;
    const dLon = (pos2.longitude - pos1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pos1.latitude * Math.PI / 180) * Math.cos(pos2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  }, []);

  // Find nearest waypoint
  const findNearestWaypoint = useCallback((currentPos: GPSPosition): Waypoint | null => {
    if (!waypoints.length) return null;

    let nearest = waypoints[0];
    let minDistance = calculateDistance(currentPos, {
      latitude: nearest.coordinates[1],
      longitude: nearest.coordinates[0]
    });

    for (const waypoint of waypoints) {
      const distance = calculateDistance(currentPos, {
        latitude: waypoint.coordinates[1],
        longitude: waypoint.coordinates[0]
      });
      
      if (distance < minDistance) {
        minDistance = distance;
        nearest = waypoint;
      }
    }

    return minDistance < 0.05 ? nearest : null; // Within 50 meters
  }, [waypoints, calculateDistance]);

  // Text-to-speech for audio instructions
  const speakInstruction = useCallback((text: string) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }, [audioEnabled]);

  // Generate navigation instruction
  const generateInstruction = useCallback((nearestWaypoint: Waypoint, distance: number) => {
    const distanceText = distance < 0.01 
      ? `${Math.round(distance * 1000)}m` 
      : `${distance.toFixed(1)}km`;

    switch (nearestWaypoint.type) {
      case 'junction':
        return `In ${distanceText}, continue at trail junction - ${nearestWaypoint.name}`;
      case 'viewpoint':
        return `In ${distanceText}, scenic viewpoint - ${nearestWaypoint.name}`;
      case 'summit':
        return `In ${distanceText}, you'll reach the summit - ${nearestWaypoint.name}`;
      case 'water':
        return `In ${distanceText}, water source - ${nearestWaypoint.name}`;
      case 'rest':
        return `In ${distanceText}, rest area - ${nearestWaypoint.name}`;
      case 'hazard':
        return `Caution! In ${distanceText}, hazard area - ${nearestWaypoint.name}`;
      default:
        return `In ${distanceText}, waypoint - ${nearestWaypoint.name}`;
    }
  }, []);

  // Handle waypoint reached
  const handleWaypointReached = useCallback((waypoint: Waypoint) => {
    if (wayPointsReached.includes(waypoint.id)) return;

    setWayPointsReached(prev => [...prev, waypoint.id]);
    
    const instruction = `Reached ${waypoint.name}`;
    setCurrentInstruction(instruction);
    speakInstruction(instruction);

    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }, [wayPointsReached, speakInstruction]);

  // Update navigation state based on GPS position
  useEffect(() => {
    if (!position || !navigationState.isNavigating) return;

    const nearestWaypoint = findNearestWaypoint(position);
    
    if (nearestWaypoint) {
      const distance = calculateDistance(position, {
        latitude: nearestWaypoint.coordinates[1],
        longitude: nearestWaypoint.coordinates[0]
      });

      if (distance < 0.02) { // Within 20 meters
        handleWaypointReached(nearestWaypoint);
      } else if (distance < 0.1) { // Within 100 meters
        const instruction = generateInstruction(nearestWaypoint, distance);
        setCurrentInstruction(instruction);
      }

      setNavigationState(prev => ({
        ...prev,
        currentPosition: [position.longitude, position.latitude, position.altitude || 0],
        nextWaypoint: nearestWaypoint,
        distanceToNext: distance
      }));
    }
  }, [position, navigationState.isNavigating, findNearestWaypoint, calculateDistance, handleWaypointReached, generateInstruction]);

  const startNavigation = () => {
    setNavigationState({ isNavigating: true });
    setStartTime(Date.now());
    setTotalDistance(0);
    setWayPointsReached([]);
    startTracking();
    speakInstruction(`Starting navigation for ${trail.name}`);
  };

  const pauseNavigation = () => {
    setNavigationState(prev => ({ ...prev, isNavigating: false }));
    stopTracking();
    speakInstruction('Navigation paused');
  };

  const stopNavigation = () => {
    const endTime = Date.now();
    const duration = startTime ? (endTime - startTime) / 1000 / 60 : 0; // minutes

    const stats: NavigationStats = {
      distance: totalDistance,
      duration,
      elevationGain: 0, // Calculate based on position tracking
      wayPointsReached: wayPointsReached.length,
      averageSpeed: duration > 0 ? totalDistance / (duration / 60) : 0
    };

    setNavigationState({ isNavigating: false });
    stopTracking();
    speakInstruction('Navigation completed');
    
    if (onNavigationEnd) {
      onNavigationEnd(stats);
    }
  };

  const progress = waypoints.length > 0 ? (wayPointsReached.length / waypoints.length) * 100 : 0;

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-greentrail-600" />
            <h3 className="text-lg font-semibold">Trail Navigation</h3>
          </div>
          
          <Button
            onClick={() => setAudioEnabled(!audioEnabled)}
            variant="outline"
            size="sm"
          >
            {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>

        {/* GPS Status */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
          </div>
        )}

        {/* Current Instruction */}
        {currentInstruction && navigationState.isNavigating && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {currentInstruction}
            </p>
          </div>
        )}

        {/* Progress */}
        {navigationState.isNavigating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{wayPointsReached.length} / {waypoints.length} waypoints</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Stats */}
        {navigationState.isNavigating && position && (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <Route className="h-4 w-4 mx-auto mb-1 text-green-600" />
              <div className="text-xs text-gray-600 dark:text-gray-400">Distance</div>
              <div className="font-semibold">{totalDistance.toFixed(1)}km</div>
            </div>
            
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <Clock className="h-4 w-4 mx-auto mb-1 text-blue-600" />
              <div className="text-xs text-gray-600 dark:text-gray-400">Time</div>
              <div className="font-semibold">
                {startTime ? Math.floor((Date.now() - startTime) / 1000 / 60) : 0}m
              </div>
            </div>
          </div>
        )}

        {/* Next Waypoint */}
        {navigationState.nextWaypoint && navigationState.isNavigating && (
          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Next: {navigationState.nextWaypoint.name}</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {navigationState.distanceToNext ? 
                `${(navigationState.distanceToNext * 1000).toFixed(0)}m away` : 
                'Distance calculating...'}
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-2">
          {!navigationState.isNavigating ? (
            <Button onClick={startNavigation} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start Navigation
            </Button>
          ) : (
            <>
              <Button onClick={pauseNavigation} variant="outline" className="flex-1">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button onClick={stopNavigation} variant="destructive" className="flex-1">
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default NavigationEngine;
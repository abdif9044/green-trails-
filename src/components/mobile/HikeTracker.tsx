
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Square, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Route,
  Zap,
  Navigation
} from 'lucide-react';
import { gpsTrackingService } from '@/services/gps-tracking-service';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface HikeTrackerProps {
  trailId?: string;
  trailName?: string;
}

const HikeTracker: React.FC<HikeTrackerProps> = ({ trailId, trailName }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [distance, setDistance] = useState(0);
  const [elevationGain, setElevationGain] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Update tracking state
    setIsTracking(gpsTrackingService.isCurrentlyTracking);
    
    // Set up interval to update stats
    const interval = setInterval(() => {
      if (gpsTrackingService.isCurrentlyTracking) {
        setDistance(gpsTrackingService.currentDistance);
        setElevationGain(gpsTrackingService.currentElevationGain);
        setDuration(gpsTrackingService.currentDuration);
        
        const session = gpsTrackingService.currentHikeSession;
        if (session) {
          setStartTime(new Date(session.start_time));
          setIsPaused(session.status === 'paused');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartTracking = async () => {
    try {
      const success = await gpsTrackingService.startTracking(trailId);
      
      if (success) {
        setIsTracking(true);
        setStartTime(new Date());
        toast({
          title: "Tracking Started",
          description: `GPS tracking active${trailName ? ` for ${trailName}` : ''}`,
        });
      } else {
        toast({
          title: "Failed to Start Tracking",
          description: "Please check location permissions and try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Tracking Error",
        description: "Unable to start GPS tracking",
        variant: "destructive"
      });
    }
  };

  const handlePauseTracking = async () => {
    try {
      if (isPaused) {
        await gpsTrackingService.resumeTracking();
        setIsPaused(false);
        toast({
          title: "Tracking Resumed",
          description: "GPS tracking resumed"
        });
      } else {
        await gpsTrackingService.pauseTracking();
        setIsPaused(true);
        toast({
          title: "Tracking Paused",
          description: "GPS tracking paused"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to pause/resume tracking",
        variant: "destructive"
      });
    }
  };

  const handleStopTracking = async () => {
    try {
      const session = await gpsTrackingService.stopTracking();
      
      if (session) {
        setIsTracking(false);
        setIsPaused(false);
        setStartTime(null);
        
        toast({
          title: "Hike Completed!",
          description: `You hiked ${session.total_distance.toFixed(2)} miles in ${formatDuration(session.duration)}`,
        });
        
        // Reset local state
        setDistance(0);
        setElevationGain(0);
        setDuration(0);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop tracking",
        variant: "destructive"
      });
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatDistance = (miles: number): string => {
    return `${miles.toFixed(2)} mi`;
  };

  const formatElevation = (feet: number): string => {
    return `${Math.round(feet)} ft`;
  };

  const getAveragePace = (): string => {
    if (distance === 0 || duration === 0) return '--:--';
    
    const paceMinutesPerMile = (duration / 60) / distance;
    const paceMinutes = Math.floor(paceMinutesPerMile);
    const paceSeconds = Math.round((paceMinutesPerMile - paceMinutes) * 60);
    
    return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}/mi`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Hike Tracker
          </div>
          {isTracking && (
            <Badge variant={isPaused ? "secondary" : "default"}>
              {isPaused ? 'Paused' : 'Active'}
            </Badge>
          )}
        </CardTitle>
        {trailName && (
          <p className="text-sm text-muted-foreground">{trailName}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Route className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-muted-foreground">Distance</span>
            </div>
            <p className="text-xl font-bold text-blue-600">
              {formatDistance(distance)}
            </p>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-xs text-muted-foreground">Duration</span>
            </div>
            <p className="text-xl font-bold text-green-600">
              {formatDuration(duration)}
            </p>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-xs text-muted-foreground">Elevation</span>
            </div>
            <p className="text-xl font-bold text-purple-600">
              {formatElevation(elevationGain)}
            </p>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="h-4 w-4 text-orange-600" />
              <span className="text-xs text-muted-foreground">Pace</span>
            </div>
            <p className="text-xl font-bold text-orange-600">
              {getAveragePace()}
            </p>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          {!isTracking ? (
            <Button 
              onClick={handleStartTracking}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Hike
            </Button>
          ) : (
            <>
              <Button 
                onClick={handlePauseTracking}
                variant="outline"
                className="flex-1"
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleStopTracking}
                variant="destructive"
                className="flex-1"
              >
                <Square className="h-4 w-4 mr-2" />
                Finish
              </Button>
            </>
          )}
        </div>

        {/* Start Time */}
        {startTime && (
          <div className="text-center text-sm text-muted-foreground">
            Started {formatDistanceToNow(startTime, { addSuffix: true })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HikeTracker;


import { supabase } from '@/integrations/supabase/client';

export interface HikeSession {
  id: string;
  user_id: string;
  trail_id?: string;
  start_time: string;
  end_time?: string;
  duration: number;
  total_distance: number;
  total_elevation_gain: number;
  status: 'active' | 'paused' | 'completed';
  positions: Array<{
    lat: number;
    lng: number;
    timestamp: string;
    elevation?: number;
  }>;
}

class GPSTrackingServiceClass {
  private currentSession: HikeSession | null = null;
  private isTracking = false;
  private watchId: number | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  get isCurrentlyTracking(): boolean {
    return this.isTracking;
  }

  get currentDistance(): number {
    return this.currentSession?.total_distance || 0;
  }

  get currentElevationGain(): number {
    return this.currentSession?.total_elevation_gain || 0;
  }

  get currentDuration(): number {
    return this.currentSession?.duration || 0;
  }

  get currentHikeSession(): HikeSession | null {
    return this.currentSession;
  }

  async startTracking(trailId?: string): Promise<boolean> {
    try {
      // Check if geolocation is available
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported');
        return false;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        return false;
      }

      // Create new session using trail_logs table since hike_sessions doesn't exist
      const newSession: HikeSession = {
        id: crypto.randomUUID(),
        user_id: user.id,
        trail_id: trailId,
        start_time: new Date().toISOString(),
        duration: 0,
        total_distance: 0,
        total_elevation_gain: 0,
        status: 'active',
        positions: []
      };

      // Store in trail_logs table with mock data since we can't create hike_sessions table
      try {
        await supabase
          .from('trail_logs')
          .insert({
            id: newSession.id,
            user_id: user.id,
            trail_id: trailId,
            start_time: newSession.start_time,
            distance: 0,
            notes: 'GPS tracking session'
          });
      } catch (error) {
        console.warn('Could not save to trail_logs:', error);
        // Continue anyway - we'll track in memory
      }

      this.currentSession = newSession;
      this.isTracking = true;

      // Start GPS tracking
      this.watchId = navigator.geolocation.watchPosition(
        this.handlePositionUpdate.bind(this),
        this.handlePositionError.bind(this),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );

      // Start duration counter
      this.intervalId = setInterval(() => {
        if (this.currentSession && this.isTracking) {
          this.currentSession.duration += 1;
        }
      }, 1000);

      return true;
    } catch (error) {
      console.error('Error starting GPS tracking:', error);
      return false;
    }
  }

  async pauseTracking(): Promise<void> {
    if (this.currentSession) {
      this.currentSession.status = 'paused';
      this.isTracking = false;
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
  }

  async resumeTracking(): Promise<void> {
    if (this.currentSession) {
      this.currentSession.status = 'active';
      this.isTracking = true;
      
      // Restart duration counter
      this.intervalId = setInterval(() => {
        if (this.currentSession && this.isTracking) {
          this.currentSession.duration += 1;
        }
      }, 1000);
    }
  }

  async stopTracking(): Promise<HikeSession | null> {
    if (!this.currentSession) return null;

    try {
      // Stop GPS tracking
      if (this.watchId !== null) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }

      // Stop duration counter
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }

      // Finalize session
      this.currentSession.end_time = new Date().toISOString();
      this.currentSession.status = 'completed';

      // Try to update trail_logs
      try {
        await supabase
          .from('trail_logs')
          .update({
            end_time: this.currentSession.end_time,
            duration: `${this.currentSession.duration} seconds`,
            distance: this.currentSession.total_distance,
            notes: `Completed GPS tracking session. Distance: ${this.currentSession.total_distance.toFixed(2)} miles`
          })
          .eq('id', this.currentSession.id);
      } catch (error) {
        console.warn('Could not update trail_logs:', error);
      }

      const completedSession = { ...this.currentSession };
      
      // Reset state
      this.currentSession = null;
      this.isTracking = false;

      return completedSession;
    } catch (error) {
      console.error('Error stopping GPS tracking:', error);
      return null;
    }
  }

  private handlePositionUpdate(position: GeolocationPosition): void {
    if (!this.currentSession || !this.isTracking) return;

    const newPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      timestamp: new Date().toISOString(),
      elevation: position.coords.altitude || undefined
    };

    // Calculate distance from last position
    if (this.currentSession.positions.length > 0) {
      const lastPos = this.currentSession.positions[this.currentSession.positions.length - 1];
      const distance = this.calculateDistance(
        lastPos.lat, lastPos.lng,
        newPosition.lat, newPosition.lng
      );
      this.currentSession.total_distance += distance;

      // Calculate elevation gain
      if (newPosition.elevation && lastPos.elevation) {
        const elevationDiff = newPosition.elevation - lastPos.elevation;
        if (elevationDiff > 0) {
          this.currentSession.total_elevation_gain += elevationDiff * 3.28084; // Convert to feet
        }
      }
    }

    this.currentSession.positions.push(newPosition);
  }

  private handlePositionError(error: GeolocationPositionError): void {
    console.error('GPS tracking error:', error);
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  async getAllSessions(): Promise<HikeSession[]> {
    // Since hike_sessions table doesn't exist, return empty array
    console.log('Getting all GPS tracking sessions (mock data)');
    return [];
  }
}

export const gpsTrackingService = new GPSTrackingServiceClass();
export const GPSTrackingService = GPSTrackingServiceClass;
export default gpsTrackingService;

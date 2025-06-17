
import { supabase } from '@/integrations/supabase/client';

export interface GPSPosition {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  timestamp: number;
}

export interface HikeSession {
  id: string;
  user_id: string;
  trail_id?: string;
  start_time: string;
  end_time?: string;
  positions: GPSPosition[];
  total_distance: number;
  total_elevation_gain: number;
  status: 'active' | 'paused' | 'completed';
}

class GPSTrackingService {
  private watchId: number | null = null;
  private currentSession: HikeSession | null = null;
  private positions: GPSPosition[] = [];

  async startTracking(userId: string, trailId?: string): Promise<string> {
    try {
      const sessionId = crypto.randomUUID();
      
      this.currentSession = {
        id: sessionId,
        user_id: userId,
        trail_id: trailId,
        start_time: new Date().toISOString(),
        positions: [],
        total_distance: 0,
        total_elevation_gain: 0,
        status: 'active'
      };

      // Since hike_sessions table doesn't exist, just track locally
      console.warn('Hike sessions table does not exist, tracking locally only');

      if ('geolocation' in navigator) {
        this.watchId = navigator.geolocation.watchPosition(
          this.handlePositionUpdate.bind(this),
          this.handlePositionError.bind(this),
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      }

      return sessionId;
    } catch (error) {
      console.error('Error starting GPS tracking:', error);
      throw error;
    }
  }

  private handlePositionUpdate(position: GeolocationPosition) {
    if (!this.currentSession) return;

    const newPosition: GPSPosition = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      altitude: position.coords.altitude || undefined,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp
    };

    this.positions.push(newPosition);
    this.currentSession.positions = this.positions;

    // Calculate distance and elevation if we have previous positions
    if (this.positions.length > 1) {
      const distance = this.calculateDistance(
        this.positions[this.positions.length - 2],
        newPosition
      );
      this.currentSession.total_distance += distance;

      if (newPosition.altitude && this.positions[this.positions.length - 2].altitude) {
        const elevationChange = newPosition.altitude - this.positions[this.positions.length - 2].altitude!;
        if (elevationChange > 0) {
          this.currentSession.total_elevation_gain += elevationChange;
        }
      }
    }
  }

  private handlePositionError(error: GeolocationPositionError) {
    console.error('GPS position error:', error);
  }

  private calculateDistance(pos1: GPSPosition, pos2: GPSPosition): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (pos2.latitude - pos1.latitude) * Math.PI / 180;
    const dLon = (pos2.longitude - pos1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pos1.latitude * Math.PI / 180) * Math.cos(pos2.latitude * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  async stopTracking(): Promise<HikeSession | null> {
    if (!this.currentSession) return null;

    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    this.currentSession.end_time = new Date().toISOString();
    this.currentSession.status = 'completed';

    const completedSession = { ...this.currentSession };
    this.currentSession = null;
    this.positions = [];

    return completedSession;
  }

  async pauseTracking(): Promise<void> {
    if (this.currentSession) {
      this.currentSession.status = 'paused';
    }

    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  async getUserHikeSessions(userId: string): Promise<HikeSession[]> {
    try {
      // Since hike_sessions table doesn't exist, return empty array
      console.warn('Hike sessions table does not exist, returning empty sessions');
      return [];
    } catch (error) {
      console.error('Error fetching user hike sessions:', error);
      return [];
    }
  }

  getCurrentSession(): HikeSession | null {
    return this.currentSession;
  }
}

export const gpsTrackingService = new GPSTrackingService();
export default gpsTrackingService;

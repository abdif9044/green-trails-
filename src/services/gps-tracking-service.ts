
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
  trail_id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  positions: GPSPosition[];
  total_distance: number;
  total_elevation_gain: number;
  status: 'active' | 'paused' | 'completed';
}

export class GPSTrackingService {
  private static currentSession: HikeSession | null = null;
  private static watchId: number | null = null;

  /**
   * Start tracking a new hike session
   */
  static async startHikeSession(trailId: string, userId: string): Promise<HikeSession | null> {
    try {
      const newSession: HikeSession = {
        id: crypto.randomUUID(),
        trail_id: trailId,
        user_id: userId,
        start_time: new Date().toISOString(),
        positions: [],
        total_distance: 0,
        total_elevation_gain: 0,
        status: 'active'
      };

      // Start GPS tracking
      if (navigator.geolocation) {
        this.watchId = navigator.geolocation.watchPosition(
          (position) => this.handlePositionUpdate(position),
          (error) => console.error('GPS error:', error),
          { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
        );
      }

      this.currentSession = newSession;
      return newSession;
    } catch (error) {
      console.error('Error starting hike session:', error);
      return null;
    }
  }

  /**
   * Handle GPS position updates
   */
  private static handlePositionUpdate(position: GeolocationPosition) {
    if (!this.currentSession) return;

    const newPosition: GPSPosition = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      altitude: position.coords.altitude || undefined,
      accuracy: position.coords.accuracy,
      timestamp: Date.now()
    };

    this.currentSession.positions.push(newPosition);
    
    // Calculate distance and elevation gain
    if (this.currentSession.positions.length > 1) {
      const lastPos = this.currentSession.positions[this.currentSession.positions.length - 2];
      const distance = this.calculateDistance(lastPos, newPosition);
      this.currentSession.total_distance += distance;

      if (newPosition.altitude && lastPos.altitude) {
        const elevationGain = Math.max(0, newPosition.altitude - lastPos.altitude);
        this.currentSession.total_elevation_gain += elevationGain;
      }
    }
  }

  /**
   * Calculate distance between two GPS points using Haversine formula
   */
  private static calculateDistance(pos1: GPSPosition, pos2: GPSPosition): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = pos1.latitude * Math.PI / 180;
    const φ2 = pos2.latitude * Math.PI / 180;
    const Δφ = (pos2.latitude - pos1.latitude) * Math.PI / 180;
    const Δλ = (pos2.longitude - pos1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  /**
   * End the current hike session
   */
  static async endHikeSession(): Promise<HikeSession | null> {
    if (!this.currentSession) return null;

    try {
      // Stop GPS tracking
      if (this.watchId !== null) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }

      // Update session
      this.currentSession.end_time = new Date().toISOString();
      this.currentSession.status = 'completed';

      const completedSession = this.currentSession;
      this.currentSession = null;

      console.log('Hike session completed:', completedSession);
      return completedSession;
    } catch (error) {
      console.error('Error ending hike session:', error);
      return null;
    }
  }

  /**
   * Get all hike sessions for a user (mock implementation)
   */
  static async getUserHikeSessions(userId: string): Promise<HikeSession[]> {
    try {
      // Mock implementation since hike_sessions table doesn't exist
      const mockSessions: HikeSession[] = [
        {
          id: '1',
          trail_id: 'trail-1',
          user_id: userId,
          start_time: new Date(Date.now() - 86400000).toISOString(),
          end_time: new Date(Date.now() - 82800000).toISOString(),
          positions: [],
          total_distance: 5200,
          total_elevation_gain: 450,
          status: 'completed'
        }
      ];

      return mockSessions;
    } catch (error) {
      console.error('Error fetching hike sessions:', error);
      return [];
    }
  }

  /**
   * Get current active session
   */
  static getCurrentSession(): HikeSession | null {
    return this.currentSession;
  }

  /**
   * Pause current session
   */
  static pauseSession(): boolean {
    if (this.currentSession && this.currentSession.status === 'active') {
      this.currentSession.status = 'paused';
      
      if (this.watchId !== null) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }
      
      return true;
    }
    return false;
  }

  /**
   * Resume paused session
   */
  static resumeSession(): boolean {
    if (this.currentSession && this.currentSession.status === 'paused') {
      this.currentSession.status = 'active';
      
      if (navigator.geolocation) {
        this.watchId = navigator.geolocation.watchPosition(
          (position) => this.handlePositionUpdate(position),
          (error) => console.error('GPS error:', error),
          { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
        );
      }
      
      return true;
    }
    return false;
  }
}

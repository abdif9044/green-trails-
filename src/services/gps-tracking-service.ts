
import { supabase } from '@/integrations/supabase/client';
import { performanceMonitor } from './performance-monitor';

interface GPSPosition {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy: number;
  timestamp: number;
}

interface HikeSession {
  id: string;
  trail_id?: string;
  start_time: string;
  end_time?: string;
  positions: GPSPosition[];
  total_distance: number;
  total_elevation_gain: number;
  duration: number;
  status: 'active' | 'paused' | 'completed';
}

class GPSTrackingService {
  private watchId: number | null = null;
  private currentSession: HikeSession | null = null;
  private positions: GPSPosition[] = [];
  private lastPosition: GPSPosition | null = null;
  private isTracking = false;
  private trackingInterval: NodeJS.Timeout | null = null;

  async startTracking(trailId?: string): Promise<boolean> {
    if (this.isTracking) {
      console.warn('GPS tracking already active');
      return false;
    }

    try {
      // Request permissions
      const permission = await this.requestLocationPermission();
      if (!permission) {
        throw new Error('Location permission denied');
      }

      // Start GPS tracking
      this.watchId = navigator.geolocation.watchPosition(
        (position) => this.handlePositionUpdate(position),
        (error) => this.handlePositionError(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        }
      );

      // Create new session
      this.currentSession = {
        id: this.generateSessionId(),
        trail_id: trailId,
        start_time: new Date().toISOString(),
        positions: [],
        total_distance: 0,
        total_elevation_gain: 0,
        duration: 0,
        status: 'active'
      };

      this.isTracking = true;
      this.startPerformanceTracking();

      // Save session to Supabase
      await this.saveSession();

      console.log('GPS tracking started');
      return true;
    } catch (error) {
      console.error('Failed to start GPS tracking:', error);
      return false;
    }
  }

  async stopTracking(): Promise<HikeSession | null> {
    if (!this.isTracking || !this.currentSession) {
      return null;
    }

    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }

    // Finalize session
    this.currentSession.end_time = new Date().toISOString();
    this.currentSession.positions = this.positions;
    this.currentSession.status = 'completed';
    this.currentSession.duration = this.calculateDuration();

    // Save final session
    await this.saveSession();

    const completedSession = this.currentSession;
    
    // Reset tracking state
    this.isTracking = false;
    this.currentSession = null;
    this.positions = [];
    this.lastPosition = null;

    console.log('GPS tracking stopped');
    return completedSession;
  }

  async pauseTracking(): Promise<void> {
    if (!this.currentSession) return;

    this.currentSession.status = 'paused';
    await this.saveSession();
  }

  async resumeTracking(): Promise<void> {
    if (!this.currentSession) return;

    this.currentSession.status = 'active';
    await this.saveSession();
  }

  private async requestLocationPermission(): Promise<boolean> {
    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported');
    }

    return new Promise((resolve) => {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          resolve(true);
        } else if (result.state === 'prompt') {
          // Will be prompted when accessing geolocation
          resolve(true);
        } else {
          resolve(false);
        }
      }).catch(() => {
        // Fallback for browsers that don't support permissions API
        resolve(true);
      });
    });
  }

  private handlePositionUpdate(position: GeolocationPosition): void {
    if (!this.currentSession || this.currentSession.status !== 'active') {
      return;
    }

    const newPosition: GPSPosition = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      altitude: position.coords.altitude || undefined,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp
    };

    this.positions.push(newPosition);

    // Calculate distance and elevation if we have a previous position
    if (this.lastPosition) {
      const distance = this.calculateDistance(this.lastPosition, newPosition);
      this.currentSession.total_distance += distance;

      if (this.lastPosition.altitude && newPosition.altitude) {
        const elevationGain = newPosition.altitude - this.lastPosition.altitude;
        if (elevationGain > 0) {
          this.currentSession.total_elevation_gain += elevationGain;
        }
      }
    }

    this.lastPosition = newPosition;

    // Save session periodically
    if (this.positions.length % 10 === 0) {
      this.saveSession();
    }

    // Track performance
    performanceMonitor.trackMetric('gps_position_update', 1, {
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp
    });
  }

  private handlePositionError(error: GeolocationPositionError): void {
    console.error('GPS position error:', error);
    
    performanceMonitor.trackMetric('gps_error', 1, {
      code: error.code,
      message: error.message
    });
  }

  private calculateDistance(pos1: GPSPosition, pos2: GPSPosition): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(pos2.latitude - pos1.latitude);
    const dLon = this.toRadians(pos2.longitude - pos1.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(pos1.latitude)) * Math.cos(this.toRadians(pos2.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private calculateDuration(): number {
    if (!this.currentSession?.start_time) return 0;
    
    const start = new Date(this.currentSession.start_time).getTime();
    const end = this.currentSession.end_time 
      ? new Date(this.currentSession.end_time).getTime()
      : Date.now();
    
    return Math.floor((end - start) / 1000); // Duration in seconds
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async saveSession(): Promise<void> {
    if (!this.currentSession) return;

    try {
      const { error } = await supabase
        .from('hike_sessions')
        .upsert({
          id: this.currentSession.id,
          trail_id: this.currentSession.trail_id,
          start_time: this.currentSession.start_time,
          end_time: this.currentSession.end_time,
          positions: this.currentSession.positions,
          total_distance: this.currentSession.total_distance,
          total_elevation_gain: this.currentSession.total_elevation_gain,
          duration: this.calculateDuration(),
          status: this.currentSession.status
        });

      if (error) {
        console.error('Error saving hike session:', error);
      }
    } catch (error) {
      console.error('Error saving hike session:', error);
    }
  }

  private startPerformanceTracking(): void {
    this.trackingInterval = setInterval(() => {
      if (this.currentSession) {
        performanceMonitor.trackMetric('gps_session_duration', this.calculateDuration());
        performanceMonitor.trackMetric('gps_positions_count', this.positions.length);
      }
    }, 60000); // Track every minute
  }

  // Public getters
  get isCurrentlyTracking(): boolean {
    return this.isTracking;
  }

  get currentHikeSession(): HikeSession | null {
    return this.currentSession;
  }

  get currentDistance(): number {
    return this.currentSession?.total_distance || 0;
  }

  get currentElevationGain(): number {
    return this.currentSession?.total_elevation_gain || 0;
  }

  get currentDuration(): number {
    return this.calculateDuration();
  }

  async getRecentSessions(limit: number = 10): Promise<HikeSession[]> {
    try {
      const { data, error } = await supabase
        .from('hike_sessions')
        .select('*')
        .eq('status', 'completed')
        .order('start_time', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent sessions:', error);
      return [];
    }
  }
}

export const gpsTrackingService = new GPSTrackingService();
export default gpsTrackingService;

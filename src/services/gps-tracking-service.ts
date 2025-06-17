
export interface HikeSession {
  id: string;
  userId: string;
  trailId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  distance: number;
  elevationGain: number;
  coordinates: Array<{ lat: number; lng: number; timestamp: Date; elevation?: number }>;
  isActive: boolean;
  // Add missing properties for backward compatibility
  start_time: string;
  status: 'active' | 'paused' | 'completed';
  total_distance: number;
}

export class GPSTrackingService {
  private static instance: GPSTrackingService;
  private currentSession: HikeSession | null = null;
  private trackingInterval: number | null = null;
  private isTracking = false;

  static getInstance(): GPSTrackingService {
    if (!GPSTrackingService.instance) {
      GPSTrackingService.instance = new GPSTrackingService();
    }
    return GPSTrackingService.instance;
  }

  get isCurrentlyTracking(): boolean {
    return this.isTracking;
  }

  get currentDistance(): number {
    return this.currentSession?.distance || 0;
  }

  get currentElevationGain(): number {
    return this.currentSession?.elevationGain || 0;
  }

  get currentDuration(): number {
    return this.currentSession?.duration || 0;
  }

  get currentHikeSession(): HikeSession | null {
    return this.currentSession;
  }

  getCurrentSession(): HikeSession | null {
    return this.currentSession;
  }

  async startTracking(trailId?: string): Promise<boolean> {
    try {
      console.log('Starting GPS tracking...');
      
      const startTime = new Date();
      this.currentSession = {
        id: `session_${Date.now()}`,
        userId: 'current_user',
        trailId,
        startTime,
        duration: 0,
        distance: 0,
        elevationGain: 0,
        coordinates: [],
        isActive: true,
        start_time: startTime.toISOString(),
        status: 'active',
        total_distance: 0
      };
      
      this.isTracking = true;
      return true;
    } catch (error) {
      console.error('Error starting GPS tracking:', error);
      return false;
    }
  }

  pauseTracking(): boolean {
    console.log('Pausing GPS tracking...');
    this.isTracking = false;
    if (this.currentSession) {
      this.currentSession.isActive = false;
      this.currentSession.status = 'paused';
    }
    return true;
  }

  resumeTracking(): boolean {
    console.log('Resuming GPS tracking...');
    this.isTracking = true;
    if (this.currentSession) {
      this.currentSession.isActive = true;
      this.currentSession.status = 'active';
    }
    return true;
  }

  stopTracking(): HikeSession | null {
    console.log('Stopping GPS tracking...');
    
    if (this.currentSession) {
      this.currentSession.endTime = new Date();
      this.currentSession.isActive = false;
      this.currentSession.status = 'completed';
      this.currentSession.duration = this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime();
      this.currentSession.total_distance = this.currentSession.distance;
      
      const completedSession = { ...this.currentSession };
      this.currentSession = null;
      this.isTracking = false;
      
      return completedSession;
    }
    
    this.isTracking = false;
    return null;
  }

  updateCoordinates(lat: number, lng: number, elevation?: number): void {
    if (this.currentSession && this.isTracking) {
      const timestamp = new Date();
      this.currentSession.coordinates.push({ lat, lng, timestamp, elevation });
      this.currentSession.distance += this.calculateDistance(lat, lng);
      this.currentSession.total_distance = this.currentSession.distance;
      if (elevation) {
        this.currentSession.elevationGain += this.calculateElevationGain(elevation);
      }
      this.currentSession.duration = timestamp.getTime() - this.currentSession.startTime.getTime();
      console.log(`Updated coordinates: Lat=${lat}, Lng=${lng}, Distance=${this.currentSession.distance}, Duration=${this.currentSession.duration}`);
    }
  }

  private calculateDistance(lat: number, lng: number): number {
    if (!this.currentSession || this.currentSession.coordinates.length === 0) {
      return 0;
    }

    const prevCoord = this.currentSession.coordinates[this.currentSession.coordinates.length - 1];
    const R = 6371e3; // metres
    const φ1 = prevCoord.lat * Math.PI / 180;
    const φ2 = lat * Math.PI / 180;
    const Δφ = (lat - prevCoord.lat) * Math.PI / 180;
    const Δλ = (lng - prevCoord.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  }

  private calculateElevationGain(elevation: number): number {
    if (!this.currentSession || this.currentSession.coordinates.length === 0) {
      return 0;
    }

    const prevCoord = this.currentSession.coordinates[this.currentSession.coordinates.length - 1];
    const prevElevation = prevCoord.elevation || 0;
    const elevationGain = elevation - prevElevation;
    return elevationGain > 0 ? elevationGain : 0;
  }
}

export const gpsTrackingService = GPSTrackingService.getInstance();

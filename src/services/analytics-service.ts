
/**
 * Simple analytics service to track user interactions
 */

type EventCategory = 'trails' | 'user' | 'search' | 'social' | 'navigation';

type EventAction = 
  | 'view' 
  | 'click' 
  | 'search' 
  | 'filter' 
  | 'like' 
  | 'comment'
  | 'share'
  | 'follow'
  | 'login'
  | 'signup'
  | 'rate';

interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

class AnalyticsService {
  private enabled: boolean = true;
  
  // Initialize analytics (could be expanded to connect to Supabase or other providers)
  public init(): void {
    // Check if analytics should be enabled based on user preferences
    try {
      const analyticsDisabled = localStorage.getItem('greentrails-disable-analytics') === 'true';
      this.enabled = !analyticsDisabled;
      
      // Log initialization
      console.log(`Analytics ${this.enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error initializing analytics:', error);
    }
  }
  
  // Track a user event
  public trackEvent(
    category: EventCategory, 
    action: EventAction, 
    label?: string,
    properties?: EventProperties
  ): void {
    if (!this.enabled) return;
    
    try {
      // For now, just console log the event
      // In production, this would send to a proper analytics service via Supabase
      console.log(`Analytics Event: ${category} - ${action} - ${label || 'N/A'}`, properties || {});
      
      // Example of how to send to Supabase in the future
      /*
      supabase
        .from('analytics_events')
        .insert([
          {
            category,
            action,
            label,
            properties: properties || {},
            user_id: user?.id, // Could get from useAuth() in a React component
            timestamp: new Date().toISOString()
          }
        ])
        .then(({ error }) => {
          if (error) console.error('Error tracking event:', error);
        });
      */
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }
  
  // Enable or disable analytics
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    try {
      if (!enabled) {
        localStorage.setItem('greentrails-disable-analytics', 'true');
      } else {
        localStorage.removeItem('greentrails-disable-analytics');
      }
    } catch (error) {
      console.error('Error setting analytics preference:', error);
    }
  }
  
  // Check if analytics is enabled
  public isEnabled(): boolean {
    return this.enabled;
  }
}

// Create a singleton instance
const analyticsService = new AnalyticsService();
analyticsService.init();

export default analyticsService;

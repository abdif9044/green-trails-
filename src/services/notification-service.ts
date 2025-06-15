import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  user_id: string;
  type: 'social' | 'weather' | 'trail' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  created_at: string;
}

class NotificationService {
  private subscription: any = null;
  private toastFn: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.requestNotificationPermission();
    }
  }

  setToastFunction(toast: any) {
    this.toastFn = toast;
  }

  async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  async subscribeToNotifications(userId: string) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          this.handleNewNotification(payload.new as Notification);
        }
      )
      .subscribe();
  }

  private handleNewNotification(notification: Notification) {
    // Show browser notification
    this.showBrowserNotification(notification);
    
    // Show in-app toast
    if (this.toastFn) {
      this.toastFn({
        title: notification.title,
        description: notification.message,
        duration: 5000
      });
    }
  }

  private showBrowserNotification(notification: Notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id
      });

      browserNotification.onclick = () => {
        window.focus();
        this.markAsRead(notification.id);
        
        // Handle navigation based on notification type
        this.handleNotificationClick(notification);
      };
    }
  }

  private handleNotificationClick(notification: Notification) {
    switch (notification.type) {
      case 'social':
        if (notification.data?.albumId) {
          window.location.href = `/albums/${notification.data.albumId}`;
        } else if (notification.data?.userId) {
          window.location.href = `/profile/${notification.data.userId}`;
        } else {
          window.location.href = '/social';
        }
        break;
      case 'trail':
        if (notification.data?.trailId) {
          window.location.href = `/trail/${notification.data.trailId}`;
        } else {
          window.location.href = '/discover';
        }
        break;
      case 'weather':
        window.location.href = '/discover';
        break;
      default:
        window.location.href = '/';
    }
  }

  async createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    data?: Record<string, any>
  ) {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        data,
        read: false
      });

    if (error) {
      console.error('Error creating notification:', error);
    }
  }

  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async getNotifications(userId: string, limit: number = 20) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return data;
  }

  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  // Weather alert notifications
  async sendWeatherAlert(userId: string, trailId: string, alertType: string, message: string) {
    await this.createNotification(
      userId,
      'weather',
      `Weather Alert: ${alertType}`,
      message,
      { trailId, alertType }
    );
  }

  // Social notifications
  async sendFollowNotification(userId: string, followerId: string, followerName: string) {
    await this.createNotification(
      userId,
      'social',
      'New Follower',
      `${followerName} started following you`,
      { userId: followerId }
    );
  }

  async sendLikeNotification(userId: string, likerId: string, likerName: string, albumId: string) {
    await this.createNotification(
      userId,
      'social',
      'New Like',
      `${likerName} liked your album`,
      { userId: likerId, albumId }
    );
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;

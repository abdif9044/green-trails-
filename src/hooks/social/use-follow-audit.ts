
import { supabase } from '@/integrations/supabase/client';

export async function logSocialAction(eventType: 'follow' | 'unfollow', followerId: string, followingId: string) {
  try {
    await supabase
      .from('security_audit_log')
      .insert([
        {
          event_type: eventType,
          metadata: {
            follower_id: followerId,
            following_id: followingId,
            timestamp: new Date().toISOString()
          },
          created_at: new Date().toISOString()
        }
      ]);
  } catch (e) {
    // Silent fail; we do not want to block UI for audit logs
    console.warn('Audit log failed:', e);
  }
}

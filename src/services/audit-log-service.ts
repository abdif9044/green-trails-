
/**
 * Simple Audit Logging Service for Social Events (follow, unfollow, avatar)
 * Writes logs to user's audit_log table (optionally to Supabase security_audit_log)
 */

import { supabase } from '@/integrations/supabase/client';

// Usage: await AuditLogService.log('avatar_upload', { user_id, info });
export class AuditLogService {
  static async log(eventType: string, metadata: any) {
    try {
      await supabase.from('security_audit_log').insert([
        {
          event_type: eventType,
          metadata,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (e) {
      console.warn('AuditLogService failed', e);
    }
  }
}


import { useQuery } from '@tanstack/react-query';

// Simplified audit hook that doesn't depend on missing tables
export const useFollowAudit = (userId: string) => {
  return useQuery({
    queryKey: ['follow-audit', userId],
    queryFn: async () => {
      // Return empty audit data for now since security_audit_log table doesn't exist
      return {
        followActions: [],
        suspiciousActivity: false,
        lastAuditCheck: new Date().toISOString()
      };
    },
    enabled: !!userId,
  });
};

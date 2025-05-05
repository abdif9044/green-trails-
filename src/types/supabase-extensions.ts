
import { SupabaseClient, PostgrestResponse } from '@supabase/supabase-js';
import { BulkImportJob, ImportJob } from '@/hooks/useTrailImport';

// We need to define a more specific interface for our extended query builders
interface ExtendedPostgrestFilterBuilder<T> {
  select: (...args: any[]) => ExtendedPostgrestFilterBuilder<T>;
  eq: (column: string, value: any) => ExtendedPostgrestFilterBuilder<T>;
  order: (column: string, options?: { ascending?: boolean }) => ExtendedPostgrestFilterBuilder<T>;
  limit: (count: number) => ExtendedPostgrestFilterBuilder<T>;
  single: () => ExtendedPostgrestFilterBuilder<T>;
  then: (onFulfilled?: ((value: PostgrestResponse<T[]>) => any)) => Promise<any>;
}

export function createExtendedSupabaseClient(supabase: SupabaseClient) {
  return {
    ...supabase,
    from: (table: string) => {
      const originalFrom = supabase.from(table);
      
      // Add type-specific handling for different tables
      if (table === 'bulk_import_jobs') {
        return {
          ...originalFrom,
          select: (...args: any[]) => {
            const query = originalFrom.select(...args);
            return {
              ...query,
              eq: query.eq.bind(query),
              order: query.order.bind(query),
              limit: query.limit.bind(query),
              single: query.single.bind(query),
              then: (onFulfilled?: ((value: PostgrestResponse<BulkImportJob[]>) => any)) => {
                return query.then(onFulfilled as any);
              }
            } as ExtendedPostgrestFilterBuilder<BulkImportJob>;
          }
        };
      }
      
      if (table === 'trail_import_jobs') {
        return {
          ...originalFrom,
          select: (...args: any[]) => {
            const query = originalFrom.select(...args);
            return {
              ...query,
              eq: query.eq.bind(query),
              order: query.order.bind(query),
              limit: query.limit.bind(query),
              single: query.single.bind(query),
              then: (onFulfilled?: ((value: PostgrestResponse<ImportJob[]>) => any)) => {
                return query.then(onFulfilled as any);
              }
            } as ExtendedPostgrestFilterBuilder<ImportJob>;
          }
        };
      }
      
      return originalFrom;
    }
  };
}

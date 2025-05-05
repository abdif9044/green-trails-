
import { SupabaseClient, PostgrestResponse } from '@supabase/supabase-js';
import { BulkImportJob, ImportJob } from '@/hooks/useTrailImport';

interface ExtendedQueryResult<T> {
  select: (...args: any[]) => ExtendedQueryResult<T>;
  eq: (column: string, value: any) => ExtendedQueryResult<T>;
  order: (column: string, options?: { ascending?: boolean }) => ExtendedQueryResult<T>;
  limit: (count: number) => ExtendedQueryResult<T>;
  single: () => Promise<PostgrestResponse<T>>;
}

export function createExtendedSupabaseClient(supabase: SupabaseClient) {
  return {
    ...supabase,
    from: (table: string) => {
      const originalFrom = supabase.from(table);
      
      // Generic extension for all tables
      const extendedQuery = {
        ...originalFrom,
        select: (...args: any[]) => {
          const query = originalFrom.select(...args);
          return {
            ...query,
            eq: query.eq.bind(query),
            order: query.order.bind(query),
            limit: query.limit.bind(query),
            single: query.single.bind(query),
          };
        }
      };
      
      return extendedQuery;
    }
  };
}

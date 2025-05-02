
/**
 * Extends the Supabase database types with additional tables that aren't
 * automatically included in the generated types
 */
import { Database } from '@/integrations/supabase/types';
import { SupabaseClient } from '@supabase/supabase-js';

// Extend the Database type with additional tables
export interface ExtendedDatabase extends Database {
  public: Database['public'] & {
    Tables: Database['public']['Tables'] & {
      bulk_import_jobs: {
        Row: {
          id: string;
          status: string;
          started_at: string;
          completed_at: string | null;
          total_trails_requested: number;
          total_sources: number;
          trails_processed: number;
          trails_added: number;
          trails_updated: number;
          trails_failed: number;
          last_updated?: string;
        };
        Insert: {
          id?: string;
          status: string;
          started_at?: string;
          completed_at?: string | null;
          total_trails_requested: number;
          total_sources: number;
          trails_processed?: number;
          trails_added?: number;
          trails_updated?: number;
          trails_failed?: number;
          last_updated?: string;
        };
        Update: {
          id?: string;
          status?: string;
          started_at?: string;
          completed_at?: string | null;
          total_trails_requested?: number;
          total_sources?: number;
          trails_processed?: number;
          trails_added?: number;
          trails_updated?: number;
          trails_failed?: number;
          last_updated?: string;
        };
        Relationships: [];
      }
    }
  }
}

// Create a typed client factory 
export const createExtendedSupabaseClient = (supabaseClient: SupabaseClient) => {
  return supabaseClient as SupabaseClient<ExtendedDatabase>;
};

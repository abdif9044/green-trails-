
export interface Database {
  public: {
    Tables: {
      trails: {
        Row: {
          id: string;
          name: string;
          description?: string;
          location?: string;
          country?: string;
          state_province?: string;
          length?: number;
          elevation_gain?: number;
          difficulty?: string;
          latitude?: number;
          longitude?: number;
          is_age_restricted?: boolean;
          last_updated?: string;
          source?: string;
          source_id?: string;
        };
      };
      trail_import_jobs: {
        Row: {
          id: string;
          source_id: string;
          status: string;
          started_at: string;
          completed_at?: string;
          trails_processed: number;
          trails_added: number;
          trails_updated: number;
          trails_failed: number;
          error_message?: string;
          bulk_job_id?: string;
        };
      };
      bulk_import_jobs: {
        Row: {
          id: string;
          status: string;
          started_at: string;
          completed_at?: string;
          total_trails_requested: number;
          total_sources: number;
          trails_processed: number;
          trails_added: number;
          trails_updated: number;
          trails_failed: number;
        };
      };
      trail_tags: {
        Row: {
          trail_id: string;
          tag_id: string;
          is_strain_tag: boolean;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          tag_type: string;
          details?: any;
        };
      };
    };
  };
}

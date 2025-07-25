export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_feed: {
        Row: {
          album_id: string | null
          content: string | null
          created_at: string | null
          id: string
          target_user_id: string | null
          trail_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          album_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          target_user_id?: string | null
          trail_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          album_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          target_user_id?: string | null
          trail_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_feed_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_feed_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_feed_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "v_trail_preview"
            referencedColumns: ["id"]
          },
        ]
      }
      album_media: {
        Row: {
          album_id: string
          caption: string | null
          created_at: string | null
          file_path: string
          file_type: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          album_id: string
          caption?: string | null
          created_at?: string | null
          file_path: string
          file_type?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          album_id?: string
          caption?: string | null
          created_at?: string | null
          file_path?: string
          file_type?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "album_media_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
        ]
      }
      albums: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bulk_import_jobs: {
        Row: {
          completed_at: string | null
          config: Json | null
          created_at: string | null
          error_message: string | null
          id: string
          results: Json | null
          source_errors: Json | null
          started_at: string | null
          status: string
          total_sources: number | null
          total_trails_requested: number | null
          trails_added: number | null
          trails_failed: number | null
          trails_processed: number | null
          trails_updated: number | null
        }
        Insert: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          results?: Json | null
          source_errors?: Json | null
          started_at?: string | null
          status?: string
          total_sources?: number | null
          total_trails_requested?: number | null
          trails_added?: number | null
          trails_failed?: number | null
          trails_processed?: number | null
          trails_updated?: number | null
        }
        Update: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          results?: Json | null
          source_errors?: Json | null
          started_at?: string | null
          status?: string
          total_sources?: number | null
          total_trails_requested?: number | null
          trails_added?: number | null
          trails_failed?: number | null
          trails_processed?: number | null
          trails_updated?: number | null
        }
        Relationships: []
      }
      chat_history: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          id: number
          message: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          id?: never
          message?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          id?: never
          message?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_challenges: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          participants: number | null
          reward_badge: string | null
          start_date: string
          target: number
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          participants?: number | null
          reward_badge?: string | null
          start_date: string
          target: number
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          participants?: number | null
          reward_badge?: string | null
          start_date?: string
          target?: number
          title?: string
          type?: string
        }
        Relationships: []
      }
      event_attendees: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "hiking_events"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      hike_sessions: {
        Row: {
          created_at: string | null
          duration: number | null
          end_time: string | null
          id: string
          positions: Json | null
          start_time: string
          status: string
          total_distance: number | null
          total_elevation_gain: number | null
          trail_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          end_time?: string | null
          id?: string
          positions?: Json | null
          start_time: string
          status?: string
          total_distance?: number | null
          total_elevation_gain?: number | null
          trail_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          end_time?: string | null
          id?: string
          positions?: Json | null
          start_time?: string
          status?: string
          total_distance?: number | null
          total_elevation_gain?: number | null
          trail_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hike_sessions_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hike_sessions_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "v_trail_preview"
            referencedColumns: ["id"]
          },
        ]
      }
      hiking_events: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          id: string
          location: string | null
          max_participants: number | null
          organizer_id: string
          title: string
          trail_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          location?: string | null
          max_participants?: number | null
          organizer_id: string
          title: string
          trail_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          location?: string | null
          max_participants?: number | null
          organizer_id?: string
          title?: string
          trail_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hiking_events_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hiking_events_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "v_trail_preview"
            referencedColumns: ["id"]
          },
        ]
      }
      import_logs: {
        Row: {
          api_response_sample: Json | null
          batch_number: number | null
          created_at: string | null
          end_time: string | null
          error_details: Json | null
          failed_imports: number | null
          id: string
          job_id: string | null
          source_name: string
          source_type: string
          start_time: string | null
          successful_imports: number | null
          total_requested: number | null
        }
        Insert: {
          api_response_sample?: Json | null
          batch_number?: number | null
          created_at?: string | null
          end_time?: string | null
          error_details?: Json | null
          failed_imports?: number | null
          id?: string
          job_id?: string | null
          source_name: string
          source_type: string
          start_time?: string | null
          successful_imports?: number | null
          total_requested?: number | null
        }
        Update: {
          api_response_sample?: Json | null
          batch_number?: number | null
          created_at?: string | null
          end_time?: string | null
          error_details?: Json | null
          failed_imports?: number | null
          id?: string
          job_id?: string | null
          source_name?: string
          source_type?: string
          start_time?: string | null
          successful_imports?: number | null
          total_requested?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "import_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "bulk_import_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          media_id: string
          media_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          media_id: string
          media_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          media_id?: string
          media_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      log_photos: {
        Row: {
          caption: string | null
          created_at: string | null
          id: number
          log_id: string | null
          photo_url: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: never
          log_id?: string | null
          photo_url?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: never
          log_id?: string | null
          photo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "log_photos_log_id_fkey"
            columns: ["log_id"]
            isOneToOne: false
            referencedRelation: "trail_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      parking_spots: {
        Row: {
          amenities: string[] | null
          capacity: number | null
          created_at: string | null
          description: string | null
          id: string
          is_free: boolean | null
          lat: number
          latitude: number | null
          lon: number
          longitude: number | null
          name: string | null
          notes: string | null
          trail_id: string | null
        }
        Insert: {
          amenities?: string[] | null
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_free?: boolean | null
          lat: number
          latitude?: number | null
          lon: number
          longitude?: number | null
          name?: string | null
          notes?: string | null
          trail_id?: string | null
        }
        Update: {
          amenities?: string[] | null
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_free?: boolean | null
          lat?: number
          latitude?: number | null
          lon?: number
          longitude?: number | null
          name?: string | null
          notes?: string | null
          trail_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parking_spots_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parking_spots_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "v_trail_preview"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          metric_name: string
          user_id: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_name: string
          user_id?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_name?: string
          user_id?: string | null
          value?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          is_age_verified: boolean | null
          updated_at: string | null
          user_id: string
          username: string | null
          website_url: string | null
          year_of_birth: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          is_age_verified?: boolean | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          website_url?: string | null
          year_of_birth?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          is_age_verified?: boolean | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          website_url?: string | null
          year_of_birth?: number | null
        }
        Relationships: []
      }
      saved_trails: {
        Row: {
          created_at: string | null
          trail_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          trail_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          trail_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_trails_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_trails_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "v_trail_preview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_trails_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      stories: {
        Row: {
          caption: string | null
          created_at: string | null
          expires_at: string
          id: string
          location_name: string | null
          media_url: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          expires_at: string
          id?: string
          location_name?: string | null
          media_url: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          location_name?: string | null
          media_url?: string
          user_id?: string
        }
        Relationships: []
      }
      trail_3d_models: {
        Row: {
          file_size_kb: number | null
          generated_at: string | null
          id: string
          last_updated: string | null
          model_data: Json
          model_type: string
          quality_level: string | null
          trail_id: string
        }
        Insert: {
          file_size_kb?: number | null
          generated_at?: string | null
          id?: string
          last_updated?: string | null
          model_data: Json
          model_type: string
          quality_level?: string | null
          trail_id: string
        }
        Update: {
          file_size_kb?: number | null
          generated_at?: string | null
          id?: string
          last_updated?: string | null
          model_data?: Json
          model_type?: string
          quality_level?: string | null
          trail_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trail_3d_models_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trail_3d_models_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "v_trail_preview"
            referencedColumns: ["id"]
          },
        ]
      }
      trail_data_sources: {
        Row: {
          api_key: string | null
          config: Json | null
          country: string | null
          created_at: string | null
          error_count: number | null
          id: string
          is_active: boolean | null
          last_error: string | null
          last_synced: string | null
          name: string
          rate_limit_per_minute: number | null
          region: string | null
          source_type: string
          state_province: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          api_key?: string | null
          config?: Json | null
          country?: string | null
          created_at?: string | null
          error_count?: number | null
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_synced?: string | null
          name: string
          rate_limit_per_minute?: number | null
          region?: string | null
          source_type: string
          state_province?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          api_key?: string | null
          config?: Json | null
          country?: string | null
          created_at?: string | null
          error_count?: number | null
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_synced?: string | null
          name?: string
          rate_limit_per_minute?: number | null
          region?: string | null
          source_type?: string
          state_province?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      trail_duplicates: {
        Row: {
          created_at: string | null
          duplicate_data: Json | null
          duplicate_source: string
          duplicate_source_id: string
          id: string
          original_trail_id: string | null
          similarity_score: number | null
        }
        Insert: {
          created_at?: string | null
          duplicate_data?: Json | null
          duplicate_source: string
          duplicate_source_id: string
          id?: string
          original_trail_id?: string | null
          similarity_score?: number | null
        }
        Update: {
          created_at?: string | null
          duplicate_data?: Json | null
          duplicate_source?: string
          duplicate_source_id?: string
          id?: string
          original_trail_id?: string | null
          similarity_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trail_duplicates_original_trail_id_fkey"
            columns: ["original_trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trail_duplicates_original_trail_id_fkey"
            columns: ["original_trail_id"]
            isOneToOne: false
            referencedRelation: "v_trail_preview"
            referencedColumns: ["id"]
          },
        ]
      }
      trail_images: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          image_path: string
          is_primary: boolean | null
          trail_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_path: string
          is_primary?: boolean | null
          trail_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_path?: string
          is_primary?: boolean | null
          trail_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trail_images_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trail_images_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "v_trail_preview"
            referencedColumns: ["id"]
          },
        ]
      }
      trail_import_jobs: {
        Row: {
          bulk_job_id: string | null
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          source_id: string
          started_at: string | null
          status: string
          trails_added: number | null
          trails_failed: number | null
          trails_processed: number | null
          trails_updated: number | null
        }
        Insert: {
          bulk_job_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          source_id: string
          started_at?: string | null
          status?: string
          trails_added?: number | null
          trails_failed?: number | null
          trails_processed?: number | null
          trails_updated?: number | null
        }
        Update: {
          bulk_job_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          source_id?: string
          started_at?: string | null
          status?: string
          trails_added?: number | null
          trails_failed?: number | null
          trails_processed?: number | null
          trails_updated?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trail_import_jobs_bulk_job_id_fkey"
            columns: ["bulk_job_id"]
            isOneToOne: false
            referencedRelation: "bulk_import_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      trail_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_type: string
          metadata: Json | null
          trail_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_type: string
          metadata?: Json | null
          trail_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_type?: string
          metadata?: Json | null
          trail_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trail_interactions_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trail_interactions_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "v_trail_preview"
            referencedColumns: ["id"]
          },
        ]
      }
      trail_likes: {
        Row: {
          created_at: string | null
          id: string
          trail_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          trail_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          trail_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trail_likes_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trail_likes_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "v_trail_preview"
            referencedColumns: ["id"]
          },
        ]
      }
      trail_logs: {
        Row: {
          created_at: string | null
          distance: number | null
          duration: unknown | null
          end_time: string | null
          id: string
          notes: string | null
          path: Json | null
          start_time: string | null
          trail_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          distance?: number | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          notes?: string | null
          path?: Json | null
          start_time?: string | null
          trail_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          distance?: number | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          notes?: string | null
          path?: Json | null
          start_time?: string | null
          trail_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trail_logs_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trail_logs_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "v_trail_preview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trail_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trail_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: number
          photo_url: string | null
          rating: number | null
          trail_id: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: never
          photo_url?: string | null
          rating?: number | null
          trail_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: never
          photo_url?: string | null
          rating?: number | null
          trail_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trail_reviews_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trail_reviews_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "v_trail_preview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trail_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trail_waypoints: {
        Row: {
          coordinates_3d: Json | null
          created_at: string | null
          description: string | null
          distance_from_start: number | null
          elevation: number | null
          id: string
          latitude: number
          longitude: number
          name: string
          photos: string[] | null
          trail_id: string
          updated_at: string | null
          waypoint_type: string
        }
        Insert: {
          coordinates_3d?: Json | null
          created_at?: string | null
          description?: string | null
          distance_from_start?: number | null
          elevation?: number | null
          id?: string
          latitude: number
          longitude: number
          name: string
          photos?: string[] | null
          trail_id: string
          updated_at?: string | null
          waypoint_type: string
        }
        Update: {
          coordinates_3d?: Json | null
          created_at?: string | null
          description?: string | null
          distance_from_start?: number | null
          elevation?: number | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          photos?: string[] | null
          trail_id?: string
          updated_at?: string | null
          waypoint_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "trail_waypoints_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trail_waypoints_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "v_trail_preview"
            referencedColumns: ["id"]
          },
        ]
      }
      trail_weather: {
        Row: {
          condition: string | null
          created_at: string | null
          high: number | null
          id: string
          low: number | null
          precipitation: string | null
          sunrise: string | null
          sunset: string | null
          temperature: number | null
          trail_id: string
          updated_at: string | null
          wind_direction: string | null
          wind_speed: string | null
        }
        Insert: {
          condition?: string | null
          created_at?: string | null
          high?: number | null
          id?: string
          low?: number | null
          precipitation?: string | null
          sunrise?: string | null
          sunset?: string | null
          temperature?: number | null
          trail_id: string
          updated_at?: string | null
          wind_direction?: string | null
          wind_speed?: string | null
        }
        Update: {
          condition?: string | null
          created_at?: string | null
          high?: number | null
          id?: string
          low?: number | null
          precipitation?: string | null
          sunrise?: string | null
          sunset?: string | null
          temperature?: number | null
          trail_id?: string
          updated_at?: string | null
          wind_direction?: string | null
          wind_speed?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trail_weather_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trail_weather_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "v_trail_preview"
            referencedColumns: ["id"]
          },
        ]
      }
      trail_weather_forecasts: {
        Row: {
          created_at: string | null
          daily: Json | null
          hourly: Json | null
          id: string
          trail_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          daily?: Json | null
          hourly?: Json | null
          id?: string
          trail_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          daily?: Json | null
          hourly?: Json | null
          id?: string
          trail_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trail_weather_forecasts_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trail_weather_forecasts_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "v_trail_preview"
            referencedColumns: ["id"]
          },
        ]
      }
      trails: {
        Row: {
          accessibility_features: string[] | null
          best_seasons: string[] | null
          camping_available: boolean | null
          category: Database["public"]["Enums"]["trail_category"] | null
          created_at: string | null
          data_quality_score: number | null
          description: string | null
          difficulty: Database["public"]["Enums"]["trail_difficulty"] | null
          dogs_allowed: boolean | null
          elevation_gain: number | null
          elevation_profile: Json | null
          estimated_time: string | null
          features: string[] | null
          geom: unknown | null
          id: string
          import_job_id: string | null
          is_active: boolean | null
          last_verified: string | null
          lat: number | null
          latitude: number | null
          length: number | null
          length_miles: number | null
          location: string | null
          lon: number | null
          longitude: number | null
          name: string
          permit_required: boolean | null
          photos: string[] | null
          rating: number | null
          route_geojson: Json | null
          seasonal_conditions: Json | null
          source: string | null
          state: string | null
          status: string | null
          surface_type: string | null
          tags: string[] | null
          terrain_mesh_data: Json | null
          trail_type: Database["public"]["Enums"]["trail_type"] | null
          trailhead_info: Json | null
          waypoints: Json | null
        }
        Insert: {
          accessibility_features?: string[] | null
          best_seasons?: string[] | null
          camping_available?: boolean | null
          category?: Database["public"]["Enums"]["trail_category"] | null
          created_at?: string | null
          data_quality_score?: number | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["trail_difficulty"] | null
          dogs_allowed?: boolean | null
          elevation_gain?: number | null
          elevation_profile?: Json | null
          estimated_time?: string | null
          features?: string[] | null
          geom?: unknown | null
          id?: string
          import_job_id?: string | null
          is_active?: boolean | null
          last_verified?: string | null
          lat?: number | null
          latitude?: number | null
          length?: number | null
          length_miles?: number | null
          location?: string | null
          lon?: number | null
          longitude?: number | null
          name: string
          permit_required?: boolean | null
          photos?: string[] | null
          rating?: number | null
          route_geojson?: Json | null
          seasonal_conditions?: Json | null
          source?: string | null
          state?: string | null
          status?: string | null
          surface_type?: string | null
          tags?: string[] | null
          terrain_mesh_data?: Json | null
          trail_type?: Database["public"]["Enums"]["trail_type"] | null
          trailhead_info?: Json | null
          waypoints?: Json | null
        }
        Update: {
          accessibility_features?: string[] | null
          best_seasons?: string[] | null
          camping_available?: boolean | null
          category?: Database["public"]["Enums"]["trail_category"] | null
          created_at?: string | null
          data_quality_score?: number | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["trail_difficulty"] | null
          dogs_allowed?: boolean | null
          elevation_gain?: number | null
          elevation_profile?: Json | null
          estimated_time?: string | null
          features?: string[] | null
          geom?: unknown | null
          id?: string
          import_job_id?: string | null
          is_active?: boolean | null
          last_verified?: string | null
          lat?: number | null
          latitude?: number | null
          length?: number | null
          length_miles?: number | null
          location?: string | null
          lon?: number | null
          longitude?: number | null
          name?: string
          permit_required?: boolean | null
          photos?: string[] | null
          rating?: number | null
          route_geojson?: Json | null
          seasonal_conditions?: Json | null
          source?: string | null
          state?: string | null
          status?: string | null
          surface_type?: string | null
          tags?: string[] | null
          terrain_mesh_data?: Json | null
          trail_type?: Database["public"]["Enums"]["trail_type"] | null
          trailhead_info?: Json | null
          waypoints?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "trails_import_job_id_fkey"
            columns: ["import_job_id"]
            isOneToOne: false
            referencedRelation: "bulk_import_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_memory: {
        Row: {
          content: string
          created_at: string | null
          expires_at: string | null
          id: string
          importance_score: number | null
          memory_type: string
          metadata: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          importance_score?: number | null
          memory_type: string
          metadata?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          importance_score?: number | null
          memory_type?: string
          metadata?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          favorite_tags: string[] | null
          id: string
          location_preferences: Json | null
          preferred_difficulty: string | null
          preferred_length_range: unknown | null
          time_of_day: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          favorite_tags?: string[] | null
          id?: string
          location_preferences?: Json | null
          preferred_difficulty?: string | null
          preferred_length_range?: unknown | null
          time_of_day?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          favorite_tags?: string[] | null
          id?: string
          location_preferences?: Json | null
          preferred_difficulty?: string | null
          preferred_length_range?: unknown | null
          time_of_day?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          total_distance: number | null
          total_elevation: number | null
          total_trails: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          total_distance?: number | null
          total_elevation?: number | null
          total_trails?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          total_distance?: number | null
          total_elevation?: number | null
          total_trails?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown | null
          f_table_catalog: unknown | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown | null
          f_table_catalog: string | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      v_trail_preview: {
        Row: {
          blurb: string | null
          cover_photo: string | null
          difficulty: Database["public"]["Enums"]["trail_difficulty"] | null
          id: string | null
          length_miles: number | null
          location: string | null
          name: string | null
          rating: number | null
          state: string | null
        }
        Insert: {
          blurb?: never
          cover_photo?: never
          difficulty?: Database["public"]["Enums"]["trail_difficulty"] | null
          id?: string | null
          length_miles?: number | null
          location?: string | null
          name?: string | null
          rating?: number | null
          state?: string | null
        }
        Update: {
          blurb?: never
          cover_photo?: never
          difficulty?: Database["public"]["Enums"]["trail_difficulty"] | null
          id?: string | null
          length_miles?: number | null
          location?: string | null
          name?: string | null
          rating?: number | null
          state?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { oldname: string; newname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { tbl: unknown; col: string }
        Returns: unknown
      }
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_selectivity: {
        Args: { tbl: unknown; att_name: string; geom: unknown; mode?: string }
        Returns: number
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_bestsrid: {
        Args: { "": unknown }
        Returns: number
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_pointoutside: {
        Args: { "": unknown }
        Returns: unknown
      }
      _st_sortablehash: {
        Args: { geom: unknown }
        Returns: number
      }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          g1: unknown
          clip?: unknown
          tolerance?: number
          return_polygons?: boolean
        }
        Returns: unknown
      }
      _st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      addauth: {
        Args: { "": string }
        Returns: boolean
      }
      addgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
              new_srid_in: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
          | {
              schema_name: string
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
          | {
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
        Returns: string
      }
      audit_all_table_security: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          rls_enabled: boolean
          policy_count: number
          has_user_policies: boolean
          security_recommendation: string
        }[]
      }
      audit_security_comprehensive: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
          table_name: string
          issue_type: string
          severity: string
          description: string
          recommendation: string
          sql_fix: string
        }[]
      }
      audit_user_data_isolation: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          policy_name: string
          policy_command: string
          has_user_isolation: boolean
          security_status: string
        }[]
      }
      box: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box3d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3dtobox: {
        Args: { "": unknown }
        Returns: unknown
      }
      bulk_insert_trails: {
        Args: { payload: Json }
        Returns: {
          inserted_count: number
          updated_count: number
        }[]
      }
      bytea: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      calculate_trail_quality_score: {
        Args: {
          trail_name: string
          trail_description: string
          trail_length: number
          trail_elevation: number
          trail_lat: number
          trail_lon: number
        }
        Returns: number
      }
      check_user_permission: {
        Args: { required_permission: string; resource_id?: string }
        Returns: boolean
      }
      disablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      dropgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
            }
          | { schema_name: string; table_name: string; column_name: string }
          | { table_name: string; column_name: string }
        Returns: string
      }
      dropgeometrytable: {
        Args:
          | { catalog_name: string; schema_name: string; table_name: string }
          | { schema_name: string; table_name: string }
          | { table_name: string }
        Returns: string
      }
      enablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geography: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      geography_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geography_gist_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_gist_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_send: {
        Args: { "": unknown }
        Returns: string
      }
      geography_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geography_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry: {
        Args:
          | { "": string }
          | { "": string }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
        Returns: unknown
      }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_sortsupport_2d: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_hash: {
        Args: { "": unknown }
        Returns: number
      }
      geometry_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_send: {
        Args: { "": unknown }
        Returns: string
      }
      geometry_sortsupport: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_spgist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_3d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geometry_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometrytype: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      get_proj4_from_srid: {
        Args: { "": number }
        Returns: string
      }
      get_trail_preview: {
        Args: { p_id: string }
        Returns: {
          blurb: string | null
          cover_photo: string | null
          difficulty: Database["public"]["Enums"]["trail_difficulty"] | null
          id: string | null
          length_miles: number | null
          location: string | null
          name: string | null
          rating: number | null
          state: string | null
        }[]
      }
      get_trail_recommendations: {
        Args: {
          user_difficulty?: Database["public"]["Enums"]["trail_difficulty"]
          user_length_preference?: number
          user_location_lat?: number
          user_location_lng?: number
          recommendation_limit?: number
        }
        Returns: {
          id: string
          name: string
          location: string
          difficulty: Database["public"]["Enums"]["trail_difficulty"]
          length: number
          elevation_gain: number
          latitude: number
          longitude: number
          tags: string[]
          photos: string[]
          recommendation_score: number
        }[]
      }
      get_trail_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_trails: number
          active_trails: number
          trails_by_difficulty: Json
          average_length: number
          total_elevation_gain: number
        }[]
      }
      gettransactionid: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      gidx_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gidx_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      greentrails_health_check: {
        Args: Record<PropertyKey, never>
        Returns: {
          component: string
          status: string
          details: string
          recommendation: string
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      json: {
        Args: { "": unknown }
        Returns: Json
      }
      jsonb: {
        Args: { "": unknown }
        Returns: Json
      }
      log_performance_improvement: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      log_security_error: {
        Args: { error_type: string; error_message: string; context_data?: Json }
        Returns: undefined
      }
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      monitor_security_events: {
        Args: Record<PropertyKey, never>
        Returns: {
          event_time: string
          event_type: string
          user_id: string
          details: Json
          severity: string
        }[]
      }
      path: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_asflatgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_geometry_clusterintersecting_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_clusterwithin_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_collect_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_makeline_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_polygonize_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      point: {
        Args: { "": unknown }
        Returns: unknown
      }
      polygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      populate_geometry_columns: {
        Args:
          | { tbl_oid: unknown; use_typmod?: boolean }
          | { use_typmod?: boolean }
        Returns: string
      }
      postgis_addbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_constraint_dims: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: string
      }
      postgis_dropbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_full_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_geos_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_geos_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_getbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_hasbbox: {
        Args: { "": unknown }
        Returns: boolean
      }
      postgis_index_supportfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_proj_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_svn_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_type_name: {
        Args: {
          geomname: string
          coord_dimension: number
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_typmod_dims: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_srid: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_type: {
        Args: { "": number }
        Returns: string
      }
      postgis_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search_trails: {
        Args: {
          search_query?: string
          filter_difficulty?: Database["public"]["Enums"]["trail_difficulty"]
          filter_length_min?: number
          filter_length_max?: number
          filter_tags?: string[]
          filter_features?: string[]
          sort_by?: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: string
          name: string
          location: string
          description: string
          difficulty: Database["public"]["Enums"]["trail_difficulty"]
          length: number
          elevation_gain: number
          latitude: number
          longitude: number
          tags: string[]
          photos: string[]
          features: string[]
          surface_type: string
          permit_required: boolean
          dogs_allowed: boolean
          camping_available: boolean
          data_quality_score: number
          created_at: string
        }[]
      }
      spheroid_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      spheroid_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlength: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dperimeter: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle: {
        Args:
          | { line1: unknown; line2: unknown }
          | { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
        Returns: number
      }
      st_area: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_area2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_asbinary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_asewkt: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asgeojson: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; options?: number }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              r: Record<string, unknown>
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
            }
        Returns: string
      }
      st_asgml: {
        Args:
          | { "": string }
          | {
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              version: number
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
          | {
              version: number
              geom: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
        Returns: string
      }
      st_ashexewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_askml: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
          | { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
        Returns: string
      }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: {
        Args: { geom: unknown; format?: string }
        Returns: string
      }
      st_asmvtgeom: {
        Args: {
          geom: unknown
          bounds: unknown
          extent?: number
          buffer?: number
          clip_geom?: boolean
        }
        Returns: unknown
      }
      st_assvg: {
        Args:
          | { "": string }
          | { geog: unknown; rel?: number; maxdecimaldigits?: number }
          | { geom: unknown; rel?: number; maxdecimaldigits?: number }
        Returns: string
      }
      st_astext: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_astwkb: {
        Args:
          | {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
          | {
              geom: unknown
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
        Returns: string
      }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_boundary: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_boundingdiagonal: {
        Args: { geom: unknown; fits?: boolean }
        Returns: unknown
      }
      st_buffer: {
        Args:
          | { geom: unknown; radius: number; options?: string }
          | { geom: unknown; radius: number; quadsegs: number }
        Returns: unknown
      }
      st_buildarea: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_centroid: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      st_cleangeometry: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_clipbybox2d: {
        Args: { geom: unknown; box: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_clusterintersecting: {
        Args: { "": unknown[] }
        Returns: unknown[]
      }
      st_collect: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collectionextract: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_collectionhomogenize: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_concavehull: {
        Args: {
          param_geom: unknown
          param_pctconvex: number
          param_allow_holes?: boolean
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_convexhull: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_coorddim: {
        Args: { geometry: unknown }
        Returns: number
      }
      st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_curvetoline: {
        Args: { geom: unknown; tol?: number; toltype?: number; flags?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { g1: unknown; tolerance?: number; flags?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_dimension: {
        Args: { "": unknown }
        Returns: number
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance: {
        Args:
          | { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_distancesphere: {
        Args:
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; radius: number }
        Returns: number
      }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dump: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumppoints: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumprings: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumpsegments: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_endpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_envelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_expand: {
        Args:
          | { box: unknown; dx: number; dy: number }
          | { box: unknown; dx: number; dy: number; dz?: number }
          | { geom: unknown; dx: number; dy: number; dz?: number; dm?: number }
        Returns: unknown
      }
      st_exteriorring: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_flipcoordinates: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force3d: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; zvalue?: number; mvalue?: number }
        Returns: unknown
      }
      st_forcecollection: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcecurve: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygonccw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygoncw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcerhr: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcesfs: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_generatepoints: {
        Args:
          | { area: unknown; npoints: number }
          | { area: unknown; npoints: number; seed: number }
        Returns: unknown
      }
      st_geogfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geogfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geographyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geohash: {
        Args:
          | { geog: unknown; maxchars?: number }
          | { geom: unknown; maxchars?: number }
        Returns: string
      }
      st_geomcollfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomcollfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometricmedian: {
        Args: {
          g: unknown
          tolerance?: number
          max_iter?: number
          fail_if_not_converged?: boolean
        }
        Returns: unknown
      }
      st_geometryfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometrytype: {
        Args: { "": unknown }
        Returns: string
      }
      st_geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromgeojson: {
        Args: { "": Json } | { "": Json } | { "": string }
        Returns: unknown
      }
      st_geomfromgml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromkml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfrommarc21: {
        Args: { marc21xml: string }
        Returns: unknown
      }
      st_geomfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromtwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_gmltosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_hasarc: {
        Args: { geometry: unknown }
        Returns: boolean
      }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { size: number; cell_i: number; cell_j: number; origin?: unknown }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { size: number; bounds: unknown }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_isclosed: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_iscollection: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isempty: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygonccw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygoncw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isring: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_issimple: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvalid: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvaliddetail: {
        Args: { geom: unknown; flags?: number }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
      }
      st_isvalidreason: {
        Args: { "": unknown }
        Returns: string
      }
      st_isvalidtrajectory: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_length: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_length2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_letters: {
        Args: { letters: string; font?: Json }
        Returns: unknown
      }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { txtin: string; nprecision?: number }
        Returns: unknown
      }
      st_linefrommultipoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_linefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linemerge: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linestringfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linetocurve: {
        Args: { geometry: unknown }
        Returns: unknown
      }
      st_locatealong: {
        Args: { geometry: unknown; measure: number; leftrightoffset?: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          geometry: unknown
          frommeasure: number
          tomeasure: number
          leftrightoffset?: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { geometry: unknown; fromelevation: number; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_m: {
        Args: { "": unknown }
        Returns: number
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makepolygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { "": unknown } | { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_maximuminscribedcircle: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_memsize: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_minimumboundingradius: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_minimumclearance: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumclearanceline: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_mlinefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mlinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multi: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_multilinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multilinestringfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_ndims: {
        Args: { "": unknown }
        Returns: number
      }
      st_node: {
        Args: { g: unknown }
        Returns: unknown
      }
      st_normalize: {
        Args: { geom: unknown }
        Returns: unknown
      }
      st_npoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_nrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numgeometries: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorring: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpatches: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_offsetcurve: {
        Args: { line: unknown; distance: number; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_orientedenvelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { "": unknown } | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_perimeter2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_pointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointonsurface: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_points: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_polyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonize: {
        Args: { "": unknown[] }
        Returns: unknown
      }
      st_project: {
        Args: { geog: unknown; distance: number; azimuth: number }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_x: number
          prec_y?: number
          prec_z?: number
          prec_m?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: string
      }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_reverse: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid: {
        Args: { geog: unknown; srid: number } | { geom: unknown; srid: number }
        Returns: unknown
      }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shiftlongitude: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; vertex_fraction: number; is_outer?: boolean }
        Returns: unknown
      }
      st_split: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_square: {
        Args: { size: number; cell_i: number; cell_j: number; origin?: unknown }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { size: number; bounds: unknown }
        Returns: Record<string, unknown>[]
      }
      st_srid: {
        Args: { geog: unknown } | { geom: unknown }
        Returns: number
      }
      st_startpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_subdivide: {
        Args: { geom: unknown; maxvertices?: number; gridsize?: number }
        Returns: unknown[]
      }
      st_summary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          zoom: number
          x: number
          y: number
          bounds?: unknown
          margin?: number
        }
        Returns: unknown
      }
      st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_transform: {
        Args:
          | { geom: unknown; from_proj: string; to_proj: string }
          | { geom: unknown; from_proj: string; to_srid: number }
          | { geom: unknown; to_proj: string }
        Returns: unknown
      }
      st_triangulatepolygon: {
        Args: { g1: unknown }
        Returns: unknown
      }
      st_union: {
        Args:
          | { "": unknown[] }
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; gridsize: number }
        Returns: unknown
      }
      st_voronoilines: {
        Args: { g1: unknown; tolerance?: number; extend_to?: unknown }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { g1: unknown; tolerance?: number; extend_to?: unknown }
        Returns: unknown
      }
      st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_wkbtosql: {
        Args: { wkb: string }
        Returns: unknown
      }
      st_wkttosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_wrapx: {
        Args: { geom: unknown; wrap: number; move: number }
        Returns: unknown
      }
      st_x: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmin: {
        Args: { "": unknown }
        Returns: number
      }
      st_y: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymax: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymin: {
        Args: { "": unknown }
        Returns: number
      }
      st_z: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmflag: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmin: {
        Args: { "": unknown }
        Returns: number
      }
      test_rls_policies: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          test_type: string
          result: string
          details: string
        }[]
      }
      text: {
        Args: { "": unknown }
        Returns: string
      }
      trails_within_radius: {
        Args: { center_lat: number; center_lng: number; radius_km?: number }
        Returns: {
          id: string
          name: string
          location: string
          description: string
          difficulty: Database["public"]["Enums"]["trail_difficulty"]
          length: number
          elevation_gain: number
          latitude: number
          longitude: number
          tags: string[]
          photos: string[]
          features: string[]
          best_seasons: string[]
          surface_type: string
          accessibility_features: string[]
          permit_required: boolean
          dogs_allowed: boolean
          camping_available: boolean
          created_at: string
          data_quality_score: number
        }[]
      }
      unlockrows: {
        Args: { "": string }
        Returns: number
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          schema_name: string
          table_name: string
          column_name: string
          new_srid_in: number
        }
        Returns: string
      }
      validate_auth_requirements: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_name: string
          status: string
          message: string
        }[]
      }
      validate_import_readiness: {
        Args: Record<PropertyKey, never>
        Returns: {
          ready: boolean
          active_sources: number
          total_sources: number
          issues: string[]
        }[]
      }
    }
    Enums: {
      trail_category: "hiking" | "biking" | "offroad"
      trail_difficulty: "easy" | "moderate" | "hard" | "expert"
      trail_type: "loop" | "out_and_back" | "point_to_point"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      trail_category: ["hiking", "biking", "offroad"],
      trail_difficulty: ["easy", "moderate", "hard", "expert"],
      trail_type: ["loop", "out_and_back", "point_to_point"],
    },
  },
} as const

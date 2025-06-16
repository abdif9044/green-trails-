export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bulk_import_jobs: {
        Row: {
          completed_at: string | null
          config: Json | null
          id: string
          last_updated: string | null
          results: Json | null
          started_at: string
          status: string
          total_sources: number
          total_trails_requested: number
          trails_added: number | null
          trails_failed: number | null
          trails_processed: number | null
          trails_updated: number | null
        }
        Insert: {
          completed_at?: string | null
          config?: Json | null
          id?: string
          last_updated?: string | null
          results?: Json | null
          started_at?: string
          status: string
          total_sources: number
          total_trails_requested: number
          trails_added?: number | null
          trails_failed?: number | null
          trails_processed?: number | null
          trails_updated?: number | null
        }
        Update: {
          completed_at?: string | null
          config?: Json | null
          id?: string
          last_updated?: string | null
          results?: Json | null
          started_at?: string
          status?: string
          total_sources?: number
          total_trails_requested?: number
          trails_added?: number | null
          trails_failed?: number | null
          trails_processed?: number | null
          trails_updated?: number | null
        }
        Relationships: []
      }
      community_challenges: {
        Row: {
          created_at: string | null
          description: string
          end_date: string
          id: string
          participants: number | null
          reward_badge: string | null
          start_date: string
          target: number
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          end_date: string
          id?: string
          participants?: number | null
          reward_badge?: string | null
          start_date: string
          target: number
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          end_date?: string
          id?: string
          participants?: number | null
          reward_badge?: string | null
          start_date?: string
          target?: number
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      parking_spots: {
        Row: {
          capacity: number | null
          created_at: string | null
          description: string | null
          id: string
          is_free: boolean | null
          latitude: number
          longitude: number
          name: string
          notes: string | null
          trail_id: string | null
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_free?: boolean | null
          latitude: number
          longitude: number
          name: string
          notes?: string | null
          trail_id?: string | null
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_free?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          notes?: string | null
          trail_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parking_spots_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_age_verified: boolean | null
          updated_at: string | null
          username: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_age_verified?: boolean | null
          updated_at?: string | null
          username?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_age_verified?: boolean | null
          updated_at?: string | null
          username?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      trail_import_jobs: {
        Row: {
          bulk_job_id: string | null
          completed_at: string | null
          error_message: string | null
          id: string
          source_id: string
          started_at: string
          status: string
          trails_added: number | null
          trails_processed: number | null
          trails_updated: number | null
        }
        Insert: {
          bulk_job_id?: string | null
          completed_at?: string | null
          error_message?: string | null
          id?: string
          source_id: string
          started_at?: string
          status: string
          trails_added?: number | null
          trails_processed?: number | null
          trails_updated?: number | null
        }
        Update: {
          bulk_job_id?: string | null
          completed_at?: string | null
          error_message?: string | null
          id?: string
          source_id?: string
          started_at?: string
          status?: string
          trails_added?: number | null
          trails_processed?: number | null
          trails_updated?: number | null
        }
        Relationships: []
      }
      trails: {
        Row: {
          country: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          elevation: number | null
          elevation_gain: number | null
          geojson: Json | null
          id: string
          is_age_restricted: boolean | null
          is_verified: boolean | null
          latitude: number | null
          length: number | null
          location: string
          longitude: number | null
          name: string
          region: string | null
          state_province: string | null
          terrain_type: string | null
          trail_length: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          elevation?: number | null
          elevation_gain?: number | null
          geojson?: Json | null
          id?: string
          is_age_restricted?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          length?: number | null
          location: string
          longitude?: number | null
          name: string
          region?: string | null
          state_province?: string | null
          terrain_type?: string | null
          trail_length?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          elevation?: number | null
          elevation_gain?: number | null
          geojson?: Json | null
          id?: string
          is_age_restricted?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          length?: number | null
          location?: string
          longitude?: number | null
          name?: string
          region?: string | null
          state_province?: string | null
          terrain_type?: string | null
          trail_length?: number | null
          updated_at?: string | null
          user_id?: string | null
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
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          total_distance?: number | null
          total_elevation?: number | null
          total_trails?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          total_distance?: number | null
          total_elevation?: number | null
          total_trails?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

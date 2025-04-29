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
      albums: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_private: boolean | null
          location: string | null
          title: string
          trail_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          location?: string | null
          title: string
          trail_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          location?: string | null
          title?: string
          trail_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          media_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          media_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          media_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
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
      hashtags: {
        Row: {
          id: string
          tag: string
        }
        Insert: {
          id?: string
          tag: string
        }
        Update: {
          id?: string
          tag?: string
        }
        Relationships: []
      }
      legal_content: {
        Row: {
          content: string
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          media_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          media_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          media_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          album_id: string
          caption: string | null
          created_at: string | null
          file_path: string
          file_type: string
          id: string
          user_id: string
        }
        Insert: {
          album_id: string
          caption?: string | null
          created_at?: string | null
          file_path: string
          file_type: string
          id?: string
          user_id: string
        }
        Update: {
          album_id?: string
          caption?: string | null
          created_at?: string | null
          file_path?: string
          file_type?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
        ]
      }
      media_hashtags: {
        Row: {
          hashtag_id: string
          id: string
          media_id: string
        }
        Insert: {
          hashtag_id: string
          id?: string
          media_id: string
        }
        Update: {
          hashtag_id?: string
          id?: string
          media_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_hashtags_hashtag_id_fkey"
            columns: ["hashtag_id"]
            isOneToOne: false
            referencedRelation: "hashtags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_hashtags_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
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
      trail_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          trail_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          trail_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          trail_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trail_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          trail_id: string | null
          user_id: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_path: string
          is_primary?: boolean | null
          trail_id?: string | null
          user_id?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_path?: string
          is_primary?: boolean | null
          trail_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trail_images_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
        ]
      }
      trail_likes: {
        Row: {
          created_at: string | null
          id: string
          trail_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          trail_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          trail_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trail_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trail_ratings: {
        Row: {
          created_at: string | null
          id: string
          rating: number
          trail_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rating: number
          trail_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rating?: number
          trail_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trail_tags: {
        Row: {
          created_at: string | null
          id: string
          is_strain_tag: boolean | null
          tag: string
          trail_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_strain_tag?: boolean | null
          tag: string
          trail_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_strain_tag?: boolean | null
          tag?: string
          trail_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trail_tags_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "trails"
            referencedColumns: ["id"]
          },
        ]
      }
      trail_weather: {
        Row: {
          condition: string | null
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
        Relationships: []
      }
      trails: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: string
          elevation: number
          id: string
          is_age_restricted: boolean | null
          is_verified: boolean | null
          latitude: number | null
          length: number
          location: string
          longitude: number | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty: string
          elevation: number
          id?: string
          is_age_restricted?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          length: number
          location: string
          longitude?: number | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: string
          elevation?: number
          id?: string
          is_age_restricted?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          length?: number
          location?: string
          longitude?: number | null
          name?: string
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
      execute_sql: {
        Args: { sql_query: string } | { sql_query: string; params?: Json }
        Returns: Json[]
      }
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

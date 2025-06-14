
import { supabase } from '@/integrations/supabase/client';

/**
 * Service responsible for managing tag-related database operations
 */
export class TagsService {
  /**
   * Sets up the tables required for trail tags
   * @returns Promise resolving to success status and optional error
   */
  static async setupTagTables() {
    try {
      // Use the raw SQL script to create necessary tables
      const { error } = await supabase.rpc('execute_sql', { 
        sql_query: `
          -- Add tags table if it doesn't exist
          CREATE TABLE IF NOT EXISTS tags (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL UNIQUE,
            details JSONB,
            created_at TIMESTAMPTZ DEFAULT now()
          );

          -- Add trail_tags junction table if it doesn't exist
          CREATE TABLE IF NOT EXISTS trail_tags (
            trail_id UUID REFERENCES trails(id) ON DELETE CASCADE,
            tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
            PRIMARY KEY (trail_id, tag_id)
          );

          -- Add index for faster tag queries
          CREATE INDEX IF NOT EXISTS idx_trail_tags_trail_id ON trail_tags(trail_id);
          CREATE INDEX IF NOT EXISTS idx_trail_tags_tag_id ON trail_tags(tag_id);
        `
      });

      if (error) {
        console.error('Error setting up tag tables:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Exception when setting up tag tables:', error);
      return { success: false, error };
    }
  }
}

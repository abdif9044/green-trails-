
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
          -- Add tags table if it doesn't exist (for regular and strain tags)
          CREATE TABLE IF NOT EXISTS tags (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL UNIQUE,
            tag_type TEXT NOT NULL DEFAULT 'regular',
            details JSONB,
            created_at TIMESTAMPTZ DEFAULT now()
          );

          -- Add trail_tags junction table if it doesn't exist
          CREATE TABLE IF NOT EXISTS trail_tags (
            trail_id UUID REFERENCES trails(id) ON DELETE CASCADE,
            tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
            is_strain_tag BOOLEAN DEFAULT false,
            PRIMARY KEY (trail_id, tag_id)
          );

          -- Add index for faster tag queries
          CREATE INDEX IF NOT EXISTS idx_trail_tags_trail_id ON trail_tags(trail_id);
          CREATE INDEX IF NOT EXISTS idx_trail_tags_tag_id ON trail_tags(tag_id);
          CREATE INDEX IF NOT EXISTS idx_trail_tags_is_strain ON trail_tags(is_strain_tag);
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
  
  /**
   * Create default strain tags for cannabis-friendly trails
   * @returns Promise resolving to success status
   */
  static async createDefaultStrainTags() {
    try {
      const defaultStrains = [
        { name: 'Sativa', details: { effects: ['energizing', 'uplifting', 'creative'] } },
        { name: 'Indica', details: { effects: ['relaxing', 'sedating', 'pain relief'] } },
        { name: 'Hybrid', details: { effects: ['balanced', 'varied effects'] } },
        { name: 'CBD', details: { effects: ['non-psychoactive', 'therapeutic'] } }
      ];
      
      // Check if the tags table exists
      const { data: tableExists, error: checkError } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = 'tags'
          ) as exists;
        `
      });
      
      if (checkError) {
        console.error('Error checking if tags table exists:', checkError);
        return { success: false, error: checkError };
      }
      
      // Properly handle the returned data using type assertions
      let tagsTableExists = false;
      
      if (tableExists && Array.isArray(tableExists) && tableExists.length > 0) {
        const result = tableExists[0] as Record<string, unknown>;
        tagsTableExists = result.exists === true;
      }
      
      // If tags table exists, insert default strains
      if (tagsTableExists) {
        // Insert default strain tags if they don't exist
        for (const strain of defaultStrains) {
          const { error } = await supabase.rpc('execute_sql', {
            sql_query: `
              INSERT INTO tags (name, tag_type, details)
              VALUES ('${strain.name}', 'strain', '${JSON.stringify(strain.details)}')
              ON CONFLICT (name) DO NOTHING;
            `
          });
          
          if (error) {
            console.error(`Error inserting strain tag ${strain.name}:`, error);
            return { success: false, error };
          }
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Exception when creating default strain tags:', error);
      return { success: false, error };
    }
  }
}

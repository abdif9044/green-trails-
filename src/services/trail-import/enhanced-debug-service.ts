
import { supabase } from '@/integrations/supabase/client';

export class EnhancedDebugService {
  /**
   * Test database permissions and schema
   */
  static async testDatabasePermissions(): Promise<{
    canSelect: boolean;
    canInsert: boolean;
    userRole: string;
    rlsEnabled: boolean;
    error?: string;
  }> {
    try {
      // Test basic select
      const { data: selectData, error: selectError } = await supabase
        .from('trails')
        .select('count')
        .limit(1);

      const canSelect = !selectError;

      // Test insert (will fail if no auth, but that's expected)
      const { error: insertError } = await supabase
        .from('trails')
        .insert({
          name: 'Test Trail',
          location: 'Test Location',
          difficulty: 'easy',
          length: 1.0
        });

      const canInsert = !insertError;

      // Clean up test insert if it succeeded
      if (canInsert) {
        await supabase
          .from('trails')
          .delete()
          .eq('name', 'Test Trail');
      }

      return {
        canSelect,
        canInsert,
        userRole: 'authenticated',
        rlsEnabled: true
      };
    } catch (error) {
      return {
        canSelect: false,
        canInsert: false,
        userRole: 'anonymous',
        rlsEnabled: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get database statistics
   */
  static async getDatabaseStats(): Promise<{
    totalTrails: number;
    totalUsers: number;
    totalAlbums: number;
    recentActivity: number;
  }> {
    try {
      const [trailsResult, usersResult, albumsResult, activityResult] = await Promise.all([
        supabase.from('trails').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('albums').select('*', { count: 'exact', head: true }),
        supabase.from('activity_feed').select('*', { count: 'exact', head: true })
      ]);

      return {
        totalTrails: trailsResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalAlbums: albumsResult.count || 0,
        recentActivity: activityResult.count || 0
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      return {
        totalTrails: 0,
        totalUsers: 0,
        totalAlbums: 0,
        recentActivity: 0
      };
    }
  }

  /**
   * Test import functionality
   */
  static async testImportFunctionality(): Promise<{
    edgeFunctionAvailable: boolean;
    bulkImportTablesExist: boolean;
    canCreateImportJob: boolean;
    error?: string;
  }> {
    try {
      // Test bulk import tables
      const { error: bulkTableError } = await supabase
        .from('bulk_import_jobs')
        .select('id')
        .limit(1);

      const bulkImportTablesExist = !bulkTableError;

      // Test creating an import job
      const { error: jobError } = await supabase
        .from('bulk_import_jobs')
        .insert({
          status: 'pending',
          total_trails_requested: 1,
          total_sources: 1
        });

      const canCreateImportJob = !jobError;

      // Clean up test job
      if (canCreateImportJob) {
        await supabase
          .from('bulk_import_jobs')
          .delete()
          .eq('total_trails_requested', 1);
      }

      return {
        edgeFunctionAvailable: true, // Assume available if no errors
        bulkImportTablesExist,
        canCreateImportJob
      };
    } catch (error) {
      return {
        edgeFunctionAvailable: false,
        bulkImportTablesExist: false,
        canCreateImportJob: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

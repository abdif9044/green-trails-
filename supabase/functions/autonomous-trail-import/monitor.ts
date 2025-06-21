
export class ImportMonitor {
  private supabase: any;
  
  constructor(supabase: any) {
    this.supabase = supabase;
  }
  
  async getCurrentTrailCount(): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error getting trail count:', error);
        return 0;
      }
      
      return count || 0;
    } catch (error) {
      console.error('Error in getCurrentTrailCount:', error);
      return 0;
    }
  }
  
  async logProgress(phase: string, progress: number, totalTarget: number): Promise<void> {
    try {
      const currentCount = await this.getCurrentTrailCount();
      console.log(`📊 ${phase}: ${currentCount}/${totalTarget} trails (${Math.round((currentCount / totalTarget) * 100)}%)`);
    } catch (error) {
      console.error('Error logging progress:', error);
    }
  }
  
  async validateImportQuality(): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    try {
      // Check for duplicate trails
      const { data: duplicates } = await this.supabase
        .from('trails')
        .select('name, location, count(*)')
        .group('name, location')
        .having('count(*) > 1');
      
      if (duplicates && duplicates.length > 0) {
        issues.push(`Found ${duplicates.length} duplicate trail combinations`);
      }
      
      // Check for trails without required fields
      const { data: incomplete } = await this.supabase
        .from('trails')
        .select('id')
        .or('name.is.null,location.is.null,difficulty.is.null');
      
      if (incomplete && incomplete.length > 0) {
        issues.push(`Found ${incomplete.length} trails with missing required fields`);
      }
      
      return {
        valid: issues.length === 0,
        issues
      };
      
    } catch (error) {
      console.error('Error validating import quality:', error);
      return {
        valid: false,
        issues: ['Failed to validate import quality']
      };
    }
  }
}

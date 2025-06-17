
import { supabase } from '@/integrations/supabase/client';

export interface BulkImportJob {
  id: string;
  total_trails_requested: number;
  total_sources: number;
  status: string;
  started_at: string;
  completed_at?: string;
  trails_processed: number;
  trails_added: number;
  trails_updated: number;
  trails_failed: number;
  config?: any;
  results?: any;
}

export const createBulkImportJob = async (jobData: Partial<BulkImportJob>) => {
  try {
    // Since bulk_import_jobs table exists, use it directly
    const { data, error } = await supabase
      .from('bulk_import_jobs')
      .insert({
        total_trails_requested: jobData.total_trails_requested || 0,
        total_sources: jobData.total_sources || 0,
        status: jobData.status || 'pending',
        trails_processed: 0,
        trails_added: 0,
        trails_updated: 0,
        trails_failed: 0,
        config: jobData.config,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating bulk import job:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createBulkImportJob:', error);
    throw error;
  }
};

export const updateBulkImportJob = async (id: string, updates: Partial<BulkImportJob>) => {
  try {
    const { data, error } = await supabase
      .from('bulk_import_jobs')
      .update({
        ...updates,
        last_updated: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating bulk import job:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateBulkImportJob:', error);
    throw error;
  }
};

export const getBulkImportJobs = async () => {
  try {
    const { data, error } = await supabase
      .from('bulk_import_jobs')
      .select('*')
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Error fetching bulk import jobs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getBulkImportJobs:', error);
    return [];
  }
};

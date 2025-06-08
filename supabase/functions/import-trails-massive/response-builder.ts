
export function buildSuccessResponse(
  bulkJob: any,
  target: string,
  locationName: string,
  totalProcessed: number,
  totalAdded: number,
  totalFailed: number,
  sourceResults: any[],
  allInsertErrors: string[],
  finalCount: number | null,
  isLocationSpecific: boolean,
  finalStatus: string
) {
  const successRate = totalProcessed > 0 ? Math.round((totalAdded / totalProcessed) * 100) : 0;
  
  return {
    job_id: bulkJob.id,
    status: finalStatus,
    target: target,
    location: locationName,
    total_processed: totalProcessed,
    total_added: totalAdded,
    total_updated: 0,
    total_failed: totalFailed,
    success_rate: successRate,
    source_results: sourceResults,
    service_role_used: true,
    insert_errors: allInsertErrors.slice(-5),
    final_database_count: finalCount,
    schema_fixes_applied: true,
    location_targeting: isLocationSpecific,
    message: `${target} import completed for ${locationName}: ${totalAdded} trails added with ${successRate}% success rate using LOCATION-AWARE SCHEMA`
  };
}

export function buildErrorResponse(
  error: any,
  target: string = '30K'
) {
  return {
    error: 'Massive import failed', 
    details: error instanceof Error ? error.message : 'Unknown error',
    target: target,
    service_role_configured: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    schema_fixes_applied: true
  };
}

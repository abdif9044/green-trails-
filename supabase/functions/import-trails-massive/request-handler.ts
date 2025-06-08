
import { ImportRequest } from "./types.ts";

export function parseAndValidateRequest(req: Request): Promise<ImportRequest> {
  return req.json() as Promise<ImportRequest>;
}

export function validateImportRequest(request: ImportRequest): { isValid: boolean; error?: string } {
  const { sources, maxTrailsPerSource } = request;
  
  if (!sources || sources.length === 0) {
    return { isValid: false, error: 'No sources specified for import' };
  }
  
  if (!maxTrailsPerSource || maxTrailsPerSource <= 0) {
    return { isValid: false, error: 'Invalid maxTrailsPerSource value' };
  }
  
  return { isValid: true };
}

export function getLocationInfo(location?: { lat: number; lng: number; radius: number; city?: string; state?: string }) {
  const isLocationSpecific = !!location;
  const locationName = location ? `${location.city || 'Location'}, ${location.state || 'Area'}` : 'General';
  
  return { isLocationSpecific, locationName };
}

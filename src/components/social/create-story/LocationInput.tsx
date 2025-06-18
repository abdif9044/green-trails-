
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/use-geolocation';

interface LocationInputProps {
  locationName: string;
  setLocationName: (location: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ locationName, setLocationName }) => {
  const { toast } = useToast();
  const { coordinates, error: locationError, getCurrentLocation } = useGeolocation();

  const handleLocationCapture = () => {
    getCurrentLocation();
    
    // Check if coordinates are available after calling getCurrentLocation
    if (coordinates) {
      const lat = coordinates.latitude.toFixed(4);
      const lng = coordinates.longitude.toFixed(4);
      setLocationName(`${lat}, ${lng}`);
    } else if (locationError) {
      toast({
        title: "Location access denied",
        description: "Please enable location services to add your location",
        variant: "destructive"
      });
    }
  };

  // Update location name when coordinates become available
  React.useEffect(() => {
    if (coordinates && !locationName) {
      const lat = coordinates.latitude.toFixed(4);
      const lng = coordinates.longitude.toFixed(4);
      setLocationName(`${lat}, ${lng}`);
    }
  }, [coordinates, locationName, setLocationName]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLocationCapture}
          disabled={!!locationError}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Add Location
        </Button>
        {locationName && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {locationName}
            <button 
              onClick={() => setLocationName('')}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>
      
      {!locationName && (
        <Input
          placeholder="Enter location manually"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          className="text-sm"
        />
      )}
    </div>
  );
};

export default LocationInput;

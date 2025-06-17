
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationFieldProps {
  location: string;
  setLocation: (location: string) => void;
  setUserLocation: (coords: {lat: number, lng: number} | null) => void;
  setUseLocation: (use: boolean) => void;
}

const LocationField = ({ location, setLocation, setUserLocation, setUseLocation }: LocationFieldProps) => {
  const { toast } = useToast();

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Error',
        description: 'Geolocation is not supported by your browser.',
        variant: 'destructive',
      });
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setUseLocation(true);
        
        // Try to get location name from coordinates using reverse geocoding
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=pk.eyJ1IjoiZ3JlZW50cmFpbHMtdGVzdCIsImEiOiJjbDBjZXlmYWMwMDQxM2RydDJ1bm1zYmVqIn0.OnS8ThN47ArmXCkV2NBa9A`)
          .then(response => response.json())
          .then(data => {
            if (data.features && data.features.length > 0) {
              setLocation(data.features[0].place_name);
            }
          })
          .catch(err => {
            console.error('Error getting location name:', err);
          });
      },
      (error) => {
        toast({
          title: 'Error',
          description: `Unable to retrieve your location: ${error.message}`,
          variant: 'destructive',
        });
      }
    );
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="location">Location (Optional)</Label>
      <div className="flex gap-2">
        <Input
          id="location"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="button" 
          variant="outline"
          onClick={getLocation}
        >
          <MapPin className="h-4 w-4 mr-1" />
          Current
        </Button>
      </div>
    </div>
  );
};

export default LocationField;

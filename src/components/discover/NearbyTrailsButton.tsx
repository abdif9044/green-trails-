
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { useGeolocation } from '@/hooks/use-geolocation';
import { useToast } from '@/hooks/use-toast';

interface NearbyTrailsButtonProps {
  onLocationFound: (longitude: number, latitude: number) => void;
}

const NearbyTrailsButton: React.FC<NearbyTrailsButtonProps> = ({ onLocationFound }) => {
  const { location, error, loading, coordinates } = useGeolocation();
  const { toast } = useToast();

  const handleClick = () => {
    if (location && location.coords) {
      // Use location.coords rather than coordinates
      onLocationFound(location.coords.longitude, location.coords.latitude);
      toast({
        title: "Location found",
        description: "Showing trails near your location",
      });
    } else if (error) {
      toast({
        title: "Location error",
        description: error.message || "Unable to access location",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full mt-4"
      onClick={handleClick}
      disabled={loading || !!error}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Finding location...
        </>
      ) : (
        <>
          <MapPin className="h-4 w-4 mr-2" />
          Find trails near me
        </>
      )}
    </Button>
  );
};

export default NearbyTrailsButton;


import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, MapPin, Search, Sparkles } from 'lucide-react';
import WeatherProphet from '@/components/weather/WeatherProphet';
import { useGeolocation } from '@/hooks/use-geolocation';

const WeatherProphetPage: React.FC = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | null>(null);
  const [locationName, setLocationName] = useState('');
  
  const { 
    coordinates: userLocation, 
    loading: locationLoading,
    error: locationError,
    getCurrentLocation 
  } = useGeolocation();

  // Use user's current location by default
  useEffect(() => {
    if (userLocation && !selectedCoordinates) {
      setSelectedCoordinates([userLocation.longitude, userLocation.latitude]);
      setLocationName('Your Current Location');
    }
  }, [userLocation, selectedCoordinates]);

  const handleLocationSearch = async () => {
    if (!searchLocation.trim()) return;
    
    try {
      // Simple geocoding using OpenStreetMap Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchLocation)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        setSelectedCoordinates([parseFloat(result.lon), parseFloat(result.lat)]);
        setLocationName(result.display_name);
      }
    } catch (error) {
      console.error('Location search failed:', error);
    }
  };

  const handleUseCurrentLocation = () => {
    getCurrentLocation();
  };

  return (
    <>
      <Helmet>
        <title>AI Weather Prophet - GreenTrails</title>
        <meta name="description" content="Get AI-powered weather analysis and hiking recommendations for any location" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Weather Prophet
              </h1>
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get intelligent weather analysis powered by AI to make informed hiking decisions. 
              Our Weather Prophet analyzes patterns, safety conditions, and optimal timing for your outdoor adventures.
            </p>
          </div>

          {/* Location Selection */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Choose Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Search for a location (city, trail, landmark...)"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                  />
                  <Button onClick={handleLocationSearch} disabled={!searchLocation.trim()}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleUseCurrentLocation}
                  disabled={locationLoading}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Use My Location
                </Button>
              </div>
              
              {locationName && selectedCoordinates && (
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <MapPin className="h-3 w-3 mr-1" />
                    {locationName}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({selectedCoordinates[1].toFixed(4)}, {selectedCoordinates[0].toFixed(4)})
                  </span>
                </div>
              )}

              {locationError && (
                <p className="text-red-600 text-sm mt-2">
                  Unable to get your location: {locationError}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Weather Prophet Analysis */}
          {selectedCoordinates && (
            <div className="grid grid-cols-1 gap-8">
              <WeatherProphet 
                coordinates={selectedCoordinates}
                trailData={{ name: locationName }}
                className="shadow-lg"
              />
            </div>
          )}

          {!selectedCoordinates && !locationLoading && (
            <Card className="text-center py-12">
              <CardContent>
                <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready for Weather Analysis</h3>
                <p className="text-muted-foreground">
                  Choose a location above to get started with AI-powered weather insights
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default WeatherProphetPage;

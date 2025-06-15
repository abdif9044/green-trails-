
import React, { useEffect, useState } from 'react';
import { useMap } from '../context/MapContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { 
  Mountain, 
  Sun, 
  Moon, 
  Sunrise, 
  Trees,
  Layers,
  Eye,
  Settings
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';

interface Enhanced3DTerrainLayerProps {
  enabled: boolean;
  timeOfDay?: 'sunrise' | 'day' | 'sunset' | 'night';
  season?: 'spring' | 'summer' | 'fall' | 'winter';
}

const Enhanced3DTerrainLayer: React.FC<Enhanced3DTerrainLayerProps> = ({
  enabled,
  timeOfDay = 'day',
  season = 'summer'
}) => {
  const { map } = useMap();
  const [terrainExaggeration, setTerrainExaggeration] = useState(1.5);
  const [shadowIntensity, setShadowIntensity] = useState(0.7);
  const [vegetationDensity, setVegetationDensity] = useState(0.8);
  const [showControls, setShowControls] = useState(false);
  const [lighting, setLighting] = useState({
    azimuth: 180,
    elevation: 45,
    intensity: 1.0
  });

  useEffect(() => {
    if (!map || !enabled) return;

    // Enhanced 3D terrain setup
    setupEnhanced3DTerrain();
    
    // Dynamic lighting based on time of day
    updateLighting(timeOfDay);
    
    // Seasonal terrain texturing
    updateSeasonalTextures(season);

  }, [map, enabled, timeOfDay, season]);

  const setupEnhanced3DTerrain = async () => {
    if (!map) return;

    try {
      // Add high-resolution terrain source
      if (!map.getSource('enhanced-terrain')) {
        map.addSource('enhanced-terrain', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        });
      }

      // Set terrain with enhanced exaggeration
      map.setTerrain({
        source: 'enhanced-terrain',
        exaggeration: terrainExaggeration
      });

      // Add atmosphere and sky
      if (!map.getLayer('enhanced-sky')) {
        map.addLayer({
          id: 'enhanced-sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [lighting.azimuth, lighting.elevation],
            'sky-atmosphere-sun-intensity': lighting.intensity * 15
          }
        });
      }

      // Add hillshade for dramatic shadows
      if (!map.getSource('hillshade-source')) {
        map.addSource('hillshade-source', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512
        });

        map.addLayer({
          id: 'hillshade-layer',
          type: 'hillshade',
          source: 'hillshade-source',
          paint: {
            'hillshade-shadow-color': getTimeBasedShadowColor(timeOfDay),
            'hillshade-highlight-color': getTimeBasedHighlightColor(timeOfDay),
            'hillshade-exaggeration': shadowIntensity,
            'hillshade-illumination-direction': lighting.azimuth
          }
        });
      }

      // Add vegetation layer based on season
      addVegetationLayer(season);

    } catch (error) {
      console.error('Error setting up enhanced 3D terrain:', error);
    }
  };

  const updateLighting = (time: string) => {
    const lightingConfigs = {
      sunrise: { azimuth: 90, elevation: 15, intensity: 0.8 },
      day: { azimuth: 180, elevation: 60, intensity: 1.0 },
      sunset: { azimuth: 270, elevation: 15, intensity: 0.9 },
      night: { azimuth: 180, elevation: -30, intensity: 0.3 }
    };

    const config = lightingConfigs[time as keyof typeof lightingConfigs];
    setLighting(config);

    if (map && map.getLayer('enhanced-sky')) {
      map.setPaintProperty('enhanced-sky', 'sky-atmosphere-sun', [config.azimuth, config.elevation]);
      map.setPaintProperty('enhanced-sky', 'sky-atmosphere-sun-intensity', config.intensity * 15);
    }

    if (map && map.getLayer('hillshade-layer')) {
      map.setPaintProperty('hillshade-layer', 'hillshade-illumination-direction', config.azimuth);
      map.setPaintProperty('hillshade-layer', 'hillshade-shadow-color', getTimeBasedShadowColor(time));
      map.setPaintProperty('hillshade-layer', 'hillshade-highlight-color', getTimeBasedHighlightColor(time));
    }
  };

  const updateSeasonalTextures = (currentSeason: string) => {
    if (!map) return;

    const seasonalColors = {
      spring: { primary: '#7CB342', secondary: '#8BC34A', accent: '#CDDC39' },
      summer: { primary: '#4CAF50', secondary: '#66BB6A', accent: '#81C784' },
      fall: { primary: '#FF8F00', secondary: '#FFA000', accent: '#FFB300' },
      winter: { primary: '#ECEFF1', secondary: '#CFD8DC', accent: '#B0BEC5' }
    };

    const colors = seasonalColors[currentSeason as keyof typeof seasonalColors];
    
    // Update land cover colors based on season
    if (map.getLayer('landcover')) {
      map.setPaintProperty('landcover', 'fill-color', [
        'match',
        ['get', 'class'],
        'wood', colors.primary,
        'scrub', colors.secondary,
        'grass', colors.accent,
        '#E0E0E0' // default
      ]);
    }
  };

  const addVegetationLayer = (currentSeason: string) => {
    if (!map || map.getSource('vegetation')) return;

    // Add vegetation data source (simplified example)
    map.addSource('vegetation', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: generateVegetationFeatures()
      }
    });

    map.addLayer({
      id: 'vegetation-layer',
      type: 'circle',
      source: 'vegetation',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10, 2,
          15, 6,
          20, 12
        ],
        'circle-color': getSeasonalVegetationColor(currentSeason),
        'circle-opacity': vegetationDensity,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#2E7D32'
      }
    });
  };

  const generateVegetationFeatures = () => {
    // Generate random vegetation points (in a real app, this would come from actual data)
    const features = [];
    for (let i = 0; i < 500; i++) {
      features.push({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [
            -120 + Math.random() * 40, // Western US longitude range
            35 + Math.random() * 15    // Western US latitude range
          ]
        },
        properties: {
          type: 'tree',
          density: Math.random()
        }
      });
    }
    return features;
  };

  const getTimeBasedShadowColor = (time: string) => {
    const colors = {
      sunrise: '#FF6B35',
      day: '#424242',
      sunset: '#FF5722',
      night: '#1A237E'
    };
    return colors[time as keyof typeof colors] || '#424242';
  };

  const getTimeBasedHighlightColor = (time: string) => {
    const colors = {
      sunrise: '#FFECB3',
      day: '#FFFFFF',
      sunset: '#FFE0B2',
      night: '#E8EAF6'
    };
    return colors[time as keyof typeof colors] || '#FFFFFF';
  };

  const getSeasonalVegetationColor = (currentSeason: string) => {
    const colors = {
      spring: '#8BC34A',
      summer: '#4CAF50',
      fall: '#FF8F00',
      winter: '#78909C'
    };
    return colors[currentSeason as keyof typeof colors] || '#4CAF50';
  };

  const handleTerrainExaggerationChange = (values: number[]) => {
    const [value] = values;
    setTerrainExaggeration(value);
    
    if (map) {
      map.setTerrain({
        source: 'enhanced-terrain',
        exaggeration: value
      });
    }
  };

  const handleLightingChange = (property: 'azimuth' | 'elevation' | 'intensity', values: number[]) => {
    const [value] = values;
    const newLighting = { ...lighting, [property]: value };
    setLighting(newLighting);

    if (map && map.getLayer('enhanced-sky')) {
      if (property === 'azimuth' || property === 'elevation') {
        map.setPaintProperty('enhanced-sky', 'sky-atmosphere-sun', [newLighting.azimuth, newLighting.elevation]);
      }
      if (property === 'intensity') {
        map.setPaintProperty('enhanced-sky', 'sky-atmosphere-sun-intensity', value * 15);
      }
    }
  };

  if (!enabled) return null;

  return (
    <div className="absolute top-4 right-4 z-20">
      <Popover open={showControls} onOpenChange={setShowControls}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="bg-white/90 backdrop-blur-sm shadow-md"
          >
            <Mountain className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="left" className="w-80 p-4">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4" />
              3D Terrain Controls
            </h3>

            {/* Time of Day Controls */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Time of Day</label>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { key: 'sunrise', icon: Sunrise, label: 'Dawn' },
                  { key: 'day', icon: Sun, label: 'Day' },
                  { key: 'sunset', icon: Sunrise, label: 'Dusk' },
                  { key: 'night', icon: Moon, label: 'Night' }
                ].map(({ key, icon: Icon, label }) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={timeOfDay === key ? "default" : "outline"}
                    onClick={() => updateLighting(key)}
                    className="flex flex-col items-center gap-1 p-2 h-auto"
                  >
                    <Icon className="h-3 w-3" />
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Terrain Exaggeration */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Terrain Height</label>
                <span className="text-xs text-gray-600">{terrainExaggeration.toFixed(1)}x</span>
              </div>
              <Slider
                value={[terrainExaggeration]}
                onValueChange={handleTerrainExaggerationChange}
                min={0.5}
                max={3.0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Lighting Controls */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Lighting</label>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">Sun Direction</span>
                  <span className="text-xs text-gray-600">{lighting.azimuth}°</span>
                </div>
                <Slider
                  value={[lighting.azimuth]}
                  onValueChange={(values) => handleLightingChange('azimuth', values)}
                  min={0}
                  max={360}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">Sun Elevation</span>
                  <span className="text-xs text-gray-600">{lighting.elevation}°</span>
                </div>
                <Slider
                  value={[lighting.elevation]}
                  onValueChange={(values) => handleLightingChange('elevation', values)}
                  min={-30}
                  max={90}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">Light Intensity</span>
                  <span className="text-xs text-gray-600">{(lighting.intensity * 100).toFixed(0)}%</span>
                </div>
                <Slider
                  value={[lighting.intensity]}
                  onValueChange={(values) => handleLightingChange('intensity', values)}
                  min={0.1}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Shadow and Vegetation */}
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Shadow Intensity</label>
                  <span className="text-xs text-gray-600">{(shadowIntensity * 100).toFixed(0)}%</span>
                </div>
                <Slider
                  value={[shadowIntensity]}
                  onValueChange={([value]) => setShadowIntensity(value)}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Trees className="h-3 w-3" />
                    Vegetation
                  </label>
                  <span className="text-xs text-gray-600">{(vegetationDensity * 100).toFixed(0)}%</span>
                </div>
                <Slider
                  value={[vegetationDensity]}
                  onValueChange={([value]) => setVegetationDensity(value)}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Enhanced3DTerrainLayer;

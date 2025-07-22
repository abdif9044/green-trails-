import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, Navigation, Layers, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const InteractiveMapPreview: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'terrain' | 'satellite' | 'trails'>('terrain');

  // Mock trail data
  const trailMarkers = [
    { id: 1, name: 'Eagle Peak', difficulty: 'Hard', x: 60, y: 30 },
    { id: 2, name: 'Forest Loop', difficulty: 'Easy', x: 40, y: 60 },
    { id: 3, name: 'Ridge Trail', difficulty: 'Moderate', x: 75, y: 45 },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Moderate': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLayerStyle = () => {
    switch (activeLayer) {
      case 'satellite':
        return 'bg-gradient-to-br from-emerald-800 via-green-700 to-lime-600';
      case 'terrain':
        return 'bg-gradient-to-br from-amber-200 via-orange-300 to-red-400';
      case 'trails':
        return 'bg-gradient-to-br from-slate-300 via-slate-200 to-white';
      default:
        return 'bg-gradient-to-br from-green-200 via-green-300 to-green-400';
    }
  };

  return (
    <Card className="w-full h-96 bg-background border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Map className="w-5 h-5 text-primary" />
            Interactive Trail Maps
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant={activeLayer === 'terrain' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveLayer('terrain')}
              className="text-xs"
            >
              Terrain
            </Button>
            <Button
              variant={activeLayer === 'satellite' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveLayer('satellite')}
              className="text-xs"
            >
              Satellite
            </Button>
            <Button
              variant={activeLayer === 'trails' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveLayer('trails')}
              className="text-xs"
            >
              <Layers className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-80">
        <div 
          ref={mapContainer}
          className={`relative w-full h-full rounded-b-lg overflow-hidden cursor-pointer transition-all duration-500 ${getLayerStyle()}`}
          onClick={() => setIsInteractive(!isInteractive)}
        >
          {/* Topographic lines for terrain */}
          {activeLayer === 'terrain' && (
            <>
              <div className="absolute inset-0 opacity-30">
                <svg width="100%" height="100%" className="absolute inset-0">
                  <defs>
                    <pattern id="topo" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                      <circle cx="20" cy="20" r="25" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#topo)" />
                </svg>
              </div>
            </>
          )}

          {/* Trail markers */}
          {trailMarkers.map((trail) => (
            <div
              key={trail.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${trail.x}%`, top: `${trail.y}%` }}
            >
              <div className={`w-3 h-3 rounded-full ${getDifficultyColor(trail.difficulty)} ring-2 ring-white shadow-lg transition-transform group-hover:scale-150`} />
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                  {trail.name} - {trail.difficulty}
                </Badge>
              </div>
            </div>
          ))}

          {/* GPS location indicator */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
              <Navigation className="w-3 h-3 text-blue-600" />
              <span className="text-xs text-slate-700">Your Location</span>
            </div>
          </div>

          {/* Real-time indicators */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <Badge className="bg-green-500/90 text-white border-0">
              <Zap className="w-3 h-3 mr-1" />
              Live Updates
            </Badge>
            <Badge variant="secondary" className="bg-white/90">
              3 trails nearby
            </Badge>
          </div>

          {/* Interactive overlay */}
          {!isInteractive && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[1px]">
              <div className="text-white text-center">
                <Map className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-medium">Click to explore interactive map</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMapPreview;
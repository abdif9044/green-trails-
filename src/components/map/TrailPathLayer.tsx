
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Trail } from '@/types/trails';

interface TrailPathLayerProps {
  trail: Trail;
  map: mapboxgl.Map;
  onClick?: () => void;
}

const TrailPathLayer: React.FC<TrailPathLayerProps> = ({ trail, map, onClick }) => {
  useEffect(() => {
    // If trail has no geojson data, don't render
    if (!trail.geojson) return;
    
    // Create unique source and layer IDs based on trail ID
    const sourceId = `trail-path-${trail.id}`;
    const layerId = `trail-path-line-${trail.id}`;
    const highlightLayerId = `trail-path-highlight-${trail.id}`;
    
    // Add GeoJSON source if it doesn't exist
    if (!map.getSource(sourceId)) {
      try {
        map.addSource(sourceId, {
          type: 'geojson',
          data: trail.geojson
        });
      } catch (error) {
        console.error(`Failed to add source for trail ${trail.id}:`, error);
        return;
      }
    }
    
    // Add trail path line if it doesn't exist
    if (!map.getLayer(layerId)) {
      try {
        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': getTrailColor(trail.difficulty),
            'line-width': 4,
            'line-opacity': 0.75
          }
        });
        
        // Add highlight line layer
        map.addLayer({
          id: highlightLayerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#ffffff',
            'line-width': 6,
            'line-opacity': 0,
            'line-blur': 2
          }
        });
        
        // Add click handler
        if (onClick) {
          map.on('click', layerId, onClick);
          
          // Change cursor on hover
          map.on('mouseenter', layerId, () => {
            map.getCanvas().style.cursor = 'pointer';
            map.setPaintProperty(highlightLayerId, 'line-opacity', 0.4);
          });
          
          map.on('mouseleave', layerId, () => {
            map.getCanvas().style.cursor = '';
            map.setPaintProperty(highlightLayerId, 'line-opacity', 0);
          });
        }
      } catch (error) {
        console.error(`Failed to add layer for trail ${trail.id}:`, error);
      }
    }
    
    // Cleanup function to remove source and layer on unmount
    return () => {
      if (map.getLayer(highlightLayerId)) map.removeLayer(highlightLayerId);
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
      
      if (onClick) {
        map.off('click', layerId, onClick);
        map.off('mouseenter', layerId, () => {});
        map.off('mouseleave', layerId, () => {});
      }
    };
  }, [trail, map, onClick]);
  
  return null;
};

// Helper function to get color based on trail difficulty
const getTrailColor = (difficulty: string = 'moderate'): string => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return '#4ade80'; // green
    case 'moderate':
      return '#fbbf24'; // amber
    case 'hard':
      return '#f87171'; // red
    case 'expert':
      return '#8b5cf6'; // purple
    default:
      return '#60a5fa'; // blue
  }
};

export default TrailPathLayer;

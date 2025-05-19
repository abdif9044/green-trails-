
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Trail } from '@/types/trails';

interface MapMarkerProps {
  trail: Trail;
  map: mapboxgl.Map;
  onSelect?: (trailId: string) => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ trail, map, onSelect }) => {
  useEffect(() => {
    if (!map || !trail.coordinates || !trail.coordinates[0] || !trail.coordinates[1]) {
      return;
    }
    
    // Create marker element
    const element = document.createElement('div');
    
    // Style the marker
    const markerStyle = {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      cursor: 'pointer',
      border: '2px solid white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      backgroundColor: 
        trail.difficulty === 'easy' ? '#4ade80' :
        trail.difficulty === 'moderate' ? '#fbbf24' :
        trail.difficulty === 'hard' ? '#f87171' :
        '#000000'
    };
    
    Object.assign(element.style, markerStyle);
    
    // Create popup with trail information
    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      className: 'bg-white dark:bg-greentrail-800 shadow-lg rounded-lg'
    }).setHTML(`
      <div class="p-3">
        <h3 class="font-semibold text-greentrail-800 dark:text-greentrail-200">${trail.name}</h3>
        <p class="text-sm text-greentrail-600 dark:text-greentrail-400">${trail.location || ''}</p>
        ${trail.length ? `<p class="text-sm text-greentrail-600 dark:text-greentrail-400 mt-1">${trail.length} miles</p>` : ''}
      </div>
    `);
    
    // Create and add marker to map
    const marker = new mapboxgl.Marker(element)
      .setLngLat([trail.coordinates[0], trail.coordinates[1]])
      .setPopup(popup)
      .addTo(map);
      
    // Add click handler if provided
    if (onSelect) {
      element.addEventListener('click', () => onSelect(trail.id));
    }
    
    // Return a cleanup function that removes the marker
    return () => {
      marker.remove();
    };
  }, [trail, map, onSelect]);
  
  return null;
};

export default MapMarker;

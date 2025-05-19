
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Trail } from '@/types/trails';
import { getTrailColor } from '@/features/map/utils/mapUtils';

interface MapMarkerProps {
  trail: Trail;
  map: mapboxgl.Map;
  onSelect?: (trailId: string) => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ trail, map, onSelect }) => {
  useEffect(() => {
    // Ensure we have valid coordinates before creating a marker
    if (!map || !trail.coordinates || !Array.isArray(trail.coordinates) || trail.coordinates.length < 2) {
      console.warn(`Invalid coordinates for trail ${trail.name} (${trail.id})`);
      return;
    }
    
    // Extract coordinates properly, ensuring they are numbers
    const lng = parseFloat(String(trail.coordinates[0]));
    const lat = parseFloat(String(trail.coordinates[1]));
    
    // Validate coordinates
    if (isNaN(lng) || isNaN(lat) || !isFinite(lng) || !isFinite(lat)) {
      console.warn(`Invalid coordinates values for trail ${trail.name} (${trail.id}): [${lng}, ${lat}]`);
      return;
    }
    
    // Create marker element
    const element = document.createElement('div');
    
    // Style the marker using the utility function
    const markerStyle = {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      cursor: 'pointer',
      border: '2px solid white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      backgroundColor: getTrailColor(trail.difficulty)
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
    
    // Create and add marker to map with validated coordinates
    try {
      const marker = new mapboxgl.Marker(element)
        .setLngLat([lng, lat])
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
    } catch (error) {
      console.error(`Error creating marker for trail ${trail.id}:`, error);
      return undefined;
    }
  }, [trail, map, onSelect]);
  
  return null;
};

export default MapMarker;

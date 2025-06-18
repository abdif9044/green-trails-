
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Trail } from '@/types/trails';
import { getTrailColor, validateCoordinates } from '@/features/map/utils/mapUtils';

interface MapMarkerProps {
  trail: Trail;
  map: mapboxgl.Map;
  onSelect?: (trailId: string) => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ trail, map, onSelect }) => {
  useEffect(() => {
    // Validate coordinates before creating a marker
    const validCoords = validateCoordinates(trail.coordinates);
    if (!map || !validCoords) {
      console.warn(`🗺️ Invalid coordinates for trail ${trail.name} (${trail.id}):`, trail.coordinates);
      return;
    }
    
    const [lng, lat] = validCoords;
    console.log(`🗺️ Creating marker for trail ${trail.name} at [${lng}, ${lat}]`);
    
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
      backgroundColor: getTrailColor(trail.difficulty),
      transition: 'transform 0.2s ease'
    };
    
    Object.assign(element.style, markerStyle);
    
    // Add hover effect
    element.addEventListener('mouseenter', () => {
      element.style.transform = 'scale(1.2)';
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'scale(1)';
    });
    
    // Create popup with trail information
    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      className: 'custom-popup'
    }).setHTML(`
      <div class="p-3">
        <h3 class="font-semibold text-greentrail-800 dark:text-greentrail-200">${trail.name}</h3>
        <p class="text-sm text-greentrail-600 dark:text-greentrail-400">${trail.location || ''}</p>
        ${trail.length ? `<p class="text-sm text-greentrail-600 dark:text-greentrail-400 mt-1">${trail.length} miles</p>` : ''}
        <div class="text-xs text-gray-500 mt-2 capitalize">
          ${trail.difficulty || 'Unknown difficulty'}
        </div>
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
        element.addEventListener('click', () => {
          console.log(`🗺️ Trail marker clicked: ${trail.id}`);
          onSelect(trail.id);
        });
      }
      
      console.log(`🗺️ Successfully created marker for trail ${trail.name}`);
      
      // Return a cleanup function that removes the marker
      return () => {
        console.log(`🗺️ Removing marker for trail ${trail.name}`);
        marker.remove();
      };
    } catch (error) {
      console.error(`🗺️ Error creating marker for trail ${trail.id}:`, error);
      return undefined;
    }
  }, [trail, map, onSelect]);
  
  return null;
};

export default MapMarker;

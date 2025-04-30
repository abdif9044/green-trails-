
import React from 'react';
import mapboxgl from 'mapbox-gl';

export interface ParkingSpot {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  is_free: boolean | null;
  capacity: number | null;
  notes: string | null;
  trail_id: string;
}

interface ParkingMarkerProps {
  parkingSpot: ParkingSpot;
  map: mapboxgl.Map;
}

const ParkingMarker: React.FC<ParkingMarkerProps> = ({ parkingSpot, map }) => {
  React.useEffect(() => {
    // Create a custom HTML element for the marker
    const el = document.createElement('div');
    el.className = 'parking-marker';
    el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-parking-meter"><path d="M9 9a3 3 0 1 1 6 0v8"/><path d="M8 14h7"/><circle cx="12" cy="19" r="2"/><path d="M10 2v2"/><path d="M14 2v2"/></svg>`;
    
    // Style the marker
    Object.assign(el.style, {
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      background: parkingSpot.is_free ? '#4ade80' : '#f97316',
      borderRadius: '50%',
      border: '2px solid white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    });
    
    // Create a popup with parking information
    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      className: 'bg-white dark:bg-greentrail-800 shadow-lg rounded-lg'
    }).setHTML(`
      <div class="p-3 max-w-xs">
        <h3 class="font-semibold text-greentrail-800 dark:text-greentrail-200">${parkingSpot.name}</h3>
        <p class="text-sm text-greentrail-600 dark:text-greentrail-400 mb-1">${parkingSpot.description || ''}</p>
        
        <div class="flex items-center gap-2 mt-2 text-sm">
          <span class="font-medium">${parkingSpot.is_free ? 'Free parking' : 'Paid parking'}</span>
          ${parkingSpot.capacity ? `• ${parkingSpot.capacity} spots` : ''}
        </div>
        
        ${parkingSpot.notes ? `
          <div class="mt-2 text-xs text-greentrail-500 dark:text-greentrail-400 italic">
            ${parkingSpot.notes}
          </div>
        ` : ''}
      </div>
    `);
    
    // Add marker to map
    const marker = new mapboxgl.Marker(el)
      .setLngLat([parkingSpot.longitude, parkingSpot.latitude])
      .setPopup(popup)
      .addTo(map);
      
    // Return a cleanup function that removes the marker
    return () => {
      marker.remove();
    };
  }, [parkingSpot, map]);
  
  return null;
};

export default ParkingMarker;

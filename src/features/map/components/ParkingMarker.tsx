
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { ParkingMeter } from 'lucide-react';
import { createRoot } from 'react-dom/client';

export interface ParkingSpot {
  id: string;
  trail_id: string;
  name: string;
  is_free: boolean;
  latitude: number;
  longitude: number;
  description: string;
  capacity?: number | null;
  notes?: string | null;
}

interface ParkingMarkerProps {
  parkingSpot: ParkingSpot;
  map: mapboxgl.Map;
}

const ParkingMarker: React.FC<ParkingMarkerProps> = ({ parkingSpot, map }) => {
  useEffect(() => {
    // Create a DOM element for the marker
    const markerElement = document.createElement('div');
    markerElement.className = 'parking-marker';
    
    // Create marker
    const marker = new mapboxgl.Marker({
      element: markerElement,
      anchor: 'bottom',
      offset: [0, -5]
    })
      .setLngLat([parkingSpot.longitude, parkingSpot.latitude])
      .addTo(map);
    
    // Create React component for marker content
    const markerContent = (
      <div className="flex items-center justify-center bg-blue-100 border-2 border-blue-500 dark:bg-blue-900 dark:border-blue-400 text-blue-700 dark:text-blue-200 rounded-full w-8 h-8 shadow-md">
        <ParkingMeter className="w-4 h-4" />
      </div>
    );
    
    // Render React component to marker element
    const root = createRoot(markerElement);
    root.render(markerContent);
    
    // Create and add popup
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: true,
      offset: 25,
      className: 'parking-popup',
      maxWidth: '300px'
    }).setHTML(`
      <div class="font-medium mb-1">${parkingSpot.name}</div>
      <div class="text-sm mb-1">
        <span class="inline-block px-2 py-1 rounded-full text-xs ${parkingSpot.is_free 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
          : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
        }">
          ${parkingSpot.is_free ? 'Free' : 'Paid'} parking
        </span>
      </div>
      <div class="text-sm">${parkingSpot.description}</div>
      ${parkingSpot.capacity 
        ? `<div class="text-sm mt-1">Capacity: ${parkingSpot.capacity} spots</div>` 
        : ''}
      ${parkingSpot.notes 
        ? `<div class="text-xs italic mt-1">${parkingSpot.notes}</div>` 
        : ''}
    `);
    
    // Show popup on mouse enter
    markerElement.addEventListener('mouseenter', () => {
      marker.setPopup(popup);
      popup.addTo(map);
    });
    
    // Clean up
    return () => {
      marker.remove();
    };
  }, [parkingSpot, map]);
  
  return null;
};

export default ParkingMarker;

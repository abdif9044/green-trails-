import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Waypoint } from '@/types/trails';
import * as THREE from 'three';

interface WaypointMarkersProps {
  waypoints: Waypoint[];
  isAnimating?: boolean;
}

const WaypointMarkers: React.FC<WaypointMarkersProps> = ({ waypoints, isAnimating = false }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Get marker color based on waypoint type
  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'trailhead': return '#22c55e';
      case 'viewpoint': return '#3b82f6';
      case 'summit': return '#f59e0b';
      case 'water': return '#06b6d4';
      case 'rest': return '#8b5cf6';
      case 'hazard': return '#ef4444';
      case 'camping': return '#f97316';
      default: return '#6b7280';
    }
  };

  // Get marker size based on importance
  const getMarkerSize = (type: string) => {
    switch (type) {
      case 'trailhead':
      case 'summit': return 1.5;
      case 'viewpoint': return 1.2;
      default: return 1;
    }
  };

  // Convert waypoint coordinates to 3D positions
  const waypointPositions = useMemo(() => {
    if (waypoints.length === 0) return [];
    
    const firstWaypoint = waypoints[0];
    
    return waypoints.map(waypoint => {
      const x = (waypoint.coordinates[0] - firstWaypoint.coordinates[0]) * 1000;
      const z = (waypoint.coordinates[1] - firstWaypoint.coordinates[1]) * 1000;
      const y = (waypoint.coordinates[2] - firstWaypoint.coordinates[2]) * 0.1;
      
      return {
        ...waypoint,
        position: new THREE.Vector3(x, y + 3, z)
      };
    });
  }, [waypoints]);

  // Animation for floating waypoints
  useFrame((state, delta) => {
    if (groupRef.current && isAnimating) {
      groupRef.current.children.forEach((child, index) => {
        const offset = index * 0.5;
        child.position.y += Math.sin(state.clock.elapsedTime * 2 + offset) * 0.01;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {waypointPositions.map((waypoint, index) => (
        <group key={waypoint.id} position={waypoint.position}>
          {/* Waypoint marker */}
          <mesh>
            <cylinderGeometry args={[getMarkerSize(waypoint.type), getMarkerSize(waypoint.type), 0.5, 8]} />
            <meshLambertMaterial color={getMarkerColor(waypoint.type)} />
          </mesh>
          
          {/* Waypoint pole */}
          <mesh position={[0, -1, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
            <meshLambertMaterial color="#4a5568" />
          </mesh>
          
          {/* Waypoint label */}
          <Text
            position={[0, 2, 0]}
            fontSize={0.8}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.1}
            outlineColor="black"
          >
            {waypoint.name}
          </Text>
          
          {/* Distance marker if available */}
          {waypoint.distance_from_start !== undefined && (
            <Text
              position={[0, 1.2, 0]}
              fontSize={0.5}
              color="#d1d5db"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.05}
              outlineColor="black"
            >
              {waypoint.distance_from_start.toFixed(1)}mi
            </Text>
          )}
        </group>
      ))}
    </group>
  );
};

export default WaypointMarkers;
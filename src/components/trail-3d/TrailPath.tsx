import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface TrailPathProps {
  coordinates: [number, number, number][];
  difficulty: string;
}

const TrailPath: React.FC<TrailPathProps> = ({ coordinates, difficulty }) => {
  // Convert coordinates to 3D positions for rendering
  const points = useMemo(() => {
    return coordinates.map(coord => {
      // Scale coordinates for 3D view
      const x = (coord[0] - coordinates[0][0]) * 1000; // Relative to start point
      const z = (coord[1] - coordinates[0][1]) * 1000; // Relative to start point  
      const y = (coord[2] - coordinates[0][2]) * 0.1;  // Scale elevation
      
      return new THREE.Vector3(x, y + 2, z); // Lift slightly above terrain
    });
  }, [coordinates]);

  // Color based on difficulty
  const trailColor = useMemo(() => {
    switch (difficulty) {
      case 'easy': return '#22c55e'; // Green
      case 'moderate': return '#f59e0b'; // Yellow/Orange
      case 'hard': return '#ef4444'; // Red
      case 'expert': return '#7c2d12'; // Dark red
      default: return '#6b7280'; // Gray
    }
  }, [difficulty]);

  return (
    <>
      {/* Main trail line */}
      <Line
        points={points}
        color={trailColor}
        lineWidth={3}
        transparent
        opacity={0.9}
      />
      
      {/* Trail start marker */}
      <mesh position={[points[0].x, points[0].y + 1, points[0].z]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>
      
      {/* Trail end marker */}
      {points.length > 1 && (
        <mesh position={[points[points.length - 1].x, points[points.length - 1].y + 1, points[points.length - 1].z]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#dc2626" />
        </mesh>
      )}
    </>
  );
};

export default TrailPath;
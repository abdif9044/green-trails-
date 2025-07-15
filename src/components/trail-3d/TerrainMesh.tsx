import React, { useMemo } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TerrainMeshProps {
  elevationProfile: number[];
  trailBounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
}

const TerrainMesh: React.FC<TerrainMeshProps> = ({ elevationProfile, trailBounds }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate terrain geometry
  const { geometry, material } = useMemo(() => {
    const width = 100;
    const height = 100;
    const widthSegments = 32;
    const heightSegments = 32;

    const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    
    // Modify vertices to create terrain height variation
    const vertices = geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      
      // Create height variation based on position and elevation profile
      const noiseScale = 0.05;
      const heightVariation = Math.sin(x * noiseScale) * Math.cos(y * noiseScale) * 5;
      
      // Use elevation profile for main height
      const profileIndex = Math.floor(((x + width/2) / width) * (elevationProfile.length - 1));
      const baseHeight = (elevationProfile[profileIndex] || 1000) - 1000; // Normalize to 0 base
      
      vertices[i + 2] = (baseHeight * 0.1) + heightVariation; // Scale down for view
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    // Create material with realistic terrain colors
    const material = new THREE.MeshLambertMaterial({
      color: 0x567d46, // Forest green
      transparent: true,
      opacity: 0.9,
      wireframe: false
    });

    return { geometry, material };
  }, [elevationProfile]);

  // Optional: Gentle rotation animation
  useFrame((state, delta) => {
    // Add subtle movement if desired
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      {/* Add texture if needed in future */}
    </mesh>
  );
};

export default TerrainMesh;
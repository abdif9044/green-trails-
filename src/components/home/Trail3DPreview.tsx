import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mountain, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Trail3DMesh = () => {
  const meshRef = useRef<any>();
  const [isRotating, setIsRotating] = useState(true);

  useFrame((state, delta) => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Simple mountain-like geometry for demo
  const mountainVertices = new Float32Array([
    0, 2, 0,    // Peak
    -2, 0, -1,  // Base left
    2, 0, -1,   // Base right
    0, 0, 2,    // Base front
  ]);

  const mountainIndices = [
    0, 1, 2,
    0, 2, 3,
    0, 3, 1,
    1, 3, 2,
  ];

  return (
    <group ref={meshRef}>
      <mesh position={[0, -0.5, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={mountainVertices}
            count={4}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            array={new Uint16Array(mountainIndices)}
            count={12}
            itemSize={1}
          />
        </bufferGeometry>
        <meshPhongMaterial color="hsl(var(--primary))" />
      </mesh>
      
      {/* Trail path */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
        <meshBasicMaterial color="hsl(var(--accent))" />
      </mesh>
      
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.3}
        color="hsl(var(--foreground))"
        anchorX="center"
        anchorY="middle"
      >
        Eagle Peak Trail
      </Text>
    </group>
  );
};

const Trail3DPreview: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <Card className="w-full h-96 bg-gradient-to-br from-background to-muted/20 border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mountain className="w-5 h-5 text-primary" />
            3D Trail Preview
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-muted-foreground hover:text-primary"
            >
              {isPlaying ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-80">
        <Canvas
          camera={{ position: [3, 3, 3], fov: 60 }}
          className="w-full h-full rounded-b-lg"
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Trail3DMesh />
          <OrbitControls enableZoom={true} enablePan={false} />
        </Canvas>
      </CardContent>
    </Card>
  );
};

export default Trail3DPreview;
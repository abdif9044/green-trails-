
import React, { useRef, useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TouchGestureMapProps {
  children: React.ReactNode;
  onZoom?: (scale: number) => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  className?: string;
}

const TouchGestureMap: React.FC<TouchGestureMapProps> = ({
  children,
  onZoom,
  onPan,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isGesturing, setIsGesturing] = useState(false);
  const [lastDistance, setLastDistance] = useState(0);
  const [lastCenter, setLastCenter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isMobile || !containerRef.current) return;

    const container = containerRef.current;
    let startTouches: TouchList | null = null;

    const getDistance = (touches: TouchList) => {
      if (touches.length < 2) return 0;
      const touch1 = touches[0];
      const touch2 = touches[1];
      return Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
    };

    const getCenter = (touches: TouchList) => {
      if (touches.length === 0) return { x: 0, y: 0 };
      if (touches.length === 1) {
        return { x: touches[0].clientX, y: touches[0].clientY };
      }
      const sumX = Array.from(touches).reduce((sum, touch) => sum + touch.clientX, 0);
      const sumY = Array.from(touches).reduce((sum, touch) => sum + touch.clientY, 0);
      return { x: sumX / touches.length, y: sumY / touches.length };
    };

    const handleTouchStart = (e: TouchEvent) => {
      startTouches = e.touches;
      setIsGesturing(true);
      
      if (e.touches.length >= 2) {
        const distance = getDistance(e.touches);
        const center = getCenter(e.touches);
        setLastDistance(distance);
        setLastCenter(center);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startTouches || !isGesturing) return;

      e.preventDefault(); // Prevent scrolling

      if (e.touches.length >= 2) {
        // Pinch to zoom
        const distance = getDistance(e.touches);
        const center = getCenter(e.touches);
        
        if (lastDistance > 0) {
          const scale = distance / lastDistance;
          onZoom?.(scale);
        }
        
        if (lastCenter.x !== 0 && lastCenter.y !== 0) {
          const deltaX = center.x - lastCenter.x;
          const deltaY = center.y - lastCenter.y;
          onPan?.(deltaX, deltaY);
        }
        
        setLastDistance(distance);
        setLastCenter(center);
      } else if (e.touches.length === 1 && startTouches.length === 1) {
        // Single finger pan
        const deltaX = e.touches[0].clientX - startTouches[0].clientX;
        const deltaY = e.touches[0].clientY - startTouches[0].clientY;
        onPan?.(deltaX, deltaY);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        setIsGesturing(false);
        setLastDistance(0);
        setLastCenter({ x: 0, y: 0 });
        startTouches = null;
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, onZoom, onPan, isGesturing, lastDistance, lastCenter]);

  return (
    <div
      ref={containerRef}
      className={`touch-none select-none ${className}`}
      style={{ touchAction: 'none' }}
    >
      {children}
    </div>
  );
};

export default TouchGestureMap;

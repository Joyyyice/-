import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TopStar: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Sprite>(null);

  // Generate the 5-pointed star shape
  const starGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const spikes = 5;
    // Increased size parameters
    const outerRadius = 2.0; 
    const innerRadius = 0.9; 

    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i / (spikes * 2)) * Math.PI * 2;
      // Rotate -Math.PI/2 to point upwards
      const x = Math.cos(angle + Math.PI / 2) * r;
      const y = Math.sin(angle + Math.PI / 2) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    const extrudeSettings = {
      depth: 0.4, // Slightly thicker
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 0.15,
      bevelThickness: 0.15,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // Create a soft glow texture programmatically
  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(255, 255, 220, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 220, 100, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 200, 0, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y = t * 0.4;
      // Floating motion
      groupRef.current.position.y = 7.0 + Math.sin(t * 1.5) * 0.15;
    }
    
    // Pulse the halo
    if (haloRef.current) {
      // Increased halo scale to match larger star
      const scale = 7.5 + Math.sin(t * 2) * 0.5;
      haloRef.current.scale.set(scale, scale, 1);
      haloRef.current.material.opacity = 0.6 + Math.sin(t * 3) * 0.1;
    }
  });

  return (
    <group position={[0, 6.8, 0]}>
      {/* Rotating 3D Star */}
      <group ref={groupRef}>
        <mesh geometry={starGeometry}>
          <meshStandardMaterial
            color="#ffdd00"
            emissive="#ffaa00"
            emissiveIntensity={2}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* 2D Billboard Halo for natural glow */}
      <sprite ref={haloRef} position={[0, 0, 0]}>
        <spriteMaterial 
          map={glowTexture} 
          transparent 
          blending={THREE.AdditiveBlending} 
          depthWrite={false} 
        />
      </sprite>

      {/* Point Light source */}
      <pointLight color="#ffccaa" intensity={5} distance={18} decay={2} />
    </group>
  );
};

export default TopStar;
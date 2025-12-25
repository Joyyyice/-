import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TreeParticlesProps {
  palette: string[];
}

const VERTEX_SHADER = `
  uniform float uTime;
  attribute float aSize;
  attribute float aSpeed;
  attribute float aOffset;
  attribute vec3 aColor;
  varying vec3 vColor;
  
  void main() {
    vColor = aColor;
    vec3 pos = position;
    
    // Twinkling movement and breathing
    float breathe = sin(uTime * aSpeed + aOffset) * 0.1;
    pos.x += breathe * pos.x;
    pos.z += breathe * pos.z;
    pos.y += sin(uTime * 0.5 + aOffset) * 0.05;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = aSize * (350.0 / -mvPosition.z);
    
    // Twinkle size
    gl_PointSize *= (1.0 + sin(uTime * 3.0 + aOffset) * 0.3);
  }
`;

const FRAGMENT_SHADER = `
  varying vec3 vColor;
  
  void main() {
    // Circular particle
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;
    
    // Soft glow edge
    float glow = 1.0 - (r * 2.0);
    glow = pow(glow, 2.0);

    gl_FragColor = vec4(vColor, glow); 
  }
`;

const TreeParticles: React.FC<TreeParticlesProps> = ({ palette }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const colorAttributeRef = useRef<THREE.BufferAttribute>(null);

  // Generate tree structure (static geometry)
  const { positions, sizes, speeds, offsets, colorIndices } = useMemo(() => {
    const count = 4500; 
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);
    const colorIndices = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 30; // Spiral turns
      
      // Cone shape
      const radius = 5.0 * (1 - t);
      // Vertical position
      const y = t * 13 - 6.5; 
      
      // Random spread
      const randomRadiusOffset = (Math.random() - 0.5) * 1.0;
      const finalRadius = radius + randomRadiusOffset;

      const x = Math.cos(angle) * finalRadius;
      const z = Math.sin(angle) * finalRadius;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      sizes[i] = Math.random() * 0.6 + 0.2;
      speeds[i] = Math.random() + 0.5;
      offsets[i] = Math.random() * Math.PI * 2;
      
      colorIndices[i] = Math.floor(Math.random() * 100); 
    }

    return { positions, sizes, speeds, offsets, colorIndices };
  }, []);

  // Generate color array based on current palette
  const colors = useMemo(() => {
    const count = positions.length / 3;
    const c = new Float32Array(count * 3);
    const threeColors = palette.map(hex => new THREE.Color(hex));

    for (let i = 0; i < count; i++) {
      const color = threeColors[colorIndices[i] % threeColors.length];
      c[i * 3] = color.r;
      c[i * 3 + 1] = color.g;
      c[i * 3 + 2] = color.b;
    }
    return c;
  }, [palette, positions.length, colorIndices]);

  // Ensure Three.js updates the attribute when the array changes
  useLayoutEffect(() => {
    if (colorAttributeRef.current) {
      colorAttributeRef.current.needsUpdate = true;
    }
  }, [colors]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          ref={colorAttributeRef}
          attach="attributes-aColor"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          count={speeds.length}
          array={speeds}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          count={offsets.length}
          array={offsets}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
      />
    </points>
  );
};

export default TreeParticles;
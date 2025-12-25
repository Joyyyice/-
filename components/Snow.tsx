import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SNOW_VERTEX_SHADER = `
  uniform float uTime;
  attribute float aSize;
  attribute float aRandom;
  varying float vAlpha;
  
  void main() {
    vec3 pos = position;
    
    // Independent fall speed based on randomness
    float fallSpeed = 1.0 + aRandom * 1.5; 
    
    // Loop position Y
    pos.y = mod(pos.y - uTime * fallSpeed, 60.0) - 30.0;
    
    // Sway motion (x and z)
    pos.x += sin(uTime * 0.5 + aRandom * 15.0) * (0.5 + aRandom);
    pos.z += cos(uTime * 0.3 + aRandom * 15.0) * (0.5 + aRandom);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation - INCREASED MULTIPLIER from 250 to 450 for larger appearance
    gl_PointSize = aSize * (450.0 / -mvPosition.z);
    
    // Twinkle alpha
    vAlpha = 0.4 + 0.6 * sin(uTime * 2.0 + aRandom * 10.0);
  }
`;

const SNOW_FRAGMENT_SHADER = `
  varying float vAlpha;
  
  void main() {
    vec2 uv = gl_PointCoord.xy - 0.5;
    float d = length(uv);
    
    // Soft circle with exponential drop-off for "fluffy" look
    float alpha = 1.0 - smoothstep(0.0, 0.5, d);
    alpha = pow(alpha, 1.5); // Slightly sharper falloff for larger flakes looks better
    
    if (alpha < 0.01) discard;
    
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * vAlpha);
  }
`;

const Snow: React.FC = () => {
  const count = 1500; // Slightly reduced count since they are bigger to prevent clutter
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, sizes, randoms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const randoms = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Spread wider
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      
      // INCREASED base size range: 0.8 to 2.5 (was smaller)
      sizes[i] = Math.random() * 1.7 + 0.8;
      randoms[i] = Math.random();
    }
    return { positions, sizes, randoms };
  }, []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={randoms.length}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={SNOW_VERTEX_SHADER}
        fragmentShader={SNOW_FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default Snow;

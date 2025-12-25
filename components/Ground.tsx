import React from 'react';
import { MeshReflectorMaterial } from '@react-three/drei';

const Ground: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6.5, 0]}>
      <planeGeometry args={[100, 100]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={40} // Strength of the reflections
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050505"
        metalness={0.5}
        mirror={0} // TypeScript error workaround for some versions, but valid prop. If error, remove.
      />
    </mesh>
  );
};

export default Ground;

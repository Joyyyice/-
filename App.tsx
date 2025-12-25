import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import TreeParticles from './components/TreeParticles';
import Snow from './components/Snow';
import TopStar from './components/TopStar';
import Ground from './components/Ground';
import Overlay from './components/Overlay';
import ColorPicker from './components/ColorPicker';

// Define Color Palettes
const PALETTES = [
  ['#ff0000', '#00ff00', '#ffd700', '#ffffff'], // Classic
  ['#caf0f8', '#90e0ef', '#00b4d8', '#ffffff'], // Frozen
  ['#cdb4db', '#ffc8dd', '#ffafcc', '#bde0fe'], // Pastel
  ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec'], // Sunset
  ['#7b2cbf', '#9d4edd', '#e0aaff', '#ffffff'], // Royal
  ['#ffD700', '#DAA520', '#EEE8AA', '#FAFAD2'], // Gold
  ['#ff0000', '#ffffff', '#ff4d4d', '#f0f0f0'], // Candy Cane
  ['#390099', '#9e0059', '#ff0054', '#ffbd00'], // Vivid
];

const Scene: React.FC<{ palette: string[] }> = ({ palette }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 25]} fov={50} />
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 2 - 0.05} // Don't go below ground
        autoRotate
        autoRotateSpeed={0.5}
        zoomSpeed={0.5}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#5555ff" />
      
      {/* Background Stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Main Elements */}
      <group position={[0, 0, 0]}>
        <TreeParticles palette={palette} />
        <TopStar />
        <Snow />
      </group>
      
      <Ground />

      {/* Post Processing */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.4} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
};

const App: React.FC = () => {
  const [activePaletteIndex, setActivePaletteIndex] = useState(0);

  return (
    <div className="relative w-full h-screen bg-[#050505]">
      {/* Import a Christmas font */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@700&display=swap');`}
      </style>
      
      <Canvas dpr={[1, 2]} gl={{ antialias: false }}>
        <Suspense fallback={null}>
          <Scene palette={PALETTES[activePaletteIndex]} />
        </Suspense>
      </Canvas>
      
      <Overlay />
      
      <ColorPicker 
        palettes={PALETTES} 
        activePaletteIndex={activePaletteIndex} 
        onSelect={setActivePaletteIndex} 
      />
    </div>
  );
};

export default App;

import React, { useState } from 'react';

const Overlay: React.FC = () => {
  const [text, setText] = useState("Merry Christmas");

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col items-center justify-end pb-12 z-10">
      {/* Enable pointer events specifically for the interactive area */}
      <div className="text-center space-y-2 w-full px-4 pointer-events-auto">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-transparent text-5xl md:text-7xl font-bold text-center border-none outline-none focus:ring-0 transition-all duration-300"
          style={{
            fontFamily: '"Mountains of Christmas", cursive, serif',
            textShadow: '0 0 20px rgba(255,255,255,0.3)',
            background: 'linear-gradient(to right, #ff5555, #ffcc00, #55ff55)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            caretColor: 'white'
          }}
          maxLength={30}
          spellCheck={false}
          aria-label="Customizable Christmas Greeting"
        />
        <p className="text-white/80 text-sm md:text-base font-light tracking-widest uppercase animate-pulse select-none">
          Drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
};

export default Overlay;
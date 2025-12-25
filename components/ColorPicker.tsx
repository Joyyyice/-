import React from 'react';

interface ColorPickerProps {
  palettes: string[][];
  activePaletteIndex: number;
  onSelect: (index: number) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ palettes, activePaletteIndex, onSelect }) => {
  return (
    <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-3 p-5 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <h3 className="text-white/90 text-xs font-bold uppercase tracking-[0.2em] mb-2 text-center drop-shadow-md">Theme Color</h3>
      <div className="grid grid-cols-4 gap-4">
        {palettes.map((palette, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`
              w-12 h-12 rounded-full relative group transition-all duration-300 ease-out transform
              ${activePaletteIndex === index 
                ? 'scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)] ring-2 ring-white ring-offset-2 ring-offset-black/50' 
                : 'hover:scale-110 hover:shadow-lg opacity-80 hover:opacity-100'}
            `}
            aria-label={`Select color palette ${index + 1}`}
          >
            <div className="w-full h-full rounded-full overflow-hidden flex transform rotate-45 border border-white/10">
              {palette.map((color, i) => (
                <div 
                  key={i} 
                  style={{ backgroundColor: color }} 
                  className="flex-1 h-full"
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
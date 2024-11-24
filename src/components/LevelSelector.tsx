import { Level } from '@/data/texts';
import { useState } from 'react';

interface LevelSelectorProps {
  currentLevel: Level;
  onLevelChange: (level: Level) => void;
}

const levelStyles = {
  easy: {
    base: 'bg-white/[0.03] text-white/70 border-white/[0.05] hover:border-white/[0.08]',
    active: 'bg-white/[0.05] text-white/90 border-white/[0.08]'
  },
  medium: {
    base: 'bg-white/[0.03] text-[#60A5FA]/70 border-[#60A5FA]/[0.05] hover:border-[#60A5FA]/[0.08]',
    active: 'bg-[#60A5FA]/[0.03] text-[#60A5FA]/90 border-[#60A5FA]/[0.08]'
  },
  hard: {
    base: 'bg-white/[0.03] text-[#FB7185]/70 border-[#FB7185]/[0.05] hover:border-[#FB7185]/[0.08]',
    active: 'bg-[#FB7185]/[0.03] text-[#FB7185]/90 border-[#FB7185]/[0.08]'
  },
  random: {
    base: 'bg-white/[0.03] text-[#A78BFA]/70 border-[#A78BFA]/[0.05] hover:border-[#A78BFA]/[0.08]',
    active: 'bg-[#A78BFA]/[0.03] text-[#A78BFA]/90 border-[#A78BFA]/[0.08]'
  }
};

export default function LevelSelector({ currentLevel, onLevelChange }: LevelSelectorProps) {
  const [clickedLevel, setClickedLevel] = useState<string | null>(null);

  const handleLevelClick = (level: Level) => {
    setClickedLevel(level);
    onLevelChange(level);
    // Reset animation after it plays
    setTimeout(() => setClickedLevel(null), 500);
  };

  return (
    <div className="flex justify-center gap-4">
      {Object.keys(levelStyles).map((level) => (
        <button
          key={level}
          onClick={() => handleLevelClick(level as Level)}
          className={`
            relative px-8 py-3 rounded-xl font-medium tracking-wide transition-all duration-300
            hover:scale-105 backdrop-blur-sm border text-sm uppercase
            ${currentLevel === level ? levelStyles[level as Level].active : levelStyles[level as Level].base}
            group
          `}
        >
          {level}
          <span className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs">
            ↻
          </span>
        </button>
      ))}
    </div>
  );
}

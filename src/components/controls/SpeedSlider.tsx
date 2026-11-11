import React from 'react';
import { Gauge } from 'lucide-react';
import { SpeedMultiplier } from '../../types/algorithm';

interface SpeedSliderProps {
  speed: SpeedMultiplier;
  onSpeedChange: (speed: SpeedMultiplier) => void;
}

const SPEEDS: SpeedMultiplier[] = [0.25, 0.5, 1, 1.5, 2, 3];

export const SpeedSlider: React.FC<SpeedSliderProps> = ({ speed, onSpeedChange }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-slate-400 text-xs hidden sm:flex">
        <Gauge className="w-3.5 h-3.5 text-sky-400" />
        <span className="font-mono text-[11px]">Speed:</span>
      </div>

      <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
        {SPEEDS.map((s) => {
          const isSelected = speed === s;
          return (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                isSelected
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {s}x
            </button>
          );
        })}
      </div>
    </div>
  );
};

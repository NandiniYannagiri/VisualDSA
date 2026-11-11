import React from 'react';
import { VisualStep } from '../../types/algorithm';

interface BinarySearchVisualizerProps {
  currentStep: VisualStep<number[]> | null;
  initialArray: number[];
}

export const BinarySearchVisualizer: React.FC<BinarySearchVisualizerProps> = ({
  currentStep,
  initialArray
}) => {
  const arr = currentStep?.state || initialArray;
  const pointers = currentStep?.pointers || {};
  const highlights = currentStep?.highlights || {};
  const dimmed = highlights.dimmed || [];

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 relative overflow-hidden select-none">
      {/* Legend & Target */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
            <span className="text-sky-300">Midpoint (arr[mid])</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-700 opacity-40" />
            <span className="text-slate-500">Eliminated Search Space</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className="text-emerald-300">Target Match</span>
          </div>
        </div>

        {pointers.target !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Search Target:</span>
            <span className="text-amber-400 font-bold font-mono px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
              {pointers.target}
            </span>
          </div>
        )}
      </div>

      {/* Main Pointer Track & Array Boxes */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl px-4">
          {arr.map((val, idx) => {
            const isMid = pointers.mid === idx;
            const isLow = pointers.low === idx;
            const isHigh = pointers.high === idx;
            const isDimmed = dimmed.includes(idx);
            const isSorted = highlights.sorted?.includes(idx);

            let borderColor = 'border-slate-700';
            let bgColor = 'bg-slate-800/80';
            let textColor = 'text-slate-200';

            if (isSorted) {
              borderColor = 'border-emerald-400';
              bgColor = 'bg-emerald-500';
              textColor = 'text-slate-950 font-extrabold';
            } else if (isMid) {
              borderColor = 'border-sky-400';
              bgColor = 'bg-sky-500/20';
              textColor = 'text-sky-300 font-extrabold';
            } else if (isDimmed) {
              borderColor = 'border-slate-800/40';
              bgColor = 'bg-slate-900/40';
              textColor = 'text-slate-600 line-through';
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-1 relative">
                {/* Pointer tags above box */}
                <div className="h-6 flex items-center justify-center gap-1 font-mono text-[10px] font-bold">
                  {isLow && (
                    <span className="px-1.5 py-0.2 rounded bg-indigo-500 text-white shadow">
                      low
                    </span>
                  )}
                  {isMid && (
                    <span className="px-1.5 py-0.2 rounded bg-sky-400 text-slate-950 shadow">
                      mid
                    </span>
                  )}
                  {isHigh && (
                    <span className="px-1.5 py-0.2 rounded bg-rose-500 text-white shadow">
                      high
                    </span>
                  )}
                </div>

                {/* Number Box */}
                <div
                  className={`w-12 h-14 rounded-xl border flex items-center justify-center font-mono text-sm shadow-md transition-all duration-200 ${borderColor} ${bgColor} ${textColor} ${
                    isMid ? 'ring-2 ring-sky-400/50 scale-105' : ''
                  }`}
                >
                  {val}
                </div>

                {/* Index subscript */}
                <span className="text-[10px] font-mono text-slate-500">
                  {idx}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

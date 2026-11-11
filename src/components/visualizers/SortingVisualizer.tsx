import React from 'react';
import { VisualStep } from '../../types/algorithm';

interface SortingVisualizerProps {
  currentStep: VisualStep<number[]> | null;
  initialArray: number[];
}

export const SortingVisualizer: React.FC<SortingVisualizerProps> = ({
  currentStep,
  initialArray
}) => {
  const arr = currentStep?.state || initialArray;
  const highlights = currentStep?.highlights || {};
  const pointers = currentStep?.pointers || {};

  // Find max value to normalize bar heights
  const maxVal = Math.max(...arr, 100);

  // Group pointers by index so multiple pointers at same index stack neatly
  const pointersByIndex: Record<number, string[]> = {};
  for (const [pName, pIdx] of Object.entries(pointers)) {
    if (typeof pIdx === 'number' && pIdx >= 0 && pIdx < arr.length) {
      if (!pointersByIndex[pIdx]) pointersByIndex[pIdx] = [];
      pointersByIndex[pIdx].push(pName);
    }
  }

  // Determine bar color according to specifications:
  // - Default: Slate / Blue-gray
  // - Active / comparing: Amber / Yellow
  // - Swaps / writes: Rose / Red
  // - Sorted / finalized: Emerald Green
  // - Pivot: Cyan / Sky
  const getBarColor = (index: number) => {
    if (highlights.swapping?.includes(index)) {
      return 'bg-rose-500 border-rose-400 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.4)]';
    }
    if (highlights.comparing?.includes(index)) {
      return 'bg-amber-400 border-amber-300 text-amber-950 shadow-[0_0_15px_rgba(251,191,36,0.4)]';
    }
    if (pointers.pivot === index || highlights.active?.includes(index)) {
      return 'bg-sky-400 border-sky-300 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.4)]';
    }
    if (highlights.sorted?.includes(index)) {
      return 'bg-emerald-500 border-emerald-400 text-emerald-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
    }
    if (highlights.auxiliary?.includes(index)) {
      return 'bg-purple-600/70 border-purple-500 text-purple-100';
    }
    return 'bg-slate-700/80 border-slate-600 text-slate-200';
  };

  const auxData = currentStep?.custom;

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 relative overflow-hidden select-none">
      {/* Visual Legend */}
      <div className="flex flex-wrap items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-700 border border-slate-600" />
          <span className="text-slate-400">Default</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 border border-amber-300" />
          <span className="text-amber-300">Comparing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 border border-rose-400" />
          <span className="text-rose-300">Swap / Write</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-sky-400 border border-sky-300" />
          <span className="text-sky-300">Pivot / Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 border border-emerald-400" />
          <span className="text-emerald-300">Sorted</span>
        </div>
      </div>

      {/* Auxiliary Array Display (if Merge Sort is merging) */}
      {auxData && (auxData.L || auxData.R) && (
        <div className="my-2 p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30 flex flex-wrap items-center justify-around gap-4 text-xs font-mono">
          {auxData.L && (
            <div className="flex items-center gap-2">
              <span className="text-purple-400 font-bold">L Subarray:</span>
              <div className="flex gap-1">
                {auxData.L.map((v: number, i: number) => (
                  <span
                    key={i}
                    className={`px-2 py-1 rounded border text-xs font-bold ${
                      auxData.activeL === i
                        ? 'bg-amber-400 border-amber-300 text-slate-950 ring-2 ring-amber-400/50'
                        : 'bg-purple-950/60 border-purple-600/50 text-purple-200'
                    }`}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}

          {auxData.R && (
            <div className="flex items-center gap-2">
              <span className="text-sky-400 font-bold">R Subarray:</span>
              <div className="flex gap-1">
                {auxData.R.map((v: number, i: number) => (
                  <span
                    key={i}
                    className={`px-2 py-1 rounded border text-xs font-bold ${
                      auxData.activeR === i
                        ? 'bg-amber-400 border-amber-300 text-slate-950 ring-2 ring-amber-400/50'
                        : 'bg-sky-950/60 border-sky-600/50 text-sky-200'
                    }`}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Bars Canvas */}
      <div className="flex-1 flex items-end justify-center gap-1.5 sm:gap-2.5 px-2 pt-16 pb-2 min-h-[220px]">
        {arr.map((val, idx) => {
          const heightPercent = Math.max((val / maxVal) * 82, 14);
          const pointerList = pointersByIndex[idx] || [];

          return (
            <div
              key={idx}
              className="flex-1 max-w-[54px] flex flex-col items-center justify-end relative h-full"
            >
              {/* Floating Pointer Badges stacked above bar */}
              {pointerList.length > 0 && (
                <div className="absolute -top-12 flex flex-col items-center gap-0.5 z-10 animate-bounce-subtle pointer-events-none">
                  {pointerList.map((p) => (
                    <span
                      key={p}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md border border-amber-300"
                    >
                      {p}
                    </span>
                  ))}
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-amber-400" />
                </div>
              )}

              {/* Animated Column Bar */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-lg border flex flex-col items-center justify-start pt-1.5 algo-bar font-mono text-xs font-bold ${getBarColor(
                  idx
                )}`}
              >
                <span>{val}</span>
              </div>

              {/* Array Index label below */}
              <span className="text-[10px] font-mono text-slate-500 mt-1.5">
                [{idx}]
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

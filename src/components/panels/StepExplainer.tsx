import React from 'react';
import { ArrowRight, Lightbulb, Compass } from 'lucide-react';
import { VisualStep } from '../../types/algorithm';

interface StepExplainerProps {
  currentStep: VisualStep | null;
  currentStepIndex: number;
  totalSteps: number;
}

export const StepExplainer: React.FC<StepExplainerProps> = ({
  currentStep,
  currentStepIndex,
  totalSteps
}) => {
  if (!currentStep) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-500">
        Ready to visualize. Press Play or Step Forward to begin execution.
      </div>
    );
  }

  const pointers = currentStep.pointers || {};
  const pointerEntries = Object.entries(pointers).filter(([_, v]) => v !== undefined && v !== null);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Pedagogical Step Breakdown</span>
        </div>

        <span className="text-[11px] font-mono text-slate-500">
          Step <span className="text-sky-400 font-bold">{currentStepIndex + 1}</span> of{' '}
          <span className="text-slate-400">{totalSteps}</span>
        </span>
      </div>

      {/* Main explanation 2-line breakdown */}
      <div className="space-y-1">
        <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug">
          {currentStep.description}
        </p>
        {currentStep.subDescription && (
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            {currentStep.subDescription}
          </p>
        )}
      </div>

      {/* Active Pointers status pills */}
      {pointerEntries.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mr-1">
            <Compass className="w-3 h-3 text-sky-400" />
            <span>Pointers:</span>
          </div>
          {pointerEntries.map(([key, val]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-slate-300"
            >
              <span className="text-sky-400 font-semibold">{key}:</span>
              <span className="text-amber-300 font-bold">{String(val)}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

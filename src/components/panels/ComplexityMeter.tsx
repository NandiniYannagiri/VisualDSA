import React from 'react';
import { Clock, HardDrive, ShieldCheck, Zap } from 'lucide-react';
import { ComplexityMetrics } from '../../types/dsa';
import { Badge } from '../common/Badge';

interface ComplexityMeterProps {
  complexity: ComplexityMetrics;
  metrics?: {
    comparisons?: number;
    swaps?: number;
    operations?: number;
    depth?: number;
  };
}

export const ComplexityMeter: React.FC<ComplexityMeterProps> = ({
  complexity,
  metrics
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span>Complexity & Performance Meter</span>
        </div>

        {complexity.stability && (
          <Badge
            variant={complexity.stability === 'Stable' ? 'emerald' : 'slate'}
            size="sm"
          >
            {complexity.stability}
          </Badge>
        )}
      </div>

      {/* Grid of complexity badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Best Time */}
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500">Best Time</span>
          <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
            {complexity.bestTime}
          </span>
        </div>

        {/* Average Time */}
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500">Average Time</span>
          <span className="text-xs font-mono font-bold text-sky-400 mt-0.5">
            {complexity.avgTime}
          </span>
        </div>

        {/* Worst Time */}
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500">Worst Time</span>
          <span className="text-xs font-mono font-bold text-rose-400 mt-0.5">
            {complexity.worstTime}
          </span>
        </div>

        {/* Space */}
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500">Space (Aux)</span>
          <span className="text-xs font-mono font-bold text-purple-400 mt-0.5">
            {complexity.space}
          </span>
        </div>
      </div>

      {/* Live execution telemetry if available */}
      {metrics && (metrics.comparisons !== undefined || metrics.swaps !== undefined) && (
        <div className="flex items-center gap-4 pt-1 border-t border-slate-800/60 text-xs text-slate-400 font-mono">
          {metrics.comparisons !== undefined && (
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Comparisons:</span>
              <span className="text-amber-300 font-bold">{metrics.comparisons}</span>
            </div>
          )}

          {metrics.swaps !== undefined && (
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Swaps / Writes:</span>
              <span className="text-rose-300 font-bold">{metrics.swaps}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

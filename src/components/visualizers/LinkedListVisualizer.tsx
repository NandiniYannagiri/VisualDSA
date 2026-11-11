import React from 'react';
import { VisualStep } from '../../types/algorithm';
import { ListNodeItem } from '../../algorithms/linear/linkedList';
import { ArrowRight } from 'lucide-react';

interface LinkedListVisualizerProps {
  currentStep: VisualStep<ListNodeItem[]> | null;
  initialValues: number[];
}

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({
  currentStep,
  initialValues
}) => {
  const nodes = currentStep?.state || initialValues.map((v, i) => ({
    id: `node-${i}`,
    val: v,
    nextId: i < initialValues.length - 1 ? `node-${i + 1}` : null
  }));

  const pointers = currentStep?.pointers || {};

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 relative overflow-hidden select-none">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
          <span className="text-indigo-300">prev Pointer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
          <span className="text-amber-300">curr Pointer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
          <span className="text-sky-300">nxt Pointer</span>
        </div>
      </div>

      {/* Linked Nodes Stream */}
      <div className="flex-1 flex items-center justify-center overflow-x-auto px-4 py-8">
        <div className="flex items-center gap-3">
          {nodes.map((node, idx) => {
            const isCurr = pointers.curr === node.id;
            const isPrev = pointers.prev === node.id;
            const isNxt = pointers.nxt === node.id;

            return (
              <React.Fragment key={node.id}>
                <div className="flex flex-col items-center gap-1 relative">
                  {/* Floating pointer chips */}
                  <div className="h-6 flex items-center gap-1 font-mono text-[10px] font-bold">
                    {isPrev && (
                      <span className="px-1.5 py-0.2 rounded bg-indigo-500 text-white">
                        prev
                      </span>
                    )}
                    {isCurr && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                        curr
                      </span>
                    )}
                    {isNxt && (
                      <span className="px-1.5 py-0.2 rounded bg-sky-400 text-slate-950">
                        nxt
                      </span>
                    )}
                  </div>

                  {/* Node Box with [val | next] */}
                  <div className="flex items-center rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shadow-lg">
                    <div className="px-4 py-3 bg-slate-900/90 font-mono text-sm font-bold text-white border-r border-slate-700">
                      {node.val}
                    </div>
                    <div className="px-2.5 py-3 bg-slate-800/80 font-mono text-xs text-slate-400">
                      next
                    </div>
                  </div>
                </div>

                {/* Arrow Pointer to Next */}
                {idx < nodes.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-slate-500 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

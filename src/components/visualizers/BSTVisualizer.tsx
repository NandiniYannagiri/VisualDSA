import React from 'react';
import { VisualStep } from '../../types/algorithm';
import { BSTState, BSTNode } from '../../algorithms/trees/bst';
import { Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface BSTVisualizerProps {
  currentStep: VisualStep<BSTState> | null;
  defaultTree: BSTNode;
}

export const BSTVisualizer: React.FC<BSTVisualizerProps> = ({
  currentStep,
  defaultTree
}) => {
  const state = currentStep?.state;
  const nodes = state?.allNodes || [];
  const edges = state?.edges || [];
  const custom = currentStep?.custom;
  const activeNodeId = custom?.activeNodeId;
  const highlightType = custom?.highlightType;
  const visitedNodeIds = custom?.visitedNodeIds || [];
  const traversalOutput = state?.traversalOutput || [];

  // Determine node color
  const getNodeFill = (node: BSTNode) => {
    if (activeNodeId === node.id) {
      if (highlightType === 'comparing') {
        return {
          fill: '#f59e0b',
          stroke: '#fbbf24',
          text: '#020617',
          glow: 'rgba(245, 158, 11, 0.5)'
        };
      }
      if (highlightType === 'sorted') {
        return {
          fill: '#10b981',
          stroke: '#34d399',
          text: '#020617',
          glow: 'rgba(16, 185, 129, 0.5)'
        };
      }
      if (highlightType === 'swapping') {
        return {
          fill: '#f43f5e',
          stroke: '#fb7185',
          text: '#ffffff',
          glow: 'rgba(244, 63, 94, 0.5)'
        };
      }
      return {
        fill: '#0284c7',
        stroke: '#38bdf8',
        text: '#ffffff',
        glow: 'rgba(56, 189, 248, 0.5)'
      };
    }

    if (visitedNodeIds.includes(node.id)) {
      return {
        fill: '#064e3b',
        stroke: '#10b981',
        text: '#a7f3d0',
        glow: 'none'
      };
    }

    // Default node
    return {
      fill: '#1e293b',
      stroke: '#475569',
      text: '#e2e8f0',
      glow: 'none'
    };
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 relative overflow-hidden select-none">
      {/* Legend & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-600" />
            <span className="text-slate-400">Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300" />
            <span className="text-amber-300">Comparing / Traversed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300" />
            <span className="text-emerald-300">Found / Inserted</span>
          </div>
        </div>

        {custom?.targetVal !== undefined && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Target Value:</span>
            <span className="text-sky-400 font-bold font-mono">{custom.targetVal}</span>
          </div>
        )}
      </div>

      {/* SVG Canvas for Tree */}
      <div className="flex-1 w-full min-h-[320px] flex items-center justify-center relative">
        <svg
          viewBox="0 0 700 360"
          className="w-full h-full max-h-[380px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker
              id="arrow-left"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isEdgeActive =
              activeNodeId === edge.to && highlightType === 'comparing';

            return (
              <g key={`${edge.from}-${edge.to}`}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isEdgeActive ? '#f59e0b' : '#334155'}
                  strokeWidth={isEdgeActive ? 3 : 2}
                  strokeDasharray={isEdgeActive ? '4 2' : 'none'}
                  className="tree-edge"
                />
                {/* Edge direction label: L or R */}
                <text
                  x={(fromNode.x + toNode.x) / 2 + (edge.direction === 'left' ? -10 : 10)}
                  y={(fromNode.y + toNode.y) / 2}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {edge.direction === 'left' ? 'L (<)' : 'R (>)'}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const style = getNodeFill(node);
            const isActive = activeNodeId === node.id;

            return (
              <g key={node.id} className="cursor-pointer group">
                {/* Glow ring if active */}
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={26}
                    fill="none"
                    stroke={style.stroke}
                    strokeWidth={2}
                    opacity={0.4}
                    className="animate-ping"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={20}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth={isActive ? 3 : 2}
                  className="tree-node-circle transition-all duration-300"
                  style={{
                    filter:
                      style.glow !== 'none'
                        ? `drop-shadow(0px 0px 8px ${style.glow})`
                        : undefined
                  }}
                />

                {/* Value Text */}
                <text
                  x={node.x}
                  y={node.y + 4.5}
                  textAnchor="middle"
                  fill={style.text}
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Traversal Output Tape if In-Order was run */}
      {traversalOutput.length > 0 && (
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            <span>In-Order Result:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1 font-mono text-xs">
            {traversalOutput.map((val, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold"
              >
                {val}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

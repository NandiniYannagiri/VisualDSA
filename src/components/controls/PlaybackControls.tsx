import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  FastForward,
  Keyboard
} from 'lucide-react';
import { PlaybackStatus, SpeedMultiplier } from '../../types/algorithm';
import { SpeedSlider } from './SpeedSlider';
import { DataInputBar } from './DataInputBar';

interface PlaybackControlsProps {
  playbackStatus: PlaybackStatus;
  currentStepIndex: number;
  totalSteps: number;
  speed: SpeedMultiplier;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onJumpToEnd: () => void;
  onScrub: (index: number) => void;
  onSpeedChange: (speed: SpeedMultiplier) => void;

  // Data inputs
  onGenerateRandom: () => void;
  onCustomInput: (values: number[]) => void;
  onEdgeCaseSelect: (type: 'sorted' | 'reversed' | 'duplicates' | 'nearly-sorted' | 'single') => void;
  isBST?: boolean;
  onBSTInsert?: (val: number) => void;
  onBSTSearch?: (val: number) => void;
  onBSTInOrder?: () => void;
  onBSTReset?: () => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  playbackStatus,
  currentStepIndex,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onJumpToEnd,
  onScrub,
  onSpeedChange,
  onGenerateRandom,
  onCustomInput,
  onEdgeCaseSelect,
  isBST,
  onBSTInsert,
  onBSTSearch,
  onBSTInOrder,
  onBSTReset
}) => {
  const isPlaying = playbackStatus === 'playing';
  const progressPercent = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-2 sm:px-4 sm:py-2.5 flex flex-col gap-2 select-none shadow-2xl z-20">
      {/* Timeline scrubber bar */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono text-slate-400 w-12 text-right shrink-0">
          {currentStepIndex + 1}/{totalSteps || 1}
        </span>

        <div className="relative flex-1 flex items-center group cursor-pointer">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => onScrub(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 focus:outline-none"
          />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-lg pointer-events-none"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
          <Keyboard className="w-3 h-3 text-slate-400" />
          <span>Space (Play/Pause) • Arrows (Step) • R (Reset)</span>
        </div>
      </div>

      {/* Main control dock */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Data input & generator tools */}
        <div className="flex items-center gap-2">
          <DataInputBar
            onGenerateRandom={onGenerateRandom}
            onCustomInput={onCustomInput}
            onEdgeCaseSelect={onEdgeCaseSelect}
            isBST={isBST}
            onBSTInsert={onBSTInsert}
            onBSTSearch={onBSTSearch}
            onBSTInOrder={onBSTInOrder}
            onBSTReset={onBSTReset}
          />
        </div>

        {/* Center: Primary Playback buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Reset */}
          <button
            onClick={onReset}
            title="Reset (Key: R)"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step Back */}
          <button
            onClick={onStepBackward}
            disabled={currentStepIndex <= 0}
            title="Step Back (Key: ←)"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Step Forward (Key: →)"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Jump to End */}
          <button
            onClick={onJumpToEnd}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Jump to Completion"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Speed Slider */}
        <div className="flex items-center gap-2">
          <SpeedSlider speed={speed} onSpeedChange={onSpeedChange} />
        </div>
      </div>
    </div>
  );
};

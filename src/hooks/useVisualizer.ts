import { useState, useEffect, useRef, useCallback } from 'react';
import { VisualStep, PlaybackStatus, SpeedMultiplier } from '../types/algorithm';

export interface UseVisualizerOptions {
  baseIntervalMs?: number;
}

export function useVisualizer<TState = any>(
  steps: VisualStep<TState>[],
  options: UseVisualizerOptions = {}
) {
  const { baseIntervalMs = 700 } = options;

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('idle');
  const [speed, setSpeed] = useState<SpeedMultiplier>(1);

  const timerRef = useRef<number | null>(null);

  // When steps array changes, reset playback
  useEffect(() => {
    setCurrentStepIndex(0);
    setPlaybackStatus('idle');
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [steps]);

  // Current active step
  const currentStep = steps[currentStepIndex] || null;

  // Clean timer helper
  const clearPlaybackTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Pause playback
  const pause = useCallback(() => {
    clearPlaybackTimer();
    setPlaybackStatus('paused');
  }, [clearPlaybackTimer]);

  // Step Forward
  const stepForward = useCallback(() => {
    pause();
    setCurrentStepIndex((prev) => {
      if (prev < steps.length - 1) return prev + 1;
      return prev;
    });
  }, [pause, steps.length]);

  // Step Backward
  const stepBackward = useCallback(() => {
    pause();
    setCurrentStepIndex((prev) => {
      if (prev > 0) return prev - 1;
      return prev;
    });
  }, [pause]);

  // Reset to start
  const reset = useCallback(() => {
    pause();
    setCurrentStepIndex(0);
    setPlaybackStatus('idle');
  }, [pause]);

  // Jump to end
  const jumpToEnd = useCallback(() => {
    pause();
    if (steps.length > 0) {
      setCurrentStepIndex(steps.length - 1);
      setPlaybackStatus('completed');
    }
  }, [pause, steps.length]);

  // Scrub direct index
  const scrubTo = useCallback((index: number) => {
    pause();
    const clamped = Math.max(0, Math.min(index, steps.length - 1));
    setCurrentStepIndex(clamped);
    if (clamped === steps.length - 1) {
      setPlaybackStatus('completed');
    } else {
      setPlaybackStatus('paused');
    }
  }, [pause, steps.length]);

  // Play
  const play = useCallback(() => {
    if (steps.length === 0) return;

    // If at end, restart from 0
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }

    setPlaybackStatus('playing');
  }, [currentStepIndex, steps.length]);

  // Handle active playing ticker
  useEffect(() => {
    if (playbackStatus !== 'playing') {
      clearPlaybackTimer();
      return;
    }

    const interval = Math.max(80, Math.floor(baseIntervalMs / speed));

    timerRef.current = window.setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          clearPlaybackTimer();
          setPlaybackStatus('completed');
          return prev;
        }
        return prev + 1;
      });
    }, interval);

    return () => clearPlaybackTimer();
  }, [playbackStatus, speed, steps.length, baseIntervalMs, clearPlaybackTimer]);

  return {
    currentStep,
    currentStepIndex,
    totalSteps: steps.length,
    playbackStatus,
    speed,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    jumpToEnd,
    scrubTo,
    setSpeed
  };
}

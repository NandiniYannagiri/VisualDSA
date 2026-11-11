export interface StepHighlight {
  comparing?: number[]; // indices of elements being compared (amber/yellow)
  swapping?: number[];  // indices of elements being swapped/written (rose/red)
  sorted?: number[];    // indices finalized/in-place (emerald green)
  active?: number[];    // active pivot / current working element (sky/blue)
  auxiliary?: number[]; // auxiliary buffer elements (purple)
  dimmed?: number[];    // discarded or inactive elements
}

export interface CallStackFrame {
  id: string;
  funcName: string;
  params: string;
  depth: number;
  returnValue?: string;
  status: 'active' | 'returning' | 'waiting';
}

export interface VisualStep<TState = any> {
  stepIndex: number;
  totalSteps: number;
  state: TState;
  activeLine: number;
  description: string;
  subDescription?: string;
  pointers?: Record<string, number | string | null>;
  highlights?: StepHighlight;
  callStack?: CallStackFrame[];
  metrics?: {
    comparisons?: number;
    swaps?: number;
    operations?: number;
    depth?: number;
  };
  custom?: any;
}

export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'completed';

export type SpeedMultiplier = 0.25 | 0.5 | 1 | 1.5 | 2 | 3;

export type CategoryType = 
  | 'linear'
  | 'sorting'
  | 'searching'
  | 'trees'
  | 'graphs'
  | 'advanced';

export type ComplexityValue = string; // e.g. "O(1)", "O(log N)", "O(N log N)", "O(N^2)"

export interface ComplexityMetrics {
  bestTime: ComplexityValue;
  avgTime: ComplexityValue;
  worstTime: ComplexityValue;
  space: ComplexityValue;
  inPlace?: boolean;
  stability?: 'Stable' | 'Unstable' | 'N/A';
}

export interface DSATopic {
  id: string;
  title: string;
  category: CategoryType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  leetcodeNumber?: number;
  leetcodeTitle?: string;
  summary: string;
  complexity: ComplexityMetrics;
  keyTakeaways: string[];
  pythonTip: string;
  defaultInput?: any;
}

export interface CodeSnippets {
  python: string;
  cpp: string;
  java: string;
  javascript: string;
}

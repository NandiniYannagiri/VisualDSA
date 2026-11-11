import React from 'react';
import { DSATopic } from '../../types/dsa';
import { VisualStep } from '../../types/algorithm';
import { CodeSnippets } from '../../types/dsa';
import { ComplexityMeter } from '../panels/ComplexityMeter';
import { StepExplainer } from '../panels/StepExplainer';
import { CodePanel } from '../panels/CodePanel';
import { TheoryPanel } from '../panels/TheoryPanel';

interface SplitWorkspaceProps {
  currentTopic: DSATopic;
  currentStep: VisualStep | null;
  currentStepIndex: number;
  totalSteps: number;
  codeSnippets: CodeSnippets;
  visualizerStage: React.ReactNode;
}

export const SplitWorkspace: React.FC<SplitWorkspaceProps> = ({
  currentTopic,
  currentStep,
  currentStepIndex,
  totalSteps,
  codeSnippets,
  visualizerStage
}) => {
  return (
    <main className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
      {/* Left / Center: Visualization Stage (7 cols on lg) */}
      <section className="lg:col-span-7 xl:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/70 overflow-hidden relative">
        {/* Stage Content */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-2 relative">
          {visualizerStage}
        </div>
      </section>

      {/* Right Panel: Theory, Complexity & Synchronized Code Tracing (5 cols on lg) */}
      <section className="lg:col-span-5 xl:col-span-5 flex flex-col bg-slate-900/50 overflow-y-auto p-3.5 space-y-3.5">
        {/* 1. Pedagogical Step Breakdown */}
        <StepExplainer
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
        />

        {/* 2. Complexity Meter & Metrics */}
        <ComplexityMeter
          complexity={currentTopic.complexity}
          metrics={currentStep?.metrics}
        />

        {/* 3. Synchronized Code Tracing Panel */}
        <div className="h-72 sm:h-80 shrink-0">
          <CodePanel
            snippets={codeSnippets}
            activeLine={currentStep?.activeLine || 1}
          />
        </div>

        {/* 4. Theory & Python Trainer Tips */}
        <TheoryPanel topic={currentTopic} />
      </section>
    </main>
  );
};

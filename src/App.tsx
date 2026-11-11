import React, { useState, useMemo, useCallback } from 'react';
import { DSA_TOPICS } from './data/topics';
import { CODE_SNIPPETS } from './data/codeSnippets';
import { DSATopic } from './types/dsa';
import { VisualStep } from './types/algorithm';
import { useVisualizer } from './hooks/useVisualizer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { SplitWorkspace } from './components/layout/SplitWorkspace';
import { PlaybackControls } from './components/controls/PlaybackControls';

import { SortingVisualizer } from './components/visualizers/SortingVisualizer';
import { BSTVisualizer } from './components/visualizers/BSTVisualizer';
import { BinarySearchVisualizer } from './components/visualizers/BinarySearchVisualizer';
import { LinkedListVisualizer } from './components/visualizers/LinkedListVisualizer';

import { generateQuickSortSteps } from './algorithms/sorting/quickSort';
import { generateMergeSortSteps } from './algorithms/sorting/mergeSort';
import { generateBubbleSortSteps } from './algorithms/sorting/bubbleSort';
import { generateBinarySearchSteps } from './algorithms/searching/binarySearch';
import {
  BSTNode,
  createSampleBST,
  generateBSTInsertSteps,
  generateBSTSearchSteps,
  generateBSTInOrderSteps
} from './algorithms/trees/bst';
import { generateReverseLinkedListSteps } from './algorithms/linear/linkedList';

export const App: React.FC = () => {
  // Topic state
  const [currentTopicId, setCurrentTopicId] = useState<string>('quick-sort');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Active dataset for array algorithms
  const [arrayData, setArrayData] = useState<number[]>([
    45, 12, 85, 32, 89, 39, 67, 24, 71, 18, 55
  ]);

  // BST state
  const [bstRoot, setBstRoot] = useState<BSTNode>(() => createSampleBST());
  const [bstCustomSteps, setBstCustomSteps] = useState<VisualStep[] | null>(null);

  // Binary search target
  const [searchTarget, setSearchTarget] = useState<number>(39);

  // Current topic object
  const currentTopic: DSATopic = useMemo(() => {
    return DSA_TOPICS.find(t => t.id === currentTopicId) || DSA_TOPICS[0];
  }, [currentTopicId]);

  // Generate steps based on current topic
  const steps: VisualStep[] = useMemo(() => {
    if (currentTopicId === 'quick-sort') {
      return generateQuickSortSteps(arrayData);
    }
    if (currentTopicId === 'merge-sort') {
      return generateMergeSortSteps(arrayData);
    }
    if (currentTopicId === 'bubble-sort') {
      return generateBubbleSortSteps(arrayData);
    }
    if (currentTopicId === 'binary-search') {
      return generateBinarySearchSteps(arrayData, searchTarget);
    }
    if (currentTopicId === 'bst') {
      if (bstCustomSteps) return bstCustomSteps;
      return generateBSTInOrderSteps(bstRoot);
    }
    if (currentTopicId === 'singly-linked-list') {
      return generateReverseLinkedListSteps(arrayData.slice(0, 5));
    }

    // Fallback default
    return generateQuickSortSteps(arrayData);
  }, [currentTopicId, arrayData, searchTarget, bstRoot, bstCustomSteps]);

  // Hook for timeline playback
  const {
    currentStep,
    currentStepIndex,
    totalSteps,
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
  } = useVisualizer(steps);

  // Accessible keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: () => {
      if (playbackStatus === 'playing') pause();
      else play();
    },
    onStepForward: stepForward,
    onStepBackward: stepBackward,
    onReset: reset
  });

  // Data generator handlers
  const handleGenerateRandom = useCallback(() => {
    const size = 10;
    const randoms: number[] = [];
    while (randoms.length < size) {
      const val = Math.floor(Math.random() * 85) + 12;
      if (!randoms.includes(val)) randoms.push(val);
    }
    setArrayData(randoms);
    setSearchTarget(randoms[Math.floor(randoms.length / 2)]);
    reset();
  }, [reset]);

  const handleCustomInput = useCallback((values: number[]) => {
    setArrayData(values);
    setSearchTarget(values[Math.floor(values.length / 2)]);
    reset();
  }, [reset]);

  const handleEdgeCaseSelect = useCallback((type: 'sorted' | 'reversed' | 'duplicates' | 'nearly-sorted' | 'single') => {
    switch (type) {
      case 'sorted':
        setArrayData([10, 18, 25, 34, 42, 58, 69, 77, 88, 95]);
        setSearchTarget(58);
        break;
      case 'reversed':
        setArrayData([95, 88, 77, 69, 58, 42, 34, 25, 18, 10]);
        setSearchTarget(34);
        break;
      case 'duplicates':
        setArrayData([45, 12, 45, 80, 12, 45, 80, 12, 45]);
        setSearchTarget(45);
        break;
      case 'nearly-sorted':
        setArrayData([10, 20, 35, 30, 50, 60, 85, 75, 95]);
        setSearchTarget(60);
        break;
      case 'single':
        setArrayData([42]);
        setSearchTarget(42);
        break;
    }
    reset();
  }, [reset]);

  // BST Handlers
  const handleBSTInsert = useCallback((val: number) => {
    const generated = generateBSTInsertSteps(bstRoot, val);
    setBstCustomSteps(generated);
    // Also persist into state
    if (generated.length > 0) {
      const lastState = generated[generated.length - 1].state;
      if (lastState?.root) {
        setBstRoot(lastState.root);
      }
    }
    reset();
  }, [bstRoot, reset]);

  const handleBSTSearch = useCallback((val: number) => {
    const generated = generateBSTSearchSteps(bstRoot, val);
    setBstCustomSteps(generated);
    reset();
  }, [bstRoot, reset]);

  const handleBSTInOrder = useCallback(() => {
    const generated = generateBSTInOrderSteps(bstRoot);
    setBstCustomSteps(generated);
    reset();
  }, [bstRoot, reset]);

  const handleBSTReset = useCallback(() => {
    const newTree = createSampleBST();
    setBstRoot(newTree);
    setBstCustomSteps(null);
    reset();
  }, [reset]);

  // Current visual stage selector
  const renderVisualStage = () => {
    if (currentTopicId === 'bst') {
      return (
        <BSTVisualizer
          currentStep={currentStep as any}
          defaultTree={bstRoot}
        />
      );
    }
    if (currentTopicId === 'binary-search') {
      return (
        <BinarySearchVisualizer
          currentStep={currentStep as any}
          initialArray={arrayData}
        />
      );
    }
    if (currentTopicId === 'singly-linked-list') {
      return (
        <LinkedListVisualizer
          currentStep={currentStep as any}
          initialValues={arrayData.slice(0, 5)}
        />
      );
    }

    // Default: Sorting (Quick Sort, Merge Sort, Bubble Sort)
    return (
      <SortingVisualizer
        currentStep={currentStep as any}
        initialArray={arrayData}
      />
    );
  };

  const codeSnippets = CODE_SNIPPETS[currentTopicId] || CODE_SNIPPETS['quick-sort'];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTopic={currentTopic}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      {/* Main Split Body: Sidebar + Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          currentTopicId={currentTopicId}
          onSelectTopic={(id) => {
            setCurrentTopicId(id);
            if (id === 'bst') {
              setBstCustomSteps(null);
            }
            reset();
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <SplitWorkspace
          currentTopic={currentTopic}
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          codeSnippets={codeSnippets}
          visualizerStage={renderVisualStage()}
        />
      </div>

      {/* Docked Global Playback Controller */}
      <PlaybackControls
        playbackStatus={playbackStatus}
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        speed={speed}
        onPlay={play}
        onPause={pause}
        onStepForward={stepForward}
        onStepBackward={stepBackward}
        onReset={reset}
        onJumpToEnd={jumpToEnd}
        onScrub={scrubTo}
        onSpeedChange={setSpeed}
        onGenerateRandom={handleGenerateRandom}
        onCustomInput={handleCustomInput}
        onEdgeCaseSelect={handleEdgeCaseSelect}
        isBST={currentTopicId === 'bst'}
        onBSTInsert={handleBSTInsert}
        onBSTSearch={handleBSTSearch}
        onBSTInOrder={handleBSTInOrder}
        onBSTReset={handleBSTReset}
      />
    </div>
  );
};

export default App;

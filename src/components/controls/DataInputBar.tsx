import React, { useState } from 'react';
import { Shuffle, Edit3, AlertCircle, Sparkles, Check, ChevronDown } from 'lucide-react';

interface DataInputBarProps {
  onGenerateRandom: () => void;
  onCustomInput: (values: number[]) => void;
  onEdgeCaseSelect: (type: 'sorted' | 'reversed' | 'duplicates' | 'nearly-sorted' | 'single') => void;
  isBST?: boolean;
  onBSTInsert?: (val: number) => void;
  onBSTSearch?: (val: number) => void;
  onBSTInOrder?: () => void;
  onBSTReset?: () => void;
}

export const DataInputBar: React.FC<DataInputBarProps> = ({
  onGenerateRandom,
  onCustomInput,
  onEdgeCaseSelect,
  isBST = false,
  onBSTInsert,
  onBSTSearch,
  onBSTInOrder,
  onBSTReset
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customText, setCustomText] = useState('45, 12, 89, 34, 70, 23, 61, 19');
  const [showEdgeDropdown, setShowEdgeDropdown] = useState(false);

  // BST specific state
  const [bstInsertVal, setBstInsertVal] = useState('25');
  const [bstSearchVal, setBstSearchVal] = useState('40');

  const handleApplyCustom = () => {
    const parsed = customText
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n));

    if (parsed.length > 0) {
      onCustomInput(parsed.slice(0, 16)); // cap to 16 for clean visual stage
      setShowCustomModal(false);
    }
  };

  if (isBST) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {/* BST Insert Input */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg overflow-hidden p-0.5">
          <input
            type="number"
            value={bstInsertVal}
            onChange={(e) => setBstInsertVal(e.target.value)}
            className="w-14 bg-transparent text-xs font-mono text-center text-slate-100 focus:outline-none"
            placeholder="Val"
          />
          <button
            onClick={() => {
              const val = parseInt(bstInsertVal, 10);
              if (!isNaN(val)) onBSTInsert?.(val);
            }}
            className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors"
          >
            + Insert
          </button>
        </div>

        {/* BST Search Input */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg overflow-hidden p-0.5">
          <input
            type="number"
            value={bstSearchVal}
            onChange={(e) => setBstSearchVal(e.target.value)}
            className="w-14 bg-transparent text-xs font-mono text-center text-slate-100 focus:outline-none"
            placeholder="Val"
          />
          <button
            onClick={() => {
              const val = parseInt(bstSearchVal, 10);
              if (!isNaN(val)) onBSTSearch?.(val);
            }}
            className="px-2.5 py-1 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded transition-colors"
          >
            Search
          </button>
        </div>

        {/* BST In-Order Traversal */}
        <button
          onClick={onBSTInOrder}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>In-Order</span>
        </button>

        {/* BST Reset sample tree */}
        <button
          onClick={onBSTReset}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
        >
          Reset Tree
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-wrap items-center gap-2">
      {/* Generate Random */}
      <button
        onClick={onGenerateRandom}
        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors flex items-center gap-1.5 shadow-sm"
      >
        <Shuffle className="w-3.5 h-3.5 text-sky-400" />
        <span>Random</span>
      </button>

      {/* Custom Input */}
      <button
        onClick={() => setShowCustomModal(true)}
        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors flex items-center gap-1.5 shadow-sm"
      >
        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
        <span>Custom</span>
      </button>

      {/* Edge Cases Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowEdgeDropdown(!showEdgeDropdown)}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Edge Cases</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {showEdgeDropdown && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setShowEdgeDropdown(false)}
            />
            <div className="absolute bottom-full mb-1.5 left-0 z-40 w-44 bg-slate-900 border border-slate-700 rounded-lg p-1 shadow-2xl flex flex-col space-y-0.5">
              <button
                onClick={() => {
                  onEdgeCaseSelect('sorted');
                  setShowEdgeDropdown(false);
                }}
                className="text-left px-2.5 py-1.5 text-xs rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-medium"
              >
                Sorted Array (Ascending)
              </button>
              <button
                onClick={() => {
                  onEdgeCaseSelect('reversed');
                  setShowEdgeDropdown(false);
                }}
                className="text-left px-2.5 py-1.5 text-xs rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-medium"
              >
                Reversed Array
              </button>
              <button
                onClick={() => {
                  onEdgeCaseSelect('nearly-sorted');
                  setShowEdgeDropdown(false);
                }}
                className="text-left px-2.5 py-1.5 text-xs rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-medium"
              >
                Nearly Sorted
              </button>
              <button
                onClick={() => {
                  onEdgeCaseSelect('duplicates');
                  setShowEdgeDropdown(false);
                }}
                className="text-left px-2.5 py-1.5 text-xs rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-medium"
              >
                Many Duplicates
              </button>
              <button
                onClick={() => {
                  onEdgeCaseSelect('single');
                  setShowEdgeDropdown(false);
                }}
                className="text-left px-2.5 py-1.5 text-xs rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-medium"
              >
                Single Element
              </button>
            </div>
          </>
        )}
      </div>

      {/* Custom Input Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-4 space-y-3 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-sky-400" />
              <span>Enter Custom Array Elements</span>
            </h3>
            <p className="text-xs text-slate-400">
              Enter 3 to 16 comma-separated numbers (values between 5 and 100 recommended for clear visualization).
            </p>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
              placeholder="e.g. 45, 12, 89, 34, 70, 23"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustom}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Input</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

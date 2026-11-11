import React, { useState, useEffect, useRef } from 'react';
import { Code, Copy, Check, FileCode2 } from 'lucide-react';
import { CodeSnippets } from '../../types/dsa';

interface CodePanelProps {
  snippets: CodeSnippets;
  activeLine: number;
}

type Language = 'python' | 'cpp' | 'java' | 'javascript';

const LANGUAGE_LABELS: Record<Language, { label: string; badge: string }> = {
  python: { label: 'Python (Primary)', badge: 'PY' },
  cpp: { label: 'C++', badge: 'C++' },
  java: { label: 'Java', badge: 'JAVA' },
  javascript: { label: 'JavaScript', badge: 'JS' }
};

export const CodePanel: React.FC<CodePanelProps> = ({ snippets, activeLine }) => {
  const [selectedLang, setSelectedLang] = useState<Language>('python');
  const [copied, setCopied] = useState(false);
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  const rawCode = snippets[selectedLang] || snippets.python;
  const lines = rawCode.split('\n');

  // Auto-scroll to active line if in view
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeLine, selectedLang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-xl">
      {/* Tab Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex items-center justify-between select-none">
        <div className="flex items-center gap-1 overflow-x-auto">
          {(['python', 'cpp', 'java', 'javascript'] as Language[]).map((lang) => {
            const isSelected = selectedLang === lang;
            return (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-800 text-sky-400 border border-slate-700/80 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span
                  className={`text-[9px] font-bold px-1 py-0.2 rounded ${
                    isSelected ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {LANGUAGE_LABELS[lang].badge}
                </span>
                <span>{LANGUAGE_LABELS[lang].label}</span>
              </button>
            );
          })}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Copy Code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Code Viewer Body */}
      <div className="flex-1 overflow-y-auto p-2 font-mono text-xs leading-5">
        <div className="min-w-full">
          {lines.map((lineText, idx) => {
            const lineNum = idx + 1;
            // Only highlight on Python since line markers are mapped to Python implementation
            const isActive = selectedLang === 'python' && lineNum === activeLine;

            return (
              <div
                key={lineNum}
                ref={isActive ? activeLineRef : null}
                className={`flex items-start rounded px-2 py-0.5 transition-colors ${
                  isActive
                    ? 'bg-indigo-950/80 text-sky-200 border-l-2 border-sky-400 shadow-[inset_0_0_12px_rgba(56,189,248,0.15)] font-semibold'
                    : 'text-slate-300 hover:bg-slate-900/60'
                }`}
              >
                {/* Line pointer arrow & number */}
                <div className="w-8 shrink-0 flex items-center justify-between pr-2 text-slate-600 select-none">
                  {isActive ? (
                    <span className="text-sky-400 font-bold text-[10px]">▶</span>
                  ) : (
                    <span className="w-2" />
                  )}
                  <span className={`text-[11px] ${isActive ? 'text-sky-400 font-bold' : ''}`}>
                    {lineNum}
                  </span>
                </div>

                {/* Line text */}
                <pre className="flex-1 overflow-x-auto whitespace-pre font-mono font-normal">
                  <code className={isActive ? 'text-white' : ''}>{lineText || ' '}</code>
                </pre>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer hint */}
      <div className="px-3 py-1.5 bg-slate-900/60 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <FileCode2 className="w-3 h-3 text-sky-400" />
          <span>Synchronized Line Tracing Enabled</span>
        </span>
        {selectedLang === 'python' && (
          <span className="text-sky-400 font-semibold">Active Line: {activeLine || 'Ready'}</span>
        )}
      </div>
    </div>
  );
};

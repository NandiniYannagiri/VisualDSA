import React from 'react';
import { BookOpen, CheckCircle, Code, Lightbulb } from 'lucide-react';
import { DSATopic } from '../../types/dsa';

interface TheoryPanelProps {
  topic: DSATopic;
}

export const TheoryPanel: React.FC<TheoryPanelProps> = ({ topic }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
        <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
        <span>Algorithm Theory & Intuition</span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        {topic.summary}
      </p>

      {/* Key takeaways bullet points */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Key Concepts to Remember:
        </span>
        <ul className="space-y-1">
          {topic.keyTakeaways.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Python Trainer Pro-Tip */}
      {topic.pythonTip && (
        <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-500/20 text-xs text-sky-200 flex items-start gap-2">
          <Code className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-sky-300 block text-[11px] uppercase tracking-wider">
              Python Trainer Tip:
            </span>
            <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
              {topic.pythonTip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

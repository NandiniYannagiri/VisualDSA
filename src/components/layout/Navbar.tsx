import React from 'react';
import { Sparkles, Terminal, Code2, BookOpen, Layers } from 'lucide-react';
import { DSATopic } from '../../types/dsa';
import { Badge } from '../common/Badge';

interface NavbarProps {
  currentTopic: DSATopic;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onOpenTopicModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTopic,
  onToggleSidebar,
  isSidebarOpen
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 flex items-center justify-between z-30 select-none">
      {/* Left: Hamburger & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/50"
        >
          <Layers className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-400 p-[1.5px] flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Code2 className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center">
                Visual<span className="text-sky-400">DSA</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Python 3.13
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Current active topic breadcrumb & LeetCode link */}
      <div className="hidden md:flex items-center gap-2.5 px-3 py-1 rounded-full bg-slate-800/40 border border-slate-700/40">
        <span className="text-xs text-slate-400 capitalize">{currentTopic.category}</span>
        <span className="text-slate-600 text-xs">/</span>
        <span className="text-xs font-semibold text-slate-200">{currentTopic.title}</span>
        {currentTopic.leetcodeNumber && (
          <Badge variant="amber" size="sm">
            LC #{currentTopic.leetcodeNumber}
          </Badge>
        )}
      </div>

      {/* Right: Quick actions & Python badge */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Tracing</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs font-mono">
          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse-subtle" />
          <span>Step-by-Step</span>
        </div>
      </div>
    </header>
  );
};

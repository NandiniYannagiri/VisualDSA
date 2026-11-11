import React, { useState, useMemo } from 'react';
import {
  Search,
  BarChart2,
  GitFork,
  Layers,
  Network,
  Cpu,
  CheckCircle2,
  ChevronRight,
  Flame,
  X
} from 'lucide-react';
import { DSATopic, CategoryType } from '../../types/dsa';
import { DSA_TOPICS, CATEGORIES_CONFIG } from '../../data/topics';
import { Badge } from '../common/Badge';

interface SidebarProps {
  currentTopicId: string;
  onSelectTopic: (topicId: string) => void;
  isOpen: boolean;
  onClose?: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  sorting: <BarChart2 className="w-4 h-4 text-sky-400" />,
  trees: <GitFork className="w-4 h-4 text-emerald-400" />,
  searching: <Search className="w-4 h-4 text-amber-400" />,
  linear: <Layers className="w-4 h-4 text-indigo-400" />,
  graphs: <Network className="w-4 h-4 text-purple-400" />,
  advanced: <Cpu className="w-4 h-4 text-rose-400" />
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentTopicId,
  onSelectTopic,
  isOpen,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (catId: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const filteredTopics = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return DSA_TOPICS;

    return DSA_TOPICS.filter(
      t =>
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.leetcodeNumber && t.leetcodeNumber.toString().includes(q)) ||
        (t.leetcodeTitle && t.leetcodeTitle.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Group topics by category
  const groupedTopics = useMemo(() => {
    const map: Record<CategoryType, DSATopic[]> = {
      sorting: [],
      trees: [],
      searching: [],
      linear: [],
      graphs: [],
      advanced: []
    };

    for (const topic of filteredTopics) {
      if (map[topic.category]) {
        map[topic.category].push(topic);
      }
    }
    return map;
  }, [filteredTopics]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-14 bottom-0 left-0 z-40 w-72 lg:w-80 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-80'
        }`}
      >
        {/* Search & Filter Header */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, LC #, algorithms..."
              className="w-full bg-slate-950 text-slate-200 placeholder-slate-500 text-xs rounded-lg pl-9 pr-8 py-2 border border-slate-700/60 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mt-2.5 px-1 text-[11px] text-slate-400">
            <span className="font-medium">Topics & Interactive Labs</span>
            <span className="font-mono text-slate-500">{filteredTopics.length} available</span>
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {CATEGORIES_CONFIG.map((cat) => {
            const topicsInCat = groupedTopics[cat.id as CategoryType] || [];
            if (topicsInCat.length === 0) return null;

            const isCollapsed = !!collapsedCategories[cat.id];

            return (
              <div key={cat.id} className="space-y-1">
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-300 hover:bg-slate-800/60 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    {CATEGORY_ICONS[cat.id]}
                    <span>{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400">
                      {topicsInCat.length}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                        isCollapsed ? '' : 'rotate-90'
                      }`}
                    />
                  </div>
                </button>

                {/* Topic list under category */}
                {!isCollapsed && (
                  <div className="pl-2 space-y-0.5 border-l border-slate-800 ml-3">
                    {topicsInCat.map((topic) => {
                      const isActive = topic.id === currentTopicId;
                      const isReadyToRun = [
                        'quick-sort',
                        'merge-sort',
                        'bubble-sort',
                        'bst',
                        'binary-search',
                        'singly-linked-list'
                      ].includes(topic.id);

                      return (
                        <button
                          key={topic.id}
                          onClick={() => {
                            onSelectTopic(topic.id);
                            if (window.innerWidth < 1024 && onClose) onClose();
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-all group ${
                            isActive
                              ? 'bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30 shadow-sm shadow-sky-500/10'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                isActive ? 'bg-sky-400' : isReadyToRun ? 'bg-emerald-500/70' : 'bg-slate-600'
                              }`}
                            />
                            <span className="truncate">{topic.title}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isReadyToRun ? (
                              <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Lab
                              </span>
                            ) : null}
                            {topic.leetcodeNumber && (
                              <span className="text-[9px] font-mono text-amber-400/80">
                                #{topic.leetcodeNumber}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive Visualizer</span>
          </div>
          <span className="font-mono text-[10px]">v1.0</span>
        </div>
      </aside>
    </>
  );
};

      return (
        <div className={`flex flex-col h-screen w-screen font-sans relative overflow-hidden select-none theme-${isBrightMode ? 'bright' : theme} ${isBrightMode ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
          
          {/* Subtle Ambient Glowing Mesh Orbs */}
          {!isBrightMode && (
            <>
              <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[rgba(var(--theme-accent-rgb),0.12)] blur-[120px] pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[rgba(var(--theme-secondary-rgb),0.12)] blur-[120px] pointer-events-none" />
              <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-[rgba(var(--theme-accent-rgb),0.06)] blur-[140px] pointer-events-none" />
            </>
          )}

          {/* ===================================================================
              OPENING CINEMATIC SPLASH ANIMATION (CHARACTER BY CHARACTER)
              =================================================================== */}
          {showIntro && (
            <VisualDSAIntroSplash onFinish={() => setShowIntro(false)} />
          )}

          {/* ===================================================================
              WORLD-CLASS EXECUTIVE DASHBOARD HEADER NAVBAR
              =================================================================== */}
          <header className={`h-14 border-b px-4 flex items-center justify-between select-none z-30 shadow-md shrink-0 transition-colors ${
            isBrightMode ? 'bg-white border-slate-200 text-slate-900' : 'border-white/10 text-white'
          }`} style={{ backgroundColor: 'var(--theme-header-bg)', backdropFilter: 'blur(16px)' }}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(p => !p)}
                className={`p-1.5 rounded-lg border transition shadow-sm ${
                  isBrightMode
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
                }`}
                title="Toggle Curriculum Sidebar"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setShowIntro(true)} title="Replay Opening Cinematic">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--theme-accent)] to-[var(--theme-secondary)] flex items-center justify-center font-black text-white text-sm shadow-md group-hover:scale-105 transition">
                  ⚡
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base tracking-tight transition">
                      Visual<span style={{ color: 'var(--theme-accent)' }}>DSA</span>
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-extrabold uppercase border ${
                      isBrightMode
                        ? 'bg-sky-50 text-sky-700 border-sky-300'
                        : 'bg-white/10 text-white/90 border-white/15'
                    }`}>
                      PRO LAB
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono hidden sm:inline -mt-0.5 ${isBrightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Interactive Computer Science Workbench
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation & Controls Cluster */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* 1. DARK MODE / BRIGHT MODE TOGGLE (PRIMARY USER REQUIREMENT) */}
              <button
                onClick={() => setIsBrightMode(p => !p)}
                className={`px-3 py-1 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                  isBrightMode
                    ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900 shadow-amber-200/50'
                    : 'bg-indigo-950/70 hover:bg-indigo-900 border-indigo-500/40 text-indigo-300 shadow-indigo-950/50'
                }`}
                title={isBrightMode ? 'Switch to Dark Mode' : 'Switch to Bright / Light Mode'}
              >
                <span>{isBrightMode ? '☀️' : '🌙'}</span>
                <span className="font-mono">{isBrightMode ? 'Bright Mode' : 'Dark Mode'}</span>
              </button>


              {/* 3. Web Audio Synthesizer Toggle */}
              <button
                onClick={() => {
                  setSoundEnabled(p => !p);
                  if (!soundEnabled) playBeep(523, 0.1, 'sine');
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                  soundEnabled
                    ? isBrightMode
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                      : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : isBrightMode
                    ? 'bg-slate-100 border-slate-300 text-slate-600'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
                title={soundEnabled ? 'Mute Sound FX' : 'Enable Synthesized Audio FX'}
              >
                {soundEnabled ? (
                  <>
                    <div className="flex items-end gap-0.5 h-3.5 w-3.5">
                      <span className="w-0.5 bg-emerald-500 animate-eq-1 rounded-full" />
                      <span className="w-0.5 bg-emerald-500 animate-eq-2 rounded-full" />
                      <span className="w-0.5 bg-emerald-500 animate-eq-3 rounded-full" />
                    </div>
                    <span className="hidden sm:inline">Sound ON</span>
                  </>
                ) : (
                  <>
                    <span>🔇</span>
                    <span className="hidden sm:inline">Muted</span>
                  </>
                )}
              </button>

              {/* 4. Layout View Mode Switcher */}
              <div className={`hidden lg:flex items-center gap-1 border rounded-lg p-0.5 ${
                isBrightMode ? 'bg-slate-100 border-slate-300' : 'bg-black/40 border-white/10'
              }`}>
                {[
                  { id: 'split', icon: '🔲', label: 'Split' },
                  { id: 'canvas', icon: '🖥️', label: 'Stage' },
                  { id: 'code', icon: '💻', label: 'Code' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setLayoutMode(mode.id)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition flex items-center gap-1 ${
                      layoutMode === mode.id
                        ? isBrightMode
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                          : 'bg-white/15 text-white shadow-sm'
                        : isBrightMode
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title={`${mode.label} View Mode`}
                  >
                    <span>{mode.icon}</span>
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>

              {/* Curriculum Hub Launcher */}
              <button
                onClick={() => setIsHubOpen(true)}
                className="px-3 py-1 rounded-lg text-white text-xs font-bold transition shadow-md flex items-center gap-1.5 hover:scale-105"
                style={{ backgroundColor: 'var(--theme-accent)' }}
              >
                <span>📚</span>
                <span className="hidden sm:inline">All Topics</span>
                <span className="text-[10px] font-mono bg-black/25 px-1 py-0.2 rounded font-black text-white">{ALL_TOPICS.length}</span>
              </button>
            </div>
          </header>

          {/* ===================================================================
              MAIN WORKSPACE (SPLIT VIEW / CANVAS FOCUS / CODE FOCUS)
              =================================================================== */}
          <div className="flex-1 flex overflow-hidden relative">

            {/* A. Collapsible Curriculum Sidebar */}
            <aside
              className={`border-r flex flex-col transition-all duration-300 shrink-0 select-none z-20 ${
                sidebarOpen ? 'w-64 md:w-72' : 'w-0'
              } ${isBrightMode ? 'bg-white border-slate-200 text-slate-800' : 'border-white/10'}`}
              style={{ width: sidebarOpen ? `${sidebarWidth}px` : "0px", minWidth: sidebarOpen ? `${sidebarWidth}px` : "0px", backgroundColor: "var(--theme-panel-bg)", backdropFilter: "blur(20px)", transition: isResizingSidebar ? "none" : "width 0.2s ease" }}
            >
              {sidebarOpen && (
                <div className="flex flex-col h-full overflow-hidden" style={{ width: `${sidebarWidth}px`, minWidth: `${sidebarWidth}px` }}>
                  
                  {/* Sidebar Header & Search */}
                  <div className={`p-3 border-b flex flex-col gap-2 ${isBrightMode ? 'border-slate-200' : 'border-white/10'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black tracking-wider uppercase ${isBrightMode ? 'text-slate-700' : 'text-slate-300'}`}>
                        Curriculum Topics
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isBrightMode ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-white/5 text-slate-400 border-white/10'
                      }`}>
                        {filteredTopics.length} available
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search algorithms..."
                        className={`w-full rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none transition font-mono border ${
                          isBrightMode
                            ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[var(--theme-accent)]'
                            : 'bg-black/40 border-white/10 text-white placeholder-slate-500 focus:border-[var(--theme-accent)]'
                        }`}
                      />
                      <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'sorting', label: 'Sort' },
                        { id: 'comparison-sorting', label: 'Comparison' },
                        { id: 'non-comparison-sorting', label: 'Non-Comparison' },
                        { id: 'searching', label: 'Search' },
                        { id: 'trees', label: 'Trees' },
                        { id: 'bst', label: 'BST' },
                        { id: 'pointers', label: 'Pointers' },
                        { id: 'stack', label: 'Stack' },
                        { id: 'queue', label: 'Queue' },
                        { id: 'graphs', label: 'Graph' },
                        { id: 'dp', label: 'DP' },
                        { id: 'greedy', label: 'Greedy' }
                      ].map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategoryFilter(cat.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap transition ${
                            selectedCategoryFilter === cat.id
                              ? 'bg-[var(--theme-accent)] text-white font-bold'
                              : isBrightMode
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              : 'bg-white/5 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Topic List */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredTopics.map(topic => {
                      const isActive = topic.id === currentTopicId;
                      return (
                        <button
                          key={topic.id}
                          onClick={() => {
                            setCurrentTopicId(topic.id);
                          }}
                          className={`w-full text-left p-2.5 rounded-lg transition flex flex-col gap-1 border ${
                            isActive
                              ? isBrightMode
                                ? 'bg-sky-50 border-[var(--theme-accent)] text-slate-900 shadow-sm'
                                : 'bg-white/10 border-[var(--theme-accent)] shadow-md text-white'
                              : isBrightMode
                              ? 'bg-transparent border-transparent hover:bg-slate-100 text-slate-700'
                              : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold leading-tight">
                              {topic.title}
                            </span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                              topic.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-600' :
                              topic.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-600' :
                              'bg-rose-500/20 text-rose-600'
                            }`}>
                              {topic.difficulty}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="uppercase text-[9px] font-semibold tracking-wider">{topic.category}</span>
                            <span className="capitalize text-[10px] font-semibold opacity-75">{topic.stageType}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Sidebar Footer */}
                  <div className={`p-2.5 border-t flex items-center justify-between text-[11px] font-mono ${
                    isBrightMode ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-black/30 border-white/10 text-slate-400'
                  }`}>
                    <span>Algorithm Suite</span>
                    <span className="font-bold text-[var(--theme-accent)]">v2.5 Pro</span>
                  </div>
                </div>
              )}
            </aside>
            {/* Draggable Splitter between Curriculum Sidebar and Visualizer */}
            {sidebarOpen && (
              <div
                onMouseDown={handleSidebarResizeStart}
                className={`hidden md:flex w-1.5 hover:w-2 -ml-0.5 z-30 cursor-col-resize group relative items-center justify-center transition-all select-none ${
                  isResizingSidebar
                    ? 'bg-[var(--theme-accent)] shadow-[0_0_12px_var(--theme-accent)] w-2'
                    : 'hover:bg-[var(--theme-accent)]/80 bg-slate-700/20'
                }`}
                title="Drag to resize curriculum sidebar • Double-click to reset (280px)"
                onDoubleClick={() => setSidebarWidth(280)}
              >
                <div className="h-8 w-0.5 rounded-full bg-slate-500/50 group-hover:bg-white transition" />
              </div>
            )}


            {/* B. Main Visual Stage & Code Tracing Pane */}
            <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative dashboard-grid">

              {/* ===================================================================
                  VISUALIZATION STAGE (Left or Full Canvas)
                  =================================================================== */}
              <div className={`flex flex-col border-b md:border-b-0 md:border-r overflow-hidden relative transition-all duration-300 ${
                isBrightMode ? 'border-slate-200' : 'border-white/10'
              } ${
                layoutMode === 'canvas' ? 'w-full h-full' :
                layoutMode === 'code' ? 'w-full md:w-[35%] h-[40%] md:h-full' :
                'w-full md:w-[62%] h-[55%] md:h-full'
              }`}>

                {/* 1. Sibling Sub-Topic Tabs Bar (Instant Switcher) */}
                <div className={`px-4 py-2 border-b backdrop-blur-md flex items-center justify-between overflow-x-auto gap-2 shrink-0 ${
                  isBrightMode ? 'bg-white/80 border-slate-200' : 'bg-black/40 border-white/10'
                }`}>
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                    <span className={`text-[10px] font-mono uppercase font-black tracking-wider mr-1 hidden sm:inline ${
                      isBrightMode ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {currentTopic.category}:
                    </span>
                    {siblingTopics.map(sibling => {
                      const isSel = sibling.id === currentTopicId;
                      return (
                        <button
                          key={sibling.id}
                          onClick={() => setCurrentTopicId(sibling.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 border ${
                            isSel
                              ? 'bg-[var(--theme-accent)] text-white border-[var(--theme-accent)] shadow-md'
                              : isBrightMode
                              ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span>{sibling.title}</span>
                          <span className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                            isSel ? 'bg-black/25 text-white font-black' : isBrightMode ? 'bg-slate-200 text-slate-600' : 'bg-black/30 text-slate-400'
                          }`}>
                            {sibling.difficulty}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
<button
                      onClick={handleOpenCustomInputModal}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition flex items-center gap-1 shadow-sm ${
                        isBrightMode ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-white/10 hover:bg-white/15 text-white border-white/20'
                      }`}
                      title="Open Custom Input Editor"
                    >
                      <span>✏️</span>
                      <span className="hidden sm:inline">Custom Input</span>
                    </button>
                  </div>
                </div>

                {/* 2. In-Stage Quick Data Generator Toolbar (Sorting, Searching, Non-Comparison Sorting) */}
                {(currentTopic.stageType === 'sorting' || currentTopic.stageType === 'searching' || currentTopic.category === 'non-comparison-sorting') && (
                  <div className={`px-4 py-1.5 border-b flex items-center justify-between flex-wrap gap-2 text-xs font-mono shrink-0 ${
                    isBrightMode ? 'bg-slate-100/70 border-slate-200' : 'border-white/10 bg-white/[0.02]'
                  }`}>
                    <div className="flex items-center gap-2">
                      <label htmlFor="arraySizeDropdown" className="text-slate-500 text-[11px] font-semibold flex items-center gap-1">
                        <span>Array Size:</span>
                      </label>
                      <select
                        id="arraySizeDropdown"
                        value={arrData.length}
                        onChange={(e) => handleChangeArraySize(Number(e.target.value))}
                        className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border outline-none cursor-pointer transition ${
                          isBrightMode
                            ? 'bg-white border-slate-300 text-slate-800 hover:border-indigo-400 focus:ring-1 focus:ring-indigo-400'
                            : 'bg-slate-800/90 border-slate-700 text-cyan-300 hover:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                        }`}
                        title="Select array element count"
                      >
                        {[5, 6, 8, 10, 12, 14, 16, 18, 20].map(sz => (
                          <option key={sz} value={sz} className={isBrightMode ? 'bg-white text-slate-800' : 'bg-slate-900 text-cyan-300'}>
                            {sz} Elements
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-500 text-[11px] font-semibold hidden md:inline">Presets:</span>
                      <button
                        onClick={() => handleGenerateRandom(arrData.length)}
                        className={`px-2 py-0.5 rounded border text-[11px] font-semibold transition ${
                          isBrightMode ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800' : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                        }`}
                        title="Generate Scrambled Data"
                      >
                        🎲 Random
                      </button>
                      <button
                        onClick={() => handleGenerateSorted(arrData.length)}
                        className={`px-2 py-0.5 rounded border text-[11px] font-semibold transition ${
                          isBrightMode ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800' : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                        }`}
                        title="Generate Sorted Sequence"
                      >
                        📈 Sorted
                      </button>
                      <button
                        onClick={() => handleGenerateReversed(arrData.length)}
                        className={`px-2 py-0.5 rounded border text-[11px] font-semibold transition ${
                          isBrightMode ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800' : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                        }`}
                        title="Generate Reversed Sequence"
                      >
                        📉 Reversed
                      </button>
                      <button
                        onClick={() => handleGenerateDuplicates(arrData.length)}
                        className={`px-2 py-0.5 rounded border text-[11px] font-semibold transition ${
                          isBrightMode ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800' : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                        }`}
                        title="Generate Array with Duplicates"
                      >
                        🔁 Duplicates
                      </button>

                      {currentTopic.stageType === 'searching' && (
                        <div className="flex items-center gap-1 ml-2 pl-2 border-l border-slate-300 dark:border-white/15">
                          <span className="text-amber-500 font-bold text-[11px]">Target:</span>
                          <input
                            type="number"
                            value={targetVal}
                            onChange={e => {
                              const v = parseInt(e.target.value, 10);
                              if (!isNaN(v)) {
                                setTargetVal(v);
                                setStepIdx(0);
                              }
                            }}
                            className={`w-14 border rounded px-1.5 py-0.5 text-xs font-mono focus:outline-none ${
                              isBrightMode ? 'bg-white border-amber-400 text-amber-800' : 'bg-black/60 border-amber-500/40 text-amber-300'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. In-Stage Quick Graph Controller Toolbar */}
                {(currentTopic.stageType === 'graph' || currentTopic.stageType === 'graphs') && (
                  <div className={`px-4 py-1.5 border-b flex items-center justify-between flex-wrap gap-2 text-xs font-mono shrink-0 ${
                    isBrightMode ? 'bg-slate-100/70 border-slate-200' : 'border-white/10 bg-white/[0.02]'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px] font-semibold">Start Vertex:</span>
                      {['A', 'B', 'C', 'D', 'E', 'F'].map(nd => (
                        <button
                          key={nd}
                          onClick={() => {
                            setGraphStartNode(nd);
                            setStepIdx(0);
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                            graphStartNode === nd
                              ? 'bg-[var(--theme-accent)] text-white font-black'
                              : isBrightMode
                              ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                              : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {nd}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px] font-semibold">Topology:</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                        6 Vertices • 7 Weighted Edges
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. In-Stage Quick Tree & BST Controller Toolbar */}
                {(currentTopic.stageType === 'bst' || currentTopic.stageType === 'trees') && (
                  <div className={`px-4 py-1.5 border-b flex items-center justify-between flex-wrap gap-2 text-xs font-mono shrink-0 ${
                    isBrightMode ? 'bg-slate-100/70 border-slate-200' : 'border-white/10 bg-white/[0.02]'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px] font-semibold">Tree Mode:</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[var(--theme-accent)]/15 text-[var(--theme-accent)] border border-[var(--theme-accent)]/30">
                        {currentTopic.category === 'trees' ? 'Binary Tree Traversals' : 'Binary Search Tree (BST)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setBstTree(createDefaultBST());
                          setStepIdx(0);
                        }}
                        className={`px-2 py-0.5 rounded border text-[11px] font-semibold transition ${
                          isBrightMode ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800' : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                        }`}
                        title="Reset tree to default balanced BST"
                      >
                        🌲 Reset Tree
                      </button>

                      {(currentTopic.id === 'bst-search' || currentTopic.id === 'bst-insert' || currentTopic.id === 'bst-delete') && (
                        <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-300 dark:border-white/15">
                          <span className="text-amber-500 font-bold text-[11px]">
                            {currentTopic.id === 'bst-delete' ? 'Key to Delete:' : currentTopic.id === 'bst-insert' ? 'Key to Insert:' : 'Search Key:'}
                          </span>
                          <input
                            type="number"
                            value={targetVal}
                            onChange={e => {
                              const v = parseInt(e.target.value, 10);
                              if (!isNaN(v)) {
                                setTargetVal(v);
                                setStepIdx(0);
                              }
                            }}
                            className={`w-14 border rounded px-1.5 py-0.5 text-xs font-mono focus:outline-none ${
                              isBrightMode ? 'bg-white border-amber-400 text-amber-800' : 'bg-black/60 border-amber-500/40 text-amber-300'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

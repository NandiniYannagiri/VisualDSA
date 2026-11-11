          {/* ===================================================================
              GLOBAL PLAYBACK CONTROLLER (DOCKED AT BOTTOM)
              =================================================================== */}
          <footer className={`h-16 border-t px-4 flex items-center justify-between select-none z-30 shrink-0 transition-colors ${
            isBrightMode ? 'bg-white border-slate-200 text-slate-800' : 'border-white/10 text-white'
          }`} style={{ backgroundColor: 'var(--theme-header-bg)', backdropFilter: 'blur(20px)' }}>
            
            {/* Playback Button Cluster */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setStepIdx(0);
                }}
                className={`p-2 rounded-lg border transition ${
                  isBrightMode ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                }`}
                title="Reset to Step 0"
              >
                ⏮️
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setStepIdx(p => Math.max(p - 1, 0));
                }}
                disabled={stepIdx === 0}
                className={`p-2 rounded-lg border transition disabled:opacity-30 disabled:pointer-events-none ${
                  isBrightMode ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                }`}
                title="Step Backward (Left Arrow)"
              >
                ◀️
              </button>

              <button
                onClick={() => setIsPlaying(p => !p)}
                className="px-4 py-2 rounded-xl text-white font-black text-xs transition shadow-lg flex items-center gap-2 hover:scale-105"
                style={{ backgroundColor: 'var(--theme-accent)', boxShadow: '0 0 16px var(--theme-glow)' }}
                title="Play / Pause Timeline (Space)"
              >
                <span>{isPlaying ? '⏸️' : '▶️'}</span>
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setStepIdx(p => Math.min(p + 1, steps.length - 1));
                }}
                disabled={stepIdx >= steps.length - 1}
                className={`p-2 rounded-lg border transition disabled:opacity-30 disabled:pointer-events-none ${
                  isBrightMode ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                }`}
                title="Step Forward (Right Arrow)"
              >
                ▶️
              </button>
            </div>

            {/* Interactive Timeline Scrubber Slider */}
            <div className="flex-1 max-w-md mx-4 hidden sm:flex items-center gap-3">
              <span className={`text-[11px] font-mono font-bold shrink-0 ${isBrightMode ? 'text-slate-600' : 'text-slate-400'}`}>
                {stepIdx + 1}/{steps.length}
              </span>
              <input
                type="range"
                min="0"
                max={Math.max(steps.length - 1, 0)}
                value={stepIdx}
                onChange={e => {
                  setIsPlaying(false);
                  setStepIdx(parseInt(e.target.value, 10));
                }}
                className="w-full accent-[var(--theme-accent)] cursor-pointer h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg"
              />
              <span className={`text-[10px] font-mono shrink-0 ${isBrightMode ? 'text-slate-500' : 'text-slate-500'}`}>
                {Math.round(((stepIdx + 1) / steps.length) * 100)}%
              </span>
            </div>

            {/* Speed Selector Pills */}
            <div className={`flex items-center gap-1 border rounded-lg p-0.5 ${
              isBrightMode ? 'bg-slate-100 border-slate-300' : 'bg-black/40 border-white/10'
            }`}>
              {[0.5, 1, 1.5, 2, 3].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition ${
                    speed === s
                      ? isBrightMode
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                        : 'bg-white/20 text-white shadow-sm'
                      : isBrightMode
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

          </footer>

          {/* ===================================================================
              ALL TOPICS CURRICULUM HUB MODAL
              =================================================================== */}
          {isHubOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
              <div className={`w-full max-w-4xl max-h-[85vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
                isBrightMode ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-white/15 text-white'
              }`}>
                <div className={`p-4 border-b flex items-center justify-between ${isBrightMode ? 'border-slate-200' : 'border-white/10'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📚</span>
                    <h2 className="text-base font-black">VisualDSA Curriculum Hub ({ALL_TOPICS.length} Algorithms)</h2>
                  </div>
                  <button
                    onClick={() => setIsHubOpen(false)}
                    className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {ALL_TOPICS.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setCurrentTopicId(t.id);
                        setIsHubOpen(false);
                      }}
                      className={`p-3 rounded-xl border text-left transition flex flex-col gap-1.5 hover:border-[var(--theme-accent)] ${
                        isBrightMode ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' : 'bg-white/5 hover:bg-white/10 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black">{t.title}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          isBrightMode ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-slate-300'
                        }`}>{t.difficulty}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{t.summary}</p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
                        <span className="uppercase text-[var(--theme-accent)] font-semibold">{t.category}</span>
                        <span className="capitalize text-[10px] opacity-75">{t.stageType}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              UNIVERSAL CUSTOM DATA INPUT MODAL
              =================================================================== */}
          {isCustomInputModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
              <div className={`w-full max-w-lg rounded-2xl border shadow-2xl flex flex-col overflow-hidden p-5 gap-4 ${
                isBrightMode ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-white/15 text-white'
              }`}>
                <div className={`flex items-center justify-between border-b pb-3 ${isBrightMode ? 'border-slate-200' : 'border-white/10'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✏️</span>
                    <h3 className="text-sm font-black">Custom Input Editor: {currentTopic.title}</h3>
                  </div>
                  <button
                    onClick={() => setIsCustomInputModalOpen(false)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-col gap-3 font-mono text-xs">
                  {(currentTopic.stageType === 'sorting' || currentTopic.stageType === 'searching' || currentTopic.category === 'non-comparison-sorting') && (
                    <>
                      <div>
                        <label className="text-slate-500 block mb-1 font-semibold">Array Elements (comma-separated):</label>
                        <input
                          type="text"
                          value={modalArrInput}
                          onChange={e => setModalArrInput(e.target.value)}
                          className={`w-full border rounded-lg px-3 py-2 font-mono focus:outline-none ${
                            isBrightMode ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-black/50 border-white/15 text-white'
                          }`}
                        />
                      </div>
                      {currentTopic.stageType === 'searching' && (
                        <div>
                          <label className="text-slate-500 block mb-1 font-semibold">Search Target:</label>
                          <input
                            type="number"
                            value={modalTargetInput}
                            onChange={e => setModalTargetInput(e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 font-mono focus:outline-none ${
                              isBrightMode ? 'bg-slate-50 border-amber-300 text-amber-800' : 'bg-black/50 border-white/15 text-amber-300'
                            }`}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {currentTopic.stageType === 'pointers' && (
                    <>
                      <div>
                        <label className="text-slate-500 block mb-1 font-semibold">Sorted Array Elements:</label>
                        <input
                          type="text"
                          value={modalPointersArrInput}
                          onChange={e => setModalPointersArrInput(e.target.value)}
                          className={`w-full border rounded-lg px-3 py-2 font-mono focus:outline-none ${
                            isBrightMode ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-black/50 border-white/15 text-white'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block mb-1 font-semibold">Target Sum Value:</label>
                        <input
                          type="number"
                          value={modalPointersTargetInput}
                          onChange={e => setModalPointersTargetInput(e.target.value)}
                          className={`w-full border rounded-lg px-3 py-2 font-mono focus:outline-none ${
                            isBrightMode ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-black/50 border-white/15 text-white'
                          }`}
                        />
                      </div>
                    </>
                  )}

                  {currentTopic.stageType === 'stack' && (
                    <div>
                      <label className="text-slate-500 block mb-1 font-semibold">Stack Initial Elements (Bottom to Top):</label>
                      <input
                        type="text"
                        value={modalStackInput}
                        onChange={e => setModalStackInput(e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 font-mono focus:outline-none ${
                          isBrightMode ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-black/50 border-white/15 text-white'
                        }`}
                      />
                    </div>
                  )}

                  {currentTopic.stageType === 'queue' && (
                    <div>
                      <label className="text-slate-500 block mb-1 font-semibold">Queue Initial Elements (Front to Rear):</label>
                      <input
                        type="text"
                        value={modalQueueInput}
                        onChange={e => setModalQueueInput(e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 font-mono focus:outline-none ${
                          isBrightMode ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-black/50 border-white/15 text-white'
                        }`}
                      />
                    </div>
                  )}

                  {(currentTopic.stageType === 'bst' || currentTopic.stageType === 'trees') && (
                    <>
                      <div>
                        <label className="text-slate-500 block mb-1 font-semibold">Tree Node Keys (comma-separated):</label>
                        <input
                          type="text"
                          value={modalBstInput}
                          onChange={e => setModalBstInput(e.target.value)}
                          className={`w-full border rounded-lg px-3 py-2 font-mono focus:outline-none ${
                            isBrightMode ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-black/50 border-white/15 text-white'
                          }`}
                        />
                      </div>
                      {currentTopic.stageType === 'bst' && (
                        <div>
                          <label className="text-slate-500 block mb-1 font-semibold">Target Key (for Search / Insert / Delete):</label>
                          <input
                            type="number"
                            value={modalTargetInput}
                            onChange={e => setModalTargetInput(e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 font-mono focus:outline-none ${
                              isBrightMode ? 'bg-slate-50 border-amber-300 text-amber-800' : 'bg-black/50 border-white/15 text-amber-300'
                            }`}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {currentTopic.stageType === 'dp' && (
                    <div>
                      <label className="text-slate-500 block mb-1 font-semibold">DP Fibonacci N (2 - 12):</label>
                      <input
                        type="number"
                        value={modalDpNInput}
                        onChange={e => setModalDpNInput(e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 font-mono focus:outline-none ${
                          isBrightMode ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-black/50 border-white/15 text-white'
                        }`}
                      />
                    </div>
                  )}
                </div>

                <div className={`flex items-center justify-between border-t pt-3 ${isBrightMode ? 'border-slate-200' : 'border-white/10'}`}>
                  <button
                    onClick={() => {
                      setModalArrInput('45, 12, 85, 32, 89, 39, 67, 24, 71, 18');
                      setModalTargetInput('39');
                      setModalPointersArrInput('2, 5, 8, 12, 16, 23, 38, 56, 72, 91');
                      setModalPointersTargetInput('61');
                      setModalWindowKInput('3');
                      setModalStackInput('15, 30, 45');
                      setModalQueueInput('10, 20, 30');
                      setModalBstInput('50, 30, 70, 20, 40, 60, 80');
                      setModalDpNInput('6');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono ${
                      isBrightMode ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/5 hover:bg-white/10 text-slate-400'
                    }`}
                  >
                    Reset Defaults
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsCustomInputModalOpen(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        isBrightMode ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApplyCustomInputModal}
                      className="px-4 py-1.5 rounded-lg text-white text-xs font-black shadow-lg"
                      style={{ backgroundColor: 'var(--theme-accent)' }}
                    >
                      Apply & Visualize ➔
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      );
    }

                {/* 3. Dynamic Interactive Visualizer Canvas Area */}
                <div className="flex-1 w-full relative overflow-hidden flex flex-col p-4 overflow-y-auto">

                  {/* =========================================================
                      STAGE A: 3D CYLINDRICAL SORTING PILLARS WITH PEDESTAL
                      ========================================================= */}
                  {['sorting', 'count-sort', 'bucket-sort', 'radix-sort'].includes(currentTopic.stageType) && (
                    <div className="w-full h-full flex flex-col justify-between select-none">
                      
                      {/* Metric HUD Chips */}
                      <div className={`flex items-center justify-between text-xs font-mono px-3 py-1.5 rounded-lg border shrink-0 ${
                        isBrightMode ? 'bg-white border-slate-200 text-slate-700' : 'bg-black/40 border-white/10 text-slate-300'
                      }`}>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`font-bold uppercase flex items-center gap-1.5 ${isBrightMode ? 'text-slate-900' : 'text-white'}`}>
                            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: 'var(--theme-accent)' }} />
                            {currentTopic.title}
                          </span>
                          <span className="text-amber-500 font-semibold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-400" /> Comparing
                          </span>
                          <span className="text-rose-500 font-semibold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500" /> Swapping
                          </span>
                          <span className="text-sky-500 font-semibold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-sky-400" /> Pivot
                          </span>
                          <span className="text-emerald-500 font-semibold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Sorted
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span>Comparisons: <strong className="text-amber-500 font-bold">{currentStep?.metrics?.comparisons ?? 0}</strong></span>
                          <span>Swaps: <strong className="text-rose-500 font-bold">{currentStep?.metrics?.swaps ?? 0}</strong></span>
                        </div>
                      </div>

                      {/* 3D Pillars & Pedestal Stage */}
                      <div className="flex-1 w-full relative min-h-[260px] my-2 overflow-hidden px-4 flex flex-col justify-end">
                        {(() => {
                          const displayArray = (currentStep && Array.isArray(currentStep.state)) ? currentStep.state : arrData;
                          const total = displayArray.length;
                          const maxVal = Math.max(...displayArray.map(x => typeof x === 'object' && x !== null ? x.val : x), 100);
                          const pointers = currentStep?.pointers || {};

                          return (
                            <div className="w-full h-full relative">
                              
                              {/* 2. 3D Cylindrical Pillar Columns with Specular Sheen & Floating Value Pills */}
                              {displayArray.map((item, slotIdx) => {
                                const val = typeof item === 'object' && item !== null ? item.val : item;
                                const itemId = typeof item === 'object' && item !== null ? item.id : `bar-${slotIdx}-${val}`;
                                const heightPercent = Math.max((val / maxVal) * 76, 12);

                                const isComparing = currentStep?.highlights?.comparing?.includes(slotIdx);
                                const isSwapping = currentStep?.highlights?.swapping?.includes(slotIdx);
                                const isSorted = currentStep?.highlights?.sorted?.includes(slotIdx);
                                const isPivot = pointers.pivot === slotIdx;

                                let cylinderClass = 'cylinder-bar-default';
                                if (isSwapping) cylinderClass = 'cylinder-bar-swapping';
                                else if (isComparing) cylinderClass = 'cylinder-bar-comparing';
                                else if (isPivot) cylinderClass = 'cylinder-bar-pivot';
                                else if (isSorted) cylinderClass = 'cylinder-bar-sorted';

                                const slotPercent = 100 / total;

                                const tagList = [];
                                if (pointers.pivot === slotIdx) tagList.push('pivot');
                                if (pointers.low === slotIdx) tagList.push('low');
                                if (pointers.high === slotIdx) tagList.push('high');
                                if (pointers.mid === slotIdx) tagList.push('mid');
                                if (pointers.i === slotIdx) tagList.push('i');
                                if (pointers.j === slotIdx) tagList.push('j');
                                if (pointers.min === slotIdx) tagList.push('min');
                                if (pointers.max === slotIdx || pointers.largest === slotIdx) tagList.push('max');
                                if (pointers.k === slotIdx) tagList.push('k');

                                return (
                                  <div
                                    key={itemId}
                                    style={{
                                      position: 'absolute',
                                      left: `calc(${slotIdx * slotPercent}% + 4px)`,
                                      width: `calc(${slotPercent}% - 8px)`,
                                      bottom: '30px',
                                      height: `${heightPercent}%`,
                                      transform: isSwapping ? 'translateY(-16px) scale(1.05)' : 'translateY(0) scale(1)',
                                      zIndex: isSwapping ? 25 : isPivot ? 15 : 5
                                    }}
                                    className={`cylinder-cap flex flex-col items-center justify-between py-1.5 font-mono text-xs font-bold algo-bar select-none ${cylinderClass}`}
                                  >
                                    {/* Floating Pointer Badges DIRECTLY on top of this data bar */}
                                    {tagList.length > 0 && (
                                      <div
                                        style={{
                                          position: 'absolute',
                                          bottom: '100%',
                                          left: '50%',
                                          transform: 'translateX(-50%)',
                                          marginBottom: '6px',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          zIndex: 40,
                                          pointerEvents: 'none',
                                          whiteSpace: 'nowrap'
                                        }}
                                        className="animate-pointer-bounce"
                                      >
                                        <div className="flex items-center gap-0.5">
                                          {tagList.map(t => (
                                            <span
                                              key={t}
                                              className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded shadow-lg border uppercase tracking-wider ${
                                                t === 'i' ? 'bg-amber-400 text-slate-950 border-amber-200 shadow-amber-500/30' :
                                                t === 'j' ? 'bg-purple-500 text-white border-purple-300 shadow-purple-500/30' :
                                                t === 'pivot' ? 'bg-sky-400 text-slate-950 border-sky-200 shadow-sky-500/30' :
                                                t === 'low' ? 'bg-teal-400 text-slate-950 border-teal-200 shadow-teal-500/30' :
                                                t === 'high' ? 'bg-rose-500 text-white border-rose-200 shadow-rose-500/30' :
                                                t === 'min' ? 'bg-orange-500 text-white border-orange-300 shadow-orange-500/30' :
                                                t === 'max' ? 'bg-indigo-500 text-white border-indigo-300 shadow-indigo-500/30' :
                                                'bg-blue-600 text-white border-blue-300'
                                              }`}
                                            >
                                              {t}
                                            </span>
                                          ))}
                                        </div>
                                        <div
                                          style={{
                                            width: 0,
                                            height: 0,
                                            borderLeft: '4px solid transparent',
                                            borderRight: '4px solid transparent',
                                            borderTop: `5px solid ${
                                              tagList[0] === 'i' ? '#fbbf24' :
                                              tagList[0] === 'j' ? '#a855f7' :
                                              tagList[0] === 'pivot' ? '#38bdf8' :
                                              tagList[0] === 'low' ? '#2dd4bf' :
                                              tagList[0] === 'high' ? '#f43f5e' :
                                              tagList[0] === 'min' ? '#f97316' : '#6366f1'
                                            }`
                                          }}
                                        />
                                      </div>
                                    )}
                                    <span className="text-[11px] sm:text-xs font-black tracking-tight drop-shadow px-1 bg-black/30 rounded text-white">
                                      {val}
                                    </span>
                                    <span className="text-[9px] opacity-75 font-mono hidden sm:inline">
                                      [{slotIdx}]
                                    </span>
                                  </div>
                                );
                              })}

                              {/* 3. Glowing Mirrored Pedestal Platform Underneath */}
                              <div className="absolute bottom-0 left-0 right-0 h-7 stage-pedestal rounded-b-xl flex items-center justify-around px-2 border-t border-white/15">
                                {Array.from({ length: total }, (_, i) => (
                                  <div key={i} className={`text-[10px] font-mono font-semibold ${isBrightMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                    {i}
                                  </div>
                                ))}
                              </div>

                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* =========================================================
                      STAGE B: HOLOGRAPHIC SEARCHING CARDS + RADAR SCANNER HUD
                      ========================================================= */}
                  {currentTopic.stageType === 'searching' && (
                    <div className="w-full h-full flex flex-col justify-between select-none">
                      
                      {/* Radar Target Scanner HUD Card */}
                      <div className={`p-3 rounded-xl border backdrop-blur-md flex items-center justify-between flex-wrap gap-3 shrink-0 shadow-lg ${
                        isBrightMode ? 'bg-white border-slate-200' : 'bg-black/45 border-white/10'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-500 font-bold text-sm">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                            <span>Target: {targetVal}</span>
                          </div>
                          <span className={`text-xs font-mono ${isBrightMode ? 'text-slate-700' : 'text-slate-300'}`}>
                            Probes: <strong className="text-[var(--theme-accent)]">{currentStep?.metrics?.comparisons ?? 0}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono">
                          {currentStep?.pointers?.found ? (
                            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-600 dark:text-emerald-300 font-black animate-radar-pulse">
                              <span>🎉 MATCH FOUND AT INDEX {currentStep?.pointers?.foundIndex ?? currentStep?.pointers?.mid}!</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-slate-400">
                              <span>Scanner:</span>
                              <span className="text-amber-500 font-bold">{currentStep?.description || 'Scanning array space...'}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Holographic Array Track */}
                      <div className="flex-1 flex flex-col items-center justify-center py-6">
                        <div className="flex flex-wrap items-center justify-center gap-3 max-w-5xl px-4">
                          {(((currentStep && Array.isArray(currentStep.state)) ? currentStep.state : arrData)).map((val, idx) => {
                            const pointers = currentStep?.pointers || {};
                            const isI = pointers.i === idx;
                            const isLow = pointers.low === idx;
                            const isMid = pointers.mid === idx;
                            const isMid1 = pointers.mid1 === idx;
                            const isMid2 = pointers.mid2 === idx;
                            const isHigh = pointers.high === idx;
                            const isPrev = pointers.prev === idx;
                            const isCurr = pointers.curr === idx;

                            const isComparing = currentStep?.highlights?.comparing?.includes(idx);
                            const isSorted = currentStep?.highlights?.sorted?.includes(idx);
                            const isActive = currentStep?.highlights?.active?.includes(idx);
                            const isDimmed = currentStep?.highlights?.dimmed?.includes(idx);

                            let border = isBrightMode ? 'border-slate-300' : 'border-white/10';
                            let bg = isBrightMode ? 'bg-white' : 'bg-white/5';
                            let text = isBrightMode ? 'text-slate-900' : 'text-slate-200';
                            let transform = '', ring = '';

                            if (isSorted) {
                              border = 'border-emerald-400';
                              bg = 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_24px_rgba(16,185,129,0.8)]';
                              text = 'text-slate-950';
                              transform = 'scale-115 -translate-y-2';
                              ring = 'ring-4 ring-emerald-300/60';
                            } else if (isComparing) {
                              border = 'border-amber-400';
                              bg = 'bg-amber-500/30 text-amber-500 font-bold shadow-[0_0_20px_rgba(245,158,11,0.5)]';
                              text = 'text-amber-500';
                              transform = 'scale-108 -translate-y-1';
                              ring = 'ring-2 ring-amber-400';
                            } else if (isMid || isMid1 || isMid2) {
                              border = 'border-[var(--theme-accent)]';
                              bg = 'bg-[rgba(var(--theme-accent-rgb),0.25)] text-sky-600 dark:text-white font-bold shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.5)]';
                              text = isBrightMode ? 'text-sky-700' : 'text-white';
                              transform = 'scale-105';
                              ring = 'ring-2 ring-[var(--theme-accent)]';
                            } else if (isActive) {
                              border = isBrightMode ? 'border-sky-400' : 'border-white/30';
                              bg = isBrightMode ? 'bg-sky-50' : 'bg-white/10';
                            } else if (isDimmed) {
                              border = isBrightMode ? 'border-slate-200' : 'border-white/5';
                              bg = isBrightMode ? 'bg-slate-100' : 'bg-white/[0.02]';
                              text = 'text-slate-400 opacity-40';
                            }

                            return (
                              <div key={idx} className="flex flex-col items-center gap-1.5 transition-all duration-300">
                                <div className="h-6 flex items-center justify-center gap-1">
                                  {isLow && <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-black bg-cyan-400 text-slate-950 animate-pointer-bounce">low</span>}
                                  {isMid && <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-black bg-amber-400 text-slate-950 animate-pointer-bounce">mid</span>}
                                  {isMid1 && <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-black bg-amber-400 text-slate-950 animate-pointer-bounce">m1</span>}
                                  {isMid2 && <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-black bg-purple-400 text-slate-950 animate-pointer-bounce">m2</span>}
                                  {isHigh && <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-black bg-indigo-400 text-white animate-pointer-bounce">high</span>}
                                  {isPrev && <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-black bg-emerald-400 text-slate-950 animate-pointer-bounce">prev</span>}
                                  {isCurr && <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-black bg-rose-400 text-white animate-pointer-bounce">curr</span>}
                                  {isI && <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-black bg-amber-400 text-slate-950 animate-pointer-bounce">i</span>}
                                </div>

                                <div className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border flex flex-col items-center justify-center holo-card shadow-lg ${border} ${bg} ${transform} ${ring}`}>
                                  <span className={`text-base sm:text-lg font-mono font-black ${text}`}>
                                    {val}
                                  </span>
                                </div>

                                <span className={`text-[10px] font-mono font-semibold ${isBrightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                  [{idx}]
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* =========================================================
                      STAGE C: TWO POINTERS & SLIDING WINDOW WITH REAL-TIME MATH HUD
                      ========================================================= */}
                  {currentTopic.stageType === 'pointers' && (
                    <div className="w-full h-full flex flex-col justify-between select-none">
                      
                      {/* Real-Time Math HUD Card */}
                      <div className={`p-3 rounded-xl border backdrop-blur-md flex items-center justify-between flex-wrap gap-3 shrink-0 shadow-lg ${
                        isBrightMode ? 'bg-white border-slate-200' : 'bg-black/45 border-white/10'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[rgba(var(--theme-accent-rgb),0.15)] border border-[rgba(var(--theme-accent-rgb),0.3)] text-[var(--theme-accent)] font-bold text-sm">
                            <span>Target: {pointersTarget}</span>
                          </div>
                          {currentTopic.id === 'sliding-window' && (
                            <span className="text-xs font-mono font-bold bg-purple-500/20 text-purple-600 dark:text-purple-300 px-2.5 py-1 rounded border border-purple-500/30">
                              Window Size K = {windowK}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono">
                          <div className={`px-3 py-1 rounded-lg border font-bold flex items-center gap-2 ${
                            isBrightMode ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-black/60 border-white/20 text-white'
                          }`}>
                            <span className="text-amber-500">CALCULATION HUD:</span>
                            <span>{currentStep?.metrics?.calc || currentStep?.description || 'Active'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Array Track with Dynamic Pointers and Sliding Window Bracket */}
                      <div className="flex-1 flex flex-col items-center justify-center py-6">
                        <div className="flex flex-wrap items-center justify-center gap-3 max-w-5xl px-4 relative">
                          {((currentStep && Array.isArray(currentStep.state)) ? currentStep.state : pointersArr).map((val, idx) => {
                            const pointers = currentStep?.pointers || {};
                            const isLeft = pointers.left === idx;
                            const isRight = pointers.right === idx;
                            const inWindow = currentTopic.id === 'sliding-window' && pointers.left != null && pointers.right != null && idx >= pointers.left && idx <= pointers.right;
                            const isFound = currentStep?.pointers?.found;

                            let border = isBrightMode ? 'border-slate-300' : 'border-white/10';
                            let bg = isBrightMode ? 'bg-white' : 'bg-white/5';
                            let ring = '';

                            if (isFound && (isLeft || isRight)) {
                              border = 'border-emerald-400';
                              bg = 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_25px_rgba(16,185,129,0.8)]';
                              ring = 'ring-4 ring-emerald-300/60 scale-110';
                            } else if (inWindow) {
                              border = 'border-purple-400';
                              bg = isBrightMode ? 'bg-purple-50 text-purple-900 font-bold' : 'bg-purple-500/30 text-purple-100 font-bold shadow-[0_0_18px_rgba(168,85,247,0.4)]';
                            } else if (isLeft) {
                              border = 'border-cyan-400';
                              bg = isBrightMode ? 'bg-cyan-50 text-cyan-900 font-bold' : 'bg-cyan-500/25 text-cyan-200 font-bold';
                            } else if (isRight) {
                              border = 'border-rose-400';
                              bg = isBrightMode ? 'bg-rose-50 text-rose-900 font-bold' : 'bg-rose-500/25 text-rose-200 font-bold';
                            }

                            return (
                              <div key={idx} className="flex flex-col items-center gap-1.5 transition-all duration-300">
                                <div className="h-6 flex items-center justify-center gap-1">
                                  {isLeft && <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-black bg-cyan-400 text-slate-950 animate-pointer-bounce">L</span>}
                                  {isRight && <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-black bg-rose-400 text-white animate-pointer-bounce">R</span>}
                                </div>

                                <div className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border flex flex-col items-center justify-center holo-card shadow-lg ${border} ${bg} ${ring}`}>
                                  <span className={`text-base sm:text-lg font-mono font-black ${isBrightMode && !isFound ? 'text-slate-900' : 'text-white'}`}>
                                    {val}
                                  </span>
                                </div>

                                <span className={`text-[10px] font-mono font-semibold ${isBrightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                  [{idx}]
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* =========================================================
                      STAGE D: STACK (DYNAMIC PUCKS + VALID PARENTHESES SCANNER)
                      ========================================================= */}
                  {currentTopic.stageType === 'stack' && (
                    <div className="w-full h-full flex flex-col justify-between select-none">
                      
                      {/* Top Info Banner */}
                      <div className={`p-2.5 rounded-xl border backdrop-blur-md flex items-center justify-between flex-wrap gap-2 shrink-0 ${
                        isBrightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-black/45 border-white/10 text-slate-300'
                      }`}>
                        <span className="font-bold uppercase text-xs">
                          {currentTopic.id === 'valid-parentheses' ? 'Parentheses Bracket Matching Engine' : 'Stack LIFO Canister'}
                        </span>
                        <span className="text-xs font-mono text-[var(--theme-accent)]">
                          {currentStep?.description}
                        </span>
                      </div>

                      {/* Display for Valid Parentheses */}
                      {currentTopic.id === 'valid-parentheses' ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-4">
                          {/* Expression String Scanner Track */}
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Input Expression Scanner:</span>
                            <div className="flex items-center gap-2">
                              {"({[]})".split('').map((char, idx) => {
                                const isCurrentChar = currentStep?.custom?.charIdx === idx;
                                return (
                                  <div key={idx} className="flex flex-col items-center gap-1">
                                    <div className="h-5 flex items-center justify-center">
                                      {isCurrentChar && <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-black animate-pointer-bounce">SCAN</span>}
                                    </div>
                                    <div className={`w-10 h-12 rounded-lg border font-mono text-lg font-black flex items-center justify-center shadow-md transition-all ${
                                      isCurrentChar
                                        ? 'bg-amber-500/20 border-amber-400 text-amber-500 scale-110 ring-2 ring-amber-400'
                                        : isBrightMode ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-800 border-slate-700 text-slate-200'
                                    }`}>
                                      {char}
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400">[{idx}]</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* LIFO Stack Canister */}
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-xs font-mono font-bold text-sky-400">LIFO Matching Stack:</span>
                            <div className={`w-40 h-52 border-2 border-b-4 rounded-b-2xl flex flex-col-reverse p-2 gap-2 shadow-xl backdrop-blur-md relative ${
                              isBrightMode ? 'bg-slate-100 border-slate-300' : 'bg-black/40 border-white/20'
                            }`}>
                              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-sky-400">↓ TOP</span>
                              {((currentStep && Array.isArray(currentStep.state)) ? currentStep.state : []).map((ch, idx) => (
                                <div
                                  key={idx}
                                  className="w-full py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 border border-sky-300 text-white font-mono font-black text-center shadow"
                                >
                                  {ch}
                                </div>
                              ))}
                              {(!currentStep?.state || currentStep.state.length === 0) && (
                                <span className="text-[11px] font-mono text-slate-400 text-center my-auto">Stack is Empty</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Standard Stack Operations Canister */
                        <div className="flex-1 flex items-center justify-center py-6">
                          <div className={`w-56 h-72 border-2 border-b-4 rounded-b-2xl flex flex-col-reverse p-3 gap-2 relative shadow-2xl backdrop-blur-md ${
                            isBrightMode ? 'bg-slate-100 border-slate-300' : 'bg-black/40 border-white/20'
                          }`}>
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono font-bold text-sky-400 flex items-center gap-1">
                              <span>↓ TOP OF STACK</span>
                            </div>
                            {(((currentStep && Array.isArray(currentStep.state)) ? currentStep.state : stackData)).map((val, idx) => (
                              <div
                                key={idx}
                                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 border border-sky-300 text-white font-mono font-black text-center shadow-lg transform transition-all duration-300"
                              >
                                {val}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* =========================================================
                      STAGE E: QUEUE (DYNAMIC CONVEYOR + CIRCULAR RING BUFFER)
                      ========================================================= */}
                  {currentTopic.stageType === 'queue' && (
                    <div className="w-full h-full flex flex-col justify-between select-none">
                      
                      <div className={`p-2.5 rounded-xl border backdrop-blur-md flex items-center justify-between text-xs font-mono shrink-0 ${
                        isBrightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-black/45 border-white/10 text-slate-300'
                      }`}>
                        <span className="font-bold uppercase">
                          {currentTopic.id === 'circular-queue' ? 'Circular Ring Buffer (Wrap-Around)' : 'FIFO Queue Pipeline'}
                        </span>
                        <span className="text-[var(--theme-accent)]">{currentStep?.description}</span>
                      </div>

                      {/* Circular Queue Display */}
                      {currentTopic.id === 'circular-queue' ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-6">
                          <span className="text-xs font-mono font-bold text-slate-400">Fixed Capacity Circular Array (Slots 0..4):</span>
                          <div className="flex items-center gap-3">
                            {(((currentStep && Array.isArray(currentStep.state)) ? currentStep.state : Array(5).fill(null))).map((val, idx) => {
                              const isFront = currentStep?.custom?.front === idx;
                              const isRear = currentStep?.custom?.rear === idx;
                              return (
                                <div key={idx} className="flex flex-col items-center gap-1.5">
                                  <div className="h-6 flex items-center gap-1">
                                    {isFront && <span className="text-[10px] font-mono px-1 py-0.2 rounded font-black bg-rose-400 text-white">FRONT</span>}
                                    {isRear && <span className="text-[10px] font-mono px-1 py-0.2 rounded font-black bg-emerald-400 text-slate-950">REAR</span>}
                                  </div>
                                  <div className={`w-14 h-16 rounded-xl border flex items-center justify-center font-mono text-base font-black shadow-lg ${
                                    val !== null
                                      ? 'bg-teal-500 text-white border-teal-300'
                                      : isBrightMode ? 'bg-slate-100 border-dashed border-slate-300 text-slate-400' : 'bg-white/5 border-dashed border-white/20 text-slate-500'
                                  }`}>
                                    {val !== null ? val : '—'}
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-400">Slot {idx}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        /* Standard Queue Operations Conveyor */
                        <div className="flex-1 flex items-center justify-center py-6">
                          <div className={`w-full max-w-xl h-28 border-2 border-dashed rounded-2xl flex items-center px-4 gap-3 relative shadow-2xl backdrop-blur-md ${
                            isBrightMode ? 'bg-slate-100 border-slate-300' : 'bg-black/40 border-white/20'
                          }`}>
                            <span className="absolute -top-5 left-4 text-xs font-mono font-bold text-rose-500">FRONT (DEQUEUE ➔)</span>
                            <span className="absolute -top-5 right-4 text-xs font-mono font-bold text-emerald-500">(➔ ENQUEUE) REAR</span>
                            {(((currentStep && Array.isArray(currentStep.state)) ? currentStep.state : queueData)).map((val, idx) => (
                              <div
                                key={idx}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 border border-teal-300 text-white font-mono font-black text-center shadow-lg transform transition-all duration-300"
                              >
                                {val}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* =========================================================
                      STAGE F: TREES & BST (DYNAMIC SVG CANVAS & TRAVERSAL HUD)
                      ========================================================= */}
                  {(currentTopic.stageType === 'bst' || currentTopic.stageType === 'trees') && (
                    <div className="w-full h-full flex flex-col justify-between select-none">
                      
                      <div className={`p-2.5 rounded-xl border backdrop-blur-md flex items-center justify-between text-xs font-mono shrink-0 ${
                        isBrightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-black/45 border-white/10 text-slate-300'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="font-bold uppercase">{currentTopic.title} SVG Canvas</span>
                          {(currentTopic.id === 'bst-search' || currentTopic.id === 'bst-insert' || currentTopic.id === 'bst-delete') && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-amber-400/20 text-amber-400 border border-amber-400/30">
                              Target Key: {currentTopic.id === 'bst-delete' ? (targetVal || 30) : currentTopic.id === 'bst-insert' ? (targetVal || 25) : (targetVal || 60)}
                            </span>
                          )}
                        </div>
                        <span className="text-[var(--theme-accent)] max-w-[50%] text-right truncate">{currentStep?.description}</span>
                      </div>

                      {/* SVG Canvas for Tree Rendering */}
                      <div className="flex-1 w-full relative min-h-[260px] flex items-center justify-center my-2">
                        <svg className="w-full h-full max-h-[380px]" viewBox="0 0 700 280">
                          {/* Edges */}
                          {(() => {
                            const treeNodes = currentStep?.state?.allNodes || flattenBST(bstTree).nodes;
                            const edges = currentStep?.state?.edges || flattenBST(bstTree).edges;
                            return edges.map((e, idx) => {
                              const fromNode = treeNodes.find(n => n.id === e.from);
                              const toNode = treeNodes.find(n => n.id === e.to);
                              if (!fromNode || !toNode) return null;
                              return (
                                <line
                                  key={`edge-${idx}`}
                                  x1={fromNode.x}
                                  y1={fromNode.y}
                                  x2={toNode.x}
                                  y2={toNode.y}
                                  stroke={isBrightMode ? '#94a3b8' : 'rgba(255,255,255,0.25)'}
                                  strokeWidth="2.5"
                                  strokeDasharray="4 2"
                                />
                              );
                            });
                          })()}

                          {/* Nodes */}
                          {(() => {
                            const treeNodes = currentStep?.state?.allNodes || flattenBST(bstTree).nodes;
                            return treeNodes.map(node => {
                              const isCurr = currentStep?.custom?.activeNodeId === node.id || currentStep?.pointers?.curr === node.val;
                              const isSorted = currentStep?.custom?.highlightType === 'sorted';

                              let fill = isBrightMode ? '#f1f5f9' : '#1e293b';
                              let stroke = isBrightMode ? '#94a3b8' : '#475569';
                              let textColor = isBrightMode ? '#0f172a' : '#f8fafc';

                              if (isSorted) {
                                fill = '#10b981'; stroke = '#34d399'; textColor = '#ffffff';
                              } else if (isCurr) {
                                fill = '#f59e0b'; stroke = '#fde047'; textColor = '#020617';
                              }

                              return (
                                <g key={`node-${node.id}`} className="cursor-pointer">
                                  {isCurr && (
                                    <circle
                                      cx={node.x}
                                      cy={node.y}
                                      r="26"
                                      fill="none"
                                      stroke="#f59e0b"
                                      strokeWidth="2.5"
                                      className="animate-ping"
                                      opacity="0.6"
                                    />
                                  )}
                                  <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="20"
                                    fill={fill}
                                    stroke={stroke}
                                    strokeWidth="2.5"
                                    className="tree-node-circle shadow-lg"
                                  />
                                  <text
                                    x={node.x}
                                    y={node.y + 5}
                                    textAnchor="middle"
                                    fill={textColor}
                                    fontSize="12"
                                    fontWeight="900"
                                    fontFamily="monospace"
                                  >
                                    {node.val}
                                  </text>
                                </g>
                              );
                            });
                          })()}
                        </svg>
                      </div>

                      {/* Traversal Sequence Display HUD (Preorder, Inorder, Postorder) */}
                      {currentStep?.state?.output && currentStep.state.output.length > 0 && (
                        <div className={`p-2.5 rounded-xl border backdrop-blur-md flex items-center justify-between gap-3 text-xs font-mono shrink-0 mt-1 ${
                          isBrightMode ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-black/45 border-white/10 text-slate-200'
                        }`}>
                          <div className="flex items-center gap-2 overflow-x-auto">
                            <span className="font-bold text-[var(--theme-accent)] shrink-0">Traversal Sequence:</span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {currentStep.state.output.map((val, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-emerald-500 text-white font-black shadow-sm flex items-center gap-1 animate-scale-in"
                                >
                                  <span>{val}</span>
                                  {idx < currentStep.state.output.length - 1 && <span className="opacity-70 text-[10px]">➔</span>}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-[11px] text-slate-400 font-semibold shrink-0">Visited: {currentStep.state.output.length}</span>
                        </div>
                      )}

                      {/* BST Sub-description Action Bar */}
                      {(!currentStep?.state?.output || currentStep.state.output.length === 0) && currentStep?.subDescription && (
                        <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono shrink-0 flex items-center gap-2 mt-1 ${
                          isBrightMode ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-black/30 border-white/10 text-slate-300'
                        }`}>
                          <span className="text-amber-400">💡</span>
                          <span>{currentStep.subDescription}</span>
                        </div>
                      )}

                    </div>
                  )}

                  {/* =========================================================
                      STAGE G: GRAPHS (REAL SVG NETWORK CANVAS + QUEUE/STACK HUD)
                      ========================================================= */}
                  {(currentTopic.stageType === 'graph' || currentTopic.stageType === 'graphs') && (
                    <div className="w-full h-full flex flex-col justify-between select-none">
                      
                      <div className={`p-2.5 rounded-xl border backdrop-blur-md flex items-center justify-between text-xs font-mono shrink-0 ${
                        isBrightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-black/45 border-white/10 text-slate-300'
                      }`}>
                        <span className="font-bold uppercase">{currentTopic.title} Topology Canvas</span>
                        <span className="text-[var(--theme-accent)]">{currentStep?.description}</span>
                      </div>

                      {/* Real Interactive SVG Graph Canvas */}
                      <div className="flex-1 w-full relative min-h-[260px] flex items-center justify-center my-2">
                        <svg className="w-full h-full max-h-[360px]" viewBox="0 0 580 300">
                          {/* Edges with weights */}
                          {currentStep?.state?.edges?.map((e, idx) => {
                            const n1 = currentStep?.state?.nodes?.find(n => n.id === e.u);
                            const n2 = currentStep?.state?.nodes?.find(n => n.id === e.v);
                            if (!n1 || !n2) return null;
                            const isEdgeActive = currentStep?.custom?.edgeActive === `${e.u}-${e.v}` || currentStep?.custom?.edgeActive === `${e.v}-${e.u}`;
                            return (
                              <g key={`gedge-${idx}`}>
                                <line
                                  x1={n1.x}
                                  y1={n1.y}
                                  x2={n2.x}
                                  y2={n2.y}
                                  stroke={isEdgeActive ? '#00f2fe' : isBrightMode ? '#cbd5e1' : 'rgba(255,255,255,0.2)'}
                                  strokeWidth={isEdgeActive ? '4' : '2'}
                                />
                                <rect
                                  x={(n1.x + n2.x) / 2 - 10}
                                  y={(n1.y + n2.y) / 2 - 8}
                                  width="20"
                                  height="16"
                                  rx="4"
                                  fill={isBrightMode ? '#f1f5f9' : '#0f172a'}
                                  stroke={isBrightMode ? '#cbd5e1' : '#334155'}
                                />
                                <text
                                  x={(n1.x + n2.x) / 2}
                                  y={(n1.y + n2.y) / 2 + 4}
                                  textAnchor="middle"
                                  fontSize="10"
                                  fontWeight="bold"
                                  fill={isBrightMode ? '#475569' : '#94a3b8'}
                                >
                                  {e.w}
                                </text>
                              </g>
                            );
                          })}

                          {/* Graph Nodes */}
                          {currentStep?.state?.nodes?.map(node => {
                            const isVisited = currentStep?.state?.visited?.includes(node.id);
                            const isActive = currentStep?.custom?.activeNode === node.id;

                            let fill = isBrightMode ? '#ffffff' : '#1e293b';
                            let stroke = isBrightMode ? '#94a3b8' : '#475569';
                            let textC = isBrightMode ? '#0f172a' : '#ffffff';

                            if (isVisited) {
                              fill = '#10b981'; stroke = '#34d399'; textC = '#ffffff';
                            } else if (isActive) {
                              fill = '#f59e0b'; stroke = '#fde047'; textC = '#000000';
                            }

                            return (
                              <g key={`gnode-${node.id}`} className="cursor-pointer">
                                {isActive && (
                                  <circle cx={node.x} cy={node.y} r="28" fill="none" stroke="#f59e0b" strokeWidth="2.5" className="animate-ping" opacity="0.6" />
                                )}
                                <circle cx={node.x} cy={node.y} r="22" fill={fill} stroke={stroke} strokeWidth="3" className="shadow-lg" />
                                <text x={node.x} y={node.y + 5} textAnchor="middle" fill={textC} fontSize="14" fontWeight="black" fontFamily="monospace">
                                  {node.id}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>

                      {/* Live Graph HUD: Queue / Stack / Distance Table */}
                      <div className={`p-2.5 rounded-lg border flex items-center justify-between text-xs font-mono shrink-0 ${
                        isBrightMode ? 'bg-slate-100 border-slate-300' : 'bg-black/40 border-white/10'
                      }`}>
                        {currentTopic.id === 'graph-dijkstra' ? (
                          <div className="flex items-center gap-2 overflow-x-auto w-full">
                            <span className="font-bold text-amber-500">Distance Table:</span>
                            {Object.entries(currentStep?.state?.distances || {}).map(([node, d]) => (
                              <span key={node} className="px-2 py-0.5 rounded bg-white/10 border border-white/15">
                                {node}: <strong className="text-[var(--theme-accent)]">{d === Infinity ? '∞' : d}</strong>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 overflow-x-auto">
                            <span className="font-bold text-sky-400">
                              {currentTopic.id === 'graph-bfs' ? 'FIFO Queue:' : 'Recursion Sequence:'}
                            </span>
                            <span className="text-white font-bold">
                              [{(currentStep?.state?.queue || currentStep?.state?.visited || []).join(' ➔ ')}]
                            </span>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* =========================================================
                      STAGE H: DYNAMIC PROGRAMMING (1D FIBONACCI / 2D KNAPSACK)
                      ========================================================= */}
                  {currentTopic.stageType === 'dp' && (
                    <div className="w-full h-full flex flex-col justify-between select-none">
                      
                      <div className={`p-2.5 rounded-xl border backdrop-blur-md flex items-center justify-between text-xs font-mono shrink-0 ${
                        isBrightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-black/45 border-white/10 text-slate-300'
                      }`}>
                        <span className="font-bold uppercase">{currentTopic.title} Grid</span>
                        <span className="text-[var(--theme-accent)]">{currentStep?.description}</span>
                      </div>

                      {/* DP Display */}
                      <div className="flex-1 flex flex-col items-center justify-center py-6">
                        {currentTopic.id === 'dp-knapsack' ? (
                          /* 2D Knapsack Table */
                          <div className="flex flex-col items-center gap-2 max-w-2xl overflow-x-auto">
                            <span className="text-xs font-mono font-bold text-slate-400">2D Decision Matrix (Rows: Items, Cols: Capacity 0..6):</span>
                            <div className="grid gap-1 border p-2 rounded-xl bg-black/40">
                              {currentStep?.state?.dp?.map((row, rIdx) => (
                                <div key={rIdx} className="flex gap-1">
                                  {row.map((val, cIdx) => {
                                    const isCurrentCell = currentStep?.custom?.row === rIdx && currentStep?.custom?.col === cIdx;
                                    return (
                                      <div
                                        key={cIdx}
                                        className={`w-10 h-10 rounded border font-mono text-xs font-black flex items-center justify-center transition-all ${
                                          isCurrentCell
                                            ? 'bg-amber-400 text-slate-950 font-black scale-110 shadow-lg ring-2 ring-amber-300'
                                            : val > 0
                                            ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                                            : 'bg-white/5 border-white/10 text-slate-500'
                                        }`}
                                      >
                                        {val}
                                      </div>
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* 1D Fibonacci Tabulation Array */
                          <div className="flex flex-col items-center gap-3">
                            <span className="text-xs font-mono font-bold text-slate-400">1D Tabulation Table dp[0..{currentStep?.custom?.validN || 6}]:</span>
                            <div className="flex items-center gap-2 flex-wrap justify-center">
                              {((currentStep && Array.isArray(currentStep.state)) ? currentStep.state : []).map((val, idx) => {
                                const isActive = currentStep?.custom?.activeIdx === idx;
                                const isDep = currentStep?.custom?.activeIdx > 1 && (idx === currentStep.custom.activeIdx - 1 || idx === currentStep.custom.activeIdx - 2);

                                return (
                                  <div key={idx} className="flex flex-col items-center gap-1">
                                    <div className={`w-14 h-16 rounded-xl border flex flex-col items-center justify-center font-mono font-black shadow-lg transition-all ${
                                      isActive
                                        ? 'bg-amber-400 text-slate-950 font-black scale-115 ring-4 ring-amber-300 shadow-amber-400/50'
                                        : isDep
                                        ? 'bg-purple-500/30 border-purple-400 text-purple-200 scale-105'
                                        : isBrightMode ? 'bg-white border-slate-300 text-slate-800' : 'bg-white/5 border-white/10 text-slate-300'
                                    }`}>
                                      <span className="text-base">{val}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400">dp[{idx}]</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* =========================================================
                      STAGE I: GREEDY (ACTIVITY TIMELINE / COIN CHANGE)
                      ========================================================= */}
                  {currentTopic.stageType === 'greedy' && (
                    <div className="w-full h-full flex flex-col justify-between select-none">
                      
                      <div className={`p-2.5 rounded-xl border backdrop-blur-md flex items-center justify-between text-xs font-mono shrink-0 ${
                        isBrightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-black/45 border-white/10 text-slate-300'
                      }`}>
                        <span className="font-bold uppercase">{currentTopic.title} Visualizer</span>
                        <span className="text-[var(--theme-accent)]">{currentStep?.description}</span>
                      </div>

                      {/* Greedy Display */}
                      <div className="flex-1 flex flex-col items-center justify-center py-6">
                        {currentTopic.id === 'greedy-coin-change' ? (
                          /* Coin Change Denominations Canister */
                          <div className="flex flex-col items-center gap-4">
                            <span className="text-xs font-mono font-bold text-slate-400">Greedy Coin Selection (Remaining: {currentStep?.state?.amount ?? 0}¢):</span>
                            <div className="flex items-center gap-3">
                              {currentStep?.state?.coins?.map(c => {
                                const isCurrentCoin = currentStep?.custom?.currentCoin === c;
                                return (
                                  <div
                                    key={c}
                                    className={`w-14 h-14 rounded-full border-2 font-mono text-sm font-black flex items-center justify-center shadow-lg transition-all ${
                                      isCurrentCoin
                                        ? 'bg-amber-400 text-slate-950 border-amber-300 scale-120 ring-4 ring-amber-300'
                                        : isBrightMode ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-600 text-slate-300'
                                    }`}
                                  >
                                    {c}¢
                                  </div>
                                );
                              })}
                            </div>
                            <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-emerald-400">
                              Selected Coins: [{(currentStep?.state?.chosenCoins || []).map(x => `${x}¢`).join(', ')}]
                            </div>
                          </div>
                        ) : (
                          /* Activity Selection Gantt Timeline */
                          <div className="flex flex-col items-center gap-3 w-full max-w-xl">
                            <span className="text-xs font-mono font-bold text-slate-400">Activity Intervals Timeline (Earliest Finish First):</span>
                            <div className="w-full flex flex-col gap-2 p-3 rounded-xl bg-black/40 border border-white/10">
                              {currentStep?.state?.intervals?.map(act => {
                                const isSelected = currentStep?.state?.selected?.some(s => s.id === act.id);
                                const isRejected = currentStep?.state?.rejected?.includes(act.id);
                                const isCurr = currentStep?.custom?.currId === act.id;

                                return (
                                  <div key={act.id} className="flex items-center gap-3">
                                    <span className="text-xs font-mono font-bold w-20 text-slate-300">{act.label}:</span>
                                    <div className="flex-1 h-7 bg-white/5 rounded-lg relative overflow-hidden flex items-center px-2">
                                      <div
                                        style={{
                                          marginLeft: `${(act.s / 10) * 100}%`,
                                          width: `${((act.e - act.s) / 10) * 100}%`
                                        }}
                                        className={`h-5 rounded font-mono text-[10px] font-black flex items-center justify-center shadow transition-all ${
                                          isSelected
                                            ? 'bg-emerald-500 text-slate-950 border border-emerald-300'
                                            : isRejected
                                            ? 'bg-rose-500/30 text-rose-300 border border-rose-400'
                                            : isCurr
                                            ? 'bg-amber-400 text-slate-950 border border-amber-300 animate-pulse'
                                            : 'bg-slate-700 text-slate-300'
                                        }`}
                                      >
                                        [{act.s} - {act.e}]
                                      </div>
                                    </div>
                                    <span className={`text-[10px] font-mono font-bold w-24 text-right ${
                                      isSelected ? 'text-emerald-400' : isRejected ? 'text-rose-400' : 'text-slate-500'
                                    }`}>
                                      {isSelected ? '✓ ACCEPTED' : isRejected ? '✗ CONFLICT' : 'PENDING'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              </div>

              {/* Draggable Splitter between Visualizer Board and Code Panel */}
              {layoutMode === 'split' && (
                <div
                  onMouseDown={handleCodeResizeStart}
                  className={`hidden md:flex w-1.5 hover:w-2 z-30 cursor-col-resize group relative items-center justify-center transition-all select-none ${
                    isResizingCode
                      ? 'bg-[var(--theme-accent)] shadow-[0_0_12px_var(--theme-accent)] w-2'
                      : 'hover:bg-[var(--theme-accent)]/80 bg-slate-700/20'
                  }`}
                  title="Drag to resize Python Code tracer • Double-click to reset (440px)"
                  onDoubleClick={() => setCodePanelWidth(440)}
                >
                  <div className="h-8 w-0.5 rounded-full bg-slate-500/50 group-hover:bg-white transition" />
                </div>
              )}

              {/* ===================================================================
                  CODE VIEWER & COMPLEXITY PANEL (Right Pane)
                  =================================================================== */}
              {layoutMode !== 'canvas' && (
                <div
                  className={`flex flex-col backdrop-blur-xl overflow-hidden shrink-0 ${
                    isBrightMode ? 'bg-white border-l border-slate-200' : 'bg-slate-900/90'
                  }`}
                  style={{
                    width: layoutMode === 'code' ? '100%' : `${codePanelWidth}px`,
                    minWidth: layoutMode === 'code' ? '100%' : `${codePanelWidth}px`,
                    height: '100%',
                    transition: isResizingCode ? 'none' : 'width 0.2s ease'
                  }}>
                  
                  {/* Code Panel Header */}
                  <div className={`px-4 py-2 border-b flex items-center justify-between shrink-0 ${
                    isBrightMode ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/10'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold flex items-center gap-1.5 ${isBrightMode ? 'text-slate-800' : 'text-white'}`}>
                        <span className="text-amber-500">🐍</span> Python Code Tracing
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isBrightMode ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-slate-300'
                      }`}>
                        Line {activeLine}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400">Step:</span>
                      <span className="text-xs font-mono font-bold text-[var(--theme-accent)]">{stepIdx + 1}/{steps.length}</span>
                    </div>
                  </div>

                  {/* Step Pedagogical Breakdown Card */}
                  <div className={`p-3 border-b shrink-0 ${isBrightMode ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/10'}`}>
                    <div className={`p-2.5 rounded-lg border flex flex-col gap-1 ${
                      isBrightMode ? 'bg-white border-slate-200' : 'bg-black/40 border-white/10'
                    }`}>
                      <span className="text-[10px] font-mono uppercase font-black tracking-wider text-amber-500">
                        Step Execution Breakdown
                      </span>
                      <p className={`text-xs font-mono leading-relaxed ${isBrightMode ? 'text-slate-700' : 'text-slate-200'}`}>
                        {currentStep?.description || 'Ready to trace algorithm.'}
                      </p>
                    </div>
                  </div>

                  {/* Synchronized Python Code Display */}
                  <div className={`flex-1 overflow-y-auto p-2 font-mono text-xs select-text ${
                    isBrightMode ? 'bg-white' : 'bg-slate-950/70'
                  }`}>
                    {codeLines.map((line, idx) => {
                      const lineNum = idx + 1;
                      const isLineActive = lineNum === activeLine;

                      return (
                        <div
                          key={lineNum}
                          className={`flex items-center py-0.5 px-2 rounded transition-colors ${
                            isLineActive
                              ? 'active-code-line text-white font-bold shadow-sm'
                              : isBrightMode
                              ? 'text-slate-700 hover:bg-slate-100'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                          }`}
                        >
                          <span className={`w-8 select-none text-right pr-3 text-[10px] ${
                            isLineActive ? 'text-[var(--theme-accent)] font-bold' : isBrightMode ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            {lineNum}
                          </span>
                          <pre className="flex-1 font-mono text-[11px] sm:text-xs overflow-x-auto whitespace-pre">
                            {line}
                          </pre>
                        </div>
                      );
                    })}
                  </div>

                  {/* Big-O Complexity Badges */}
                  <div className={`p-3 border-t shrink-0 flex flex-col gap-2 ${
                    isBrightMode ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/10'
                  }`}>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500 font-bold uppercase tracking-wider">Complexity Meter:</span>
                      <span className="text-slate-500">Stability: <strong className={isBrightMode ? 'text-slate-800' : 'text-white'}>{currentTopic.complexity.stability}</strong></span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[11px]">
                      <div className={`p-1.5 rounded border ${isBrightMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>
                        <span className="text-[9px] text-slate-400 block">Best</span>
                        <span className="font-bold text-emerald-500">{currentTopic.complexity.best}</span>
                      </div>
                      <div className={`p-1.5 rounded border ${isBrightMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>
                        <span className="text-[9px] text-slate-400 block">Average</span>
                        <span className="font-bold text-amber-500">{currentTopic.complexity.avg}</span>
                      </div>
                      <div className={`p-1.5 rounded border ${isBrightMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>
                        <span className="text-[9px] text-slate-400 block">Worst</span>
                        <span className="font-bold text-rose-500">{currentTopic.complexity.worst}</span>
                      </div>
                      <div className={`p-1.5 rounded border ${isBrightMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>
                        <span className="text-[9px] text-slate-400 block">Space</span>
                        <span className="font-bold text-sky-500">{currentTopic.complexity.space}</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </main>
          </div>

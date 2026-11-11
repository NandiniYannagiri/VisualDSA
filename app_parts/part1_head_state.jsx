function VisualDSAMasterApp() {
      // Intro Splash State
      const [showIntro, setShowIntro] = useState(true);

      // Visual Theme & Presentation Modes (Permanent Cyber Dark Mode vs Bright Mode)
      const [isBrightMode, setIsBrightMode] = useState(false);
      const theme = 'cyber'; // Permanently Cyber Dark Mode as requested
      const [soundEnabled, setSoundEnabled] = useState(true);
      const [layoutMode, setLayoutMode] = useState('split'); // 'split' | 'canvas' | 'code'

      // Draggable Splitters State (Adjustments between Sidebar, Visualizer Canvas, and Code Panel)
      const [sidebarWidth, setSidebarWidth] = useState(280);
      const [codePanelWidth, setCodePanelWidth] = useState(440);
      const [isResizingSidebar, setIsResizingSidebar] = useState(false);
      const [isResizingCode, setIsResizingCode] = useState(false);

      const handleSidebarResizeStart = useCallback((e) => {
        e.preventDefault();
        setIsResizingSidebar(true);
      }, []);

      const handleCodeResizeStart = useCallback((e) => {
        e.preventDefault();
        setIsResizingCode(true);
      }, []);

      useEffect(() => {
        if (!isResizingSidebar && !isResizingCode) return;

        const handleMouseMove = (e) => {
          if (isResizingSidebar) {
            const newW = Math.max(180, Math.min(480, e.clientX));
            setSidebarWidth(newW);
          }
          if (isResizingCode) {
            const newW = Math.max(260, Math.min(window.innerWidth - 320, window.innerWidth - e.clientX));
            setCodePanelWidth(newW);
          }
        };

        const handleMouseUp = () => {
          setIsResizingSidebar(false);
          setIsResizingCode(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        };
      }, [isResizingSidebar, isResizingCode]);

      // Navigation & Curriculum Filtering (Default to Bubble Sort, first comparison sort)
      const [currentTopicId, setCurrentTopicId] = useState('bubble-sort');
      const [isHubOpen, setIsHubOpen] = useState(false);
      const [sidebarOpen, setSidebarOpen] = useState(true);
      const [searchQuery, setSearchQuery] = useState('');
      const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

      // Shared Array dataset for sorting & searching
      const [arraySize, setArraySize] = useState(10);
      const [arrData, setArrData] = useState([45, 12, 85, 32, 89, 39, 67, 24, 71, 18]);
      const [targetVal, setTargetVal] = useState(39);

      // Dedicated Two Pointers & Sliding Window State
      const [pointersArr, setPointersArr] = useState([2, 5, 8, 12, 16, 23, 38, 56, 72, 91]);
      const [pointersTarget, setPointersTarget] = useState(61);
      const [windowK, setWindowK] = useState(3);

      // Stack state
      const [stackData, setStackData] = useState([15, 30, 45]);
      const [stackInputVal, setStackInputVal] = useState('60');

      // Queue state
      const [queueData, setQueueData] = useState([10, 20, 30]);
      const [queueInputVal, setQueueInputVal] = useState('40');

      // BST custom interactive state
      const [bstTree, setBstTree] = useState(createDefaultBST);
      const [bstInputVal, setBstInputVal] = useState('40');

      // Graph state
      const [graphStartNode, setGraphStartNode] = useState('A');

      // DP state
      const [dpN, setDpN] = useState(6);

      // Greedy state
      const [greedyPreset, setGreedyPreset] = useState('standard');

      // Timeline Playback
      const [stepIdx, setStepIdx] = useState(0);
      const [isPlaying, setIsPlaying] = useState(false);
      const [speed, setSpeed] = useState(1);
      const timerRef = useRef(null);
      const audioCtxRef = useRef(null);

      // Universal Custom Input Modal State
      const [isCustomInputModalOpen, setIsCustomInputModalOpen] = useState(false);
      const [modalArrInput, setModalArrInput] = useState('45, 12, 85, 32, 89, 39, 67, 24, 71, 18');
      const [modalTargetInput, setModalTargetInput] = useState('39');
      const [modalPointersArrInput, setModalPointersArrInput] = useState('2, 5, 8, 12, 16, 23, 38, 56, 72, 91');
      const [modalPointersTargetInput, setModalPointersTargetInput] = useState('61');
      const [modalWindowKInput, setModalWindowKInput] = useState('3');
      const [modalStackInput, setModalStackInput] = useState('15, 30, 45');
      const [modalQueueInput, setModalQueueInput] = useState('10, 20, 30');
      const [modalBstInput, setModalBstInput] = useState('50, 30, 70, 20, 40, 60, 80');
      const [modalDpNInput, setModalDpNInput] = useState('6');

      // 1. Web Audio Synthesizer (Harmonic Tones & Sound FX)
      const playBeep = useCallback((freq, duration = 0.08, type = 'sine') => {
        if (!soundEnabled) return;
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (!AudioContextClass) return;
          if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContextClass();
          }
          const ctx = audioCtxRef.current;
          if (ctx.state === 'suspended') ctx.resume();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + duration);
        } catch(e) {}
      }, [soundEnabled]);

      // Current Topic & Sibling Categories
      const currentTopic = useMemo(() => {
        return ALL_TOPICS.find(t => t.id === currentTopicId) || ALL_TOPICS[0];
      }, [currentTopicId]);

      const siblingTopics = useMemo(() => {
        if (currentTopic.category === 'comparison-sorting' || currentTopic.category === 'non-comparison-sorting') {
          return ALL_TOPICS.filter(t => t.category === 'comparison-sorting' || t.category === 'non-comparison-sorting');
        }
        return ALL_TOPICS.filter(t => t.category === currentTopic.category);
      }, [currentTopic.category]);

      // Steps Generation Factory for ALL 31 Topics
      const steps = useMemo(() => {
        const id = currentTopic.id;
        const stage = currentTopic.stageType;

        if (stage === 'sorting') {
          return generateSortingSteps(id, arrData);
        }
        if (id === 'count-sort') {
          return generateCountSortSteps(arrData);
        }
        if (id === 'bucket-sort') {
          return generateBucketSortSteps(arrData);
        }
        if (id === 'radix-sort') {
          return generateRadixSortSteps(arrData);
        }
        if (stage === 'searching') {
          return generateSearchingSteps(id, arrData, targetVal);
        }
        if (stage === 'pointers') {
          return generatePointersSteps(id, pointersArr, pointersTarget, windowK);
        }
        if (stage === 'stack') {
          return generateStackSteps(id, stackData);
        }
        if (stage === 'queue') {
          return generateQueueSteps(id, queueData);
        }
        if (stage === 'bst' || stage === 'trees') {
          return generateTreeSteps(id, bstTree, targetVal);
        }
        if (stage === 'graph' || stage === 'graphs') {
          const gType = id === 'graph-dfs' ? 'dfs' : id === 'graph-dijkstra' ? 'dijkstra' : 'bfs';
          return generateGraphSteps(gType, graphStartNode);
        }
        if (stage === 'greedy') {
          const grType = id === 'greedy-coin-change' ? 'coin-change' : 'activity';
          return generateGreedySteps(grType, greedyPreset);
        }
        if (stage === 'dp') {
          const dpType = id === 'dp-knapsack' ? 'knapsack' : 'fibonacci';
          return generateDPSteps(dpType, dpN);
        }
        return generateSortingSteps('bubble-sort', arrData);
      }, [currentTopic, arrData, targetVal, pointersArr, pointersTarget, windowK, stackData, queueData, bstTree, graphStartNode, dpN, greedyPreset]);

      // Reset playback when topic or steps change
      useEffect(() => {
        setStepIdx(0);
        setIsPlaying(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }, [steps]);

      // Universal Sound FX Synthesizer across ALL 32 Algorithms
      useEffect(() => {
        if (!steps || !steps[stepIdx] || !soundEnabled) return;
        const cur = steps[stepIdx];

        // 1. Completion / Target Found / Sorted Finish
        const isCompleteOrFound =
          (cur.highlights?.sorted?.length && cur.highlights.sorted.length >= 2) ||
          cur.custom?.isMatch ||
          cur.custom?.found ||
          cur.custom?.highlightType === 'sorted' ||
          (cur.description && (
            cur.description.toLowerCase().includes('found') ||
            cur.description.toLowerCase().includes('complete') ||
            cur.description.toLowerCase().includes('finished') ||
            cur.description.toLowerCase().includes('sorted')
          ));

        if (isCompleteOrFound) {
          playBeep(587.33, 0.08, 'sine');
          setTimeout(() => playBeep(880, 0.1, 'triangle'), 40);
          return;
        }

        // 2. Swaps, Data Insertions, Enqueue, Push, Deletion, State Changes
        const isMutation =
          (cur.highlights?.swapping && cur.highlights.swapping.length > 0) ||
          cur.action === 'push' || cur.action === 'pop' ||
          cur.action === 'enqueue' || cur.action === 'dequeue' ||
          cur.action === 'swap' || cur.action === 'gather' ||
          (cur.description && (
            cur.description.toLowerCase().includes('swap') ||
            cur.description.toLowerCase().includes('push') ||
            cur.description.toLowerCase().includes('pop') ||
            cur.description.toLowerCase().includes('enqueue') ||
            cur.description.toLowerCase().includes('dequeue') ||
            cur.description.toLowerCase().includes('insert') ||
            cur.description.toLowerCase().includes('delete') ||
            cur.description.toLowerCase().includes('moved')
          ));

        if (isMutation) {
          playBeep(440, 0.05, 'triangle');
          setTimeout(() => playBeep(659.25, 0.05, 'triangle'), 35);
          return;
        }

        // 3. Comparisons, Tree Traversals, Graph Edge Walks, Array Scans, Radix Passes
        let dynamicFreq = 340;
        if (cur.highlights?.comparing?.length) {
          const idx = cur.highlights.comparing[0];
          const val = Array.isArray(cur.state) && cur.state[idx] != null
            ? (typeof cur.state[idx] === 'object' ? cur.state[idx].val : cur.state[idx])
            : 40;
          dynamicFreq = 220 + ((val || 30) / 100) * 580;
        } else if (cur.custom?.activeNodeId || cur.custom?.activeNode) {
          const nodeStr = String(cur.custom.activeNodeId || cur.custom.activeNode);
          const num = parseInt(nodeStr.replace(/\D/g, ''), 10) || (stepIdx + 1);
          dynamicFreq = 240 + ((num % 50) / 50) * 500;
        } else if (cur.pointers) {
          const l = cur.pointers.left ?? cur.pointers.low ?? 0;
          const r = cur.pointers.right ?? cur.pointers.high ?? 5;
          dynamicFreq = 260 + (((l + r) * 25) % 450);
        } else {
          // General step tick
          dynamicFreq = 300 + ((stepIdx * 33) % 380);
        }

        playBeep(dynamicFreq, 0.05, 'sine');
      }, [stepIdx, soundEnabled, steps, playBeep]);

      // Playback ticker
      useEffect(() => {
        if (!isPlaying) {
          if (timerRef.current) clearInterval(timerRef.current);
          return;
        }
        const interval = Math.max(80, Math.floor(700 / speed));
        timerRef.current = setInterval(() => {
          setStepIdx(prev => {
            if (prev >= steps.length - 1) {
              setIsPlaying(false);
              return prev;
            }
            return prev + 1;
          });
        }, interval);
        return () => clearInterval(timerRef.current);
      }, [isPlaying, speed, steps.length]);

      // Global keyboard shortcuts
      useEffect(() => {
        const onKey = (e) => {
          if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
          if (e.code === 'Space') {
            e.preventDefault();
            setIsPlaying(p => !p);
          } else if (e.code === 'ArrowRight') {
            e.preventDefault();
            setIsPlaying(false);
            setStepIdx(p => Math.min(p + 1, steps.length - 1));
          } else if (e.code === 'ArrowLeft') {
            e.preventDefault();
            setIsPlaying(false);
            setStepIdx(p => Math.max(p - 1, 0));
          }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, [steps.length]);

      // In-Stage Data Generators & Presets
      const handleGenerateRandom = (size = arraySize) => {
        const fresh = Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 12);
        setArrData(fresh);
        if (fresh.length > 0) setTargetVal(fresh[Math.floor(Math.random() * fresh.length)]);
        setStepIdx(0);
        setIsPlaying(false);
      };

      const handleGenerateSorted = (size = arraySize) => {
        const base = [12, 19, 28, 35, 42, 51, 63, 70, 79, 88, 92, 97, 105, 115, 128, 140, 155, 170, 185, 200];
        const fresh = base.slice(0, size);
        setArrData(fresh);
        if (fresh.length > 0) setTargetVal(fresh[Math.floor(fresh.length / 2)]);
        setStepIdx(0);
        setIsPlaying(false);
      };

      const handleGenerateReversed = (size = arraySize) => {
        const base = [12, 19, 28, 35, 42, 51, 63, 70, 79, 88, 92, 97, 105, 115, 128, 140, 155, 170, 185, 200];
        const fresh = base.slice(0, size).reverse();
        setArrData(fresh);
        if (fresh.length > 0) setTargetVal(fresh[Math.floor(fresh.length / 2)]);
        setStepIdx(0);
        setIsPlaying(false);
      };

      const handleGenerateDuplicates = (size = arraySize) => {
        const dups = [15, 30, 45, 30, 60, 45, 75, 15, 90, 60, 30, 45, 75, 90, 15, 60, 30, 45, 75, 90];
        const fresh = dups.slice(0, size);
        setArrData(fresh);
        if (fresh.length > 0) setTargetVal(fresh[3]);
        setStepIdx(0);
        setIsPlaying(false);
      };

      const handleChangeArraySize = (newSize) => {
        setArraySize(newSize);
        handleGenerateRandom(newSize);
      };

      // Custom Input Modal Handlers
      const handleOpenCustomInputModal = () => {
        setModalArrInput(arrData.join(', '));
        setModalTargetInput(String(targetVal));
        setModalPointersArrInput(pointersArr.join(', '));
        setModalPointersTargetInput(String(pointersTarget));
        setModalWindowKInput(String(windowK));
        setModalStackInput(stackData.join(', '));
        setModalQueueInput(queueData.join(', '));
        setModalDpNInput(String(dpN));
        setIsCustomInputModalOpen(true);
      };

      const handleApplyCustomInputModal = () => {
        const parseList = (str) => str.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        const stage = currentTopic.stageType;
        const id = currentTopic.id;
        if (stage === 'sorting' || stage === 'searching' || ['count-sort', 'bucket-sort', 'radix-sort'].includes(id)) {
          const parsedArr = parseList(modalArrInput);
          if (parsedArr.length >= 2) {
            setArrData(parsedArr);
            setArraySize(parsedArr.length);
          }
          const parsedT = parseInt(modalTargetInput, 10);
          if (!isNaN(parsedT)) setTargetVal(parsedT);
        } else if (stage === 'pointers') {
          const parsedPointers = parseList(modalPointersArrInput);
          if (parsedPointers.length >= 2) {
            parsedPointers.sort((a, b) => a - b);
            setPointersArr(parsedPointers);
          }
          const parsedTarget = parseInt(modalPointersTargetInput, 10);
          if (!isNaN(parsedTarget)) setPointersTarget(parsedTarget);
          const parsedK = parseInt(modalWindowKInput, 10);
          if (!isNaN(parsedK) && parsedK >= 1) setWindowK(parsedK);
        } else if (stage === 'stack') {
          const parsedStack = parseList(modalStackInput);
          if (parsedStack.length > 0) setStackData(parsedStack.slice(0, 8));
        } else if (stage === 'queue') {
          const parsedQueue = parseList(modalQueueInput);
          if (parsedQueue.length > 0) setQueueData(parsedQueue.slice(0, 8));
        } else if (stage === 'bst' || stage === 'trees') {
          const parsedBstVals = parseList(modalBstInput);
          if (parsedBstVals.length > 0) {
            const freshBst = buildBSTFromValues(parsedBstVals);
            setBstTree(freshBst);
          }
          const parsedTarget = parseInt(modalTargetInput, 10);
          if (!isNaN(parsedTarget)) setTargetVal(parsedTarget);
        } else if (stage === 'dp') {
          const parsedN = parseInt(modalDpNInput, 10);
          if (!isNaN(parsedN) && parsedN >= 2 && parsedN <= 12) {
            setDpN(parsedN);
          }
        }
        setIsCustomInputModalOpen(false);
        setStepIdx(0);
        setIsPlaying(false);
      };

      const currentStep = steps[stepIdx] || steps[0] || {};
      const activeLine = currentStep?.activeLine ?? 1;
      const codeSnippet = CODE_LIBRARY[currentTopic.id] || CODE_LIBRARY['bubble-sort'];
      const codeLines = codeSnippet.split('\n');

      const filteredTopics = useMemo(() => {
        return ALL_TOPICS.filter(t => {
          const matchesQuery = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               t.category.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCat = selectedCategoryFilter === 'all' ||
            (selectedCategoryFilter === 'sorting' && (t.category === 'comparison-sorting' || t.category === 'non-comparison-sorting' || t.category === 'sorting')) ||
            (selectedCategoryFilter === 'comparison-sorting' && t.category === 'comparison-sorting') ||
            (selectedCategoryFilter === 'non-comparison-sorting' && t.category === 'non-comparison-sorting') ||
            (selectedCategoryFilter === 'trees' && t.category === 'trees') ||
            (selectedCategoryFilter === 'bst' && t.category === 'bst') ||
            (selectedCategoryFilter === 'graphs' && (t.category === 'graphs' || t.category === 'graph')) ||
            t.category === selectedCategoryFilter;
          return matchesQuery && matchesCat;
        });
      }, [searchQuery, selectedCategoryFilter]);

function VisualDSAIntroSplash({ onFinish }) {
      const fullWord = "VisualDSA";
      const [charCount, setCharCount] = useState(0);
      const [isAssembled, setIsAssembled] = useState(false);
      const [initProgress, setInitProgress] = useState(0);
      const [statusText, setStatusText] = useState("INITIALIZING ALGORITHMIC ENGINE...");
      const [isDismissing, setIsDismissing] = useState(false);

      // 1. One-by-one character typewriter animation with smooth cadence
      useEffect(() => {
        if (charCount < fullWord.length) {
          const timeout = setTimeout(() => {
            setCharCount(prev => prev + 1);
          }, 160); // Deliberate, elegant character typing cadence
          return () => clearTimeout(timeout);
        } else {
          // When all characters are displayed, trigger assemble glow
          const timer = setTimeout(() => {
            setIsAssembled(true);
          }, 180);
          return () => clearTimeout(timer);
        }
      }, [charCount, fullWord.length]);

      // 2. High-tech progress bar and final assemble glow
      useEffect(() => {
        if (!isAssembled) return;

        const interval = setInterval(() => {
          setInitProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              setStatusText("SYSTEM ONLINE • LAUNCHING DASHBOARD");
              setTimeout(() => {
                setIsDismissing(true);
                setTimeout(onFinish, 700);
              }, 450);
              return 100;
            }
            if (prev === 25) setStatusText("LOADING PYTHON TRACING RUNTIME...");
            if (prev === 60) setStatusText("COMPILING 32 DSA DATA STRUCTURE KERNELS...");
            if (prev === 90) setStatusText("SYSTEM READY • PREPARING WORKBENCH");
            return prev + 5;
          });
        }, 35);

        return () => clearInterval(interval);
      }, [isAssembled, onFinish]);

      // Allow skipping on click or keypress
      const handleSkip = () => {
        setIsDismissing(true);
        setTimeout(onFinish, 400);
      };

      useEffect(() => {
        const onKey = (e) => {
          if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') {
            handleSkip();
          }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, []);

      const chars = fullWord.split('');

      return (
        <div
          onClick={handleSkip}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 cursor-pointer select-none transition-all duration-700 ${
            isDismissing ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
          }`}
          style={{
            backgroundImage: `radial-gradient(circle at 50% 45%, rgba(14, 165, 233, 0.14) 0%, rgba(2, 6, 23, 0.98) 75%)`
          }}
        >
          {/* Subtle Ambient Technical Grid Lines */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Glowing Aura Behind Text */}
          <div
            className={`absolute w-96 h-96 rounded-full blur-3xl transition-all duration-1000 pointer-events-none ${
              isAssembled ? 'bg-sky-500/25 scale-125' : 'bg-sky-500/10 scale-90'
            }`}
          />

          {/* Central Logo Box */}
          <div className="relative z-10 flex flex-col items-center text-center px-4">
            
            {/* Top Technology Badge */}
            <div className={`mb-6 flex items-center gap-2 px-3.5 py-1 rounded-full border border-sky-500/30 bg-sky-950/50 text-[11px] font-mono tracking-widest text-sky-400 uppercase transition-all duration-700 ${
              charCount > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}>
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span>Interactive Algorithmic Workbench</span>
            </div>

            {/* Character-by-Character Main Title */}
            <div className="flex items-center text-5xl sm:text-7xl md:text-8xl font-black tracking-tight font-sans">
              {chars.map((ch, idx) => {
                const isVisible = idx < charCount;
                const isDSA = idx >= 6; // 'D', 'S', 'A'
                
                return (
                  <span
                    key={idx}
                    className={`inline-block transition-all duration-300 transform ${
                      isVisible
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-6 scale-90'
                    } ${
                      isDSA
                        ? isAssembled
                          ? 'bg-gradient-to-r from-teal-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.7)]'
                          : 'text-sky-400'
                        : isAssembled
                        ? 'bg-gradient-to-r from-white via-slate-100 to-sky-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]'
                        : 'text-white'
                    }`}
                    style={{
                      transitionDelay: `${idx * 15}ms`
                    }}
                  >
                    {ch}
                  </span>
                );
              })}

              {/* Glowing Blinking Cursor while typing */}
              {!isAssembled && (
                <span className="inline-block w-1.5 md:w-2.5 h-12 md:h-20 bg-sky-400 ml-1 rounded-sm animate-pulse shadow-[0_0_15px_#38bdf8]" />
              )}
            </div>

            {/* All-Characters Reveal: Subtitle & Loading Progress */}
            <div className={`mt-5 flex flex-col items-center gap-4 transition-all duration-700 delay-150 ${
              isAssembled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <p className="text-xs sm:text-sm font-mono tracking-wider uppercase text-slate-300 font-semibold max-w-md">
                MASTER DATA STRUCTURES & ALGORITHMS WITH SYNCHRONIZED PYTHON TRACING
              </p>

              {/* Enterprise System Loading Progress Bar */}
              <div className="w-64 sm:w-80 flex flex-col gap-1.5 mt-2">
                <div className="w-full h-1.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-[1px]">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-500 rounded-full transition-all duration-100 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
                    style={{ width: `${initProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="text-sky-400 font-medium">{statusText}</span>
                  <span className="text-slate-400 font-bold">{initProgress}%</span>
                </div>
              </div>

              {/* Skip hint */}
              <div className="text-[11px] font-mono text-slate-500 hover:text-slate-300 mt-2 flex items-center gap-1 transition">
                <span>Click anywhere or press Space to skip</span>
                <span>➔</span>
              </div>
            </div>

          </div>
        </div>
      );
    }

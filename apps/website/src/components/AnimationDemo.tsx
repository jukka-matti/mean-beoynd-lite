import React, { useState } from 'react';
import * as d3 from 'd3';

// Single Concept Demo now
export default function AnimationDemo() {
  return <FocusedScanner />;
}

// ==========================================
// CONCEPT A: FOCUSED X-RAY (SELECTIVE DRILL-DOWN)
// ==========================================
function FocusedScanner() {
  // viewMode phases:
  // 'bar' (Initial) -> 'boxplot' (Reveal All) -> 'focus' (Isolate Factor B) -> 'ichart' (Expand & Chart)
  const [viewMode, setViewMode] = useState<'bar' | 'boxplot' | 'focus' | 'ichart'>('bar');
  const [isScanning, setIsScanning] = useState(false);

  // Single trigger for the full sequence
  const startFullScan = () => {
    if (isScanning || viewMode !== 'bar') return;
    setIsScanning(true);

    // Phase 1: Bar -> Boxplot (1.5s)
    setTimeout(() => {
      setViewMode('boxplot');

      // Phase 2: Boxplot -> Focus (Select Problem Bar)
      setTimeout(() => {
        setViewMode('focus');

        // Phase 3: Focus -> I-Chart (Expand + Data Flow)
        setTimeout(() => {
          setViewMode('ichart');
          setIsScanning(false);
        }, 1200);
      }, 2000);
    }, 1500);
  };

  const reset = () => {
    setViewMode('bar');
    setIsScanning(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-neutral-900 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden relative min-h-[400px]">
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        {viewMode === 'bar' && (
          <button
            onClick={startFullScan}
            disabled={isScanning}
            className="px-4 py-2 bg-brand-primary text-white text-sm font-bold rounded-lg disabled:opacity-50 hover:bg-opacity-90 transition-all flex items-center gap-2"
          >
            {isScanning ? 'Scanning...' : 'Start Scan'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        )}

        {viewMode === 'ichart' && (
          <button
            onClick={reset}
            className="px-4 py-2 bg-neutral-700 text-white text-sm font-bold rounded-lg hover:bg-neutral-600 transition-all"
          >
            Reset
          </button>
        )}
      </div>

      <div className="text-center mb-8 relative z-10">
        <h3 className="text-2xl font-bold text-white mb-2">Concept A: Focused Drill-Down</h3>
        <p className="text-neutral-400 h-6 transition-all duration-500">
          {viewMode === 'bar' && !isScanning && 'Step 1: Observe the Averages'}
          {isScanning && viewMode === 'bar' && 'Scanning...'}
          {viewMode === 'boxplot' && 'Step 2: Reveal the Variation'}
          {viewMode === 'focus' && 'Step 3: Isolate the Problem'}
          {viewMode === 'ichart' && 'Step 4: Diagnose with I-Chart'}
        </p>
      </div>

      <div className="h-80 relative flex items-end justify-center px-4 md:px-12 w-full">
        {/* Scanner Beam */}
        <div
          className={`absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent z-30 pointer-events-none transition-all duration-[1500ms] ease-linear ${isScanning ? 'left-[120%]' : '-left-24'}`}
        />

        {/* CHART BARS */}
        {['Factor A', 'Factor B', 'Factor C'].map((label, idx) => {
          const isProblem = idx === 1; // Factor B is the focus

          // Layout Logic
          let widthClass = 'w-24';
          let opacityClass = 'opacity-100';
          let translateClass = 'translate-x-0';

          if (viewMode === 'focus' || viewMode === 'ichart') {
            if (isProblem) {
              widthClass = 'w-full max-w-2xl'; // Focus on B
              translateClass = 'translate-x-0 z-10';
            } else {
              widthClass = 'w-0 overflow-hidden'; // Hide others
              opacityClass = 'opacity-0';
            }
          }

          // --- REALISTIC DATA GENERATION ---
          // Mulberry32 seeded PRNG (deterministic, unique per point)
          const seededRandom = (seed: number): number => {
            let t = seed + 0x6d2b79f5;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
          };

          // Box-Muller transform using seeded randoms
          const generateNormal = (
            mean: number,
            stdDev: number,
            seed1: number,
            seed2: number
          ): number => {
            const u1 = seededRandom(seed1);
            const u2 = seededRandom(seed2);
            const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            return mean + z * stdDev;
          };

          // Generate data points with proper story
          const dots = Array.from({ length: 50 }).map((_, i) => {
            const baseSeed = idx * 10000 + i * 3;

            let val: number;

            if (isProblem) {
              // Factor B Story: "The average hid a process shift"
              // Phase 1 (First 25 points): Running high and stable
              // Phase 2 (Last 25 points): Shifted low and more variable
              if (i < 25) {
                val = generateNormal(97, 1.5, baseSeed, baseSeed + 1);
              } else {
                val = generateNormal(85, 3.5, baseSeed, baseSeed + 1);
              }
            } else {
              // Factors A & C: Stable high performance
              val = generateNormal(96, 2.0, baseSeed, baseSeed + 1);
            }

            // Clamp to realistic range
            val = Math.max(60, Math.min(99, val));

            // Boxplot X position (horizontal jitter)
            const boxX = 20 + seededRandom(baseSeed + 2) * 60;

            // I-Chart positions
            const chartX = (i / 50) * 100;
            const chartY = val; // Direct mapping - Y is the value

            return { id: i, boxX, val, chartX, chartY, isProblem };
          });

          // Calculate Boxplot Stats using d3 for proper quartile interpolation
          const values = dots.map(d => d.val).sort((a, b) => a - b);
          const q1 = d3.quantile(values, 0.25) ?? 0;
          const median = d3.quantile(values, 0.5) ?? 0;
          const q3 = d3.quantile(values, 0.75) ?? 0;
          const min = values[0];
          const max = values[values.length - 1];

          // Calculate I-Chart Statistics using d3 (sample stdDev with N-1)
          const dataMean = d3.mean(values) ?? 0;
          const stdDev = d3.deviation(values) ?? 0;
          const ucl = dataMean + 3 * stdDev;
          const lcl = Math.max(60, dataMean - 3 * stdDev);

          // Dynamic Y-Axis Scaling: Map data range to visual range (5%-95% of container)
          const dataMin = Math.min(min, lcl) - 2; // Add padding
          const dataMax = Math.max(max, ucl) + 2;
          const scaleY = (value: number): number => {
            // Map value from [dataMin, dataMax] to [5, 95] (visual range)
            return 5 + ((value - dataMin) / (dataMax - dataMin)) * 90;
          };

          return (
            <div
              key={label}
              className={`flex flex-col items-center justify-end h-full relative transition-all duration-1000 ease-in-out ${widthClass} ${opacityClass} ${translateClass}`}
            >
              {/* CONTAINER */}
              <div className="w-full h-full relative flex flex-col justify-end">
                {/* I-CHART CONTEXT */}
                {isProblem && (
                  <div
                    className={`absolute inset-0 border border-neutral-700 bg-neutral-800/30 rounded-lg transition-opacity duration-1000 ${viewMode === 'ichart' ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <div className="absolute inset-0 flex flex-col justify-between py-6 px-4">
                      {[0, 1, 2, 3, 4].map(l => (
                        <div key={l} className="w-full h-px bg-white/5"></div>
                      ))}
                    </div>
                    {/* Control Limits - Scaled to visual range */}
                    <div
                      className="absolute left-0 right-0 border-t border-dashed border-red-500/50 mx-4"
                      style={{ bottom: `${scaleY(ucl)}%` }}
                    >
                      <span className="text-[10px] text-red-500 -mt-4 absolute">
                        UCL ({ucl.toFixed(1)})
                      </span>
                    </div>
                    <div
                      className="absolute left-0 right-0 border-t border-blue-500/50 mx-4"
                      style={{ bottom: `${scaleY(dataMean)}%` }}
                    >
                      <span className="text-[10px] text-blue-400 -mt-4 absolute">
                        Mean ({dataMean.toFixed(1)})
                      </span>
                    </div>
                    <div
                      className="absolute left-0 right-0 border-t border-dashed border-red-500/50 mx-4"
                      style={{ bottom: `${scaleY(lcl)}%` }}
                    >
                      <span className="text-[10px] text-red-500 mt-1 absolute">
                        LCL ({lcl.toFixed(1)})
                      </span>
                    </div>
                  </div>
                )}

                {/* VISUALIZATION LAYER */}
                <div className="absolute inset-0 mx-4 mb-8 z-20">
                  {/* I-Chart Line */}
                  <svg
                    className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${viewMode === 'ichart' ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <polyline
                      points={dots.map(d => `${d.chartX},${100 - scaleY(d.chartY)}`).join(' ')}
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  {/* DATA DOTS */}
                  {dots.map((d, i) => (
                    <div
                      key={i}
                      className={`absolute rounded-full transition-all duration-1000 ease-in-out shadow-sm
                        ${d.isProblem ? 'bg-blue-400' : 'bg-emerald-400'}
                        ${viewMode === 'ichart' ? 'w-2 h-2 border border-neutral-900 bg-opacity-100' : 'w-1.5 h-1.5 bg-opacity-80'}
                    `}
                      style={{
                        left: viewMode === 'ichart' ? `${d.chartX}%` : `${d.boxX}%`,
                        // Scaled Y position for both modes
                        bottom: `${scaleY(d.val)}%`,
                        opacity: viewMode === 'bar' ? 0 : 1,
                      }}
                    />
                  ))}
                </div>

                {/* SOLID BAR (Initial State) */}
                <div
                  className={`absolute bottom-0 w-16 left-1/2 -translate-x-1/2 rounded-t-lg transition-all duration-700 z-10 ${viewMode !== 'bar' ? 'opacity-0 scale-y-0 origin-bottom' : 'opacity-100 scale-y-100'}`}
                  style={{
                    height: `${dataMean}%`,
                    backgroundColor: idx === 1 ? '#ef4444' : '#22c55e',
                  }}
                >
                  <div className="absolute top-2 w-full text-center text-white font-bold opacity-100">
                    {Math.round(dataMean)}%
                  </div>
                </div>

                {/* BOXPLOT (Actual Stats) */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-16 transition-all duration-500 z-0 ${viewMode === 'boxplot' ? 'opacity-100' : 'opacity-0'}`}
                  style={{ height: '100%', bottom: 0 }}
                >
                  {/* Whiskers - Scaled */}
                  <div
                    className="absolute bg-white/50 w-[1px] left-1/2 -translate-x-1/2"
                    style={{ bottom: `${scaleY(min)}%`, height: `${scaleY(q1) - scaleY(min)}%` }}
                  ></div>
                  <div
                    className="absolute bg-white/50 w-[1px] left-1/2 -translate-x-1/2"
                    style={{ bottom: `${scaleY(q3)}%`, height: `${scaleY(max) - scaleY(q3)}%` }}
                  ></div>

                  {/* Caps - Scaled */}
                  <div
                    className="absolute bg-white/50 h-[1px] w-4 left-1/2 -translate-x-1/2"
                    style={{ bottom: `${scaleY(min)}%` }}
                  ></div>
                  <div
                    className="absolute bg-white/50 h-[1px] w-4 left-1/2 -translate-x-1/2"
                    style={{ bottom: `${scaleY(max)}%` }}
                  ></div>

                  {/* Box - Scaled */}
                  <div
                    className="absolute w-8 left-1/2 -translate-x-1/2 border border-white/60 bg-white/10"
                    style={{ bottom: `${scaleY(q1)}%`, height: `${scaleY(q3) - scaleY(q1)}%` }}
                  ></div>

                  {/* Median - Scaled */}
                  <div
                    className="absolute w-8 left-1/2 -translate-x-1/2 h-[2px] bg-red-400 z-10"
                    style={{ bottom: `${scaleY(median)}%` }}
                  ></div>
                </div>
              </div>

              <span
                className={`text-neutral-400 text-sm mt-2 font-bold transition-opacity duration-500 ${viewMode === 'focus' || viewMode === 'ichart' ? (isProblem ? 'opacity-100' : 'opacity-0') : 'opacity-100'}`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Story Overlay */}
      <div
        className={`absolute bottom-4 left-0 right-0 text-center transition-all duration-500 ${viewMode === 'ichart' ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        <p className="text-xl font-bold text-white bg-black/50 inline-block px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">
          "The average hid a process shift."
        </p>
      </div>
    </div>
  );
}

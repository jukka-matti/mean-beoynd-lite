import React, { useState, useEffect, useRef } from 'react';

export default function ScrollAnimationDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Handle Scroll Progress
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how far we've scrolled through the container
      // We want progress to be 0 when top is at bottom of viewport (entering)
      // And 1 when bottom is at top of viewport (leaving)
      // But for a pinned effect, we usually care about when the sticky part hits the top.

      // Simpler approach for this specific demo layout:
      // The container is very tall (e.g. 300vh).
      // The inner content is sticky.
      // Progress = (distance scrolled from top of container) / (total scrollable height)

      const startOffset = -top;
      const totalScrollable = height - windowHeight;

      let p = startOffset / totalScrollable;
      p = Math.max(0, Math.min(1, p)); // Clamp 0-1

      setProgress(p);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // MAPPING PROGRESS TO STAGES
  // 0.0 - 0.2:  Initial State (Bar Chart)
  // 0.2 - 0.5:  X-Ray Reveal (Boxplots fade in, Bars fade out)
  // 0.5 - 0.9:  Expansion (Boxplot turns into I-Chart / dots spread out)

  // Opacities & Transforms
  const xrayOpacity = Math.min(1, Math.max(0, (progress - 0.2) * 3)); // 0 at 0.2, 1 at 0.53
  const barOpacity = 1 - xrayOpacity;

  // For the expansion phase (0.5 to 0.9)
  const expansionProgress = Math.min(1, Math.max(0, (progress - 0.5) * 2.5)); // 0 at 0.5, 1 at 0.9

  // Data Generation (deterministic)
  const dots = React.useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      // Target position in I-Chart (Chaos)
      iChartX: (i / 40) * 100,
      iChartY: 50 + Math.sin(i) * 20 + (Math.random() - 0.5) * 20,
      // Boxplot position (Clustered)
      boxX: 50 + (Math.random() - 0.5) * 20,
      boxY: 50 + (Math.random() - 0.5) * 40, // Tighter cluster
    }));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: '400vh' }} // Creates the scroll space
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-neutral-900 border-y border-neutral-800">
        {/* PROGRESS INDICATOR */}
        <div className="absolute top-4 left-0 right-0 z-50 text-center">
          <span className="bg-black/50 text-white px-4 py-1 rounded-full text-xs font-mono">
            Scroll Progress: {(progress * 100).toFixed(0)}%
          </span>
        </div>

        {/* NARRATIVE TEXT */}
        <div className="absolute top-24 left-0 right-0 text-center z-40 transition-opacity duration-500">
          <h3
            className="text-3xl font-bold text-white transition-all duration-500"
            style={{
              opacity: progress < 0.2 ? 1 : 0.2,
              transform: `translateY(${progress < 0.2 ? 0 : -20}px)`,
            }}
          >
            1. Observe the Average
          </h3>
          <h3
            className="text-3xl font-bold text-blue-400 absolute top-0 left-0 right-0 transition-all duration-500"
            style={{
              opacity: progress >= 0.2 && progress < 0.5 ? 1 : 0,
              transform: `translateY(${progress >= 0.2 && progress < 0.5 ? 0 : 20}px)`,
            }}
          >
            2. Reveal the Variation
          </h3>
          <h3
            className="text-3xl font-bold text-purple-400 absolute top-0 left-0 right-0 transition-all duration-500"
            style={{
              opacity: progress >= 0.5 ? 1 : 0,
              transform: `translateY(${progress >= 0.5 ? 0 : 20}px)`,
            }}
          >
            3. Diagnose the Instability
          </h3>
        </div>

        {/* VISUALIZATION AREA */}
        <div className="relative w-full max-w-4xl h-96 flex items-end justify-center px-12 gap-16">
          {/* STATIC FACTORS (A & C) just to fade out */}
          <div
            className="w-24 h-full flex items-end justify-center transition-opacity duration-500"
            style={{ opacity: Math.max(0, 1 - progress * 4) }}
          >
            <div className="w-full h-[96%] bg-green-500 rounded-t-lg relative">
              <span className="absolute top-2 left-0 right-0 text-center text-white font-bold">
                96%
              </span>
            </div>
          </div>

          {/* HERO FACTOR (B) - THE TRANSFORMER */}
          <div className="w-full max-w-lg h-full relative border-b border-neutral-700">
            {/* 1. BAR CHART REPRESENTATION */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 bg-blue-500 rounded-t-lg transition-all duration-100"
              style={{
                height: '92%',
                opacity: barOpacity,
                transform: `translateX(-50%) scale(${1 + progress * 0.2})`,
              }}
            >
              <span className="absolute top-2 left-0 right-0 text-center text-white font-bold">
                92%
              </span>
            </div>

            {/* 2. BOXPLOT / DOTS REPRESENTATION */}
            <div
              className="absolute inset-0 transition-opacity duration-100"
              style={{ opacity: xrayOpacity }}
            >
              {/* Bounding Box / Limits */}
              <div className="absolute top-[10%] left-0 right-0 border-t border-dashed border-red-500/30 flex justify-end">
                <span className="text-xs text-red-500/50">UCL</span>
              </div>
              <div className="absolute bottom-[10%] left-0 right-0 border-t border-dashed border-red-500/30 flex justify-end">
                <span className="text-xs text-red-500/50">LCL</span>
              </div>

              {/* DOTS ANIMATION */}
              {dots.map(dot => (
                <div
                  key={dot.id}
                  className="absolute w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"
                  style={{
                    // LERP between Box position and I-Chart position
                    left: `${dot.boxX + (dot.iChartX - dot.boxX) * expansionProgress}%`,
                    bottom: `${dot.boxY + (dot.iChartY - dot.boxY) * expansionProgress}%`,
                    transition: 'none', // Driven by JS frame update (scroll) naturally
                  }}
                />
              ))}

              {/* CONNECTING LINES (Only appear in Stage 3) */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ opacity: expansionProgress }}
              >
                <polyline
                  points={dots
                    .map((d, i) => {
                      const x = d.boxX + (d.iChartX - d.boxX) * expansionProgress;
                      const y = d.boxY + (d.iChartY - d.boxY) * expansionProgress;
                      // Convert % to ~pixels for SVG or use percent in points if viewBox set?
                      // Simpler to map 0-100% to viewBox 0-100 0-100
                      return `${x},${100 - y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>

          <div
            className="w-24 h-full flex items-end justify-center transition-opacity duration-500"
            style={{ opacity: Math.max(0, 1 - progress * 4) }}
          >
            <div className="w-full h-[94%] bg-green-500 rounded-t-lg relative">
              <span className="absolute top-2 left-0 right-0 text-center text-white font-bold">
                94%
              </span>
            </div>
          </div>
        </div>

        {/* STAGE INDICATORS */}
        <div className="absolute bottom-12 flex gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                (progress < 0.2 && i === 0) ||
                (progress >= 0.2 && progress < 0.5 && i === 1) ||
                (progress >= 0.5 && i === 2)
                  ? 'w-12 bg-white'
                  : 'w-4 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

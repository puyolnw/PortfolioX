import { useEffect, useMemo, useState } from 'react';

const FpsMeter = () => {
  const [fps, setFps] = useState(0);

  const showMeter = useMemo(() => {
    if (import.meta.env.DEV) return true;
    const params = new URLSearchParams(window.location.search);
    return params.get('fps') === '1';
  }, []);

  useEffect(() => {
    if (!showMeter) return;

    let frameCount = 0;
    let rafId = 0;
    let lastTick = performance.now();

    const loop = (now: number) => {
      frameCount += 1;
      const elapsed = now - lastTick;

      if (elapsed >= 300) {
        const nextFps = Math.round((frameCount * 1000) / elapsed);
        setFps(nextFps);
        frameCount = 0;
        lastTick = now;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, [showMeter]);

  if (!showMeter) return null;

  const isGood = fps >= 50;
  const isMid = fps >= 30 && fps < 50;

  return (
    <div className="fixed top-3 right-3 z-[10000] pointer-events-none">
      <div className="px-3 py-2 rounded-lg border border-white/20 bg-black/70 text-white shadow-lg backdrop-blur-sm">
        <div className="text-[10px] uppercase tracking-wider text-white/60">FPS</div>
        <div
          className={`text-lg font-display leading-none ${
            isGood ? 'text-green-400' : isMid ? 'text-yellow-400' : 'text-red-400'
          }`}
        >
          {fps}
        </div>
      </div>
    </div>
  );
};

export default FpsMeter;

import gsap from 'gsap';
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { trackIntroImpression } from '../lib/analytics';

const ROWS = 7;
const BRAND = 'KITTIPHAT';

type KIntroOverlayProps = {
  /** Fires after intro ends (morph finished, or ~900ms pause if no morph target) */
  onComplete?: () => void;
  showDebug?: boolean;
  variant?: 'overlay' | 'page';
  /** Hero (or other) element to FLIP-morph into; overlay + ref = morph, else timed onComplete */
  morphTargetRef?: RefObject<HTMLElement | null>;
  /** Right before measuring hero target; use to reveal main content under the intro */
  onMorphStart?: () => void;
};

const KIntroOverlay = ({
  onComplete,
  showDebug = false,
  variant = 'overlay',
  morphTargetRef,
  onMorphStart,
}: KIntroOverlayProps) => {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const onMorphStartRef = useRef(onMorphStart);
  onMorphStartRef.current = onMorphStart;

  const brandRef = useRef<HTMLSpanElement>(null);
  const morphStartedRef = useRef(false);

  const [cols, setCols] = useState(18);
  const centerRow = Math.floor(ROWS / 2);
  const [fontSizePx, setFontSizePx] = useState(92);
  const [brandStartCol, setBrandStartCol] = useState(0);
  const [revealCount, setRevealCount] = useState(0);
  const [phase, setPhase] = useState<'reveal' | 'erase' | 'done'>('reveal');
  const [eraseDepth, setEraseDepth] = useState(0);
  const [gridHidden, setGridHidden] = useState(false);

  useEffect(() => {
    trackIntroImpression(variant);
  }, [variant]);

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const heightDrivenSize = Math.floor(height / (ROWS * 0.95));
      const widthDrivenSizeForBrand = Math.floor((width * 0.9) / (BRAND.length * 0.68));
      const nextSize = Math.max(34, Math.min(190, Math.floor(Math.min(heightDrivenSize * 1.12, widthDrivenSizeForBrand))));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const fontFamily = 'Montserrat, Kanit, sans-serif';
      const fontWeight = 900;
      let kWidth = nextSize * 0.62;
      let brandWidth = nextSize * BRAND.length * 0.62;
      if (ctx) {
        ctx.font = `${fontWeight} ${nextSize}px ${fontFamily}`;
        kWidth = Math.max(1, ctx.measureText('K').width);
        brandWidth = Math.max(kWidth * BRAND.length, ctx.measureText(BRAND).width);
      }

      let nextCols = Math.max(10, Math.ceil(width / kWidth) + 1);
      if (nextCols < BRAND.length + 2) nextCols = BRAND.length + 2;

      const centerXInRow = (nextCols * kWidth) / 2;
      const startByPixel = Math.round((centerXInRow - brandWidth / 2) / kWidth);
      const nextStart = Math.max(0, Math.min(nextCols - BRAND.length, startByPixel));

      setFontSizePx(nextSize);
      setCols(nextCols);
      setBrandStartCol(nextStart);
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  useEffect(() => {
    const totalCells = ROWS * cols;
    setRevealCount(0);
    setPhase('reveal');
    setEraseDepth(0);
    setGridHidden(false);
    morphStartedRef.current = false;
    const interval = setInterval(() => {
      setRevealCount((prev) => {
        if (prev >= totalCells) {
          clearInterval(interval);
          setPhase('erase');
          return prev;
        }
        return prev + 1;
      });
    }, 12);
    return () => clearInterval(interval);
  }, [cols]);

  useEffect(() => {
    if (phase !== 'erase') return;
    const maxDepth = Math.floor(ROWS / 2);
    const interval = setInterval(() => {
      setEraseDepth((prev) => {
        const next = prev + 1;
        if (next >= maxDepth) {
          clearInterval(interval);
          setPhase('done');
          return maxDepth;
        }
        return next;
      });
    }, 160);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'done') return;
    if (morphStartedRef.current) return;

    const useMorph = variant === 'overlay' && !!morphTargetRef;
    const pauseMs = useMorph ? 380 : 900;

    let cancelled = false;
    let flyTween: gsap.core.Tween | null = null;

    const timer = window.setTimeout(() => {
      if (cancelled) return;
      if (!useMorph) {
        morphStartedRef.current = true;
        onCompleteRef.current?.();
        return;
      }

      const brand = brandRef.current;
      const target = morphTargetRef?.current;
      if (!brand || !target) {
        morphStartedRef.current = true;
        onCompleteRef.current?.();
        return;
      }

      const from = brand.getBoundingClientRect();
      onMorphStartRef.current?.();

      const runMorph = () => {
        if (cancelled) return;
        const tEl = morphTargetRef?.current;
        if (!tEl) {
          morphStartedRef.current = true;
          onCompleteRef.current?.();
          return;
        }

        const h1 = tEl.querySelector('h1');
        const to = tEl.getBoundingClientRect();
        if (to.width < 2 || to.height < 2) {
          morphStartedRef.current = true;
          setGridHidden(true);
          onCompleteRef.current?.();
          return;
        }

        const innerBrand = brand.querySelector('span');
        const csBrand = window.getComputedStyle(innerBrand ?? brand);
        const startFont = csBrand.fontSize || `${fontSizePx}px`;
        const endCs = h1 ? window.getComputedStyle(h1) : window.getComputedStyle(tEl);
        const endFont = endCs.fontSize;
        const endColor = endCs.color;

        setGridHidden(true);
        morphStartedRef.current = true;

        const fly = document.createElement('div');
        fly.textContent = BRAND;
        fly.setAttribute('aria-hidden', 'true');
        Object.assign(fly.style, {
          position: 'fixed',
          zIndex: '20000',
          left: `${from.left}px`,
          top: `${from.top}px`,
          width: `${from.width}px`,
          height: `${from.height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Montserrat', 'Kanit', sans-serif",
          fontWeight: '900',
          letterSpacing: '-0.02em',
          lineHeight: '0.9',
          color: csBrand.color || '#ffffff',
          pointerEvents: 'none',
          fontSize: startFont,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        });
        document.body.appendChild(fly);

        flyTween = gsap.to(fly, {
          left: to.left,
          top: to.top,
          width: to.width,
          height: to.height,
          fontSize: endFont,
          color: endColor,
          duration: 0.88,
          ease: 'power3.inOut',
          onComplete: () => {
            if (!cancelled) fly.remove();
            onCompleteRef.current?.();
          },
        });
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(runMorph);
      });
    }, pauseMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      flyTween?.kill();
    };
  }, [phase, variant, morphTargetRef, fontSizePx]);

  const getSnakeIndex = (rowIndex: number, colIndex: number) => {
    if (rowIndex % 2 === 0) return rowIndex * cols + colIndex;
    return rowIndex * cols + (cols - 1 - colIndex);
  };

  const renderRow = (rowIndex: number) => {
    const nodes: ReactNode[] = [];
    let colIndex = 0;
    while (colIndex < cols) {
      if (rowIndex === centerRow && colIndex === brandStartCol) {
        nodes.push(
          <span key={`brand-wrap-${rowIndex}`} ref={brandRef} className="inline text-white">
            {BRAND.split('').map((_, bi) => {
              const c = brandStartCol + bi;
              const snakeIndex = getSnakeIndex(rowIndex, c);
              const isVisible = snakeIndex < revealCount;
              const removedByTopBottom = rowIndex < eraseDepth || rowIndex >= ROWS - eraseDepth;
              const shouldShow = phase === 'done' ? true : isVisible && !removedByTopBottom;
              const ch = BRAND[bi];
              return (
                <span key={bi} className={!shouldShow ? 'text-black' : 'text-white'}>
                  {ch}
                </span>
              );
            })}
          </span>
        );
        colIndex += BRAND.length;
        continue;
      }

      const snakeIndex = getSnakeIndex(rowIndex, colIndex);
      const isVisible = snakeIndex < revealCount;
      const removedByTopBottom = rowIndex < eraseDepth || rowIndex >= ROWS - eraseDepth;
      const shouldShow = phase === 'done' ? false : isVisible && !removedByTopBottom;
      const colorClass = !shouldShow ? 'text-black' : 'text-red-500';

      nodes.push(
        <span key={`${rowIndex}-${colIndex}`} className={colorClass}>
          K
        </span>
      );
      colIndex += 1;
    }
    return nodes;
  };

  const outerClass =
    variant === 'overlay'
      ? `fixed inset-0 z-[12000] flex items-center justify-center px-0 py-0 overflow-hidden transition-colors duration-300 ${
          gridHidden ? 'bg-transparent pointer-events-none' : 'bg-black'
        } text-red-500`
      : 'h-screen w-full bg-black text-red-500 flex items-center justify-center px-0 py-0 overflow-hidden';

  return (
    <div className={outerClass}>
      <div
        className={`w-full h-full flex flex-col justify-center gap-[0.15vh] select-none transition-opacity duration-200 ${
          gridHidden ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {Array.from({ length: ROWS }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="w-full text-center font-display font-black leading-[0.9] tracking-[-0.02em]"
            style={{ fontSize: `${fontSizePx}px` }}
          >
            {renderRow(rowIndex)}
          </div>
        ))}
      </div>

      {showDebug && (
        <div className="fixed left-3 bottom-3 z-10 text-[11px] font-mono text-white/65 bg-black/65 border border-white/20 rounded-md px-2 py-1">
          center word: row {centerRow + 1}, col {brandStartCol + 1}-{brandStartCol + BRAND.length}
        </div>
      )}
    </div>
  );
};

export default KIntroOverlay;

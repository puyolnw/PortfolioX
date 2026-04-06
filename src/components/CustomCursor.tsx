import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const rippleLayerRef = useRef<HTMLDivElement>(null);
  const trailLayerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const visibleRef = useRef(false);
  const isMouseDownRef = useRef(false);
  const lastTrailSpawnRef = useRef(0);
  const isSuppressedRef = useRef(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSuppressed, setIsSuppressed] = useState(false);

  useEffect(() => {
    // Check if touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    const xSetter = gsap.quickSetter(cursor, "x", "px");
    const ySetter = gsap.quickSetter(cursor, "y", "px");
    const xDotSetter = gsap.quickSetter(cursorDot, "x", "px");
    const yDotSetter = gsap.quickSetter(cursorDot, "y", "px");

    const spawnRipple = (x: number, y: number) => {
      const layer = rippleLayerRef.current;
      if (!layer) return;

      const ripple = document.createElement('div');
      ripple.style.position = 'fixed';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = '24px';
      ripple.style.height = '24px';
      ripple.style.border = '2px solid rgba(255, 82, 82, 0.95)';
      ripple.style.borderRadius = '9999px';
      ripple.style.pointerEvents = 'none';
      ripple.style.transform = 'translate(-50%, -50%) scale(0.35)';
      ripple.style.opacity = '1';
      ripple.style.boxShadow = '0 0 0 2px rgba(229, 57, 53, 0.18), 0 0 16px rgba(229, 57, 53, 0.35)';
      ripple.style.willChange = 'transform, opacity';
      layer.appendChild(ripple);

      gsap.to(ripple, {
        scale: 3.9,
        opacity: 0,
        duration: 0.58,
        ease: 'power2.out',
        onComplete: () => ripple.remove(),
      });
    };

    const spawnTrailParticle = (x: number, y: number) => {
      const layer = trailLayerRef.current;
      if (!layer) return;

      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = '8px';
      particle.style.height = '8px';
      particle.style.borderRadius = '9999px';
      particle.style.background = 'rgba(255, 82, 82, 0.9)';
      particle.style.boxShadow = '0 0 10px rgba(229, 57, 53, 0.55)';
      particle.style.pointerEvents = 'none';
      particle.style.transform = 'translate(-50%, -50%)';
      particle.style.willChange = 'transform, opacity';
      layer.appendChild(particle);

      const driftX = (Math.random() - 0.5) * 24;
      const driftY = -14 - Math.random() * 18;
      gsap.to(particle, {
        x: driftX,
        y: driftY,
        opacity: 0,
        scale: 0.25,
        duration: 0.65,
        ease: 'power1.out',
        onComplete: () => particle.remove(),
      });
    };

    const renderCursor = () => {
      rafRef.current = null;
      xSetter(pointerRef.current.x);
      ySetter(pointerRef.current.y);
      xDotSetter(pointerRef.current.x);
      yDotSetter(pointerRef.current.y);
    };

    const moveCursor = (e: MouseEvent | PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('iframe, [data-native-cursor]')) {
        if (!isSuppressedRef.current) {
          isSuppressedRef.current = true;
          setIsSuppressed(true);
        }
        return;
      }
      if (isSuppressedRef.current) {
        isSuppressedRef.current = false;
        setIsSuppressed(false);
      }

      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(renderCursor);
      }

      const now = performance.now();
      const spawnInterval = isMouseDownRef.current ? 20 : 28;
      if (now - lastTrailSpawnRef.current > spawnInterval) {
        lastTrailSpawnRef.current = now;
        spawnTrailParticle(e.clientX, e.clientY);
        if (Math.random() > (isMouseDownRef.current ? 0.35 : 0.6)) {
          spawnTrailParticle(e.clientX + (Math.random() - 0.5) * 8, e.clientY + (Math.random() - 0.5) * 8);
        }
      }
    };

    const handleMouseEnter = () => {
      visibleRef.current = true;
      setIsVisible(true);
    };
    const handleMouseLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
      isSuppressedRef.current = false;
      setIsSuppressed(false);
    };
    const handlePointerOver = (event: MouseEvent | PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const isOverIframe = Boolean(target?.closest('iframe, [data-native-cursor]'));
      isSuppressedRef.current = isOverIframe;
      setIsSuppressed(isOverIframe);
      setIsHovering(Boolean(target?.closest('a, button, [data-cursor-hover]')));
    };
    const handleMouseDown = (event: MouseEvent | PointerEvent) => {
      isMouseDownRef.current = true;
      spawnRipple(event.clientX, event.clientY);
    };
    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    // Capture phase keeps cursor updates reliable even with heavy overlays.
    window.addEventListener('pointermove', moveCursor, true);
    window.addEventListener('mousemove', moveCursor, true);
    window.addEventListener('pointerdown', handleMouseDown, true);
    window.addEventListener('mousedown', handleMouseDown, true);
    window.addEventListener('pointerup', handleMouseUp, true);
    window.addEventListener('mouseup', handleMouseUp, true);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handlePointerOver, { passive: true });

    return () => {
      window.removeEventListener('pointermove', moveCursor, true);
      window.removeEventListener('mousemove', moveCursor, true);
      window.removeEventListener('pointerdown', handleMouseDown, true);
      window.removeEventListener('mousedown', handleMouseDown, true);
      window.removeEventListener('pointerup', handleMouseUp, true);
      window.removeEventListener('mouseup', handleMouseUp, true);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handlePointerOver);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <div ref={rippleLayerRef} className="fixed inset-0 pointer-events-none z-[20010]" />
      <div ref={trailLayerRef} className="fixed inset-0 pointer-events-none z-[20020]" />

      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[20030] transition-opacity duration-200 ${
          isVisible && !isSuppressed ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div
          className={`rounded-full border border-pink/80 transition-all duration-150 ease-custom-expo ${
            isHovering ? 'w-14 h-14 bg-pink/15' : 'w-[42px] h-[42px]'
          }`}
        />
      </div>
      
      {/* Center dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[20040] transition-opacity duration-200 ${
          isVisible && !isSuppressed ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div className="w-2.5 h-2.5 bg-pink rounded-full" />
      </div>
    </>
  );
};

export default CustomCursor;

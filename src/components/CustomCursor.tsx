import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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

    const moveCursor = (e: MouseEvent) => {
      // Stop cursor updates if modal is open to save CPU/GPU
      if (document.body.classList.contains('modal-open')) return;

      setIsVisible(true);
      
      xSetter(e.clientX);
      ySetter(e.clientY);
      xDotSetter(e.clientX);
      yDotSetter(e.clientY);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Add hover detection for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]');
    
    const handleElementEnter = () => setIsHovering(true);
    const handleElementLeave = () => setIsHovering(false);

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleElementEnter);
      el.addEventListener('mouseleave', handleElementLeave);
    });

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleElementEnter);
        el.removeEventListener('mouseleave', handleElementLeave);
      });
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference transition-opacity duration-300 [.modal-open_&]:opacity-0 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div
          className={`rounded-full border-2 border-pink transition-all duration-200 ease-custom-expo ${
            isHovering ? 'w-16 h-16 bg-pink/20' : 'w-10 h-10'
          }`}
        />
      </div>
      
      {/* Center dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-300 [.modal-open_&]:opacity-0 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div className="w-1 h-1 bg-pink rounded-full" />
      </div>
    </>
  );
};

export default CustomCursor;

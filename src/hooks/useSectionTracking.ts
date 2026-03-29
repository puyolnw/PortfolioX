import { useEffect, useRef } from 'react';
import { trackSectionView, trackSectionEngagement } from '../lib/analytics';

/**
 * Hook to track section views and engagement time using IntersectionObserver.
 */
export const useSectionTracking = (sectionName: string) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasTrackedViewRef = useRef<boolean>(false);

  useEffect(() => {
    const observerOptions = {
      root: null, // Viewport
      rootMargin: '-20% 0px -20% 0px', // Trigger when 60% of section is visible (centered)
      threshold: 0.1, // Trigger when at least 10% is visible
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Section Entered View
          if (!hasTrackedViewRef.current) {
            trackSectionView(sectionName);
            hasTrackedViewRef.current = true;
          }
          
          if (startTimeRef.current === null) {
            startTimeRef.current = Date.now();
          }
        } else {
          // Section Left View
          if (startTimeRef.current !== null) {
            const duration = Date.now() - startTimeRef.current;
            // Only track if they stayed for more than 1 second to filtering out quick scrolls
            if (duration > 1000) {
              trackSectionEngagement(sectionName, duration);
            }
            startTimeRef.current = null;
            hasTrackedViewRef.current = false; // Allow re-tracking if they come back
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      // Cleanup: Final engagement track if still on screen
      if (startTimeRef.current !== null) {
        const duration = Date.now() - startTimeRef.current;
        if (duration > 1000) {
          trackSectionEngagement(sectionName, duration);
        }
      }
      observer.disconnect();
    };
  }, [sectionName]);

  return sectionRef;
};

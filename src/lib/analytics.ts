/**
 * Google Analytics 4 (GA4) Utility Functions
 * These helpers make it easier to send consistent events to gtag.
 */

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'set' | 'js',
      action: string,
      params?: Record<string, any>
    ) => void;
  }
}

export const GA_TRACKING_ID = 'G-HTG6FM7SX3';

/**
 * Send a generic event to Google Analytics
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  params?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...params,
    });
  }
};

/**
 * Track when a user views a specific section
 */
export const trackSectionView = (sectionName: string) => {
  trackEvent('view_section', 'engagement', sectionName, undefined, {
    section_name: sectionName,
  });
};

/**
 * Track how long a user spends on a section
 */
export const trackSectionEngagement = (sectionName: string, durationMs: number) => {
  // Duration in seconds for better readability in GA
  const durationSec = Math.round(durationMs / 1000);
  
  trackEvent('section_engagement', 'engagement', sectionName, durationSec, {
    section_name: sectionName,
    engagement_time_msec: durationMs,
    engagement_time_sec: durationSec,
  });
};

/**
 * Track button or link clicks
 */
export const trackClick = (label: string, location: string) => {
  trackEvent('button_click', 'interaction', label, undefined, {
    click_location: location,
    button_name: label,
  });
};

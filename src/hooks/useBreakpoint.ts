import { useState, useEffect } from 'react';

// Breakpoint definitions matching the project's design tokens
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export interface BreakpointState {
  current: Breakpoint | 'xs'; // xs for below sm
  isAbove: (breakpoint: Breakpoint) => boolean;
  isBelow: (breakpoint: Breakpoint) => boolean;
  isExactly: (breakpoint: Breakpoint | 'xs') => boolean;
  isBetween: (min: Breakpoint | 'xs', max: Breakpoint) => boolean;
  width: number;
}

/**
 * React hook for responsive breakpoint detection
 * 
 * @example
 * ```tsx
 * const { current, isAbove, isBelow, width } = useBreakpoint();
 * 
 * // Check current breakpoint
 * if (current === 'lg') {
 *   // Desktop layout
 * }
 * 
 * // Check if above/below certain breakpoints
 * const isMobile = isBelow('md');
 * const isDesktop = isAbove('lg');
 * 
 * // Conditional rendering
 * return (
 *   <div>
 *     {isAbove('md') ? <DesktopNav /> : <MobileNav />}
 *     <span>Current width: {width}px</span>
 *   </div>
 * );
 * ```
 */
export const useBreakpoint = (): BreakpointState => {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Set initial value
    handleResize();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine current breakpoint
  const getCurrentBreakpoint = (width: number): Breakpoint | 'xs' => {
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  const current = getCurrentBreakpoint(windowWidth);

  // Helper functions
  const isAbove = (breakpoint: Breakpoint): boolean => {
    return windowWidth >= breakpoints[breakpoint];
  };

  const isBelow = (breakpoint: Breakpoint): boolean => {
    return windowWidth < breakpoints[breakpoint];
  };

  const isExactly = (breakpoint: Breakpoint | 'xs'): boolean => {
    return current === breakpoint;
  };

  const isBetween = (min: Breakpoint | 'xs', max: Breakpoint): boolean => {
    const minWidth = min === 'xs' ? 0 : breakpoints[min];
    const maxWidth = breakpoints[max];
    return windowWidth >= minWidth && windowWidth < maxWidth;
  };

  return {
    current,
    isAbove,
    isBelow,
    isExactly,
    isBetween,
    width: windowWidth,
  };
};

/**
 * Hook for server-side rendering safe breakpoint detection
 * Returns default values on server, actual values on client
 */
export const useBreakpointSSR = (defaultBreakpoint: Breakpoint | 'xs' = 'lg'): BreakpointState => {
  const [hasMounted, setHasMounted] = useState(false);
  const breakpointState = useBreakpoint();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // Return default values for SSR
    const defaultWidth = defaultBreakpoint === 'xs' ? 0 : breakpoints[defaultBreakpoint as Breakpoint];
    
    return {
      current: defaultBreakpoint,
      isAbove: (bp: Breakpoint) => defaultWidth >= breakpoints[bp],
      isBelow: (bp: Breakpoint) => defaultWidth < breakpoints[bp],
      isExactly: (bp: Breakpoint | 'xs') => bp === defaultBreakpoint,
      isBetween: (min: Breakpoint | 'xs', max: Breakpoint) => {
        const minWidth = min === 'xs' ? 0 : breakpoints[min];
        return defaultWidth >= minWidth && defaultWidth < breakpoints[max];
      },
      width: defaultWidth,
    };
  }

  return breakpointState;
};

/**
 * Utility functions for breakpoint comparisons (can be used outside React)
 */
export const breakpointUtils = {
  /**
   * Get current breakpoint for a given width
   */
  getBreakpoint: (width: number): Breakpoint | 'xs' => {
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  },

  /**
   * Check if width is above a breakpoint
   */
  isAbove: (width: number, breakpoint: Breakpoint): boolean => {
    return width >= breakpoints[breakpoint];
  },

  /**
   * Check if width is below a breakpoint
   */
  isBelow: (width: number, breakpoint: Breakpoint): boolean => {
    return width < breakpoints[breakpoint];
  },

  /**
   * Generate media query string for a breakpoint
   */
  mediaQuery: (breakpoint: Breakpoint, type: 'min' | 'max' = 'min'): string => {
    const width = breakpoints[breakpoint];
    return type === 'min' 
      ? `(min-width: ${width}px)`
      : `(max-width: ${width - 1}px)`;
  },
};

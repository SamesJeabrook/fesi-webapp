/**
 * Example usage of the breakpoint utilities
 * This file shows various ways to use the responsive utilities
 */

import React from 'react';
import { 
  useBreakpoint, 
  useBreakpointSSR, 
  Show, 
  Hide, 
  Responsive,
  breakpointUtils 
} from '../utils/responsive';

// Example 1: Using the hook directly
export const ResponsiveComponent: React.FC = () => {
  const { current, isAbove, isBelow, width } = useBreakpoint();

  return (
    <div>
      <h2>Current Breakpoint Info</h2>
      <p>Current breakpoint: {current}</p>
      <p>Window width: {width}px</p>
      <p>Is mobile: {isBelow('md') ? 'Yes' : 'No'}</p>
      <p>Is desktop: {isAbove('lg') ? 'Yes' : 'No'}</p>
      
      {/* Conditional rendering based on breakpoint */}
      {isAbove('lg') && (
        <div>This content only shows on desktop (lg and above)</div>
      )}
    </div>
  );
};

// Example 2: Using Show/Hide components
export const ConditionalContent: React.FC = () => {
  return (
    <div>
      {/* Show different navigation based on screen size */}
      <Show above="lg">
        <nav>Desktop Navigation with all menu items</nav>
      </Show>
      
      <Show below="lg">
        <button>Mobile hamburger menu</button>
      </Show>
      
      {/* Hide complex components on mobile */}
      <Hide below="md">
        <table>
          <thead>
            <tr>
              <th>Complex table that's hidden on mobile</th>
            </tr>
          </thead>
        </table>
      </Hide>
      
      {/* Show only at specific breakpoint */}
      <Show only="md">
        <div>This only appears on tablet (md breakpoint)</div>
      </Show>
      
      {/* Show between breakpoints */}
      <Show between={['sm', 'xl']}>
        <div>Visible from small tablets to large desktop</div>
      </Show>
    </div>
  );
};

// Example 3: Using Responsive component with predefined breakpoints
export const ResponsiveLayout: React.FC = () => {
  return (
    <div>
      <Responsive>
        <Responsive.Mobile>
          <div>Mobile Layout (below md)</div>
        </Responsive.Mobile>
        
        <Responsive.Tablet>
          <div>Tablet Layout (md to lg)</div>
        </Responsive.Tablet>
        
        <Responsive.Desktop>
          <div>Desktop Layout (lg and above)</div>
        </Responsive.Desktop>
        
        <Responsive.Large>
          <div>Large Desktop Features (xl and above)</div>
        </Responsive.Large>
      </Responsive>
    </div>
  );
};

// Example 4: Using with Grid component
export const ResponsiveGrid: React.FC = () => {
  const { isAbove } = useBreakpoint();
  
  return (
    <div>
      {/* Adjust grid columns based on breakpoint */}
      <div className="grid-container">
        <div 
          className={`grid-item ${
            isAbove('lg') ? 'lg-4' : isAbove('md') ? 'md-6' : 'sm-12'
          }`}
        >
          Responsive grid item
        </div>
      </div>
      
      {/* Or use conditional rendering for completely different layouts */}
      {isAbove('lg') ? (
        <div>Complex desktop grid with many columns</div>
      ) : (
        <div>Simple mobile stacked layout</div>
      )}
    </div>
  );
};

// Example 5: Using utility functions outside React
export const getResponsiveImageSize = (width: number): string => {
  const breakpoint = breakpointUtils.getBreakpoint(width);
  
  switch (breakpoint) {
    case 'xs':
    case 'sm':
      return 'small';
    case 'md':
      return 'medium';
    case 'lg':
    case 'xl':
    case '2xl':
      return 'large';
    default:
      return 'medium';
  }
};

// Example 6: SSR-safe component
export const SSRSafeComponent: React.FC = () => {
  // This won't cause hydration mismatches
  const { isAbove } = useBreakpointSSR('lg'); // Default to desktop on server
  
  return (
    <div>
      {isAbove('md') ? (
        <div>Server-safe desktop content</div>
      ) : (
        <div>Server-safe mobile content</div>
      )}
    </div>
  );
};

// Example 7: Creating media queries programmatically
export const generateMediaQueries = () => {
  const queries = {
    mobile: breakpointUtils.mediaQuery('md', 'max'), // (max-width: 767px)
    tablet: breakpointUtils.mediaQuery('md', 'min'), // (min-width: 768px)
    desktop: breakpointUtils.mediaQuery('lg', 'min'), // (min-width: 1024px)
  };
  
  console.log('Generated media queries:', queries);
  return queries;
};

// Example 8: Custom hook for specific use cases
export const useIsMobile = () => {
  const { isBelow } = useBreakpoint();
  return isBelow('md');
};

export const useIsDesktop = () => {
  const { isAbove } = useBreakpoint();
  return isAbove('lg');
};

// Example 9: Responsive component that adapts Grid usage
interface ResponsiveCardGridProps {
  children: React.ReactNode;
}

export const ResponsiveCardGrid: React.FC<ResponsiveCardGridProps> = ({ children }) => {
  const { current } = useBreakpoint();
  
  // Determine columns based on breakpoint
  const getColumnClass = () => {
    switch (current) {
      case 'xs':
      case 'sm':
        return 'sm-16'; // Full width on mobile
      case 'md':
        return 'md-8'; // Half width on tablet
      case 'lg':
        return 'lg-5'; // ~3 columns on desktop
      case 'xl':
      case '2xl':
        return 'xl-4'; // 4 columns on large screens
      default:
        return 'sm-16';
    }
  };
  
  return (
    <div className="grid-container gap-md">
      {React.Children.map(children, (child) => (
        <div className={`grid-item ${getColumnClass()}`}>
          {child}
        </div>
      ))}
    </div>
  );
};

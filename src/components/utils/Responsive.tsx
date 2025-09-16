import React from 'react';
import { useBreakpoint, type Breakpoint } from '../../hooks/useBreakpoint';

interface ResponsiveProps {
  children: React.ReactNode;
}

interface ShowProps extends ResponsiveProps {
  above?: Breakpoint;
  below?: Breakpoint;
  only?: Breakpoint | 'xs';
  between?: [Breakpoint | 'xs', Breakpoint];
}

interface HideProps extends ResponsiveProps {
  above?: Breakpoint;
  below?: Breakpoint;
  only?: Breakpoint | 'xs';
  between?: [Breakpoint | 'xs', Breakpoint];
}

/**
 * Component for showing content at specific breakpoints
 * 
 * @example
 * ```tsx
 * // Show only on desktop
 * <Show above="lg">
 *   <DesktopNav />
 * </Show>
 * 
 * // Show only on mobile
 * <Show below="md">
 *   <MobileNav />
 * </Show>
 * 
 * // Show only at tablet size
 * <Show only="md">
 *   <TabletLayout />
 * </Show>
 * 
 * // Show between sm and lg
 * <Show between={['sm', 'lg']}>
 *   <TabletAndMobileLayout />
 * </Show>
 * ```
 */
export const Show: React.FC<ShowProps> = ({ 
  children, 
  above, 
  below, 
  only, 
  between 
}) => {
  const { isAbove, isBelow, isExactly, isBetween } = useBreakpoint();

  let shouldShow = false;

  if (above) {
    shouldShow = isAbove(above);
  } else if (below) {
    shouldShow = isBelow(below);
  } else if (only) {
    shouldShow = isExactly(only);
  } else if (between) {
    shouldShow = isBetween(between[0], between[1]);
  } else {
    // If no props specified, always show
    shouldShow = true;
  }

  return shouldShow ? <>{children}</> : null;
};

/**
 * Component for hiding content at specific breakpoints
 * 
 * @example
 * ```tsx
 * // Hide on mobile
 * <Hide below="md">
 *   <ComplexTable />
 * </Hide>
 * 
 * // Hide on desktop
 * <Hide above="lg">
 *   <MobileOnlyFeature />
 * </Hide>
 * ```
 */
export const Hide: React.FC<HideProps> = ({ 
  children, 
  above, 
  below, 
  only, 
  between 
}) => {
  const { isAbove, isBelow, isExactly, isBetween } = useBreakpoint();

  let shouldHide = false;

  if (above) {
    shouldHide = isAbove(above);
  } else if (below) {
    shouldHide = isBelow(below);
  } else if (only) {
    shouldHide = isExactly(only);
  } else if (between) {
    shouldHide = isBetween(between[0], between[1]);
  }

  return !shouldHide ? <>{children}</> : null;
};

/**
 * Component that renders different content for different breakpoints
 * 
 * @example
 * ```tsx
 * <Responsive>
 *   <Responsive.Mobile>
 *     <MobileLayout />
 *   </Responsive.Mobile>
 *   <Responsive.Tablet>
 *     <TabletLayout />
 *   </Responsive.Tablet>
 *   <Responsive.Desktop>
 *     <DesktopLayout />
 *   </Responsive.Desktop>
 * </Responsive>
 * ```
 */
export const Responsive: React.FC<ResponsiveProps> & {
  Mobile: React.FC<ResponsiveProps>;
  Tablet: React.FC<ResponsiveProps>;
  Desktop: React.FC<ResponsiveProps>;
  Large: React.FC<ResponsiveProps>;
} = ({ children }) => {
  return <>{children}</>;
};

// Sub-components for common breakpoint patterns
Responsive.Mobile = ({ children }: ResponsiveProps) => (
  <Show below="md">{children}</Show>
);

Responsive.Tablet = ({ children }: ResponsiveProps) => (
  <Show between={['md', 'lg']}>{children}</Show>
);

Responsive.Desktop = ({ children }: ResponsiveProps) => (
  <Show above="lg">{children}</Show>
);

Responsive.Large = ({ children }: ResponsiveProps) => (
  <Show above="xl">{children}</Show>
);

// Export all components
export { useBreakpoint } from '../../hooks/useBreakpoint';

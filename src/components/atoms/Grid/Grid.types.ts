export interface GridContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  justifyContent?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  direction?: 'row' | 'column';
  wrap?: boolean;
  'data-testid'?: string;
}

export interface GridItemProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  // Column spans for different breakpoints (1-16)
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
  // Offset columns for different breakpoints
  smOffset?: number;
  mdOffset?: number;
  lgOffset?: number;
  xlOffset?: number;
  '2xlOffset'?: number;
  // Order for flexbox ordering
  order?: number;
  // Self alignment
  alignSelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  'data-testid'?: string;
}

// Breakpoint definitions to match the project
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface GridSystemProps {
  breakpoints: {
    sm: string; // Large mobile/small tablet  
    md: string; // Tablet
    lg: string; // Desktop
    xl: string; // Large desktop
    '2xl': string; // Extra large desktop
  };
}

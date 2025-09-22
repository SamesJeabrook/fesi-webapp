import React from 'react';

// Available typography variants from the typography.scss file
export type TypographyVariant = 
  | 'heading-1'
  | 'heading-2' 
  | 'heading-3'
  | 'heading-4'
  | 'heading-5'
  | 'heading-6'
  | 'heading-7'
  | 'heading-8'
  | 'body-large'
  | 'body-medium'
  | 'body-small'
  | 'caption'
  | 'overline';

// Valid HTML element types for the `as` prop
export type TypographyElement = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6' 
  | 'p' 
  | 'span' 
  | 'div' 
  | 'label'
  | 'legend'
  | 'figcaption'
  | 'small'
  | 'strong'
  | 'em'
  | 'mark'
  | 'del'
  | 'ins'
  | 'sub'
  | 'sup';

export interface TypographyProps {
  /** Typography variant/style to apply */
  variant: TypographyVariant;
  /** HTML element to render as (defaults to 'p') */
  as?: TypographyElement;
  /** Content to render */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}

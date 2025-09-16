import React from 'react';
import classNames from 'classnames';
import type { GridContainerProps, GridItemProps } from './Grid.types';
import styles from './Grid.module.scss';

// Grid Container Component
export const GridContainer: React.FC<GridContainerProps> = ({
  children,
  className,
  style,
  gap = 'md',
  justifyContent = 'space-between',
  alignItems = 'stretch',
  direction = 'row',
  wrap = true,
  'data-testid': dataTestId,
  ...rest
}) => {
  const containerClasses = classNames(
    styles.gridContainer,
    styles[`gap-${gap}`],
    styles[`justify-${justifyContent}`],
    styles[`align-${alignItems}`],
    styles[`direction-${direction}`],
    {
      [styles.wrap]: wrap,
      [styles.noWrap]: !wrap,
    },
    className
  );

  return (
    <div 
      className={containerClasses} 
      style={style}
      data-testid={dataTestId}
      {...rest}
    >
      {children}
    </div>
  );
};

// Grid Item Component
export const GridItem: React.FC<GridItemProps> = ({
  children,
  className,
  style,
  sm,
  md,
  lg,
  xl,
  '2xl': xxl,
  smOffset,
  mdOffset,
  lgOffset,
  xlOffset,
  '2xlOffset': xxlOffset,
  order,
  alignSelf = 'auto',
  'data-testid': dataTestId,
  ...rest
}) => {
  const itemClasses = classNames(
    styles.gridItem,
    // Default to full width on mobile unless sm is specified
    !sm && !md && !lg && !xl && !xxl && styles['col-16'],
    // Column spans
    sm && styles[`sm-${sm}`],
    md && styles[`md-${md}`],
    lg && styles[`lg-${lg}`],
    xl && styles[`xl-${xl}`],
    xxl && styles[`xxl-${xxl}`],
    // Offsets
    smOffset && styles[`sm-offset-${smOffset}`],
    mdOffset && styles[`md-offset-${mdOffset}`],
    lgOffset && styles[`lg-offset-${lgOffset}`],
    xlOffset && styles[`xl-offset-${xlOffset}`],
    xxlOffset && styles[`xxl-offset-${xxlOffset}`],
    // Self alignment
    alignSelf !== 'auto' && styles[`align-self-${alignSelf}`],
    className
  );

  const itemStyle = {
    ...style,
    ...(order !== undefined ? { order } : {}),
  };

  return (
    <div 
      className={itemClasses}
      style={itemStyle}
      data-testid={dataTestId}
      {...rest}
    >
      {children}
    </div>
  );
};

// Export both components as default for convenience
export const Grid = {
  Container: GridContainer,
  Item: GridItem,
};

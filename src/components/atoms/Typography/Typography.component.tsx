import React from 'react';
import classNames from 'classnames';
import type { TypographyProps, TypographyElement } from './Typography.types';
import styles from './Typography.module.scss';

export const Typography: React.FC<TypographyProps> = ({
  variant,
  as = 'p',
  children,
  className,
  style,
  'data-testid': dataTestId,
  ...rest
}) => {
  // Combine the base typography class with the variant class
  const typographyClasses = classNames(
    styles.typography,
    styles[variant],
    className
  );

  // Create the component dynamically based on the `as` prop
  const Component = as as TypographyElement;

  return (
    <Component
      className={typographyClasses}
      style={style}
      data-testid={dataTestId}
      {...rest}
    >
      {children}
    </Component>
  );
};

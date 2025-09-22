import React from 'react';
import classNames from 'classnames';
import type { CardProps } from './Card.types';
import styles from './Card.module.scss';

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  interactive = false,
  className,
  onClick,
  'data-testid': dataTestId,
  ...rest
}) => {
  const cardClasses = classNames(
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    {
      [styles.hover]: hover,
      [styles.interactive]: interactive,
      [styles.clickable]: Boolean(onClick),
    },
    className
  );

  const handleClick = (event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    if (onClick) {
      if (CardElement === 'div') {
        onClick(event as React.MouseEvent<HTMLDivElement>);
      }
      // Optionally, handle 'button' case if needed
    }
  };

  const CardElement = onClick ? 'button' : 'div';

  return (
    <CardElement
      className={cardClasses}
      onClick={handleClick}
      data-testid={dataTestId}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      } : undefined}
      {...rest}
    >
      {children}
    </CardElement>
  );
};

Card.displayName = 'Card';

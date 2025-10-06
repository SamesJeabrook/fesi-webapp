import React from 'react';
import classNames from 'classnames';
import type { AdminBadgeProps } from './AdminBadge.types';
import styles from './AdminBadge.module.scss';

export const AdminBadge: React.FC<AdminBadgeProps> = ({
  children,
  variant = 'warning',
  className,
  'data-testid': dataTestId,
}) => {
  const badgeClasses = classNames(
    styles.adminBadge,
    styles[variant],
    className
  );

  return (
    <div className={badgeClasses} data-testid={dataTestId}>
      {children}
    </div>
  );
};
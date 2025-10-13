import React from 'react';
import styles from './Badge.module.scss';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'single' | 'multiple' | 'required' | 'optional' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '' 
}) => {
  return (
    <span 
      className={`${styles.badge} ${styles[`badge--${variant}`]} ${styles[`badge--${size}`]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
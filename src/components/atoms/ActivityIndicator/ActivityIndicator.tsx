import React from 'react';
import styles from './ActivityIndicator.module.scss';

export interface ActivityIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'primary' | 'white';
}

/**
 * ActivityIndicator Atom
 * A loading spinner for indicating activity or loading state
 */
export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  size = 'md',
  className = '',
  color = 'primary'
}) => {
  return (
    <div 
      className={`
        ${styles.spinner} 
        ${styles[`spinner--${size}`]} 
        ${styles[`spinner--${color}`]}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className={styles.spinner__visuallyHidden}>Loading...</span>
    </div>
  );
};

export default ActivityIndicator;

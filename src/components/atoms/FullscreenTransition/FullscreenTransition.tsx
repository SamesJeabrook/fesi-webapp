import React from 'react';
import styles from './FullscreenTransition.module.scss';
import type { FullscreenTransitionProps } from './FullscreenTransition.types';

const FullscreenTransition: React.FC<FullscreenTransitionProps> = ({ open, onClose, children, className }) => {
  return (
    <div
      className={[
        styles.fullscreenWrapper,
        open ? styles.open : styles.closed,
        className
      ].filter(Boolean).join(' ')}
      role="dialog"
      aria-modal="true"
    >
      {onClose && (
        <button
          className={styles.closeButton}
          aria-label="Close details"
          onClick={onClose}
        >
          &times;
        </button>
      )}
      {children}
    </div>
  );
};

export default FullscreenTransition;

'use client';

import React, { useState, useEffect } from 'react';
import { Typography } from '@/components/atoms';
import styles from './SessionTimer.module.scss';

export interface SessionTimerProps {
  startTime: string;
  showLabel?: boolean;
  className?: string;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({ 
  startTime, 
  showLabel = true,
  className = '' 
}) => {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    const updateElapsed = () => {
      const start = new Date(startTime).getTime();
      const now = Date.now();
      const diff = now - start;

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if (hours > 0) {
        setElapsed(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setElapsed(`${minutes}m ${seconds}s`);
      } else {
        setElapsed(`${seconds}s`);
      }
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className={`${styles.sessionTimer} ${className}`}>
      {showLabel && (
        <Typography variant="body-small" className={styles.label}>
          Seated:
        </Typography>
      )}
      <Typography variant="body-small" className={styles.time}>
        {elapsed}
      </Typography>
    </div>
  );
};

export default SessionTimer;

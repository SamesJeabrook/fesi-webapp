'use client';

import React, { useState } from 'react';
import classNames from 'classnames';
import { useTour } from '@/contexts/TourContext';
import { tours, TourId } from '@/config/tourSteps';
import type { HelpButtonProps } from './HelpButton.types';
import styles from './HelpButton.module.scss';

export const HelpButton: React.FC<HelpButtonProps> = ({
  className,
  'data-testid': dataTestId,
}) => {
  const { startTour, isTourActive, hasSeenTour } = useTour();
  const [showMenu, setShowMenu] = useState(false);

  const handleStartTour = (tourId: TourId) => {
    setShowMenu(false);
    startTour(tourId);
  };

  const handleToggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  // Hide button during active tour
  if (isTourActive) {
    return null;
  }

  return (
    <div className={classNames(styles.container, className)} data-testid={dataTestId}>
      {/* Tour Selection Menu */}
      {showMenu && (
        <div className={styles.menu}>
          <h3 className={styles.menuTitle}>Help & Tutorials</h3>

          <div className={styles.tourList}>
            {Object.entries(tours).map(([id, tour]) => (
              <button
                key={id}
                onClick={() => handleStartTour(id as TourId)}
                className={styles.tourButton}
                type="button"
              >
                <div className={styles.tourButtonContent}>
                  <div className={styles.tourInfo}>
                    <div className={styles.tourName}>{tour.name}</div>
                    <div className={styles.tourDescription}>{tour.description}</div>
                  </div>
                  {hasSeenTour(id as TourId) && (
                    <span className={styles.completedBadge}>✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleCloseMenu}
            className={styles.closeButton}
            type="button"
          >
            Close
          </button>
        </div>
      )}

      {/* Help Button */}
      <button
        onClick={handleToggleMenu}
        className={styles.helpButton}
        type="button"
        title="Help & Tutorials"
        aria-label="Toggle help menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={styles.icon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
          />
        </svg>
      </button>

      {/* Pulse animation for first-time users */}
      {!hasSeenTour('onboarding') && <span className={styles.pulse} />}
    </div>
  );
};

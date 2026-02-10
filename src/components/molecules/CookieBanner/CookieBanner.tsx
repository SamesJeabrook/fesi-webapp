'use client';

import React, { useState, useEffect } from 'react';
import styles from './CookieBanner.module.scss';

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className={styles.cookieBanner}>
      <div className={styles.content}>
        <p className={styles.message}>
          We use cookies for site functionality and analytics. By continuing, you agree to our use of cookies.{' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            Learn more
          </a>
        </p>
        <button onClick={handleAccept} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;

import React, { useState } from 'react';
import { Typography, Button } from '@/components/atoms';
import styles from './PostOrderSignupPrompt.module.scss';

export interface PostOrderSignupPromptProps {
  orderNumber: string;
  orderEmail: string;
  onSignup: () => void;
  onSkip: () => void;
  className?: string;
}

export const PostOrderSignupPrompt: React.FC<PostOrderSignupPromptProps> = ({
  orderNumber,
  orderEmail,
  onSignup,
  onSkip,
  className
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleSkip = () => {
    setIsVisible(false);
    onSkip();
  };

  if (!isVisible) return null;

  return (
    <div className={`${styles.promptContainer} ${className || ''}`}>
      <div className={styles.promptCard}>
        <div className={styles.promptIcon}>🎉</div>
        
        <Typography variant="heading-3" className={styles.promptTitle}>
          Order Confirmed!
        </Typography>
        
        <Typography variant="body-medium" className={styles.promptSubtitle}>
          Order #{orderNumber}
        </Typography>
        
        <div className={styles.promptContent}>
          <Typography variant="body-medium">
            Create an account to track this order and access:
          </Typography>
          
          <ul className={styles.benefitsList}>
            <li>
              <span className={styles.benefitIcon}>📦</span>
              <span>Order history & reordering</span>
            </li>
            <li>
              <span className={styles.benefitIcon}>⭐</span>
              <span>Loyalty points & rewards</span>
            </li>
            <li>
              <span className={styles.benefitIcon}>💳</span>
              <span>Saved payment methods</span>
            </li>
            <li>
              <span className={styles.benefitIcon}>🔔</span>
              <span>Order updates & notifications</span>
            </li>
          </ul>
          
          <Typography variant="body-small" className={styles.emailNote}>
            We'll use <strong>{orderEmail}</strong> for your account
          </Typography>
        </div>
        
        <div className={styles.promptActions}>
          <Button
            variant="primary"
            onClick={onSignup}
            fullWidth
          >
            Create Account
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleSkip}
            fullWidth
          >
            Continue as Guest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostOrderSignupPrompt;

import React from 'react';
import { useRouter } from 'next/router';
import styles from './UpgradePrompt.module.scss';

interface UpgradePromptProps {
  feature: string;
  featureName: string;
  requiredTier?: string;
  onClose?: () => void;
}

export default function UpgradePrompt({ 
  feature, 
  featureName, 
  requiredTier = 'Professional',
  onClose 
}: UpgradePromptProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push('/merchant/subscription');
  };

  const getFeatureDescription = (feature: string): string => {
    const descriptions: Record<string, string> = {
      table_service: 'Manage dine-in tables, track orders, and handle table sessions for your restaurant.',
      staff_management: 'Add staff members, manage PINs, and track staff performance.',
      reservations: 'Accept online reservations and manage your booking calendar.',
      inventory_management: 'Track stock levels, set alerts, and manage ingredients.',
      pos_system: 'Use our Point of Sale system for in-person orders.',
      custom_branding: 'Customize your storefront with your brand colors and logo.',
      advanced_reporting: 'Access detailed sales reports and customer insights.',
      api_access: 'Integrate with third-party systems using our API.'
    };
    return descriptions[feature] || 'Unlock premium features for your business.';
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          ×
        </button>
        
        <div className={styles.icon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                  fill="currentColor" opacity="0.2"/>
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2>Upgrade to {requiredTier}</h2>
        
        <p className={styles.featureName}>{featureName}</p>
        
        <p className={styles.description}>
          {getFeatureDescription(feature)}
        </p>

        <div className={styles.benefits}>
          <h3>What you'll get:</h3>
          <ul>
            <li>Full access to {featureName.toLowerCase()}</li>
            <li>Lower transaction fees</li>
            <li>Priority support</li>
            <li>Advanced analytics</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelButton}>
            Not Now
          </button>
          <button onClick={handleUpgrade} className={styles.upgradeButton}>
            View Plans
          </button>
        </div>
      </div>
    </div>
  );
}

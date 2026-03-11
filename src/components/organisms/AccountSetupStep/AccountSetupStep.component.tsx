import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography } from '@/components/atoms/Typography';
import { AccountSetupStepProps, AccountSetupData } from './AccountSetupStep.types';
import styles from './AccountSetupStep.module.scss';

export const AccountSetupStep: React.FC<AccountSetupStepProps> = ({
  onComplete,
  onBack,
  initialData,
  loading = false,
  className,
}) => {
  const { user } = useAuth0();
  
  // Helper to check if a string looks like an email
  const looksLikeEmail = (str: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  };
  
  // Don't use user.name as default if it's actually an email address
  const defaultName = initialData?.name || 
    (user?.name && !looksLikeEmail(user.name) ? user.name : '');
  
  const [formData, setFormData] = useState<AccountSetupData>({
    username: initialData?.username || '',
    email: initialData?.email || user?.email || '',
    name: defaultName,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AccountSetupData, string>>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateUsername = (username: string): string | null => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 50) return 'Username must be less than 50 characters';
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return 'Username can only contain letters, numbers, hyphens, and underscores';
    }
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AccountSetupData, string>> = {};

    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof AccountSetupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsValidating(true);

    // Here you could add an API call to check username availability
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onComplete(formData);
    } catch (error) {
      setErrors({ username: 'This username is already taken' });
    } finally {
      setIsValidating(false);
    }
  };

  const containerClasses = [
    styles.accountSetupStep,
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.accountSetupStep__header}>
        <Typography variant="heading-2" className={styles.accountSetupStep__title}>
          Create Your Merchant Account
        </Typography>
        <Typography variant="body-large" className={styles.accountSetupStep__description}>
          Let's start by setting up your account details
        </Typography>
      </div>

      {user && (
        <div className={styles.accountSetupStep__infoBox}>
          <Typography variant="body-small" className={styles.accountSetupStep__infoText}>
            ✅ You're signed in with {user.email}. We'll use this for authentication.
          </Typography>
        </div>
      )}

      <form className={styles.accountSetupStep__form} onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className={styles.accountSetupStep__field}>
          <label className={styles.accountSetupStep__label}>
            Full Name<span className={styles.accountSetupStep__required}>*</span>
          </label>
          <input
            type="text"
            className={`${styles.accountSetupStep__input} ${errors.name ? styles['accountSetupStep__input--error'] : ''}`}
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            disabled={loading || isValidating}
          />
          {errors.name && (
            <span className={styles.accountSetupStep__error}>⚠️ {errors.name}</span>
          )}
        </div>

        {/* Email Field */}
        <div className={styles.accountSetupStep__field}>
          <label className={styles.accountSetupStep__label}>
            Email Address<span className={styles.accountSetupStep__required}>*</span>
          </label>
          <input
            type="email"
            className={`${styles.accountSetupStep__input} ${errors.email ? styles['accountSetupStep__input--error'] : ''}`}
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="your@email.com"
            disabled={loading || isValidating || !!user?.email}
          />
          {errors.email && (
            <span className={styles.accountSetupStep__error}>⚠️ {errors.email}</span>
          )}
          {user?.email && (
            <span className={styles.accountSetupStep__helpText}>
              Email verified through Auth0
            </span>
          )}
        </div>

        {/* Username Field */}
        <div className={styles.accountSetupStep__field}>
          <label className={styles.accountSetupStep__label}>
            Username<span className={styles.accountSetupStep__required}>*</span>
          </label>
          <input
            type="text"
            className={`${styles.accountSetupStep__input} ${errors.username ? styles['accountSetupStep__input--error'] : ''}`}
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="your-business-name"
            disabled={loading || isValidating}
          />
          {errors.username && (
            <span className={styles.accountSetupStep__error}>⚠️ {errors.username}</span>
          )}
          <span className={styles.accountSetupStep__helpText}>
            This will be used in your business URL: fesi.app/{formData.username || 'username'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className={styles.accountSetupStep__actions}>
          {onBack && (
            <button
              type="button"
              className={`${styles.accountSetupStep__button} ${styles['accountSetupStep__button--secondary']}`}
              onClick={onBack}
              disabled={loading || isValidating}
            >
              Back
            </button>
          )}
          <button
            type="submit"
            className={`${styles.accountSetupStep__button} ${styles['accountSetupStep__button--primary']}`}
            disabled={loading || isValidating}
          >
            {isValidating ? 'Validating...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

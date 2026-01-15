import React, { useState, useEffect } from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import api from '@/utils/api';
import styles from './StaffPinLogin.module.scss';

export interface StaffMember {
  id: string;
  merchant_id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  is_active: boolean;
}

interface StaffPinLoginProps {
  merchantId: string;
  onSuccess: (staff: StaffMember) => void;
  title?: string;
  subtitle?: string;
}

export const StaffPinLogin: React.FC<StaffPinLoginProps> = ({
  merchantId,
  onSuccess,
  title = 'Staff Login',
  subtitle = 'Enter your PIN to continue'
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePinInput = (digit: string) => {
    if (pin.length < 6) {
      setPin(pin + digit);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handleSubmit = async () => {
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await api.post('/api/staff/verify-pin', {
        merchant_id: merchantId,
        pin
      }, {
        skipAuth: true // No auth required for PIN verification
      });

      if (response.success && response.staff) {
        onSuccess(response.staff);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid PIN. Please try again.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  // Submit on Enter key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && pin.length >= 4) {
        handleSubmit();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (/^\d$/.test(e.key)) {
        handlePinInput(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [pin]);

  return (
    <div className={styles.container}>
      <Card className={styles.loginCard}>
        <div className={styles.header}>
          <Typography variant="heading-2">{title}</Typography>
          <Typography variant="body-medium">
            {subtitle}
          </Typography>
        </div>

        <div className={styles.pinDisplay}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className={`${styles.pinDot} ${index < pin.length ? styles.pinDot__filled : ''}`}
            />
          ))}
        </div>

        {error && (
          <div className={styles.error}>
            <Typography variant="body-small">
              {error}
            </Typography>
          </div>
        )}

        <div className={styles.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              className={styles.keypadButton}
              onClick={() => handlePinInput(digit.toString())}
              disabled={loading}
            >
              {digit}
            </button>
          ))}
          <button
            className={styles.keypadButton}
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </button>
          <button
            className={styles.keypadButton}
            onClick={() => handlePinInput('0')}
            disabled={loading}
          >
            0
          </button>
          <button
            className={styles.keypadButton}
            onClick={handleBackspace}
            disabled={loading}
          >
            ←
          </button>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          isDisabled={pin.length < 4 || loading}
          fullWidth
        >
          {loading ? 'Verifying...' : 'Login'}
        </Button>
      </Card>
    </div>
  );
};

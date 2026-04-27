'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import styles from './complete.module.scss';

export default function OnboardingCompletePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      // No session ID means they skipped payment and completed trial setup
      setStatus('success');
      setMessage('Your trial has started!');
      setTimeout(() => {
        router.push('/merchant/admin');
      }, 2000);
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      // Verify the Stripe session
      const data = await api.get(`/api/subscription-checkout/session/${sessionId}`);
      
      if (data.session.payment_status === 'paid') {
        setStatus('success');
        setMessage('Payment successful! Your subscription is now active.');
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/merchant/admin?onboarding_complete=true');
        }, 3000);
      } else if (data.session.payment_status === 'unpaid') {
        setStatus('error');
        setMessage('Payment is pending. Please check back shortly.');
      } else {
        setStatus('error');
        setMessage('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setStatus('error');
      setMessage('Failed to verify payment. Please contact support.');
    }
  };

  const handleContinue = () => {
    router.push('/merchant/admin');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {status === 'loading' && (
          <>
            <div className={styles.spinner}></div>
            <Typography variant="heading-3">{message}</Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <div className={styles.icon}>🎉</div>
            <Typography variant="heading-2">Welcome to Fesi!</Typography>
            <Typography variant="body-large" className={styles.message}>
              {message}
            </Typography>
            <Typography variant="body-medium" className={styles.subMessage}>
              Redirecting you to your dashboard...
            </Typography>
            <Button 
              variant="primary" 
              onClick={handleContinue}
              className={styles.continueBtn}
            >
              Go to Dashboard Now
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className={styles.icon}>⚠️</div>
            <Typography variant="heading-3">Payment Issue</Typography>
            <Typography variant="body-large" className={styles.message}>
              {message}
            </Typography>
            <div className={styles.actions}>
              <Button 
                variant="primary" 
                onClick={handleContinue}
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => router.push('/merchant/admin/subscription')}
              >
                Retry Payment Setup
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

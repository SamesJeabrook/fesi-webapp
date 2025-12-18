'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button, Grid } from '@/components/atoms';
import { FormInput } from '@/components/atoms';
import api from '@/utils/api';
import Link from 'next/link';
import styles from './signup.module.scss';

export default function CustomerSignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();
  const [step, setStep] = useState<'auth' | 'details'>('auth');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    marketing_opt_out: false,
  });

  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
  });

  // Redirect if already authenticated and has profile
  useEffect(() => {
    const checkExistingProfile = async () => {
      if (isAuthenticated && user) {
        try {
          const data = await api.get('/api/customers/me');
          
          // If profile exists and has name, redirect to dashboard
          if (data.data && data.data.first_name) {
            const returnTo = searchParams?.get('returnTo') || '/customer/dashboard';
            router.push(returnTo);
          } else {
            // Profile exists but incomplete, show details form
            setStep('details');
            if (data.data) {
              setFormData(prev => ({
                ...prev,
                first_name: data.data.first_name || '',
                last_name: data.data.last_name || '',
                phone: data.data.phone || '',
              }));
            }
          }
        } catch (error) {
          console.error('Error checking profile:', error);
        }
      }
    };

    if (!isLoading) {
      checkExistingProfile();
    }
  }, [isAuthenticated, user, isLoading, router, searchParams]);

  const handleAuth0Signup = async () => {
    const returnTo = searchParams?.get('returnTo') || '/customer/signup?step=details';
    
    await loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
        redirect_uri: `${window.location.origin}/customer/signup`,
      },
    });
  };

  const validateForm = (): boolean => {
    const newErrors = {
      first_name: '',
      last_name: '',
    };

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleCompleteSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await api.put('/api/customers/me', {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim() || null,
        marketing_opt_out: formData.marketing_opt_out,
      });

      const returnTo = searchParams?.get('returnTo') || '/customer/dashboard';
      router.push(returnTo);
    } catch (error) {
      console.error('Error completing signup:', error);
      alert('Failed to complete signup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.signup}>
        <div className={styles.signup__container}>
          <Typography variant="heading-3">Loading...</Typography>
        </div>
      </div>
    );
  }

  // Step 1: Authentication
  if (step === 'auth' && !isAuthenticated) {
    return (
      <div className={styles.signup}>
        <div className={styles.signup__container}>
          <div className={styles.signup__header}>
            <Typography variant="heading-2">Create Your Account</Typography>
            <Typography variant="body-large" style={{ color: 'var(--color-text-secondary)' }}>
              Join thousands of food lovers ordering from their favorite vendors
            </Typography>
          </div>

          <div className={styles.signup__card}>
            <div className={styles.signup__benefits}>
              <Typography variant="heading-5" style={{ marginBottom: '1rem' }}>
                Why sign up?
              </Typography>
              <ul className={styles.benefits}>
                <li>
                  <span className={styles.benefits__icon}>✓</span>
                  <div>
                    <Typography variant="body-medium" style={{ fontWeight: 500 }}>
                      Track Your Orders
                    </Typography>
                    <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                      View your complete order history and status
                    </Typography>
                  </div>
                </li>
                <li>
                  <span className={styles.benefits__icon}>✓</span>
                  <div>
                    <Typography variant="body-medium" style={{ fontWeight: 500 }}>
                      Loyalty Rewards
                    </Typography>
                    <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                      Earn stamps and get free items from vendors
                    </Typography>
                  </div>
                </li>
                <li>
                  <span className={styles.benefits__icon}>✓</span>
                  <div>
                    <Typography variant="body-medium" style={{ fontWeight: 500 }}>
                      Faster Checkout
                    </Typography>
                    <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                      Save time with your details pre-filled
                    </Typography>
                  </div>
                </li>
                <li>
                  <span className={styles.benefits__icon}>✓</span>
                  <div>
                    <Typography variant="body-medium" style={{ fontWeight: 500 }}>
                      Order Notifications
                    </Typography>
                    <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                      Get updates when your order is ready
                    </Typography>
                  </div>
                </li>
              </ul>
            </div>

            <div className={styles.signup__divider}></div>

            <div className={styles.signup__actions}>
              <Button
                variant="primary"
                size="lg"
                onClick={handleAuth0Signup}
                className={styles.signup__button}
              >
                Sign Up with Email
              </Button>

              <Typography 
                variant="body-small" 
                style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}
              >
                By signing up, you agree to our Terms of Service and Privacy Policy
              </Typography>

              <div className={styles.signup__footer}>
                <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                  Already have an account?{' '}
                  <Link href="/customer/login" className={styles.signup__link}>
                    Log In
                  </Link>
                </Typography>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link href="/vendors" className={styles.signup__link}>
                  <Typography variant="body-small">
                    Continue as Guest →
                  </Typography>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Additional Details (after Auth0 authentication)
  if (isAuthenticated) {
    return (
      <div className={styles.signup}>
        <div className={styles.signup__container}>
          <div className={styles.signup__header}>
            <Typography variant="heading-2">Complete Your Profile</Typography>
            <Typography variant="body-large" style={{ color: 'var(--color-text-secondary)' }}>
              Just a few more details to get started
            </Typography>
          </div>

          <div className={styles.signup__card}>
            <Grid.Container gap="md">
              <Grid.Item sm={16} md={8}>
                <FormInput
                  label="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  placeholder="Enter your first name"
                  error={errors.first_name}
                  required
                  disabled={isSubmitting}
                />
              </Grid.Item>

              <Grid.Item sm={16} md={8}>
                <FormInput
                  label="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Enter your last name"
                  error={errors.last_name}
                  required
                  disabled={isSubmitting}
                />
              </Grid.Item>

              <Grid.Item sm={16}>
                <FormInput
                  label="Phone Number (Optional)"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="07xxx xxxxxx"
                  helpText="We'll use this to notify you about your orders"
                  disabled={isSubmitting}
                />
              </Grid.Item>

              <Grid.Item sm={16}>
                <div className={styles.checkbox}>
                  <input
                    type="checkbox"
                    id="marketing"
                    checked={!formData.marketing_opt_out}
                    onChange={(e) => 
                      setFormData(prev => ({ ...prev, marketing_opt_out: !e.target.checked }))
                    }
                    disabled={isSubmitting}
                  />
                  <label htmlFor="marketing">
                    <Typography variant="body-small">
                      Send me promotional emails and special offers from vendors
                    </Typography>
                  </label>
                </div>
              </Grid.Item>

              <Grid.Item sm={16}>
                <Button
                  variant="primary"
                  onClick={handleCompleteSignup}
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                  className={styles.signup__button}
                >
                  Complete Sign Up
                </Button>
              </Grid.Item>
            </Grid.Container>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

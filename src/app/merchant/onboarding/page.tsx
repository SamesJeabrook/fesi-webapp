'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { MerchantOnboardingTemplate, MerchantOnboardingData } from '@/components/templates/MerchantOnboardingTemplate';

export default function MerchantOnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user, getAccessTokenSilently } = useAuth0();

  const handleStartSignup = () => {
    // Store that they want to onboard, then redirect to Auth0 signup
    sessionStorage.setItem('postLoginAction', 'merchant-onboarding');
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup', // Tells Auth0 to show signup form instead of login
        redirect_uri: `${window.location.origin}/merchant/onboarding`,
      }
    });
  };

  const handleOnboardingComplete = async (data: MerchantOnboardingData, merchantId?: string) => {
    setLoading(true);

    try {
      // The merchant is already created and updated by the template
      // We just need to handle the redirect and re-auth logic
      
      if (!merchantId) {
        throw new Error('Merchant ID not available');
      }

      // Get Auth0 token to check if reauth is needed
      const token = await getAccessTokenSilently();
      
      // Check if Auth0 roles need to be updated by making a simple check
      // The merchant creation should have updated roles, but we need to refresh the token
      console.log('Onboarding complete - checking if reauth is required...');
      
      // For now, always do a reauth to pick up the new merchant role
      sessionStorage.setItem('postLoginRedirect', `/merchant/admin?merchantId=${merchantId}&onboarding=complete`);
      await logout({ logoutParams: { returnTo: `${window.location.origin}/reauth` } });
    } catch (error) {
      console.error('Onboarding error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete onboarding. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Show welcome screen BEFORE authentication
  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '600px',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '48px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>🍽️</div>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            color: '#1a1a1a'
          }}>
            Welcome to Fesi!
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#666', 
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Start your journey as a food merchant. We'll help you set up your business and connect with customers at events.
          </p>

          <div style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'left'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '12px',
              color: '#0369a1',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🔒 Secure Authentication with Auth0
            </h3>
            <p style={{ 
              color: '#334155',
              marginBottom: '12px',
              lineHeight: '1.6'
            }}>
              First, we'll create your secure account using Auth0 - an industry-leading authentication platform trusted by thousands of businesses worldwide.
            </p>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0,
              color: '#334155'
            }}>
              <li style={{ marginBottom: '8px', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>✓</span>
                Enterprise-grade encryption
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>✓</span>
                Two-factor authentication available
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>✓</span>
                Regular security audits
              </li>
              <li style={{ paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>✓</span>
                GDPR & SOC 2 compliant
              </li>
            </ul>
          </div>

          <div style={{ marginBottom: '32px', textAlign: 'left' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: '#1a1a1a'
            }}>
              After Creating Your Account
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '8px' }}>
              We'll guide you through a simple setup process (5-10 minutes):
            </p>
            <ol style={{ color: '#666', paddingLeft: '24px', lineHeight: '1.8' }}>
              <li>Business information</li>
              <li>Food safety compliance</li>
              <li>Payment setup with Stripe</li>
            </ol>
          </div>

          <button
            onClick={handleStartSignup}
            style={{
              width: '100%',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#0ea5e9',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0ea5e9'}
          >
            Create Your Secure Account →
          </button>

          <p style={{ 
            marginTop: '24px', 
            fontSize: '14px', 
            color: '#999' 
          }}>
            Already have an account?{' '}
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                loginWithRedirect({
                  authorizationParams: {
                    redirect_uri: `${window.location.origin}/merchant/onboarding`,
                  }
                });
              }}
              style={{ color: '#0ea5e9', textDecoration: 'none' }}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <MerchantOnboardingTemplate
      onComplete={handleOnboardingComplete}
      loading={loading}
      initialData={{
        accountSetup: {
          username: '',
          email: user?.email || '',
          name: user?.name || '',
        }
      }}
    />
  );
}

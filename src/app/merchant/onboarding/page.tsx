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

  const handleOnboardingComplete = async (data: MerchantOnboardingData) => {
    setLoading(true);

    try {
      // Get Auth0 token
      const token = await getAccessTokenSilently();
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      console.log('Submitting onboarding to:', `${apiUrl}/api/merchants/onboard`);
      console.log('Auth0 User:', user);
      
      const payload = {
        // Account Setup (pre-filled from Auth0)
        username: data.accountSetup?.username,
        email: user?.email || data.accountSetup?.email,
        name: user?.name || data.accountSetup?.name,
        auth0Id: user?.sub, // Link to Auth0 account
        
        // Business Details
        businessName: data.businessDetails?.businessName,
        description: data.businessDetails?.description,
        phoneNumber: data.businessDetails?.phoneNumber,
        address: data.businessDetails?.address,
        categories: data.businessDetails?.categories,
        
        // Compliance
        hygieneRating: data.compliance?.hygieneRating,
        hygieneRatingDate: data.compliance?.hygieneRatingDate,
        foodSafetyCertificate: data.compliance?.foodSafetyCertificate,
        publicLiabilityInsurance: data.compliance?.publicLiabilityInsurance,
        allergenTrainingCertificate: data.compliance?.allergenTrainingCertificate,
        
        // Payment Setup
        stripeAccountId: data.paymentSetup?.stripeAccountId,
        acceptedTerms: data.paymentSetup?.acceptedTerms,
        agreedToPaymentProcessing: data.paymentSetup?.agreedToPaymentProcessing,
      };
      
      console.log('Payload:', payload);
      
      const response = await fetch(`${apiUrl}/api/merchants/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include Auth0 token
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to complete onboarding');
      }

      const result = await response.json();
      console.log('Success:', result);
      const merchantId = result.merchantId;

      // If Auth0 roles were updated, we need to refresh the token
      if (result.requiresReauth) {
        console.log('Onboarding complete - refreshing authentication...');
        // Store the destination for after re-login
        sessionStorage.setItem('postLoginRedirect', `/merchant/admin?merchantId=${merchantId}&onboarding=complete`);
        // Log out and redirect to reauth page which will trigger login
        await logout({ logoutParams: { returnTo: `${window.location.origin}/reauth` } });
        return;
      }

      // Redirect to merchant admin dashboard
      router.push(`/merchant/admin?merchantId=${merchantId}&onboarding=complete`);
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

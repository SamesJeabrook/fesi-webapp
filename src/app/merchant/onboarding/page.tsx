'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { MerchantOnboardingTemplate, MerchantOnboardingData } from '@/components/templates/MerchantOnboardingTemplate';

export default function MerchantOnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [merchantData, setMerchantData] = useState<any>(null);
  const [isFetchingMerchant, setIsFetchingMerchant] = useState(true);
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user, getAccessTokenSilently } = useAuth0();

  // Fetch existing merchant data when authenticated
  useEffect(() => {
    const fetchMerchantData = async () => {
      if (!isAuthenticated || !user) {
        setIsFetchingMerchant(false);
        return;
      }

      // Set a flag to indicate we're in onboarding - this prevents other auth checks from redirecting
      sessionStorage.setItem('activeOnboarding', 'true');

      try {
        setIsFetchingMerchant(true);
        console.log('Fetching merchant data during onboarding...');
        
        // Explicitly pass the audience to ensure we get the right token
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
          },
          cacheMode: 'on', // Use cached token if available
        });
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        
        // Try to get existing merchant data
        const response = await fetch(`${apiUrl}/api/merchants/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Existing merchant data found:', data.data);
          const merchant = data.data;
          setMerchantData(merchant);
          
          // Check if we're in the middle of onboarding (came back from Stripe, etc.)
          const isActivelyOnboarding = sessionStorage.getItem('stripeOnboardingContext') === 'merchant-onboarding';
          
          // If onboarding is already complete AND we're not actively onboarding, redirect to dashboard
          if (merchant.onboarding_complete && !isActivelyOnboarding) {
            console.log('Merchant has completed onboarding, redirecting to dashboard...');
            sessionStorage.removeItem('activeOnboarding');
            router.push('/merchant/admin');
            return; // Don't set isFetchingMerchant to false, let redirect happen
          } else if (merchant.onboarding_complete && isActivelyOnboarding) {
            console.log('Merchant has completed onboarding previously, but actively resuming onboarding flow...');
            // Let them continue with onboarding (maybe they need to update something)
          }
        } else if (response.status === 404) {
          // User doesn't have a merchant account yet - this is expected for new signups
          console.log('No existing merchant account found - user is new');
        } else if (response.status === 401 || response.status === 403) {
          console.log('Auth error fetching merchant - user may not have merchant role yet. This is OK during onboarding.');
          // Don't redirect to login - this is expected for new signups
        }
      } catch (error) {
        console.error('Error fetching merchant data:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        // If it's a consent error, try to get a new token by waiting a bit
        if (errorMessage.includes('consent_required') || errorMessage.includes('login_required')) {
          console.log('Auth0 requires consent/login - will retry after user completes onboarding');
          // Don't redirect - let the user continue with onboarding
        }
        // Not a critical error - user might be new, so continue with onboarding
      } finally {
        setIsFetchingMerchant(false);
      }
    };

    fetchMerchantData();
    
    // Cleanup: remove the onboarding flag when component unmounts
    return () => {
      sessionStorage.removeItem('activeOnboarding');
    };
  }, [isAuthenticated, user, getAccessTokenSilently, router]);

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
      
      // Clear the onboarding flags
      sessionStorage.removeItem('activeOnboarding');
      sessionStorage.removeItem('stripeOnboardingContext');
      
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
  if (isLoading || isFetchingMerchant) {
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
      initialMerchantId={merchantData?.id}
      initialData={{
        accountSetup: {
          username: merchantData?.username || '',
          email: user?.email || '',
          name: user?.name || '',
        },
        planSelection: merchantData ? {
          selectedTier: merchantData.subscription_tier || 'starter',
          hasTrialAccess: !!merchantData.trial_ends_at,
          isBetaUser: merchantData.is_beta_user || false,
        } : undefined,
        businessDetails: merchantData ? {
          businessName: merchantData.name || '',
          description: merchantData.description || '',
          phoneNumber: merchantData.phone_number || '',
          address: {
            street: merchantData.address_street || '',
            city: merchantData.address_city || '',
            postcode: merchantData.address_postcode || '',
            country: merchantData.address_country || 'United Kingdom',
          },
          categories: merchantData.categories?.map((cat: any) => cat.name) || [],
        } : undefined,
        compliance: merchantData ? {
          hygieneRating: merchantData.hygiene_rating || undefined,
          hygieneRatingDate: merchantData.hygiene_rating_date ? new Date(merchantData.hygiene_rating_date) : undefined,
          foodSafetyCertificate: undefined, // Files can't be pre-populated
          publicLiabilityInsurance: undefined,
          allergenTrainingCertificate: undefined,
          confirmedAccuracy: true, // They've already submitted, so this was confirmed
        } : undefined,
        paymentSetup: merchantData ? {
          stripeAccountId: merchantData.stripe_account_id,
          accountStatus: merchantData.stripe_account_status,
          acceptedTerms: merchantData.accepted_merchant_terms || false,
          agreedToPaymentProcessing: merchantData.agreed_to_payment_processing || false,
        } : undefined,
      }}
      initialStep={merchantData ? 'payment' : 'account'}
    />
  );
}

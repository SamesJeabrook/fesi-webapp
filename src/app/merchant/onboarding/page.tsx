'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { MerchantOnboardingTemplate, MerchantOnboardingData } from '@/components/templates/MerchantOnboardingTemplate';

export default function MerchantOnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isLoading, loginWithRedirect, user, getAccessTokenSilently } = useAuth0();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store that they want to onboard, then redirect to Auth0 signup
      sessionStorage.setItem('postLoginAction', 'merchant-onboarding');
      loginWithRedirect({
        authorizationParams: {
          screen_hint: 'signup', // Tells Auth0 to show signup form instead of login
          redirect_uri: `${window.location.origin}/merchant/onboarding`,
        }
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

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

  // Don't render form if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
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

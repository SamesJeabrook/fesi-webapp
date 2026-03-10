import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';
import { OnboardingProgress } from '@/components/atoms/OnboardingProgress';
import { AccountSetupStep } from '@/components/organisms/AccountSetupStep';
import { BusinessDetailsStep } from '@/components/organisms/BusinessDetailsStep';
import { ComplianceStep } from '@/components/organisms/ComplianceStep';
import { PaymentSetupStep } from '@/components/organisms/PaymentSetupStep';
import {
  MerchantOnboardingTemplateProps,
  MerchantOnboardingData,
  OnboardingStep,
  StepConfig,
} from './MerchantOnboardingTemplate.types';
import styles from './MerchantOnboardingTemplate.module.scss';

const STEPS: StepConfig[] = [
  { id: 'account', title: 'Account', description: 'Basic account setup' },
  { id: 'business', title: 'Business', description: 'Business information' },
  { id: 'compliance', title: 'Compliance', description: 'Legal documents' },
  { id: 'payment', title: 'Payment', description: 'Payment setup' },
];

export const MerchantOnboardingTemplate: React.FC<MerchantOnboardingTemplateProps> = ({
  initialData,
  initialStep = 'account',
  onComplete,
  loading = false,
  className,
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep);
  const [formData, setFormData] = useState<MerchantOnboardingData>(initialData || {});
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [isCreatingMerchant, setIsCreatingMerchant] = useState(false);
  const { user, getAccessTokenSilently } = useAuth0();

  const getCurrentStepIndex = (): number => {
    return STEPS.findIndex(step => step.id === currentStep);
  };

  const handleAccountSetupComplete = (data: MerchantOnboardingData['accountSetup']) => {
    setFormData(prev => ({ ...prev, accountSetup: data }));
    setCurrentStep('business');
  };

  const handleBusinessDetailsComplete = (data: MerchantOnboardingData['businessDetails']) => {
    setFormData(prev => ({ ...prev, businessDetails: data }));
    setCurrentStep('compliance');
  };

  const handleComplianceComplete = async (data: MerchantOnboardingData['compliance']) => {
    const updatedFormData = { ...formData, compliance: data };
    setFormData(updatedFormData);
    
    // Create the merchant record before moving to payment step
    // This gives us a merchantId needed for Stripe onboarding
    if (!merchantId) {
      setIsCreatingMerchant(true);
      try {
        const token = await getAccessTokenSilently();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        
        const payload = {
          username: updatedFormData.accountSetup?.username,
          email: user?.email || updatedFormData.accountSetup?.email,
          name: user?.name || updatedFormData.accountSetup?.name,
          auth0Id: user?.sub,
          
          businessName: updatedFormData.businessDetails?.businessName,
          description: updatedFormData.businessDetails?.description,
          phoneNumber: updatedFormData.businessDetails?.phoneNumber,
          address: updatedFormData.businessDetails?.address,
          categories: updatedFormData.businessDetails?.categories,
          
          hygieneRating: data?.hygieneRating,
          hygieneRatingDate: data?.hygieneRatingDate,
          foodSafetyCertificate: data?.foodSafetyCertificate,
          publicLiabilityInsurance: data?.publicLiabilityInsurance,
          allergenTrainingCertificate: data?.allergenTrainingCertificate,
          
          // Mark as incomplete onboarding - will be updated after payment setup
          acceptedTerms: false,
          agreedToPaymentProcessing: false,
        };
        
        const response = await fetch(`${apiUrl}/api/merchants/onboard`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create merchant account');
        }
        
        const result = await response.json();
        setMerchantId(result.merchantId);
        
        // Now move to payment step
        setCurrentStep('payment');
      } catch (error) {
        console.error('Error creating merchant:', error);
        alert(error instanceof Error ? error.message : 'Failed to create merchant account. Please try again.');
      } finally {
        setIsCreatingMerchant(false);
      }
    } else {
      // Merchant already exists, just move to payment step
      setCurrentStep('payment');
    }
  };

  const handlePaymentSetupComplete = async (data: MerchantOnboardingData['paymentSetup']) => {
    const completeData = { ...formData, paymentSetup: data };
    setFormData(completeData);
    
    // Update the merchant record with payment details
    if (merchantId) {
      try {
        const token = await getAccessTokenSilently();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        
        const payload = {
          username: completeData.accountSetup?.username,
          email: user?.email || completeData.accountSetup?.email,
          name: user?.name || completeData.accountSetup?.name,
          auth0Id: user?.sub,
          
          businessName: completeData.businessDetails?.businessName,
          description: completeData.businessDetails?.description,
          phoneNumber: completeData.businessDetails?.phoneNumber,
          address: completeData.businessDetails?.address,
          categories: completeData.businessDetails?.categories,
          
          hygieneRating: completeData.compliance?.hygieneRating,
          hygieneRatingDate: completeData.compliance?.hygieneRatingDate,
          foodSafetyCertificate: completeData.compliance?.foodSafetyCertificate,
          publicLiabilityInsurance: completeData.compliance?.publicLiabilityInsurance,
          allergenTrainingCertificate: completeData.compliance?.allergenTrainingCertificate,
          
          stripeAccountId: data?.stripeAccountId,
          acceptedTerms: data?.acceptedTerms,
          agreedToPaymentProcessing: data?.agreedToPaymentProcessing,
        };
        
        const response = await fetch(`${apiUrl}/api/merchants/onboard`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to complete onboarding');
        }
        
        const result = await response.json();
        
        // Pass the result including merchantId back to the caller
        onComplete(completeData, result.merchantId || merchantId);
      } catch (error) {
        console.error('Error updating merchant:', error);
        alert(error instanceof Error ? error.message : 'Failed to complete onboarding. Please try again.');
      }
    } else {
      // Fallback to original behavior if no merchantId
      onComplete(completeData);
    }
  };

  const handleBack = (targetStep: OnboardingStep) => {
    setCurrentStep(targetStep);
  };

  // Map steps to OnboardingProgress format
  const currentStepIndex = getCurrentStepIndex();
  const progressSteps = STEPS.map((step, index) => ({
    label: step.title,
    completed: index < currentStepIndex,
  }));

  const containerClasses = [
    styles.merchantOnboardingTemplate,
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.merchantOnboardingTemplate__container}>
        {/* Header */}
        <div className={styles.merchantOnboardingTemplate__header}>
          <Link href="/" className={styles.merchantOnboardingTemplate__logo}>
            Fesi
          </Link>

          <div className={styles.merchantOnboardingTemplate__progressWrapper}>
            <OnboardingProgress
              currentStep={currentStepIndex + 1}
              totalSteps={STEPS.length}
              steps={progressSteps}
            />
          </div>
        </div>

        {/* Content */}
        <div className={styles.merchantOnboardingTemplate__content}>
          <div className={styles.merchantOnboardingTemplate__stepContainer}>
            {currentStep === 'account' && (
              <AccountSetupStep
                onComplete={handleAccountSetupComplete}
                onBack={() => {}} // No back on first step
                initialData={formData.accountSetup}
                loading={loading}
              />
            )}

            {currentStep === 'business' && (
              <BusinessDetailsStep
                onComplete={handleBusinessDetailsComplete}
                onBack={() => handleBack('account')}
                initialData={formData.businessDetails}
                loading={loading}
              />
            )}

            {currentStep === 'compliance' && (
              <ComplianceStep
                onComplete={handleComplianceComplete}
                onBack={() => handleBack('business')}
                initialData={formData.compliance}
                loading={loading || isCreatingMerchant}
              />
            )}

            {currentStep === 'payment' && (
              <PaymentSetupStep
                onComplete={handlePaymentSetupComplete}
                onBack={() => handleBack('compliance')}
                initialData={formData.paymentSetup}
                loading={loading}
                merchantId={merchantId || undefined}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.merchantOnboardingTemplate__footer}>
        <p className={styles.merchantOnboardingTemplate__footerText}>
          Need help? <Link href="/support">Contact Support</Link> or read our{' '}
          <Link href="/merchant-guide">Merchant Guide</Link>
        </p>
      </div>
    </div>
  );
};

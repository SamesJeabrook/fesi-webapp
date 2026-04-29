import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';
import { OnboardingProgress } from '@/components/atoms/OnboardingProgress';
import { AccountSetupStep } from '@/components/organisms/AccountSetupStep';
import { PlanSelectionStep } from '@/components/organisms/PlanSelectionStep';
import { BusinessDetailsStep } from '@/components/organisms/BusinessDetailsStep';
import { ComplianceStep } from '@/components/organisms/ComplianceStep';
import { PaymentSetupStep } from '@/components/organisms/PaymentSetupStep';
import { SubscriptionPaymentSetup } from '@/components/organisms/SubscriptionPaymentSetup';
import {
  MerchantOnboardingTemplateProps,
  MerchantOnboardingData,
  OnboardingStep,
  StepConfig,
} from './MerchantOnboardingTemplate.types';
import styles from './MerchantOnboardingTemplate.module.scss';
import api from '@/utils/api';

const STEPS: StepConfig[] = [
  { id: 'account', title: 'Account', description: 'Basic account setup' },
  { id: 'plan', title: 'Plan', description: 'Choose subscription' },
  { id: 'business', title: 'Business', description: 'Business information' },
  { id: 'compliance', title: 'Compliance', description: 'Legal documents' },
  { id: 'payment', title: 'Payment', description: 'Payment setup' },
  { id: 'subscription', title: 'Subscription', description: 'Monthly billing' },
];

export const MerchantOnboardingTemplate: React.FC<MerchantOnboardingTemplateProps> = ({
  initialData,
  initialStep = 'account',
  initialMerchantId,
  onComplete,
  loading = false,
  className,
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep);
  const [formData, setFormData] = useState<MerchantOnboardingData>(initialData || {});
  const [merchantId, setMerchantId] = useState<string | null>(initialMerchantId || null);
  const [isCreatingMerchant, setIsCreatingMerchant] = useState(false);
  const { user, getAccessTokenSilently } = useAuth0();

  const getCurrentStepIndex = (): number => {
    return STEPS.findIndex(step => step.id === currentStep);
  };

  const handleAccountSetupComplete = (data: MerchantOnboardingData['accountSetup']) => {
    setFormData(prev => ({ ...prev, accountSetup: data }));
    setCurrentStep('plan');
  };

  const handlePlanSelectionComplete = (data: MerchantOnboardingData['planSelection']) => {
    setFormData(prev => ({ ...prev, planSelection: data }));
    setCurrentStep('business');
  };

  const handleBusinessDetailsComplete = (data: MerchantOnboardingData['businessDetails']) => {
    setFormData(prev => ({ ...prev, businessDetails: data }));
    setCurrentStep('compliance');
  };

  const uploadComplianceDocuments = async (merchantIdToUse: string, token: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const compliance = formData.compliance;
    
    if (!compliance) return;

    const documentsToUpload = [
      { doc: compliance.foodSafetyCertificate, type: 'food_safety_certificate' },
      { doc: compliance.businessLicense, type: 'business_license' },
      { doc: compliance.publicLiabilityInsurance, type: 'insurance_certificate' },
      { doc: compliance.allergenTrainingCertificate, type: 'allergen_information' },
    ];

    for (const { doc, type } of documentsToUpload) {
      if (doc?.file) {
        try {
          console.log(`Uploading ${doc.name} for merchant ${merchantIdToUse}...`);
          
          // Upload to Cloudinary
          const formData = new FormData();
          formData.append('document', doc.file);
          formData.append('merchantId', merchantIdToUse);
          formData.append('documentType', type);

          const uploadResponse = await fetch(`${apiUrl}/api/upload/compliance`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          if (!uploadResponse.ok) {
            throw new Error(`Failed to upload ${doc.name}`);
          }

          const uploadResult = await uploadResponse.json();
          console.log(`Uploaded ${doc.name} successfully:`, uploadResult);

          // Save document record to database
          const docResponse = await fetch(`${apiUrl}/api/merchants/${merchantIdToUse}/documents`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              document_type: type,
              document_name: doc.name,
              document_url: uploadResult.document?.cloudinaryUrl || uploadResult.document?.url,
              expiry_date: doc.expiryDate ? doc.expiryDate.toISOString() : null,
            }),
          });

          if (!docResponse.ok) {
            console.error(`Failed to save document record for ${doc.name}`);
          } else {
            console.log(`Saved document record for ${doc.name}`);
          }
        } catch (error) {
          console.error(`Error uploading ${doc.name}:`, error);
          // Continue with other documents even if one fails
        }
      }
    }
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
          
          selectedTier: updatedFormData.planSelection?.selectedTier,
          hasTrialAccess: updatedFormData.planSelection?.hasTrialAccess,
          isBetaUser: updatedFormData.planSelection?.isBetaUser,
          
          businessName: updatedFormData.businessDetails?.businessName,
          description: updatedFormData.businessDetails?.description,
          phoneNumber: updatedFormData.businessDetails?.phoneNumber,
          address: updatedFormData.businessDetails?.address,
          categories: updatedFormData.businessDetails?.categories,
          
          hygieneRating: data?.hygieneRating,
          hygieneRatingDate: data?.hygieneRatingDate,
          
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
        const createdMerchantId = result.merchantId;
        setMerchantId(createdMerchantId);
        
        // Upload compliance documents now that we have merchantId
        console.log('Uploading compliance documents...');
        await uploadComplianceDocuments(createdMerchantId, token);
        console.log('Compliance documents uploaded successfully');
        
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
    
    // Update the merchant record with Stripe Connect details
    if (merchantId) {
      try {
        const token = await getAccessTokenSilently();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        
        const payload = {
          username: completeData.accountSetup?.username,
          email: user?.email || completeData.accountSetup?.email,
          name: user?.name || completeData.accountSetup?.name,
          auth0Id: user?.sub,
          
          selectedTier: completeData.planSelection?.selectedTier,
          hasTrialAccess: completeData.planSelection?.hasTrialAccess,
          isBetaUser: completeData.planSelection?.isBetaUser,
          
          businessName: completeData.businessDetails?.businessName,
          description: completeData.businessDetails?.description,
          phoneNumber: completeData.businessDetails?.phoneNumber,
          address: completeData.businessDetails?.address,
          categories: completeData.businessDetails?.categories,
          
          hygieneRating: completeData.compliance?.hygieneRating,
          hygieneRatingDate: completeData.compliance?.hygieneRatingDate,
          foodSafetyCertificate: completeData.compliance?.foodSafetyCertificate,
          businessLicense: completeData.compliance?.businessLicense,
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
        
        // Move to subscription payment step instead of completing
        setCurrentStep('subscription');
      } catch (error) {
        console.error('Error updating merchant:', error);
        alert(error instanceof Error ? error.message : 'Failed to complete onboarding. Please try again.');
      }
    } else {
      // Move to subscription step even without merchantId
      setCurrentStep('subscription');
    }
  };

  const handleSubscriptionPaymentComplete = async (skipped: boolean) => {
    const completeData = { ...formData, subscriptionPayment: { skipped } };
    setFormData(completeData);
    
    if (skipped) {
      // Start 7-day trial
      try {
        await api.post('/api/subscriptions/start-trial');
        console.log('Trial started successfully');
      } catch (error) {
        console.error('Error starting trial:', error);
        // Continue anyway - trial might already be set
      }
    }
    
    // Complete onboarding
    onComplete(completeData, merchantId || undefined);
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

            {currentStep === 'plan' && (
              <PlanSelectionStep
                onComplete={handlePlanSelectionComplete}
                onBack={() => handleBack('account')}
                initialData={formData.planSelection}
                loading={loading}
                userEmail={user?.email || ''}
              />
            )}

            {currentStep === 'business' && (
              <BusinessDetailsStep
                onComplete={handleBusinessDetailsComplete}
                onBack={() => handleBack('plan')}
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

            {currentStep === 'subscription' && (
              <SubscriptionPaymentSetup
                selectedTier={formData.planSelection?.selectedTier || 'starter'}
                onComplete={() => handleSubscriptionPaymentComplete(false)}
                onSkip={() => handleSubscriptionPaymentComplete(true)}
                isOnboarding={true}
                isBetaUser={formData.planSelection?.isBetaUser || false}
                hasTrialAccess={formData.planSelection?.hasTrialAccess || false}
                trialDays={formData.planSelection?.daysRemaining || 7}
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

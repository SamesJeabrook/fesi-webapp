import React, { useState } from 'react';
import Link from 'next/link';
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

  const handleComplianceComplete = (data: MerchantOnboardingData['compliance']) => {
    setFormData(prev => ({ ...prev, compliance: data }));
    setCurrentStep('payment');
  };

  const handlePaymentSetupComplete = (data: MerchantOnboardingData['paymentSetup']) => {
    const completeData = { ...formData, paymentSetup: data };
    setFormData(completeData);
    onComplete(completeData);
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
                loading={loading}
              />
            )}

            {currentStep === 'payment' && (
              <PaymentSetupStep
                onComplete={handlePaymentSetupComplete}
                onBack={() => handleBack('compliance')}
                initialData={formData.paymentSetup}
                loading={loading}
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

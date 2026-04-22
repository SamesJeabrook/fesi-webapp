import { AccountSetupData } from '@/components/organisms/AccountSetupStep/AccountSetupStep.types';
import { PlanSelectionData } from '@/components/organisms/PlanSelectionStep/PlanSelectionStep.types';
import { BusinessDetailsData } from '@/components/organisms/BusinessDetailsStep/BusinessDetailsStep.types';
import { ComplianceData } from '@/components/organisms/ComplianceStep/ComplianceStep.types';
import { PaymentSetupData } from '@/components/organisms/PaymentSetupStep/PaymentSetupStep.types';

export interface MerchantOnboardingData {
  accountSetup?: AccountSetupData;
  planSelection?: PlanSelectionData;
  businessDetails?: BusinessDetailsData;
  compliance?: ComplianceData;
  paymentSetup?: PaymentSetupData;
}

export type OnboardingStep = 'account' | 'plan' | 'business' | 'compliance' | 'payment';

export interface MerchantOnboardingTemplateProps {
  initialData?: MerchantOnboardingData;
  initialStep?: OnboardingStep;
  onComplete: (data: MerchantOnboardingData, merchantId?: string) => void;
  loading?: boolean;
  className?: string;
}

export interface StepConfig {
  id: OnboardingStep;
  title: string;
  description: string;
}

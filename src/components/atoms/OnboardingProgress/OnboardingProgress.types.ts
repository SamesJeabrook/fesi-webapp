export interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    label: string;
    completed: boolean;
  }>;
  className?: string;
}

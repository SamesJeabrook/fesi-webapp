export interface AccountSetupStepProps {
  onComplete: (data: AccountSetupData) => void;
  onBack?: () => void;
  initialData?: Partial<AccountSetupData>;
  loading?: boolean;
  className?: string;
}

export interface AccountSetupData {
  username: string;
  email: string;
  name: string;
}

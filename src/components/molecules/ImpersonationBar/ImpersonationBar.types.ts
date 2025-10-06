export interface ImpersonationBarProps {
  /** Currently selected merchant */
  merchant: {
    business_name?: string;
    name?: string;
    email?: string;
  };
  /** Handler for changing merchant */
  onChangeMerchant?: () => void;
  /** Handler for exiting admin mode */
  onExitAdminMode?: () => void;
  /** Whether to show the change merchant button */
  showChangeMerchant?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}
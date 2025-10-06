export interface MerchantCardProps {
  /** Merchant data to display */
  merchant: {
    id: string;
    name: string;
    username: string;
    phone: string;
    overall_status: string;
    created_at: string;
  };
  /** Whether this merchant is currently selected */
  isSelected?: boolean;
  /** Handler for merchant selection */
  onSelect?: (merchant: MerchantCardProps['merchant']) => void;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}
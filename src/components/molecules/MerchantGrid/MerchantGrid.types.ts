export interface MerchantGridProps {
  /** Array of merchants to display */
  merchants: Array<{
    id: string;
    name: string;
    username: string;
    phone: string;
    status: string;
    created_at: string;
  }>;
  /** Currently selected merchant ID */
  selectedMerchantId?: string;
  /** Handler for merchant selection */
  onMerchantSelect?: (merchant: MerchantGridProps['merchants'][0]) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string | null;
  /** Empty state message */
  emptyMessage?: string;
  /** Grid layout columns */
  columns?: number;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}
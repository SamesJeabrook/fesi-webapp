export interface MerchantSelectorProps {
  /** Handler for merchant selection */
  onMerchantSelect: (merchant: {
    id: string;
    name: string;
    username: string;
    phone: string;
    status: string;
    created_at: string;
  }) => void;
  /** Currently selected merchant */
  selectedMerchant?: {
    id: string;
    name: string;
    username: string;
    phone: string;
    status: string;
    created_at: string;
  } | null;
  /** View mode for merchant display */
  viewMode?: 'grid' | 'table';
  /** Number of columns for grid view */
  gridColumns?: number;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}
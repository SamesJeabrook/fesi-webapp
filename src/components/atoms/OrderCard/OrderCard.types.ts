export interface OrderCardProps {
  /** Order data */
  order: {
    id: string;
    order_number: string;
    customer_name: string;
    first_name: string;
    last_name: string;
    customer_email?: string;
    items: Array<{
      id?: string;
      menu_item_title: string;
      quantity: number;
      customizations?: Array<{
        sub_item_name: string;
        quantity: number;
      }>;
    }>;
    total_amount: number;
    status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'complete' | 'cancelled';
    created_at: string;
    estimated_completion?: string;
    notes?: string;
    refired_at?: string;
    refired_item_ids?: string[];
  };
  /** Whether the card is draggable */
  isDraggable?: boolean;
  /** Whether the card is in a dragging state */
  isDragging?: boolean;
  /** Click handler for the card */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}
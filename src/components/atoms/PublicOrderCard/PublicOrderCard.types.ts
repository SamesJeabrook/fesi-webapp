export interface PublicOrderCardProps {
  orderNumber: string;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  estimatedTime?: string;
  className?: string;
  'data-testid'?: string;
}
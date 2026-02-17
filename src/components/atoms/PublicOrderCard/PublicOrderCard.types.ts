export interface PublicOrderCardProps {
  orderNumber: string;
  status: "pending" | "accepted" | "preparing" | "ready" | "cancelled" | "delivered" | "confirmed";
  estimatedTime?: string;
  className?: string;
  'data-testid'?: string;
}
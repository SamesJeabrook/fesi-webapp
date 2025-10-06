export interface OrderItem {
  /** Name of the menu item */
  name: string;
  /** Quantity ordered */
  quantity: number;
}

export interface OrderQRCodeProps {
  /** Order ID for QR code generation */
  orderId: string;
  /** Order number to display */
  orderNumber: string;
  /** List of items in the order (without customizations) */
  orderItems: OrderItem[];
  /** Optional merchant ID */
  merchantId?: string;
  /** Size of the QR code in pixels */
  size?: number;
  /** Whether to show order information below QR code */
  showOrderInfo?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}
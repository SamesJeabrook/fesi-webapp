export interface OrderQRCodeProps {
  /** Order ID for QR code generation */
  orderId: string;
  /** Order number to display */
  orderNumber: string;
  /** Customer ID for verification */
  customerId: string;
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
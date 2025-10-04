export interface QRWorkflowProps {
  /** Current merchant ID */
  merchantId: string;
  /** Orders that are ready for pickup */
  readyOrders?: Array<{
    id: string;
    orderNumber: string;
    customerId: string;
    customerName?: string;
    estimatedReadyTime?: string;
  }>;
  /** Handler for when an order is successfully verified and completed */
  onOrderCompleted?: (orderId: string) => void;
  /** Handler for errors during QR processing */
  onError?: (error: string) => void;
  /** Whether to show the scanner immediately */
  startWithScanner?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}
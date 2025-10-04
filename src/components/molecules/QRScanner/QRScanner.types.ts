export interface QRScannerProps {
  /** Whether the scanner is active */
  isActive?: boolean;
  /** Handler for successful QR code scan */
  onScan?: (data: {
    orderId: string;
    orderNumber: string;
    customerId: string;
    merchantId?: string;
    hash: string;
  }) => void;
  /** Handler for scan errors */
  onError?: (error: string) => void;
  /** Handler for closing the scanner */
  onClose?: () => void;
  /** Loading state while processing scan */
  isProcessing?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}
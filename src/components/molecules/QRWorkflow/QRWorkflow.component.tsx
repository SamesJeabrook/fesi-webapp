import React, { useState } from 'react';
import { QRWorkflowProps } from './QRWorkflow.types';
import { Typography } from '../../atoms/Typography';
import QRScanner from '../QRScanner';
import { QRVerificationService, QRVerificationData } from '../../../services/QRVerificationService';
import styles from './QRWorkflow.module.scss';

const QRWorkflow: React.FC<QRWorkflowProps> = ({
  merchantId,
  readyOrders = [],
  onOrderCompleted,
  onError,
  startWithScanner = false,
  className = '',
  'data-testid': testId = 'qr-workflow'
}) => {
  const [showScanner, setShowScanner] = useState(startWithScanner);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScannedOrder, setLastScannedOrder] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleScanSuccess = async (qrData: QRVerificationData) => {
    setIsProcessing(true);
    setSuccessMessage('');

    try {
      // Verify the QR code with the backend
      const verificationResult = await QRVerificationService.verifyQRCode(qrData);

      if (!verificationResult.success) {
        onError?.(verificationResult.error || 'QR verification failed');
        setIsProcessing(false);
        return;
      }

      const { order } = verificationResult;
      if (!order) {
        onError?.('Order not found');
        setIsProcessing(false);
        return;
      }

      // Check if this merchant owns the order
      if (order.merchantId !== merchantId) {
        onError?.('This order belongs to a different merchant');
        setIsProcessing(false);
        return;
      }

      // Complete the order
      const completionResult = await QRVerificationService.completeOrder(order.id);

      if (!completionResult.success) {
        onError?.(completionResult.error || 'Failed to complete order');
        setIsProcessing(false);
        return;
      }

      // Success!
      setLastScannedOrder(order.orderNumber);
      setSuccessMessage(`Order ${order.orderNumber} completed successfully!`);
      setShowScanner(false);
      setIsProcessing(false);
      
      // Notify parent component
      onOrderCompleted?.(order.id);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
        setLastScannedOrder(null);
      }, 3000);

    } catch (error) {
      console.error('QR workflow error:', error);
      onError?.('Unexpected error during order verification');
      setIsProcessing(false);
    }
  };

  const handleScanError = (error: string) => {
    onError?.(error);
    setIsProcessing(false);
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
    setIsProcessing(false);
  };

  const handleStartScanning = () => {
    setShowScanner(true);
    setSuccessMessage('');
    setLastScannedOrder(null);
  };

  return (
    <div className={`${styles.qrWorkflow} ${className}`} data-testid={testId}>
      {/* Main Interface */}
      {!showScanner && (
        <div className={styles.workflowContent}>
          {/* Header */}
          <div className={styles.header}>
            <Typography variant="heading-3" className={styles.title}>
              Order Pickup Verification
            </Typography>
            <Typography variant="body-medium" className={styles.subtitle}>
              Scan customer QR codes to verify and complete orders
            </Typography>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>✓</div>
              <Typography variant="body-medium" className={styles.successText}>
                {successMessage}
              </Typography>
            </div>
          )}

          {/* Ready Orders Summary */}
          {readyOrders.length > 0 && (
            <div className={styles.readyOrders}>
              <Typography variant="heading-5" className={styles.sectionTitle}>
                Orders Ready for Pickup ({readyOrders.length})
              </Typography>
              <div className={styles.ordersList}>
                {readyOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className={styles.orderItem}>
                    <Typography variant="body-medium" className={styles.orderNumber}>
                      #{order.orderNumber}
                    </Typography>
                    {order.customerName && (
                      <Typography variant="body-small" className={styles.customerName}>
                        {order.customerName}
                      </Typography>
                    )}
                    {order.estimatedReadyTime && (
                      <Typography variant="caption" className={styles.readyTime}>
                        Ready: {new Date(order.estimatedReadyTime).toLocaleTimeString()}
                      </Typography>
                    )}
                  </div>
                ))}
                {readyOrders.length > 5 && (
                  <Typography variant="caption" className={styles.moreOrders}>
                    +{readyOrders.length - 5} more orders
                  </Typography>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.scanButton}
              onClick={handleStartScanning}
              disabled={isProcessing}
            >
              <span className={styles.scanIcon}>📱</span>
              Scan QR Code for Pickup
            </button>
          </div>

          {/* Instructions */}
          <div className={styles.instructions}>
            <Typography variant="body-small" className={styles.instructionText}>
              When a customer arrives for pickup, ask them to show their order QR code 
              and tap the scan button to verify and complete their order.
            </Typography>
          </div>
        </div>
      )}

      {/* QR Scanner */}
      {showScanner && (
        <QRScanner
          isActive={true}
          isProcessing={isProcessing}
          onScan={handleScanSuccess}
          onError={handleScanError}
          onClose={handleCloseScanner}
        />
      )}
    </div>
  );
};

export default QRWorkflow;
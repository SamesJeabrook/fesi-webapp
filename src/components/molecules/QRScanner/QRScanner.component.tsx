import React, { useRef, useEffect, useState } from 'react';
import { QRScannerProps } from './QRScanner.types';
import { Typography } from '../../atoms/Typography';
import styles from './QRScanner.module.scss';

const QRScanner: React.FC<QRScannerProps> = ({
  isActive = false,
  onScan,
  onError,
  onClose,
  isProcessing = false,
  className = '',
  'data-testid': testId = 'qr-scanner'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanMessage, setScanMessage] = useState('Position QR code within the frame');

  // Initialize camera and start scanning
  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Start scanning once video is ready
        videoRef.current.onloadedmetadata = () => {
          startScanning();
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          onError?.('Camera permission denied. Please allow camera access to scan QR codes.');
        } else if (error.name === 'NotFoundError') {
          onError?.('No camera found. Please ensure your device has a camera.');
        } else {
          onError?.('Camera error: ' + error.message);
        }
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setHasPermission(null);
  };

  const startScanning = () => {
    if (!videoRef.current || !canvasRef.current) return;

    intervalRef.current = setInterval(() => {
      scanForQRCode();
    }, 300); // Scan every 300ms
  };

  const scanForQRCode = () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Simulate QR code detection (in real implementation, use a QR library like jsQR)
    const qrResult = detectQRCode(imageData);
    
    if (qrResult) {
      try {
        const qrData = JSON.parse(qrResult);
        
        // Validate QR data structure
        if (validateQRData(qrData)) {
          setScanMessage('QR Code detected! Processing...');
          onScan?.(qrData);
        } else {
          setScanMessage('Invalid QR code format');
          setTimeout(() => setScanMessage('Position QR code within the frame'), 2000);
        }
      } catch (error) {
        setScanMessage('Invalid QR code data');
        setTimeout(() => setScanMessage('Position QR code within the frame'), 2000);
      }
    }
  };

  // Placeholder QR detection function - replace with actual QR library
  const detectQRCode = (imageData: ImageData): string | null => {
    // This is a placeholder - in real implementation, use jsQR or similar library
    // For now, we'll simulate detection based on canvas content
    
    // Check for specific patterns that might indicate a QR code
    const data = imageData.data;
    let darkPixels = 0;
    let lightPixels = 0;
    
    // Sample pixels to detect contrast patterns
    for (let i = 0; i < data.length; i += 40) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (brightness < 128) darkPixels++;
      else lightPixels++;
    }
    
    // If we have good contrast (indication of QR pattern), simulate successful scan
    const contrastRatio = Math.abs(darkPixels - lightPixels) / (darkPixels + lightPixels);
    
    if (contrastRatio > 0.3 && darkPixels > 10 && lightPixels > 10) {
      // Simulate returning QR data for testing
      return JSON.stringify({
        orderId: 'order_123',
        orderNumber: 'ORD-2025-001',
        customerId: 'customer_123',
        merchantId: 'merchant_456',
        hash: 'abc123def456'
      });
    }
    
    return null;
  };

  const validateQRData = (data: any): boolean => {
    return (
      typeof data === 'object' &&
      typeof data.orderId === 'string' &&
      typeof data.orderNumber === 'string' &&
      typeof data.customerId === 'string' &&
      typeof data.hash === 'string'
    );
  };

  const handleRetryCamera = () => {
    setHasPermission(null);
    startCamera();
  };

  return (
    <div className={`${styles.qrScanner} ${className}`} data-testid={testId}>
      {/* Header */}
      <div className={styles.header}>
        <Typography variant="heading-3" className={styles.title}>
          Scan Order QR Code
        </Typography>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close QR scanner"
        >
          ×
        </button>
      </div>

      {/* Scanner Content */}
      <div className={styles.scannerContent}>
        {hasPermission === false ? (
          <div className={styles.errorState}>
            <Typography variant="body-medium" className={styles.errorMessage}>
              Camera access required to scan QR codes
            </Typography>
            <button
              type="button"
              className={styles.retryButton}
              onClick={handleRetryCamera}
            >
              Retry Camera Access
            </button>
          </div>
        ) : hasPermission === null ? (
          <div className={styles.loadingState}>
            <Typography variant="body-medium">
              Requesting camera access...
            </Typography>
          </div>
        ) : (
          <div className={styles.cameraContainer}>
            {/* Video Stream */}
            <video
              ref={videoRef}
              className={styles.videoStream}
              playsInline
              muted
            />
            
            {/* Hidden canvas for processing */}
            <canvas
              ref={canvasRef}
              className={styles.hiddenCanvas}
              style={{ display: 'none' }}
            />
            
            {/* Scan Frame Overlay */}
            <div className={styles.scanFrame}>
              <div className={styles.scanCorners}>
                <div className={`${styles.corner} ${styles.topLeft}`} />
                <div className={`${styles.corner} ${styles.topRight}`} />
                <div className={`${styles.corner} ${styles.bottomLeft}`} />
                <div className={`${styles.corner} ${styles.bottomRight}`} />
              </div>
            </div>
            
            {/* Processing Overlay */}
            {isProcessing && (
              <div className={styles.processingOverlay}>
                <div className={styles.spinner} />
                <Typography variant="body-medium" className={styles.processingText}>
                  Processing order...
                </Typography>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Message */}
      {hasPermission && (
        <div className={styles.footer}>
          <Typography variant="body-small" className={styles.scanMessage}>
            {scanMessage}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
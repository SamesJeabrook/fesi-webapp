import { Order, Customer } from '../types';

export interface QRVerificationData {
  orderId: string;
  orderNumber: string;
  customerId: string;
  merchantId?: string;
  hash: string;
}

export interface QRVerificationResult {
  success: boolean;
  order?: Order;
  customer?: Customer;
  error?: string;
}

export class QRVerificationService {
  private static readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  /**
   * Verify QR code data and retrieve order information
   */
  static async verifyQRCode(qrData: QRVerificationData): Promise<QRVerificationResult> {
    try {
      // Validate QR data structure
      if (!this.validateQRData(qrData)) {
        return {
          success: false,
          error: 'Invalid QR code format'
        };
      }

      // Call API to verify QR code and get order
      const response = await fetch(`${this.API_BASE_URL}/api/orders/verify-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(qrData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || 'Failed to verify QR code'
        };
      }

      const { order } = await response.json();

      // Validate that order can be completed
      if (order.status !== 'ready') {
        return {
          success: false,
          error: `Order is ${order.status}, not ready for pickup`
        };
      }

      return {
        success: true,
        order
      };

    } catch (error) {
      console.error('QR verification error:', error);
      return {
        success: false,
        error: 'Network error during verification'
      };
    }
  }

  /**
   * Complete order after successful QR verification
   */
  static async completeOrder(orderId: string): Promise<QRVerificationResult> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/orders/${orderId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || 'Failed to complete order'
        };
      }

      const { order } = await response.json();

      return {
        success: true,
        order
      };

    } catch (error) {
      console.error('Order completion error:', error);
      return {
        success: false,
        error: 'Network error during order completion'
      };
    }
  }

  /**
   * Generate QR code data for an order
   */
  static generateQRData(order: Order, customer: Customer): QRVerificationData {
    // Create a hash for verification
    const hash = this.generateVerificationHash(order, customer);

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerId: customer.id,
      merchantId: order.merchantId,
      hash
    };
  }

  /**
   * Validate QR data structure
   */
  private static validateQRData(data: any): data is QRVerificationData {
    return (
      typeof data === 'object' &&
      typeof data.orderId === 'string' &&
      typeof data.orderNumber === 'string' &&
      typeof data.customerId === 'string' &&
      typeof data.hash === 'string' &&
      data.orderId.length > 0 &&
      data.orderNumber.length > 0 &&
      data.customerId.length > 0 &&
      data.hash.length > 0
    );
  }

  /**
   * Generate verification hash for order security
   */
  private static generateVerificationHash(order: Order, customer: Customer): string {
    // In production, use a proper cryptographic hash with secret key
    // For now, we'll use a simple hash based on order data
    const dataString = `${order.id}-${order.orderNumber}-${customer.id}-${order.createdAt}`;
    
    // Simple hash function (replace with proper crypto in production)
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Mock verification for development/testing
   */
  static async mockVerifyQRCode(qrData: QRVerificationData): Promise<QRVerificationResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (!this.validateQRData(qrData)) {
      return {
        success: false,
        error: 'Invalid QR code format'
      };
    }

    // Mock order data
    const mockOrder: Order = {
      id: qrData.orderId,
      customerId: qrData.customerId,
      merchantId: qrData.merchantId || 'merchant_1',
      orderNumber: qrData.orderNumber,
      status: 'ready',
      items: [
        {
          id: 'item_1',
          orderId: qrData.orderId,
          menuItemId: 'menu_item_1',
          menuItemName: 'Test Item',
          quantity: 1,
          unitPrice: 1299,
          totalPrice: 1299,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      subtotal: 1299,
      deliveryFee: 0,
      platformFee: 130,
      total: 1429,
      currency: 'USD',
      paymentStatus: 'succeeded',
      orderType: 'pickup',
      estimatedDeliveryTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Mock customer data
    const mockCustomer: Customer = {
      id: qrData.customerId,
      userId: 'user_1',
      email: 'customer@example.com',
      name: 'John Doe',
      phone: '+1234567890',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      order: mockOrder,
      customer: mockCustomer
    };
  }
}
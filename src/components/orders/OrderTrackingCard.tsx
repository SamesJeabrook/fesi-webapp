// Order Tracking Card Component
// Displays order status with notification settings and wallet pass download

'use client';

import React, { useState, useEffect } from 'react';
import pushNotificationService from '@/services/pushNotificationService';
import AddToWallet from '../wallet/AddToWallet';
import NotificationPermission from '../notifications/NotificationPermission';

interface OrderTrackingCardProps {
  orderId: string;
  orderStatus: string;
  merchantName: string;
  estimatedTime?: string;
  showWalletOption?: boolean;
  showNotificationPrompt?: boolean;
  className?: string;
}

const ORDER_STATUS_CONFIG = {
  pending: {
    icon: '⏳',
    title: 'Order Received',
    description: 'Your order has been received and is being processed',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  },
  preparing: {
    icon: '👨‍🍳',
    title: 'Being Prepared',
    description: 'Your food is being prepared with care',
    color: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  ready: {
    icon: '✅',
    title: 'Ready for Pickup',
    description: 'Your order is ready! Please come pick it up',
    color: 'bg-green-100 text-green-800 border-green-300'
  },
  delivering: {
    icon: '🚗',
    title: 'Out for Delivery',
    description: 'Your order is on the way',
    color: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  completed: {
    icon: '🎉',
    title: 'Completed',
    description: 'Order delivered. Enjoy your meal!',
    color: 'bg-green-100 text-green-800 border-green-300'
  },
  cancelled: {
    icon: '❌',
    title: 'Cancelled',
    description: 'This order has been cancelled',
    color: 'bg-red-100 text-red-800 border-red-300'
  }
};

export const OrderTrackingCard: React.FC<OrderTrackingCardProps> = ({
  orderId,
  orderStatus,
  merchantName,
  estimatedTime,
  showWalletOption = true,
  showNotificationPrompt = true,
  className = ''
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);

  const statusConfig = ORDER_STATUS_CONFIG[orderStatus as keyof typeof ORDER_STATUS_CONFIG] || ORDER_STATUS_CONFIG.pending;

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const enabled = pushNotificationService.isEnabled();
    setNotificationsEnabled(enabled);
    
    // Show notification prompt if not enabled and not completed/cancelled
    if (!enabled && showNotificationPrompt && !['completed', 'cancelled'].includes(orderStatus)) {
      setShowNotificationBanner(true);
    }
  };

  const handleNotificationPermissionGranted = () => {
    setNotificationsEnabled(true);
    setShowNotificationBanner(false);
  };

  const getProgressPercentage = () => {
    const statusOrder = ['pending', 'preparing', 'ready', 'delivering', 'completed'];
    const currentIndex = statusOrder.indexOf(orderStatus);
    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const isActive = !['completed', 'cancelled'].includes(orderStatus);

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Notification Banner */}
      {showNotificationBanner && (
        <NotificationPermission
          onPermissionGranted={handleNotificationPermissionGranted}
          onPermissionDenied={() => setShowNotificationBanner(false)}
          className="border-b"
        />
      )}

      {/* Header */}
      <div className={`p-6 border-b-4 ${statusConfig.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{statusConfig.icon}</span>
            <div>
              <h3 className="text-2xl font-bold">{statusConfig.title}</h3>
              <p className="text-sm opacity-80">{statusConfig.description}</p>
            </div>
          </div>
          {notificationsEnabled && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span className="text-sm font-medium">Notifications On</span>
            </div>
          )}
        </div>
      </div>

      {/* Order Details */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-mono font-semibold">{orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">From</p>
            <p className="font-semibold">{merchantName}</p>
          </div>
        </div>

        {estimatedTime && isActive && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-600">Estimated Time</p>
                <p className="font-semibold text-orange-900">{estimatedTime}</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isActive && (
          <div className="pt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Progress</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}

        {/* Status Timeline */}
        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Timeline</h4>
          <div className="space-y-2">
            {Object.entries(ORDER_STATUS_CONFIG).map(([status, config]) => {
              const statusOrder = ['pending', 'preparing', 'ready', 'delivering', 'completed'];
              const currentIndex = statusOrder.indexOf(orderStatus);
              const thisIndex = statusOrder.indexOf(status);
              const isPast = thisIndex <= currentIndex;
              const isCurrent = status === orderStatus;

              if (status === 'cancelled') return null;

              return (
                <div
                  key={status}
                  className={`flex items-center gap-3 ${
                    isPast ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCurrent
                        ? 'bg-orange-600 text-white ring-4 ring-orange-200'
                        : isPast
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isPast && !isCurrent ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-sm">{config.icon}</span>
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isCurrent ? 'text-orange-900' : ''}`}>
                      {config.title}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-gray-500">{config.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wallet Pass Option */}
        {showWalletOption && (
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Track Your Order
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Add this order to your wallet for quick access and automatic updates.
            </p>
            <AddToWallet orderId={orderId} size="medium" />
          </div>
        )}

        {/* Help Text */}
        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <h5 className="text-sm font-semibold text-gray-700 mb-2">Need Help?</h5>
          <p className="text-xs text-gray-600">
            {isActive
              ? 'If you have any questions about your order, please contact the merchant directly.'
              : 'Thank you for your order! We hope you enjoyed your meal.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingCard;

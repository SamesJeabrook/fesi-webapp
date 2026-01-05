// Notification Permission Request Component
// Prompts users to enable push notifications for order updates

'use client';

import React, { useState, useEffect } from 'react';
import pushNotificationService from '@/services/pushNotificationService';

interface NotificationPermissionProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
  className?: string;
  showAsModal?: boolean;
}

export const NotificationPermission: React.FC<NotificationPermissionProps> = ({
  onPermissionGranted,
  onPermissionDenied,
  className = '',
  showAsModal = false
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    // Check if notifications are supported
    if (!pushNotificationService.isSupported()) {
      setIsSupported(false);
      return;
    }

    // Get current permission state
    setPermission(Notification.permission);

    // Check subscription status
    if (Notification.permission === 'granted') {
      const subscription = await pushNotificationService.getSubscription();
      setIsSubscribed(!!subscription);
    }

    // Show prompt if permission not yet requested
    if (Notification.permission === 'default') {
      setShowPrompt(true);
    }
  };

  const handleEnableNotifications = async () => {
    setIsLoading(true);

    try {
      // Initialize service worker
      await pushNotificationService.initialize();

      // Request permission
      const result = await pushNotificationService.requestPermission();

      setPermission(result.permission);

      if (result.permission === 'granted') {
        setIsSubscribed(!!result.subscription);
        setShowPrompt(false);
        onPermissionGranted?.();
      } else {
        onPermissionDenied?.();
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setIsLoading(true);

    try {
      await pushNotificationService.unsubscribe();
      setIsSubscribed(false);
    } catch (error) {
      console.error('Error disabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // Don't show if not supported
  if (!isSupported) {
    return null;
  }

  // Don't show if already granted or denied (unless explicitly showing as modal)
  if (!showAsModal && permission !== 'default' && !showPrompt) {
    return null;
  }

  // Modal version
  if (showAsModal) {
    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Stay Updated on Your Orders
            </h3>
          </div>

          <p className="text-gray-600 mb-6">
            Enable notifications to receive real-time updates about your order status, including when your food is being prepared, ready for pickup, or out for delivery.
          </p>

          {permission === 'granted' && isSubscribed ? (
            <div className="space-y-3">
              <div className="flex items-center text-green-600 mb-4">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Notifications enabled
              </div>
              <button
                onClick={handleDisableNotifications}
                disabled={isLoading}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {isLoading ? 'Disabling...' : 'Disable Notifications'}
              </button>
            </div>
          ) : permission === 'denied' ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                Notifications are blocked. To enable them, please update your browser settings.
              </p>
            </div>
          ) : (
            <button
              onClick={handleEnableNotifications}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {isLoading ? 'Enabling...' : 'Enable Notifications'}
            </button>
          )}

          <button
            onClick={handleDismiss}
            className="w-full mt-3 py-2 text-gray-600 hover:text-gray-800"
          >
            Maybe Later
          </button>
        </div>
      </div>
    );
  }

  // Banner version
  if (!showPrompt) {
    return null;
  }

  return (
    <div className={`bg-orange-50 border-l-4 border-orange-400 p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-orange-800">
            <strong className="font-medium">Get order updates!</strong> Enable notifications to track your order in real-time.
          </p>
          <div className="mt-2 flex space-x-3">
            <button
              onClick={handleEnableNotifications}
              disabled={isLoading}
              className="text-sm font-medium text-orange-800 hover:text-orange-900 disabled:opacity-50"
            >
              {isLoading ? 'Enabling...' : 'Enable'}
            </button>
            <button
              onClick={handleDismiss}
              className="text-sm font-medium text-orange-700 hover:text-orange-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermission;

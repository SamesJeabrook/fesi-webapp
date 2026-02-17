// Push Notification Service - Frontend
// Handles push notification subscription and management

import api from '@/utils/api';

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface NotificationPermissionResult {
  permission: NotificationPermission;
  subscription?: PushSubscription;
  error?: string;
}

class PushNotificationService {
  private vapidPublicKey: string | null = null;

  /**
   * Initialize service worker and get VAPID public key
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if service workers are supported
      if (!('serviceWorker' in navigator)) {
        console.warn('Service Workers not supported');
        return false;
      }

      // Check if push notifications are supported
      if (!('PushManager' in window)) {
        console.warn('Push notifications not supported');
        return false;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });

      console.log('Service Worker registered:', registration);

      // Get VAPID public key from backend
      const response = await api.get('/api/push/vapid-public-key');
      this.vapidPublicKey = response.data.publicKey;

      return true;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return false;
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermissionResult> {
    try {
      // Check current permission
      if (Notification.permission === 'granted') {
        const subscription = await this.getSubscription();
        return { 
          permission: 'granted',
          subscription: subscription || undefined
        };
      }

      // Request permission
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        // Subscribe to push notifications
        const subscription = await this.subscribe();
        return { 
          permission: 'granted',
          subscription: subscription || undefined
        };
      }

      return { permission };
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return {
        permission: Notification.permission,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(): Promise<PushSubscription | null> {
    try {
      if (!this.vapidPublicKey) {
        await this.initialize();
      }

      if (!this.vapidPublicKey) {
        throw new Error('VAPID public key not available');
      }

      const registration = await navigator.serviceWorker.ready;

      // Check for existing subscription
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Create new subscription
        const applicationServerKey = this.urlBase64ToUint8Array(this.vapidPublicKey);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey as BufferSource
        });
      }

      // Send subscription to backend
      const subscriptionObject = subscription.toJSON();
      await api.post('/api/push/subscribe', subscriptionObject);

      return subscriptionObject as PushSubscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Unsubscribe on device
        await subscription.unsubscribe();

        // Notify backend
        const subscriptionObject = subscription.toJSON();
        await api.post('/api/push/unsubscribe', subscriptionObject);
      }

      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }

  /**
   * Get current subscription status
   */
  async getSubscription(): Promise<PushSubscription | null> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      return subscription ? subscription.toJSON() as PushSubscription : null;
    } catch (error) {
      console.error('Error getting subscription:', error);
      return null;
    }
  }

  /**
   * Check if notifications are enabled
   */
  isEnabled(): boolean {
    return Notification.permission === 'granted';
  }

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  /**
   * Send a test notification
   */
  async sendTestNotification(): Promise<boolean> {
    try {
      await api.post('/api/push/test');
      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  }

  /**
   * Show a local notification (without push)
   */
  async showLocalNotification(title: string, options?: NotificationOptions): Promise<boolean> {
    try {
      if (Notification.permission !== 'granted') {
        return false;
      }

      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/logo192.png',
        badge: '/badge-72x72.png',
        ...options
      });

      return true;
    } catch (error) {
      console.error('Error showing local notification:', error);
      return false;
    }
  }

  /**
   * Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray as Uint8Array;
  }
}

export default new PushNotificationService();

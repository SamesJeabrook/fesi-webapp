import { useEffect, useRef, useState } from 'react';

interface UseNewOrderNotificationProps {
  orders: any[];
  enabled?: boolean;
}

/**
 * Hook to play a sound notification when new orders arrive
 * Compares current order count with previous to detect new orders
 */
export function useNewOrderNotification({ orders, enabled = true }: UseNewOrderNotificationProps) {
  const previousOrderCountRef = useRef<number>(0);
  const [hasPlayedInitialLoad, setHasPlayedInitialLoad] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element on mount
    if (enabled && typeof window !== 'undefined') {
      // Using a simple notification sound (browser default or data URI)
      audioRef.current = new Audio();
      // Simple beep sound as data URI (440Hz sine wave)
      audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGH0fPTgjMGHm7A7+OZTR';
      audioRef.current.volume = 0.5;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !orders || orders.length === 0) {
      return;
    }

    // Skip notification on initial load
    if (!hasPlayedInitialLoad) {
      previousOrderCountRef.current = orders.length;
      setHasPlayedInitialLoad(true);
      return;
    }

    // Get count of pending orders
    const pendingOrders = orders.filter(order => order.status === 'pending');
    const previousPendingCount = previousOrderCountRef.current;
    const currentPendingCount = pendingOrders.length;

    // Play sound if there are NEW pending orders
    if (currentPendingCount > previousPendingCount) {
      const newOrdersCount = currentPendingCount - previousPendingCount;
      console.log(`🔔 ${newOrdersCount} new order(s) detected!`);
      
      if (audioRef.current) {
        // Play sound
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => {
          console.warn('Failed to play notification sound:', err);
          // Browser might block autoplay - user needs to interact first
        });
      }

      // Show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Order!', {
          body: `You have ${newOrdersCount} new order(s)`,
          icon: '/favicon.ico',
          tag: 'new-order',
        });
      }
    }

    // Update the reference
    previousOrderCountRef.current = currentPendingCount;
  }, [orders, enabled, hasPlayedInitialLoad]);

  return {
    requestNotificationPermission: async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return Notification.permission === 'granted';
    },
  };
}

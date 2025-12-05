/**
 * Centralized WebSocket Hook
 * 
 * Manages a single WebSocket connection that multiple components can subscribe to.
 * This prevents multiple connection attempts and properly handles errors.
 */

import { useEffect, useRef, useCallback, useState } from 'react';

interface WebSocketMessage {
  type: string;
  payload?: any;
  [key: string]: any;
}

interface UseWebSocketOptions {
  /** Whether this hook should be active */
  enabled?: boolean;
  /** Callback when a message is received */
  onMessage?: (message: WebSocketMessage) => void;
  /** Callback when connection opens */
  onOpen?: () => void;
  /** Callback when connection closes */
  onClose?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Event) => void;
  /** Auto-reconnect on close (default: true) */
  autoReconnect?: boolean;
  /** Reconnect delay in ms (default: 3000) */
  reconnectDelay?: number;
}

interface UseWebSocketReturn {
  /** Send a message through the WebSocket */
  sendMessage: (message: any) => void;
  /** Current connection status */
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  /** Manually reconnect */
  reconnect: () => void;
  /** Close the connection */
  close: () => void;
}

// Singleton WebSocket instance shared across all components
let sharedSocket: WebSocket | null = null;
let connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error' = 'disconnected';
let reconnectTimeout: NodeJS.Timeout | null = null;
const subscribers = new Set<(message: WebSocketMessage) => void>();
const statusSubscribers = new Set<(status: typeof connectionStatus) => void>();

/**
 * Create or get the shared WebSocket connection
 */
function getWebSocketConnection(
  url: string,
  onOpenCallback?: () => void,
  onCloseCallback?: () => void,
  onErrorCallback?: (error: Event) => void,
  autoReconnect = true,
  reconnectDelay = 3000
): WebSocket | null {
  // If socket exists and is open/connecting, return it
  if (sharedSocket && (sharedSocket.readyState === WebSocket.OPEN || sharedSocket.readyState === WebSocket.CONNECTING)) {
    return sharedSocket;
  }

  // Clear any existing reconnect timeout
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  try {
    console.log('Creating new WebSocket connection to:', url);
    updateConnectionStatus('connecting');
    
    sharedSocket = new WebSocket(url);

    sharedSocket.onopen = () => {
      console.log('✅ WebSocket connection established');
      updateConnectionStatus('connected');
      onOpenCallback?.();
    };

    sharedSocket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        // Broadcast to all subscribers
        subscribers.forEach((callback) => {
          try {
            callback(message);
          } catch (error) {
            console.error('Error in WebSocket message subscriber:', error);
          }
        });
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    sharedSocket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      updateConnectionStatus('error');
      onErrorCallback?.(error);
    };

    sharedSocket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      updateConnectionStatus('disconnected');
      sharedSocket = null;
      onCloseCallback?.();

      // Auto-reconnect if enabled and not a normal closure
      if (autoReconnect && event.code !== 1000) {
        console.log(`Reconnecting in ${reconnectDelay}ms...`);
        reconnectTimeout = setTimeout(() => {
          getWebSocketConnection(url, onOpenCallback, onCloseCallback, onErrorCallback, autoReconnect, reconnectDelay);
        }, reconnectDelay);
      }
    };

    return sharedSocket;
  } catch (error) {
    console.error('Failed to create WebSocket connection:', error);
    updateConnectionStatus('error');
    
    // Auto-reconnect on creation failure
    if (autoReconnect) {
      reconnectTimeout = setTimeout(() => {
        getWebSocketConnection(url, onOpenCallback, onCloseCallback, onErrorCallback, autoReconnect, reconnectDelay);
      }, reconnectDelay);
    }
    
    return null;
  }
}

/**
 * Update connection status and notify all subscribers
 */
function updateConnectionStatus(status: typeof connectionStatus) {
  connectionStatus = status;
  statusSubscribers.forEach((callback) => {
    try {
      callback(status);
    } catch (error) {
      console.error('Error in status subscriber:', error);
    }
  });
}

/**
 * Close the shared WebSocket connection
 */
function closeSharedConnection() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  
  if (sharedSocket) {
    sharedSocket.close(1000, 'Client closing connection');
    sharedSocket = null;
  }
  
  updateConnectionStatus('disconnected');
}

/**
 * Hook for using the shared WebSocket connection
 */
export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    enabled = true,
    onMessage,
    onOpen,
    onClose,
    onError,
    autoReconnect = true,
    reconnectDelay = 3000,
  } = options;

  const [status, setStatus] = useState<typeof connectionStatus>(connectionStatus);
  const messageCallbackRef = useRef(onMessage);
  const openCallbackRef = useRef(onOpen);
  const closeCallbackRef = useRef(onClose);
  const errorCallbackRef = useRef(onError);

  // Keep refs up to date
  useEffect(() => {
    messageCallbackRef.current = onMessage;
    openCallbackRef.current = onOpen;
    closeCallbackRef.current = onClose;
    errorCallbackRef.current = onError;
  }, [onMessage, onOpen, onClose, onError]);

  // Setup WebSocket connection and subscriptions
  useEffect(() => {
    if (!enabled) return;

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'}/orders`;

    // Create message subscriber
    const messageSubscriber = (message: WebSocketMessage) => {
      messageCallbackRef.current?.(message);
    };

    // Create status subscriber
    const statusSubscriber = (newStatus: typeof connectionStatus) => {
      setStatus(newStatus);
    };

    // Add subscribers
    subscribers.add(messageSubscriber);
    statusSubscribers.add(statusSubscriber);

    // Get or create connection
    const socket = getWebSocketConnection(
      wsUrl,
      () => openCallbackRef.current?.(),
      () => closeCallbackRef.current?.(),
      (error) => errorCallbackRef.current?.(error),
      autoReconnect,
      reconnectDelay
    );

    // Update initial status
    setStatus(connectionStatus);

    // Cleanup on unmount
    return () => {
      subscribers.delete(messageSubscriber);
      statusSubscribers.delete(statusSubscriber);

      // Only close the connection if there are no more subscribers
      if (subscribers.size === 0) {
        closeSharedConnection();
      }
    };
  }, [enabled, autoReconnect, reconnectDelay]);

  // Send message function
  const sendMessage = useCallback((message: any) => {
    if (sharedSocket && sharedSocket.readyState === WebSocket.OPEN) {
      try {
        const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
        sharedSocket.send(messageStr);
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
      }
    } else {
      console.warn('WebSocket is not connected. Cannot send message:', message);
    }
  }, []);

  // Reconnect function
  const reconnect = useCallback(() => {
    closeSharedConnection();
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'}/orders`;
    getWebSocketConnection(
      wsUrl,
      () => openCallbackRef.current?.(),
      () => closeCallbackRef.current?.(),
      (error) => errorCallbackRef.current?.(error),
      autoReconnect,
      reconnectDelay
    );
  }, [autoReconnect, reconnectDelay]);

  // Close function
  const close = useCallback(() => {
    closeSharedConnection();
  }, []);

  return {
    sendMessage,
    status,
    reconnect,
    close,
  };
}

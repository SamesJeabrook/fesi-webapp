'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { NotificationContainer, type Notification } from '@/components/organisms/NotificationContainer';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import type { AlertVariant } from '@/components/atoms/Alert';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
}

interface NotificationContextValue {
  showNotification: (message: string, variant?: AlertVariant, title?: string, duration?: number) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const showNotification = useCallback(
    (message: string, variant: AlertVariant = 'info', title?: string, duration: number = 5000) => {
      const id = Math.random().toString(36).substring(7);
      const notification: Notification = {
        id,
        variant,
        title,
        message,
        duration,
      };

      setNotifications((prev) => [...prev, notification]);

      if (duration > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
      }
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, title?: string) => {
      showNotification(message, 'success', title);
    },
    [showNotification]
  );

  const showError = useCallback(
    (message: string, title?: string) => {
      showNotification(message, 'error', title);
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string, title?: string) => {
      showNotification(message, 'warning', title);
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string, title?: string) => {
      showNotification(message, 'info', title);
    },
    [showNotification]
  );

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmDialog({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleConfirm = () => {
    if (confirmDialog) {
      confirmDialog.resolve(true);
      setConfirmDialog(null);
    }
  };

  const handleCancel = () => {
    if (confirmDialog) {
      confirmDialog.resolve(false);
      setConfirmDialog(null);
    }
  };

  const handleDismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value: NotificationContextValue = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    confirm,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} onDismiss={handleDismiss} />
      {confirmDialog && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.options.title}
          message={confirmDialog.options.message}
          confirmText={confirmDialog.options.confirmText}
          cancelText={confirmDialog.options.cancelText}
          variant={confirmDialog.options.variant}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </NotificationContext.Provider>
  );
};

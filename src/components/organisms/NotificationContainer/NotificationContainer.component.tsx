'use client';

import React from 'react';
import { Alert, type AlertVariant } from '@/components/atoms/Alert';
import './NotificationContainer.scss';

export interface Notification {
  id: string;
  variant: AlertVariant;
  title?: string;
  message: string;
  duration?: number;
}

interface NotificationContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onDismiss,
}) => {
  return (
    <div className="notification-container" aria-live="polite" aria-atomic="true">
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          variant={notification.variant}
          title={notification.title}
          message={notification.message}
          onClose={() => onDismiss(notification.id)}
        />
      ))}
    </div>
  );
};

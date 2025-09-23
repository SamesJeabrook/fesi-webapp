import React from 'react';
import styles from './Notification.module.scss';
import type { NotificationProps } from './Notification.types';

const Notification: React.FC<NotificationProps> = ({
  message,
  subMessage,
  type = 'success',
  persistent = false,
  onClose,
  className = '',
}) => {
  return (
    <div
      className={[
        styles.notification,
        styles[type],
        className
      ].filter(Boolean).join(' ')}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <span className={styles.message}>{message}</span>
      {subMessage && <span className={styles.submessage}>{subMessage}</span>}
      {!persistent && onClose && (
        <button
          className={styles.closeButton}
          aria-label="Close notification"
          onClick={onClose}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Notification;

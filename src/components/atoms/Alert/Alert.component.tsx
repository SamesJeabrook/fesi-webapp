import React from 'react';
import './Alert.scss';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`alert alert--${variant} ${className}`} role="alert">
      <div className="alert__icon">
        {icons[variant]}
      </div>
      <div className="alert__content">
        {title && <div className="alert__title">{title}</div>}
        <div className="alert__message">{message}</div>
      </div>
      {onClose && (
        <button
          className="alert__close"
          onClick={onClose}
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};

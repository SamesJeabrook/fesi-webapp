import React from 'react';
import './Alert.scss';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export interface AlertAction {
  label: string;
  onClick?: () => void;
  href?: string;
  target?: '_blank' | '_self';
}

export interface AlertProps {
  variant?: AlertVariant;
  type?: AlertVariant; // Alias for variant for backward compatibility
  title?: string;
  message?: string;
  children?: React.ReactNode;
  actions?: AlertAction[];
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant,
  type,
  title,
  message,
  children,
  actions,
  onClose,
  className = '',
}) => {
  // Support both 'variant' and 'type' props
  const effectiveVariant = variant || type || 'info';
  
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`alert alert--${effectiveVariant} ${className}`} role="alert">
      <div className="alert__icon">
        {icons[effectiveVariant]}
      </div>
      <div className="alert__content">
        {title && <div className="alert__title">{title}</div>}
        {message && <div className="alert__message">{message}</div>}
        {children && <div className="alert__body">{children}</div>}
        {actions && actions.length > 0 && (
          <div className="alert__actions">
            {actions.map((action, index) => (
              action.href ? (
                <a
                  key={index}
                  href={action.href}
                  target={action.target}
                  className="alert__action-link"
                  rel={action.target === '_blank' ? 'noopener noreferrer' : undefined}
                >
                  {action.label}
                </a>
              ) : (
                <button
                  key={index}
                  type="button"
                  onClick={action.onClick}
                  className="alert__action-button"
                >
                  {action.label}
                </button>
              )
            ))}
          </div>
        )}
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

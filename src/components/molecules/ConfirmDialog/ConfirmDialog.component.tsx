'use client';

import React from 'react';
import { Button } from '@/components/atoms/Button';
import './ConfirmDialog.scss';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
  className = '',
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const variantMap = {
    danger: 'danger',
    warning: 'outline',
    primary: 'primary',
  } as const;

  return (
    <div className="confirm-dialog-overlay" onClick={handleOverlayClick}>
      <div className={`confirm-dialog ${className}`} role="alertdialog" aria-labelledby="dialog-title" aria-describedby="dialog-message">
        <div className="confirm-dialog__header">
          <h2 id="dialog-title" className="confirm-dialog__title">{title}</h2>
        </div>
        <div className="confirm-dialog__body">
          <p id="dialog-message" className="confirm-dialog__message">{message}</p>
        </div>
        <div className="confirm-dialog__footer">
          <Button
            variant="secondary"
            size="md"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button
            variant={variantMap[variant]}
            size="md"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

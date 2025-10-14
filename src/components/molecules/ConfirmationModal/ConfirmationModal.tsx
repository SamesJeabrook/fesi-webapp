import React from 'react';
import { Button } from '@/components/atoms';
import { Modal } from '@/components/molecules';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'secondary';
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const modalFooter = (
    <>
      <Button
        variant="secondary"
        onClick={onClose}
        isDisabled={isLoading}
      >
        {cancelText}
      </Button>
      <Button
        variant={variant}
        onClick={onConfirm}
        isDisabled={isLoading}
      >
        {isLoading ? 'Processing...' : confirmText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={modalFooter}
      size="small"
      closeOnOverlayClick={!isLoading}
    >
      <p style={{ margin: 0, lineHeight: 1.5 }}>{message}</p>
    </Modal>
  );
};
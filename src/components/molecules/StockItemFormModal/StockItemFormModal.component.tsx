'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { StockItemForm } from './StockItemForm.component';
import type { StockItemFormModalProps } from './StockItemFormModal.types';

export const StockItemFormModal: React.FC<StockItemFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add Stock Item' : 'Edit Stock Item'}
      size="large"
      closeOnOverlayClick={!isLoading}
    >
      <StockItemForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </Modal>
  );
};

export default StockItemFormModal;

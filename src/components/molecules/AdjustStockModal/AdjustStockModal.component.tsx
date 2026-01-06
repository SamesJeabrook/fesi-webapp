'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { AdjustStockForm } from './AdjustStockForm.component';
import type { AdjustStockModalProps } from './AdjustStockModal.types';

export const AdjustStockModal: React.FC<AdjustStockModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  stockItem,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error adjusting stock:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Adjust Stock: ${stockItem.name}`}
      size="medium"
      closeOnOverlayClick={!isLoading}
    >
      <AdjustStockForm
        stockItem={stockItem}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </Modal>
  );
};

export default AdjustStockModal;

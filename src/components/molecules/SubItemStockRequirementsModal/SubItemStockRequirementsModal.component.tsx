'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { AddStockRequirementForm } from '../MenuItemStockRequirementsModal/AddStockRequirementForm.component';
import { StockRequirementList } from '../MenuItemStockRequirementsModal/StockRequirementList.component';
import stockAPI from '@/services/stockAPI';
import type { StockItem, SubItemStockRequirement } from '@/types/stock.types';
import styles from '../MenuItemStockRequirementsModal/MenuItemStockRequirementsModal.module.scss';
import type { SubItemStockRequirementsModalProps, StockRequirementFormData } from './SubItemStockRequirementsModal.types';

export const SubItemStockRequirementsModal: React.FC<SubItemStockRequirementsModalProps> = ({
  isOpen,
  onClose,
  subItemId,
  subItemName,
  merchantId,
}) => {
  const [requirements, setRequirements] = useState<SubItemStockRequirement[]>([]);
  const [availableStockItems, setAvailableStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, subItemId, merchantId]);

  const loadData = async () => {
    try {
      setIsInitialLoading(true);
      const [reqData, stockData] = await Promise.all([
        stockAPI.getSubItemStockRequirements(subItemId),
        stockAPI.getStockItems(merchantId),
      ]);
      
      setRequirements(reqData);
      
      // Filter out already assigned stock items
      const assignedIds = new Set(reqData.map(r => r.stock_item_id));
      setAvailableStockItems(
        stockData.filter(item => !assignedIds.has(item.id) && item.is_active)
      );
    } catch (error) {
      console.error('Error loading sub item stock requirements:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleAddRequirement = async (data: StockRequirementFormData) => {
    setIsLoading(true);
    try {
      // Combine new requirement with existing ones
      const updatedRequirements = [
        ...requirements.map(r => ({
          stock_item_id: r.stock_item_id,
          quantity_required: r.quantity_required,
          is_optional: r.is_optional,
        })),
        data,
      ];

      await stockAPI.setSubItemStockRequirements(subItemId, {
        stockRequirements: updatedRequirements,
      });

      await loadData();
    } catch (error) {
      console.error('Error adding requirement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveRequirement = async (requirementId: string) => {
    setIsLoading(true);
    try {
      // Remove the requirement from the list
      const updatedRequirements = requirements
        .filter(r => r.id !== requirementId)
        .map(r => ({
          stock_item_id: r.stock_item_id,
          quantity_required: r.quantity_required,
          is_optional: r.is_optional,
        }));

      await stockAPI.setSubItemStockRequirements(subItemId, {
        stockRequirements: updatedRequirements,
      });

      await loadData();
    } catch (error) {
      console.error('Error removing requirement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Stock Requirements: ${subItemName}`}
      size="large"
      closeOnOverlayClick={!isLoading}
    >
      <div className={styles.content}>
        {isInitialLoading ? (
          <div className={styles.loading}>
            <div className={styles.loading__spinner} />
            <p>Loading stock requirements...</p>
          </div>
        ) : (
          <>
            {/* Current Requirements List */}
            <StockRequirementList
              requirements={requirements}
              onRemove={handleRemoveRequirement}
              isLoading={isLoading}
            />

            {/* Divider */}
            {requirements.length > 0 && availableStockItems.length > 0 && (
              <div className={styles.divider} />
            )}

            {/* Add New Requirement Form */}
            {availableStockItems.length > 0 ? (
              <AddStockRequirementForm
                availableStockItems={availableStockItems}
                onAdd={handleAddRequirement}
                isLoading={isLoading}
              />
            ) : requirements.length > 0 ? (
              <div className={styles.noItems}>
                <p>All stock items have been assigned to this option.</p>
              </div>
            ) : null}

            {/* Info Banner */}
            <div className={styles.infoBanner}>
              <span className={styles.infoBanner__icon}>💡</span>
              <div>
                <p className={styles.infoBanner__title}>How Stock Requirements Work</p>
                <p className={styles.infoBanner__text}>
                  When customers select this option (e.g., "Extra Pepperoni"), the specified stock quantities will automatically be deducted. 
                  Mark items as <strong>optional</strong> if this option should still be available when out of stock.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default SubItemStockRequirementsModal;

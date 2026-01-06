'use client';

import React from 'react';
import { Button, Badge } from '@/components/atoms';
import styles from './MenuItemStockRequirementsModal.module.scss';
import type { StockRequirementListProps } from './MenuItemStockRequirementsModal.types';

export const StockRequirementList: React.FC<StockRequirementListProps> = ({
  requirements,
  onRemove,
  isLoading = false,
}) => {
  if (requirements.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyState__icon}>📦</p>
        <p className={styles.emptyState__text}>No stock requirements set</p>
        <p className={styles.emptyState__subtext}>
          Add stock items below to automatically track inventory when orders are placed
        </p>
      </div>
    );
  }

  return (
    <div className={styles.requirementList}>
      <h3 className={styles.requirementList__title}>Current Requirements</h3>
      
      <div className={styles.requirementList__items}>
        {requirements.map((req) => (
          <div key={req.id} className={styles.requirement}>
            <div className={styles.requirement__info}>
              <div className={styles.requirement__name}>
                {req.stock_name}
                {req.is_optional && (
                  <Badge variant="info" size="sm">Optional</Badge>
                )}
              </div>
              <div className={styles.requirement__details}>
                <span className={styles.requirement__quantity}>
                  {req.quantity_required} {req.unit}
                </span>
                <span className={styles.requirement__separator}>•</span>
                <span className={styles.requirement__available}>
                  {req.current_quantity} {req.unit} available
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(req.id)}
              isDisabled={isLoading}
              className={styles.requirement__remove}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockRequirementList;

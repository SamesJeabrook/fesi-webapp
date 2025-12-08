/**
 * OptionGroupSelector Component
 * 
 * A reusable component for selecting and managing option groups (sub-item groups)
 * for menu items. Displays available groups with checkboxes and shows details
 * about each group's configuration.
 */

'use client';

import React from 'react';
import { OptionGroupSelectorProps, SubItemGroup } from './OptionGroupSelector.types';
import styles from './OptionGroupSelector.module.scss';

const OptionGroupSelector: React.FC<OptionGroupSelectorProps> = ({
  availableGroups,
  selectedGroupIds,
  onChange,
  disabled = false,
  loading = false,
  error
}) => {
  const handleToggle = (groupId: number) => {
    if (disabled) return;
    
    const isSelected = selectedGroupIds.includes(groupId);
    const newSelection = isSelected
      ? selectedGroupIds.filter(id => id !== groupId)
      : [...selectedGroupIds, groupId];
    
    onChange(newSelection);
  };

  const handleSelectAll = () => {
    if (disabled) return;
    onChange(availableGroups.map(group => group.id));
  };

  const handleClearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  const getGroupTypeLabel = (selectionType: string): string => {
    return selectionType === 'single' ? 'Single Choice' : 'Multiple Choice';
  };

  if (loading) {
    return (
      <div className={styles.optionGroupSelector__loading}>
        <div className={styles.optionGroupSelector__spinner}></div>
        <span className={styles.optionGroupSelector__loadingText}>Loading option groups...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.optionGroupSelector__error}>
        <p className={styles.optionGroupSelector__errorText}>{error}</p>
      </div>
    );
  }

  if (availableGroups.length === 0) {
    return (
      <div className={styles.optionGroupSelector__empty}>
        <p className={styles.optionGroupSelector__emptyTitle}>No option groups available</p>
        <p className={styles.optionGroupSelector__emptyDescription}>
          Create option groups first to assign them to menu items
        </p>
      </div>
    );
  }

  return (
    <div className={styles.optionGroupSelector__container}>
      {/* Header with bulk actions */}
      <div className={styles.optionGroupSelector__header}>
        <h3 className={styles.optionGroupSelector__title}>
          Option Groups ({selectedGroupIds.length} selected)
        </h3>
        <div className={styles.optionGroupSelector__bulkActions}>
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={disabled || selectedGroupIds.length === availableGroups.length}
            className={styles.optionGroupSelector__bulkButton}
          >
            Select All
          </button>
          <span className={styles.optionGroupSelector__divider}>|</span>
          <button
            type="button"
            onClick={handleClearAll}
            disabled={disabled || selectedGroupIds.length === 0}
            className={styles.optionGroupSelector__bulkButton}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Option groups list */}
      <div className={styles.optionGroupSelector__list}>
        {availableGroups.map((group) => {
          const isSelected = selectedGroupIds.includes(group.id);
          
          // Debug logging
          if (selectedGroupIds.length > 0) {
            console.log(`OptionGroupSelector - Group ${group.id} (${group.name}):`, {
              selectedGroupIds,
              groupId: group.id,
              groupIdType: typeof group.id,
              selectedIdsTypes: selectedGroupIds.map(id => typeof id),
              isSelected
            });
          }
          
          const cardClasses = [
            styles.optionGroupSelector__groupCard,
            isSelected && styles['optionGroupSelector__groupCard--selected'],
            disabled && styles['optionGroupSelector__groupCard--disabled']
          ].filter(Boolean).join(' ');

          const badgeClass = group.is_required 
            ? `${styles.optionGroupSelector__badge} ${styles['optionGroupSelector__badge--required']}`
            : `${styles.optionGroupSelector__badge} ${styles['optionGroupSelector__badge--optional']}`;
          
          return (
            <div
              key={group.id}
              onClick={() => handleToggle(group.id)}
              className={cardClasses}
            >
              <div className={styles.optionGroupSelector__cardContent}>
                {/* Checkbox */}
                <div className={styles.optionGroupSelector__checkboxWrapper}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggle(group.id)}
                    disabled={disabled}
                    className={styles.optionGroupSelector__checkbox}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Group details */}
                <div className={styles.optionGroupSelector__details}>
                  <div className={styles.optionGroupSelector__detailsHeader}>
                    <h4 className={styles.optionGroupSelector__groupName}>
                      {group.name}
                    </h4>
                    
                    {/* Badges */}
                    <div className={styles.optionGroupSelector__badges}>
                      <span className={badgeClass}>
                        {group.is_required ? 'Required' : 'Optional'}
                      </span>
                      
                      <span className={`${styles.optionGroupSelector__badge} ${styles['optionGroupSelector__badge--type']}`}>
                        {getGroupTypeLabel(group.selection_type)}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {group.description && (
                    <p className={styles.optionGroupSelector__description}>
                      {group.description}
                    </p>
                  )}

                  {/* Group metadata */}
                  <div className={styles.optionGroupSelector__metadata}>
                    {group.max_selections && (
                      <span>Max selections: {group.max_selections}</span>
                    )}
                    {group.sub_items && group.sub_items.length > 0 && (
                      <span>
                        {group.sub_items.length} option{group.sub_items.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Show sub-items if available */}
                  {isSelected && group.sub_items && group.sub_items.length > 0 && (
                    <div className={styles.optionGroupSelector__subItems}>
                      <p className={styles.optionGroupSelector__subItemsTitle}>Options:</p>
                      <div className={styles.optionGroupSelector__subItemsList}>
                        {group.sub_items.slice(0, 3).map((item) => (
                          <div key={item.id} className={styles.optionGroupSelector__subItem}>
                            <span>{item.name}</span>
                            {item.additional_price > 0 && (
                              <span className={styles.optionGroupSelector__subItemPrice}>
                                +£{(item.additional_price / 100).toFixed(2)}
                              </span>
                            )}
                            {item.additional_price < 0 && (
                              <span className={styles.optionGroupSelector__subItemPrice__negative}>
                                -£{(item.additional_price / 100).toFixed(2)}
                              </span>
                            )}
                          </div>
                        ))}
                        {group.sub_items.length > 3 && (
                          <p className={styles.optionGroupSelector__subItemsMore}>
                            +{group.sub_items.length - 3} more...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Help text */}
      <p className={styles.optionGroupSelector__helpText}>
        Select option groups to add customization options to this menu item.
        Customers will be able to choose from these options when ordering.
      </p>
    </div>
  );
};

export default OptionGroupSelector;

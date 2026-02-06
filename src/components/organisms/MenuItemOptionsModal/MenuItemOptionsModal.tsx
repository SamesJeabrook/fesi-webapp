import React from 'react';
import { Typography, Button } from '@/components/atoms';
import { Modal } from '@/components/molecules/Modal';
import styles from './MenuItemOptionsModal.module.scss';

export interface SubItem {
  id: string;
  name: string;
  additional_price: number;
  display_order: number;
}

export interface OptionGroup {
  id: string;
  name: string;
  selection_type: 'single' | 'multiple';
  is_required: boolean;
  max_selections: number | null;
  sub_items: SubItem[];
}

export interface MenuItem {
  id: string;
  title: string;
  base_price: number;
  category_name?: string;
  description?: string;
  image_url?: string;
  option_groups?: OptionGroup[];
}

export interface MenuItemOptionsModalProps {
  /** The menu item being customized */
  menuItem: MenuItem | null;
  /** Currently selected options { [groupId]: [subItemId, subItemId] } */
  selectedOptions: Record<string, string[]>;
  /** Whether the modal is open */
  isOpen: boolean;
  /** Handler for closing the modal */
  onClose: () => void;
  /** Handler for toggling an option selection */
  onOptionSelect: (groupId: string, subItemId: string, selectionType: 'single' | 'multiple', maxSelections: number | null) => void;
  /** Handler for adding item to cart with selections */
  onAddToCart: () => void;
  /** Optional notes for the item */
  notes?: string;
  /** Handler for notes change */
  onNotesChange?: (notes: string) => void;
}

export const MenuItemOptionsModal: React.FC<MenuItemOptionsModalProps> = ({
  menuItem,
  selectedOptions,
  isOpen,
  onClose,
  onOptionSelect,
  onAddToCart,
  notes = '',
  onNotesChange
}) => {
  console.log('MenuItemOptionsModal render - isOpen:', isOpen, 'menuItem:', menuItem);
  
  if (!menuItem) return null;

  const calculateTotal = () => {
    let total = menuItem.base_price;
    
    menuItem.option_groups?.forEach(group => {
      const selectedSubItemIds = selectedOptions[group.id] || [];
      group.sub_items.forEach(subItem => {
        if (selectedSubItemIds.includes(subItem.id)) {
          total += subItem.additional_price;
        }
      });
    });
    
    return total;
  };

  const isValid = () => {
    // Check if all required option groups have at least one selection
    return menuItem.option_groups?.every(group => {
      if (group.is_required) {
        const selections = selectedOptions[group.id] || [];
        return selections.length > 0;
      }
      return true;
    }) ?? true;
  };

  const footer = (
    <div className={styles.modalFooter}>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button 
        variant="primary" 
        onClick={onAddToCart}
        isDisabled={!isValid()}
      >
        Add to Cart - £{(calculateTotal() / 100).toFixed(2)}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={menuItem.title}
      footer={footer}
      size="medium"
    >
      {menuItem.description && (
        <Typography 
          variant="body-medium" 
          className={styles.description}
        >
          {menuItem.description}
        </Typography>
      )}

      <div className={styles.optionGroups}>
        {menuItem.option_groups?.map(group => (
          <div key={group.id} className={styles.optionGroup}>
            <div className={styles.optionGroup__header}>
              <Typography variant="heading-6" className={styles.optionGroup__title}>
                {group.name}
                {group.is_required && (
                  <span className={styles.optionGroup__required}>*</span>
                )}
              </Typography>
              {group.max_selections && group.max_selections > 1 && (
                <Typography variant="body-small" className={styles.optionGroup__limit}>
                  (Max {group.max_selections})
                </Typography>
              )}
            </div>
            
            <div className={styles.optionGroup__items}>
              {group.sub_items.map(subItem => {
                const isSelected = selectedOptions[group.id]?.includes(subItem.id);
                return (
                  <button
                    key={subItem.id}
                    type="button"
                    className={`${styles.optionItem} ${isSelected ? styles['optionItem--selected'] : ''}`}
                    onClick={() => onOptionSelect(group.id, subItem.id, group.selection_type, group.max_selections)}
                    aria-pressed={isSelected}
                  >
                    <span className={styles.optionItem__name}>{subItem.name}</span>
                    {subItem.additional_price !== 0 && (
                      <span className={styles.optionItem__price}>
                        {subItem.additional_price > 0 ? '+' : ''}£{(subItem.additional_price / 100).toFixed(2)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {onNotesChange && (
        <div className={styles.notesSection}>
          <Typography variant="heading-6" className={styles.notesLabel}>
            Additional Notes
          </Typography>
          <Typography variant="body-small" className={styles.notesHint}>
            e.g., "No onions", "Extra sauce on the side"
          </Typography>
          <textarea
            className={styles.notesInput}
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Add any special requests..."
            rows={3}
          />
        </div>
      )}
    </Modal>
  );
};

export default MenuItemOptionsModal;

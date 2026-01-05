/**
 * MenuEditor Component
 * Form for creating and editing menus with menu item selection
 */

import React, { useState, useEffect } from 'react';
import { Typography, Button, Input } from '@/components/atoms';
import { Menu, CreateMenuPayload, UpdateMenuPayload } from '@/types/menu.types';
import styles from './MenuEditor.module.scss';

interface MenuItem {
  id: string;
  merchant_id: string;
  category_id: string;
  title: string;
  description: string;
  image_url: string;
  base_price: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name: string;
  category_order: number;
  has_options: boolean;
}

interface Category {
  name: string;
  display_order: number;
  items: MenuItem[];
}

export interface MenuEditorProps {
  /** Menu being edited (null for create mode) */
  menu?: Menu | null;
  /** Available categories with their menu items */
  availableItems: Category[];
  /** Whether the form is submitting */
  isSubmitting?: boolean;
  /** Handler for form submission */
  onSubmit: (payload: CreateMenuPayload | UpdateMenuPayload) => void;
  /** Handler for cancel action */
  onCancel: () => void;
  /** Merchant ID (isRequired={true} for create mode) */
  merchantId: string;
}

export const MenuEditor: React.FC<MenuEditorProps> = ({
  menu,
  availableItems,
  isSubmitting = false,
  onSubmit,
  onCancel,
  merchantId,
}) => {
  const [name, setName] = useState(menu?.name || '');
  const [description, setDescription] = useState(menu?.description || '');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (menu?.items) {
      setSelectedItems(new Set(menu.items.map(item => item.id)));
    }
  }, [menu]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (menu) {
      // Update mode
      const payload: UpdateMenuPayload = {
        name,
        description,
        items: Array.from(selectedItems),
      };
      onSubmit(payload);
    } else {
      // Create mode
      const payload: CreateMenuPayload = {
        merchant_id: merchantId,
        name,
        description,
        items: Array.from(selectedItems),
      };
      onSubmit(payload);
    }
  };

  const toggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    const allItemIds = availableItems.flatMap(category => 
      category.items.map(item => item.id)
    );
    setSelectedItems(new Set(allItemIds));
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
  };

  const filteredCategories = availableItems.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className={styles.editor}>
      <div className={styles.editor__header}>
        <Typography variant="heading-3">
          {menu ? 'Edit Menu' : 'Create New Menu'}
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.form__section}>
          <Typography variant="heading-5">Menu Details</Typography>
          
          <div className={styles.form__field}>
            <label htmlFor="menu-name">
              <Typography variant="body-small">
                Name *
              </Typography>
            </label>
            <Input
              id="menu-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Lunch Menu, Dinner Special"
              isRequired={true}
            />
          </div>

          <div className={styles.form__field}>
            <label htmlFor="menu-description">
              <Typography variant="body-small">
                Description
              </Typography>
            </label>
            <textarea
              id="menu-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description for this menu"
              className={styles.form__textarea}
              rows={3}
            />
          </div>
        </div>

        <div className={styles.form__section}>
          <div className={styles.items__header}>
            <Typography variant="heading-5">Menu Items</Typography>
            <div className={styles.items__actions}>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={selectAll}
              >
                Select All
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={deselectAll}
              >
                Deselect All
              </Button>
            </div>
          </div>

          <div className={styles.form__field}>
            <Input
              id="search-items"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items..."
            />
          </div>

          <div className={styles.items__list}>
            {filteredCategories.length === 0 ? (
              <div className={styles.items__empty}>
                <Typography variant="body-small">
                  {searchTerm ? 'No items match your search' : 'No menu items available'}
                </Typography>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.name} className={styles.category}>
                  <div className={styles.category__header}>
                    <Typography variant="body-medium">
                      {category.name}
                    </Typography>
                  </div>
                  <div className={styles.category__items}>
                    {category.items.map((item) => (
                      <label key={item.id} className={styles.item}>
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleItem(item.id)}
                          className={styles.item__checkbox}
                        />
                        <div className={styles.item__details}>
                          <Typography variant="body-small">
                            {item.title}
                          </Typography>
                          {item.description && (
                            <Typography variant="body-small" className={styles.item__description}>
                              {item.description}
                            </Typography>
                          )}
                        </div>
                        <Typography variant="body-small">
                          £{(item.base_price / 100).toFixed(2)}
                        </Typography>
                      </label>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.items__summary}>
            <Typography variant="body-small">
              {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
            </Typography>
          </div>
        </div>

        <div className={styles.form__actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isDisabled={isSubmitting || !name.trim() || selectedItems.size === 0}
          >
            {isSubmitting ? 'Saving...' : menu ? 'Update Menu' : 'Create Menu'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MenuEditor;

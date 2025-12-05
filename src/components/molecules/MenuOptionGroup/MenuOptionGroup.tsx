import React from 'react';
import styles from './MenuOptionGroup.module.scss';
import type { MenuOptionGroupProps, SelectedOptionDetail } from './MenuOptionGroup.types';
import { formatPrice } from '@/utils/menu';

const MenuOptionGroup: React.FC<MenuOptionGroupProps> = ({ group, selected, onChange, disabled }) => {
  // Support both old and new property names
  const selectionType = group.selection_type || group.type || 'single';
  const isRequired = group.is_required ?? group.required ?? false;
  const maxSelections = group.max_selections ?? group.maxSelections;
  const items = group.sub_items || group.choices || [];

  const isSelected = (id: string) => selected.some(opt => opt.id === id);
  
  // Support both old (additional_price) and new (priceModifier) structures
  const getDetail = (item: any) => ({
    id: item.id,
    name: item.name,
    price: item.additional_price ?? item.priceModifier ?? 0
  });

  const handleSelect = (item: any) => {
    const detail = getDetail(item);
    if (selectionType === 'single') {
      onChange([detail]);
    } else {
      if (isSelected(item.id)) {
        onChange(selected.filter(opt => opt.id !== item.id));
      } else {
        if (maxSelections && selected.length >= maxSelections) return;
        onChange([...selected, detail]);
      }
    }
  };

  return (
    <div className={styles.group}>
      <label className={styles.label}>
        {group.name}
        {isRequired && ' *'}
      </label>
      <div className={styles.options}>
        {items.map((item: any) => {
          const price = item.additional_price ?? item.priceModifier ?? 0;
          return (
            <div
              key={item.id}
              className={[styles.option, isSelected(item.id) ? styles.selected : ''].join(' ')}
              onClick={() => !disabled && handleSelect(item)}
              aria-checked={isSelected(item.id)}
              role={selectionType === 'single' ? 'radio' : 'checkbox'}
              tabIndex={0}
            >
              <input
                type={selectionType === 'single' ? 'radio' : 'checkbox'}
                checked={isSelected(item.id)}
                disabled={disabled}
                readOnly
              />
              <span>{item.name}</span>
              {price !== 0 && (
                <span className={styles.price}>
                  {price > 0 ? `+${formatPrice(price)}` : formatPrice(price)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuOptionGroup;

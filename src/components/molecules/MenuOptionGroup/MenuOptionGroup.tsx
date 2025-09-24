import React from 'react';
import styles from './MenuOptionGroup.module.scss';
import type { MenuOptionGroupProps, SelectedOptionDetail } from './MenuOptionGroup.types';
import { formatPrice } from '@/utils/menu';

const MenuOptionGroup: React.FC<MenuOptionGroupProps> = ({ group, selected, onChange, disabled }) => {
  const isSelected = (id: string) => selected.some(opt => opt.id === id);
  const getDetail = (sub: any) => ({ id: sub.id, name: sub.name, price: sub.additional_price });

  const handleSelect = (sub: any) => {
    const detail = getDetail(sub);
    if (group.selection_type === 'single') {
      onChange([detail]);
    } else {
      if (isSelected(sub.id)) {
        onChange(selected.filter(opt => opt.id !== sub.id));
      } else {
        if (group.max_selections && selected.length >= group.max_selections) return;
        onChange([...selected, detail]);
      }
    }
  };

  return (
    <div className={styles.group}>
      <label className={styles.label}>
        {group.name}
        {group.is_required && ' *'}
      </label>
      <div className={styles.options}>
        {group.sub_items.map(sub => (
          <div
            key={sub.id}
            className={[styles.option, isSelected(sub.id) ? styles.selected : ''].join(' ')}
            onClick={() => !disabled && handleSelect(sub)}
            aria-checked={isSelected(sub.id)}
            role={group.selection_type === 'single' ? 'radio' : 'checkbox'}
            tabIndex={0}
          >
            <input
              type={group.selection_type === 'single' ? 'radio' : 'checkbox'}
              checked={isSelected(sub.id)}
              disabled={disabled}
              readOnly
            />
            <span>{sub.name}</span>
            {sub.additional_price !== 0 && (
              <span className={styles.price}>
                {sub.additional_price > 0 ? `+${formatPrice(sub.additional_price)}` : formatPrice(sub.additional_price)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuOptionGroup;

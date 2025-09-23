import React from 'react';
import styles from './MenuOptionGroup.module.scss';
import type { MenuOptionGroupProps } from './MenuOptionGroup.types';

const MenuOptionGroup: React.FC<MenuOptionGroupProps> = ({ group, selected, onChange, disabled }) => {
  const handleSelect = (id: string) => {
    if (group.selection_type === 'single') {
      onChange([id]);
    } else {
      if (selected.includes(id)) {
        onChange(selected.filter(sid => sid !== id));
      } else {
        if (group.max_selections && selected.length >= group.max_selections) return;
        onChange([...selected, id]);
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
            className={[
              styles.option,
              selected.includes(sub.id) ? styles.selected : ''
            ].join(' ')}
            onClick={() => !disabled && handleSelect(sub.id)}
            aria-checked={selected.includes(sub.id)}
            role={group.selection_type === 'single' ? 'radio' : 'checkbox'}
            tabIndex={0}
          >
            <input
              type={group.selection_type === 'single' ? 'radio' : 'checkbox'}
              checked={selected.includes(sub.id)}
              disabled={disabled}
              readOnly
            />
            <span>{sub.name}</span>
            {sub.additional_price !== 0 && (
              <span className={styles.price}>
                {sub.additional_price > 0 ? `+${sub.additional_price}` : sub.additional_price}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuOptionGroup;

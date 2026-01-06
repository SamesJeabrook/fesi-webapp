import React from 'react';
import { StockStatusBadge, StockLevelBar } from '@/components/atoms';
import styles from './StockItemRow.module.scss';
import type { StockItemRowProps } from './StockItemRow.types';

export const StockItemRow: React.FC<StockItemRowProps> = ({ 
  item,
  onAdjust,
  onEdit,
  className = '' 
}) => {
  return (
    <tr className={`${styles.row} ${className}`}>
      <td className={styles.cell}>
        <StockStatusBadge status={item.stock_status} />
      </td>
      <td className={styles.cell}>
        <div className={styles.itemInfo}>
          <div className={styles.itemInfo__name}>{item.name}</div>
          {item.description && (
            <div className={styles.itemInfo__description}>{item.description}</div>
          )}
        </div>
      </td>
      <td className={styles.cell}>
        {item.category ? (
          <span className={styles.category}>{item.category}</span>
        ) : (
          <span className={styles.category__empty}>—</span>
        )}
      </td>
      <td className={styles.cell}>
        <div className={styles.quantity}>{item.current_quantity}</div>
      </td>
      <td className={styles.cell}>
        <div className={styles.threshold}>{item.low_stock_threshold}</div>
      </td>
      <td className={styles.cell}>
        <div className={styles.unit}>{item.unit}</div>
      </td>
      <td className={styles.cell}>
        <StockLevelBar 
          percentage={item.stock_percentage || 0}
          status={item.stock_status}
        />
      </td>
      <td className={`${styles.cell} ${styles['cell--actions']}`}>
        <button
          onClick={() => onAdjust(item)}
          className={styles.action}
        >
          Adjust
        </button>
        <button
          onClick={() => onEdit(item)}
          className={styles.action}
        >
          Edit
        </button>
      </td>
    </tr>
  );
};

export default StockItemRow;

import React, { useState } from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/atoms/Card';
import { TopItemsTableProps } from './TopItemsTable.types';
import styles from './TopItemsTable.module.scss';

export const TopItemsTable: React.FC<TopItemsTableProps> = ({
  items,
  maxItems = 10,
  showRevenue = true,
  className,
}) => {
  const [sortBy, setSortBy] = useState<'quantity' | 'revenue'>('quantity');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const formatCurrency = (amount: number) => {
    return `£${(amount / 100).toFixed(2)}`;
  };

  const handleSort = (column: 'quantity' | 'revenue') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    const aValue = sortBy === 'quantity' ? a.quantitySold : a.revenue;
    const bValue = sortBy === 'quantity' ? b.quantitySold : b.revenue;
    
    if (sortDirection === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const displayItems = sortedItems.slice(0, maxItems);

  const getSortIcon = (column: 'quantity' | 'revenue') => {
    if (sortBy !== column) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const tableClasses = [
    styles.topItemsTable,
    className || ''
  ].filter(Boolean).join(' ');

  if (items.length === 0) {
    return (
      <Card variant="outlined" className={tableClasses}>
        <div className={styles.topItemsTable__empty}>
          <Typography variant="body-medium" className={styles.topItemsTable__emptyText}>
            No items to display
          </Typography>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="outlined" className={tableClasses}>
      <div className={styles.topItemsTable__container}>
        <table className={styles.topItemsTable__table}>
          <thead>
            <tr>
              <th className={styles.topItemsTable__headerCell}>
                <Typography variant="body-small" className={styles.topItemsTable__headerText}>
                  Rank
                </Typography>
              </th>
              <th className={styles.topItemsTable__headerCell}>
                <Typography variant="body-small" className={styles.topItemsTable__headerText}>
                  Item Name
                </Typography>
              </th>
              <th 
                className={`${styles.topItemsTable__headerCell} ${styles['topItemsTable__headerCell--sortable']}`}
                onClick={() => handleSort('quantity')}
              >
                <Typography variant="body-small" className={styles.topItemsTable__headerText}>
                  Quantity {getSortIcon('quantity')}
                </Typography>
              </th>
              {showRevenue && (
                <th 
                  className={`${styles.topItemsTable__headerCell} ${styles['topItemsTable__headerCell--sortable']}`}
                  onClick={() => handleSort('revenue')}
                >
                  <Typography variant="body-small" className={styles.topItemsTable__headerText}>
                    Revenue {getSortIcon('revenue')}
                  </Typography>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayItems.map((item, index) => (
              <tr key={item.id} className={styles.topItemsTable__row}>
                <td className={styles.topItemsTable__cell}>
                  <div className={styles.topItemsTable__rank}>
                    {index + 1 <= 3 ? (
                      <span className={styles[`topItemsTable__medal--${index + 1}`]}>
                        {index + 1 === 1 ? '🥇' : index + 1 === 2 ? '🥈' : '🥉'}
                      </span>
                    ) : (
                      <Typography variant="body-medium">{index + 1}</Typography>
                    )}
                  </div>
                </td>
                <td className={styles.topItemsTable__cell}>
                  <Typography variant="body-medium" className={styles.topItemsTable__itemName}>
                    {item.name}
                  </Typography>
                </td>
                <td className={styles.topItemsTable__cell}>
                  <Typography variant="body-medium" className={styles.topItemsTable__quantity}>
                    {item.quantitySold}
                  </Typography>
                </td>
                {showRevenue && (
                  <td className={styles.topItemsTable__cell}>
                    <Typography variant="body-medium" className={styles.topItemsTable__revenue}>
                      {formatCurrency(item.revenue)}
                    </Typography>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

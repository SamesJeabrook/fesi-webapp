import React from 'react';
import { TableCard, Typography } from '@/components/atoms';
import type { TableGridProps } from './TableGrid.types';
import styles from './TableGrid.module.scss';

export const TableGrid: React.FC<TableGridProps> = ({
  tables,
  onTableClick,
  filterStatus = 'all',
  className = '',
}) => {
  const filteredTables = filterStatus === 'all' 
    ? tables 
    : tables.filter(table => table.status === filterStatus);

  const getStatusCount = (status: string) => {
    return tables.filter(t => t.status === status).length;
  };

  if (filteredTables.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Typography variant="body">
          {filterStatus === 'all' 
            ? 'No tables configured. Add tables to get started.' 
            : `No ${filterStatus} tables.`}
        </Typography>
      </div>
    );
  }

  return (
    <div className={`${styles.tableGridContainer} ${className}`}>
      <div className={styles.statusSummary}>
        <div className={styles.statusItem}>
          <Typography variant="body-small" className={styles.available}>
            ✓ {getStatusCount('available')} Available
          </Typography>
        </div>
        <div className={styles.statusItem}>
          <Typography variant="body-small" className={styles.occupied}>
            👥 {getStatusCount('occupied')} Occupied
          </Typography>
        </div>
        <div className={styles.statusItem}>
          <Typography variant="body-small" className={styles.reserved}>
            🔒 {getStatusCount('reserved')} Reserved
          </Typography>
        </div>
        <div className={styles.statusItem}>
          <Typography variant="body-small" className={styles.cleaning}>
            🧹 {getStatusCount('cleaning')} Cleaning
          </Typography>
        </div>
      </div>

      <div className={styles.tableGrid}>
        {filteredTables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onClick={() => onTableClick?.(table.id)}
          />
        ))}
      </div>
    </div>
  );
};

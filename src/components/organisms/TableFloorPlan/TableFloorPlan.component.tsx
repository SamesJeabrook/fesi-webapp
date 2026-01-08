'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@/components/atoms';
import { TableGrid } from '@/components/molecules';
import api from '@/utils/api';
import type { TableFloorPlanProps, Table } from './TableFloorPlan.types';
import styles from './TableFloorPlan.module.scss';

export const TableFloorPlan: React.FC<TableFloorPlanProps> = ({
  merchantId,
  onCreateTables,
  className = '',
}) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'occupied' | 'reserved' | 'cleaning'>('all');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTables();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchTables, 30000);
    return () => clearInterval(interval);
  }, [merchantId]);

  const fetchTables = async () => {
    try {
      const data = await api.get(`/api/tables/merchant/${merchantId}`);
      setTables(data.tables || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const handleTableClick = (tableId: string) => {
    setSelectedTableId(tableId);
    // This will be handled by parent to open session modal
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchTables();
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Typography variant="body-medium">Loading table floor plan...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <Typography variant="body-medium" className={styles.errorText}>
          {error}
        </Typography>
        <Button onClick={handleRefresh} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Typography variant="heading-4" className={styles.emptyTitle}>
          No Tables Configured
        </Typography>
        <Typography variant="body-medium" className={styles.emptyDescription}>
          Set up your restaurant tables to start managing table service.
        </Typography>
        {onCreateTables && (
          <Button onClick={onCreateTables} variant="primary" size="lg">
            Create Tables
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`${styles.tableFloorPlan} ${className}`}>
      <div className={styles.header}>
        <Typography variant="heading-4">Table Floor Plan</Typography>
        <div className={styles.actions}>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            🔄 Refresh
          </Button>
        </div>
      </div>

      <div className={styles.filters}>
        <Button
          variant={filterStatus === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('all')}
        >
          All Tables
        </Button>
        <Button
          variant={filterStatus === 'available' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('available')}
        >
          Available
        </Button>
        <Button
          variant={filterStatus === 'occupied' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('occupied')}
        >
          Occupied
        </Button>
        <Button
          variant={filterStatus === 'reserved' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('reserved')}
        >
          Reserved
        </Button>
        <Button
          variant={filterStatus === 'cleaning' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('cleaning')}
        >
          Cleaning
        </Button>
      </div>

      <TableGrid
        tables={tables}
        onTableClick={handleTableClick}
        filterStatus={filterStatus}
      />
    </div>
  );
};

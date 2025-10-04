import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import { OrderCard } from '@/components/atoms/OrderCard';
import { StatusColumn } from '@/components/atoms/StatusColumn';
import { Typography } from '@/components/atoms';
import type { OrderBoardProps, ColumnConfig } from './OrderBoard.types';
import styles from './OrderBoard.module.scss';

const COLUMN_CONFIGS: ColumnConfig[] = [
  { status: 'pending', title: 'New Orders', acceptsDrops: false },
  { status: 'accepted', title: 'Accepted', acceptsDrops: true },
  { status: 'preparing', title: 'Preparing', acceptsDrops: true },
  { status: 'ready', title: 'Ready', acceptsDrops: true },
  { status: 'complete', title: 'Complete', acceptsDrops: true },
];

export const OrderBoard: React.FC<OrderBoardProps> = ({
  orders,
  isReadOnly = false,
  onOrderStatusChange,
  onOrderClick,
  isLoading = false,
  error = null,
  className,
  'data-testid': dataTestId,
}) => {
  const [draggedOrder, setDraggedOrder] = useState<string | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const boardClasses = classNames(
    styles.orderBoard,
    {
      [styles.readOnly]: isReadOnly,
      [styles.loading]: isLoading,
    },
    className
  );

  // Group orders by status
  const ordersByStatus = React.useMemo(() => {
    const grouped: Record<string, typeof orders> = {};
    COLUMN_CONFIGS.forEach(config => {
      grouped[config.status] = orders.filter(order => order.status === config.status);
    });
    return grouped;
  }, [orders]);

  const handleDragStart = (event: React.DragEvent, orderId: string) => {
    if (isReadOnly) return;
    
    setDraggedOrder(orderId);
    event.dataTransfer.setData('text/plain', orderId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedOrder(null);
    setDraggedOverColumn(null);
    dragCounter.current = 0;
  };

  const handleDragOver = (event: React.DragEvent, columnStatus: string) => {
    event.preventDefault();
    setDraggedOverColumn(columnStatus);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDraggedOverColumn(null);
    }
  };

  const handleDragEnter = (event: React.DragEvent) => {
    dragCounter.current++;
  };

  const handleDrop = (orderId: string, newStatus: string) => {
    if (isReadOnly) return;
    
    const order = orders.find(o => o.id === orderId);
    if (order && order.status !== newStatus) {
      onOrderStatusChange?.(orderId, newStatus);
    }
    
    setDraggedOrder(null);
    setDraggedOverColumn(null);
    dragCounter.current = 0;
  };

  if (isLoading) {
    return (
      <div className={boardClasses} data-testid={dataTestId}>
        <div className={styles.loadingState}>
          <Typography variant="heading-5">Loading orders...</Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={boardClasses} data-testid={dataTestId}>
        <div className={styles.errorState}>
          <Typography variant="heading-5" className={styles.errorTitle}>
            Error loading orders
          </Typography>
          <Typography variant="body-medium" className={styles.errorMessage}>
            {error}
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={boardClasses} data-testid={dataTestId}>
      <div className={styles.columns}>
        {COLUMN_CONFIGS.map(config => (
          <StatusColumn
            key={config.status}
            title={config.title}
            status={config.status}
            acceptsDrops={config.acceptsDrops && !isReadOnly}
            isDraggedOver={draggedOverColumn === config.status}
            count={ordersByStatus[config.status]?.length || 0}
            onDrop={handleDrop}
            onDragOver={(event) => handleDragOver(event, config.status)}
            onDragLeave={handleDragLeave}
          >
            {ordersByStatus[config.status]?.map(order => (
              <div
                key={order.id}
                draggable={!isReadOnly}
                onDragStart={(event) => handleDragStart(event, order.id)}
                onDragEnd={handleDragEnd}
                onDragEnter={handleDragEnter}
              >
                <OrderCard
                  order={order}
                  isDraggable={!isReadOnly}
                  isDragging={draggedOrder === order.id}
                  onClick={() => onOrderClick?.(order)}
                />
              </div>
            ))}
          </StatusColumn>
        ))}
      </div>
    </div>
  );
};
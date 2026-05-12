import React from 'react';
import { OrderCard } from '@/components/atoms/OrderCard';
import { Typography } from '@/components/atoms';
import styles from './PreOrderTimelineView.module.scss';

export interface PreOrderTimelineViewProps {
  orders: any[]; // Orders with is_pre_order: true
  capacityType?: 'orders' | 'items';
  onOrderClick?: (order: any) => void;
  onOrderStatusChange?: (orderId: string, newStatus: string) => void;
  className?: string;
  'data-testid'?: string;
}

interface TimeSlot {
  time: string; // ISO timestamp
  displayTime: string; // Formatted time
  orders: any[];
  capacity: number;
  used: number; // Either count of orders or count of items
}

/**
 * PreOrderTimelineView Organism
 * Displays pre-orders organized by time slots with capacity indicators
 * Shows visual timeline with slot availability
 */
export const PreOrderTimelineView: React.FC<PreOrderTimelineViewProps> = ({
  orders,
  capacityType = 'orders',
  onOrderClick,
  onOrderStatusChange,
  className = '',
  'data-testid': dataTestId
}) => {
  // Group orders by scheduled time slot
  const groupByTimeSlot = (): TimeSlot[] => {
    const slotMap = new Map<string, TimeSlot>();

    orders.forEach(order => {
      if (!order.scheduled_time) return;

      const slotTime = new Date(order.scheduled_time).toISOString();
      
      if (!slotMap.has(slotTime)) {
        slotMap.set(slotTime, {
          time: slotTime,
          displayTime: formatSlotTime(new Date(order.scheduled_time)),
          orders: [],
          capacity: 0, // Will be determined from first order if available
          used: 0
        });
      }

      const slot = slotMap.get(slotTime)!;
      slot.orders.push(order);
      
      // Calculate used capacity based on type
      if (capacityType === 'items') {
        slot.used += order.total_items || order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 1;
      } else {
        slot.used += 1;
      }
    });

    // Sort by time
    return Array.from(slotMap.values()).sort((a, b) => 
      new Date(a.time).getTime() - new Date(b.time).getTime()
    );
  };

  const formatSlotTime = (date: Date): string => {
    const time = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return `Today, ${time}`;
    if (isTomorrow) return `Tomorrow, ${time}`;

    const dateStr = date.toLocaleDateString('en-GB', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    return `${dateStr}, ${time}`;
  };

  const getCapacityPercentage = (used: number, capacity: number): number => {
    if (!capacity) return 0;
    return Math.min((used / capacity) * 100, 100);
  };

  const getCapacityStatus = (percentage: number): 'low' | 'medium' | 'high' | 'full' => {
    if (percentage >= 100) return 'full';
    if (percentage >= 80) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';
  };

  const getStatusActions = (currentStatus: string): Array<{ label: string; status: string; variant: string }> => {
    // For pre-orders, we just need a complete button since they're already accepted
    if (currentStatus === 'complete' || currentStatus === 'cancelled') {
      return [];
    }
    
    return [
      { label: 'Mark Complete', status: 'complete', variant: 'success' }
    ];
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    onOrderStatusChange?.(orderId, newStatus);
  };

  const slots = groupByTimeSlot();

  if (orders.length === 0) {
    return (
      <div className={`${styles.emptyState} ${className}`} data-testid={dataTestId}>
        <div className={styles.emptyState__content}>
          <span className={styles.emptyState__icon}>📅</span>
          <Typography variant="heading-5" className={styles.emptyState__title}>
            No Pre-Orders Yet
          </Typography>
          <Typography variant="body-medium" className={styles.emptyState__message}>
            Pre-orders will appear here when customers schedule orders for future time slots.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.timeline} ${className}`} data-testid={dataTestId}>
      <div className={styles.timeline__header}>
        <Typography variant="heading-5">Pre-Orders Timeline</Typography>
        <Typography variant="body-medium" className={styles.timeline__subtitle}>
          {slots.length} time slot{slots.length !== 1 ? 's' : ''} • {orders.length} order{orders.length !== 1 ? 's' : ''}
          {capacityType === 'items' && ` • ${slots.reduce((sum, slot) => sum + slot.used, 0)} items total`}
        </Typography>
      </div>

      <div className={styles.timeline__slots}>
        {slots.map((slot, index) => {
          const capacityPercentage = slot.capacity > 0 ? getCapacityPercentage(slot.used, slot.capacity) : 0;
          const capacityStatus = getCapacityStatus(capacityPercentage);

          return (
            <div key={slot.time} className={styles.slot}>
              <div className={styles.slot__header}>
                <div className={styles.slot__info}>
                  <Typography variant="heading-6" className={styles.slot__time}>
                    {slot.displayTime}
                  </Typography>
                  <div className={styles.slot__meta}>
                    <span className={styles.slot__orderCount}>
                      {slot.orders.length} order{slot.orders.length !== 1 ? 's' : ''}
                    </span>
                    {capacityType === 'items' && (
                      <span className={styles.slot__itemCount}>
                        • {slot.used} item{slot.used !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {slot.capacity > 0 && (
                  <div className={styles.slot__capacity}>
                    <div className={styles.slot__capacityBar}>
                      <div 
                        className={`${styles.slot__capacityFill} ${styles[`capacity--${capacityStatus}`]}`}
                        style={{ width: `${capacityPercentage}%` }}
                      />
                    </div>
                    <Typography variant="caption" className={styles.slot__capacityLabel}>
                      {slot.used}/{slot.capacity} {capacityType}
                    </Typography>
                  </div>
                )}
              </div>

              <div className={styles.slot__orders}>
                {slot.orders.map(order => {
                  const actions = getStatusActions(order.status);
                  
                  return (
                    <div key={order.id} className={styles.slot__orderCard}>
                      <OrderCard
                        order={order}
                        onClick={() => onOrderClick?.(order)}
                      />
                      
                      {actions.length > 0 && (
                        <div className={styles.slot__orderActions}>
                          {actions.map(action => (
                            <button
                              key={action.status}
                              className={`${styles.actionButton} ${styles[`actionButton--${action.variant}`]}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(order.id, action.status);
                              }}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PreOrderTimelineView;

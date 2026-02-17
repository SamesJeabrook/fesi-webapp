'use client';

import { useRef, useEffect } from 'react';
import { Typography } from '@/components/atoms/Typography';
import type { Reservation, Table } from '../ReservationsTemplate.types';
import styles from './ReservationTimeline.module.scss';

interface ReservationTimelineProps {
  tables: Table[];
  reservations: Reservation[];
  selectedDate: string;
  onReservationClick: (reservation: Reservation) => void;
  onTimeSlotClick: (tableId: string, time: string) => void;
}

export function ReservationTimeline({
  tables,
  reservations,
  selectedDate,
  onReservationClick,
  onTimeSlotClick
}: ReservationTimelineProps) {
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  
  // Generate hours (9 AM to 11 PM)
  const hours = Array.from({ length: 15 }, (_, i) => i + 9); // 9-23 (9am-11pm)
  const HOUR_WIDTH = 120; // Width of each hour column in pixels
  const ROW_HEIGHT = 60; // Height of each table row

  const formatHour = (hour: number) => {
    if (hour === 0 || hour === 24) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const timeToPosition = (time: string) => {
    // time format: "HH:MM:SS"
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = (hours - 9) * 60 + minutes; // Relative to 9 AM
    return (totalMinutes / 60) * HOUR_WIDTH;
  };

  const getReservationWidth = (duration: number) => {
    return (duration / 60) * HOUR_WIDTH;
  };

  const getReservationColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'confirmed': return '#4CAF50';
      case 'seated': return '#2196F3';
      case 'completed': return '#9E9E9E';
      case 'cancelled': return '#F44336';
      case 'no_show': return '#795548';
      default: return '#757575';
    }
  };

  // Synchronize horizontal scrolling
  useEffect(() => {
    const headerScroll = headerScrollRef.current;
    const bodyScroll = bodyScrollRef.current;

    if (!headerScroll || !bodyScroll) return;

    const handleHeaderScroll = () => {
      if (bodyScroll.scrollLeft !== headerScroll.scrollLeft) {
        bodyScroll.scrollLeft = headerScroll.scrollLeft;
      }
    };

    const handleBodyScroll = () => {
      if (headerScroll.scrollLeft !== bodyScroll.scrollLeft) {
        headerScroll.scrollLeft = bodyScroll.scrollLeft;
      }
    };

    headerScroll.addEventListener('scroll', handleHeaderScroll);
    bodyScroll.addEventListener('scroll', handleBodyScroll);

    return () => {
      headerScroll.removeEventListener('scroll', handleHeaderScroll);
      bodyScroll.removeEventListener('scroll', handleBodyScroll);
    };
  }, []);

  return (
    <div className={styles.timeline}>
      <div className={styles.timelineHeader}>
        <div className={styles.tablesColumn}>
          <div className={styles.cornerCell}>
            <Typography variant="body-small">Tables</Typography>
          </div>
        </div>
        <div className={styles.hoursScroll} ref={headerScrollRef}>
          <div className={styles.hoursContainer} style={{ width: hours.length * HOUR_WIDTH }}>
            {hours.map(hour => (
              <div key={hour} className={styles.hourCell} style={{ width: HOUR_WIDTH }}>
                <Typography variant="body-medium">{formatHour(hour)}</Typography>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.timelineBody}>
        <div className={styles.tablesColumn}>
          {tables.sort((a, b) => (a.table_number as number) - (b.table_number as number)).map(table => (
            <div key={table.id} className={styles.tableRow} style={{ height: ROW_HEIGHT }}>
              <div className={styles.tableLabel}>
                <Typography variant="body-medium">Table {table.table_number}</Typography>
                <Typography variant="body-small" style={{ color: 'var(--color-neutral-600)' }}>
                  Capacity: {table.capacity}
                </Typography>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.gridScroll} ref={bodyScrollRef}>
          <div className={styles.gridContainer} style={{ width: hours.length * HOUR_WIDTH }}>
            {/* Grid lines */}
            {tables.sort((a, b) => (a.table_number as number) - (b.table_number as number)).map((table, rowIndex) => (
              <div key={table.id} className={styles.gridRow} style={{ height: ROW_HEIGHT }}>
                {hours.map((hour) => (
                  <div
                    key={`${table.id}-${hour}`}
                    className={styles.timeSlot}
                    style={{ width: HOUR_WIDTH }}
                    onClick={() => onTimeSlotClick(table.id, `${hour.toString().padStart(2, '0')}:00`)}
                  />
                ))}
                
                {/* Reservations for this table */}
                {reservations
                  .filter(r => 
                    r.table_id === table.id || 
                    (r.table_ids && r.table_ids.includes(table.id))
                  )
                  .map(reservation => {
                    const left = timeToPosition(reservation.start_time);
                    const width = getReservationWidth(reservation.duration_minutes || 90);
                    const color = getReservationColor(reservation.status);

                    return (
                      <div
                        key={reservation.id}
                        className={styles.reservationBlock}
                        style={{
                          left: `${left}px`,
                          width: `${width}px`,
                          backgroundColor: color,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onReservationClick(reservation);
                        }}
                      >
                        <div className={styles.reservationContent}>
                          <div className={styles.reservationTime}>
                            {reservation.start_time.substring(0, 5)}
                          </div>
                          <div className={styles.reservationGuest}>
                            {reservation.customer_first_name 
                              ? `${reservation.customer_first_name} ${reservation.customer_last_name}`
                              : reservation.guest_name}
                          </div>
                          <div className={styles.reservationInfo}>
                            👥 {reservation.guest_count}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <Typography variant="body-small" style={{ marginRight: 'var(--spacing-4)' }}>
          Status:
        </Typography>
        {[
          { status: 'pending', label: 'Pending' },
          { status: 'confirmed', label: 'Confirmed' },
          { status: 'seated', label: 'Seated' },
          { status: 'completed', label: 'Completed' },
          { status: 'cancelled', label: 'Cancelled' }
        ].map(({ status, label }) => (
          <div key={status} className={styles.legendItem}>
            <div 
              className={styles.legendColor} 
              style={{ backgroundColor: getReservationColor(status) }}
            />
            <Typography variant="body-small">{label}</Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

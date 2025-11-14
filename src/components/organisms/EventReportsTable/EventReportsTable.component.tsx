import React, { useState, useMemo } from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { EventReportsTableProps, EventReport } from './EventReportsTable.types';
import styles from './EventReportsTable.module.scss';

export const EventReportsTable: React.FC<EventReportsTableProps> = ({
  events,
  loading = false,
  onEventClick,
  showFilters = true,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'revenue' | 'orders'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    return `£${(amount / 100).toFixed(2)}`;
  };

  const handleSort = (column: 'date' | 'revenue' | 'orders') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (column: 'date' | 'revenue' | 'orders') => {
    if (sortBy !== column) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => {
      if (!showFilters || !searchTerm) return true;
      return event.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.startDate).getTime();
          bValue = new Date(b.startDate).getTime();
          break;
        case 'revenue':
          aValue = a.revenue;
          bValue = b.revenue;
          break;
        case 'orders':
          aValue = a.orders;
          bValue = b.orders;
          break;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [events, searchTerm, sortBy, sortDirection, showFilters]);

  const totalPages = Math.ceil(filteredAndSortedEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredAndSortedEvents.slice(startIndex, startIndex + itemsPerPage);

  const tableClasses = [
    styles.eventReportsTable,
    className || ''
  ].filter(Boolean).join(' ');

  if (loading) {
    return (
      <Card variant="outlined" className={tableClasses}>
        <div className={styles.eventReportsTable__loading}>
          <Typography variant="body-medium">Loading events...</Typography>
        </div>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card variant="outlined" className={tableClasses}>
        <div className={styles.eventReportsTable__empty}>
          <Typography variant="heading-4">No Events Found</Typography>
          <Typography variant="body-medium" className={styles.eventReportsTable__emptyText}>
            Create your first event to see analytics here.
          </Typography>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="outlined" className={tableClasses}>
      {showFilters && (
        <div className={styles.eventReportsTable__filters}>
          <Input
            id="event-search"
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.eventReportsTable__search}
          />
        </div>
      )}

      <div className={styles.eventReportsTable__container}>
        <table className={styles.eventReportsTable__table}>
          <thead>
            <tr>
              <th className={styles.eventReportsTable__headerCell}>
                <Typography variant="body-small" className={styles.eventReportsTable__headerText}>
                  Event Name
                </Typography>
              </th>
              <th 
                className={`${styles.eventReportsTable__headerCell} ${styles['eventReportsTable__headerCell--sortable']}`}
                onClick={() => handleSort('date')}
              >
                <Typography variant="body-small" className={styles.eventReportsTable__headerText}>
                  Date {getSortIcon('date')}
                </Typography>
              </th>
              <th className={styles.eventReportsTable__headerCell}>
                <Typography variant="body-small" className={styles.eventReportsTable__headerText}>
                  Status
                </Typography>
              </th>
              <th 
                className={`${styles.eventReportsTable__headerCell} ${styles['eventReportsTable__headerCell--sortable']}`}
                onClick={() => handleSort('orders')}
              >
                <Typography variant="body-small" className={styles.eventReportsTable__headerText}>
                  Orders {getSortIcon('orders')}
                </Typography>
              </th>
              <th 
                className={`${styles.eventReportsTable__headerCell} ${styles['eventReportsTable__headerCell--sortable']}`}
                onClick={() => handleSort('revenue')}
              >
                <Typography variant="body-small" className={styles.eventReportsTable__headerText}>
                  Revenue {getSortIcon('revenue')}
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedEvents.map((event) => (
              <tr 
                key={event.id} 
                className={`${styles.eventReportsTable__row} ${onEventClick ? styles['eventReportsTable__row--clickable'] : ''}`}
                onClick={() => onEventClick?.(event.id)}
              >
                <td className={styles.eventReportsTable__cell}>
                  <Typography variant="body-medium" className={styles.eventReportsTable__eventName}>
                    {event.name}
                  </Typography>
                </td>
                <td className={styles.eventReportsTable__cell}>
                  <Typography variant="body-small" className={styles.eventReportsTable__date}>
                    {event.endDate 
                      ? `${formatDate(event.startDate)} - ${formatDate(event.endDate)}`
                      : formatDate(event.startDate)
                    }
                  </Typography>
                </td>
                <td className={styles.eventReportsTable__cell}>
                  <span className={`${styles.eventReportsTable__status} ${
                    event.isOpen 
                      ? styles['eventReportsTable__status--open'] 
                      : styles['eventReportsTable__status--closed']
                  }`}>
                    {event.isOpen ? '🟢 Open' : '🔴 Closed'}
                  </span>
                </td>
                <td className={styles.eventReportsTable__cell}>
                  <Typography variant="body-medium" className={styles.eventReportsTable__orders}>
                    {event.orders}
                  </Typography>
                </td>
                <td className={styles.eventReportsTable__cell}>
                  <Typography variant="body-medium" className={styles.eventReportsTable__revenue}>
                    {formatCurrency(event.revenue)}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.eventReportsTable__pagination}>
          <button
            className={styles.eventReportsTable__paginationButton}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          <Typography variant="body-small" className={styles.eventReportsTable__paginationInfo}>
            Page {currentPage} of {totalPages}
          </Typography>
          <button
            className={styles.eventReportsTable__paginationButton}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </Card>
  );
};

import React from 'react';
import { Badge } from '@/components/atoms';
import styles from './TableStatusBadge.module.scss';

export interface TableStatusBadgeProps {
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  className?: string;
}

export const TableStatusBadge: React.FC<TableStatusBadgeProps> = ({ 
  status, 
  className = '' 
}) => {
  const getVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'occupied':
        return 'error';
      case 'reserved':
        return 'warning';
      case 'cleaning':
        return 'info';
      default:
        return 'default';
    }
  };

  const getLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Badge 
      variant={getVariant(status)} 
      className={`${styles.tableStatusBadge} ${className}`}
    >
      {getLabel(status)}
    </Badge>
  );
};

export default TableStatusBadge;

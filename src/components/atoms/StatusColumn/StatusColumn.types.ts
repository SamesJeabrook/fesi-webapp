import React from 'react';

export interface StatusColumnProps {
  /** Column title */
  title: string;
  /** Column status identifier */
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'complete' | 'cancelled';
  /** Order cards to display in this column */
  children: React.ReactNode;
  /** Whether this column accepts drops */
  acceptsDrops?: boolean;
  /** Whether something is being dragged over this column */
  isDraggedOver?: boolean;
  /** Drop handler */
  onDrop?: (orderId: string, newStatus: string) => void;
  /** Drag over handler */
  onDragOver?: (event: React.DragEvent) => void;
  /** Drag leave handler */
  onDragLeave?: (event: React.DragEvent) => void;
  /** Number of orders in this column */
  count?: number;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}
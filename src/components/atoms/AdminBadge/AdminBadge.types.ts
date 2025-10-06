export interface AdminBadgeProps {
  /** Badge text content */
  children: React.ReactNode;
  /** Badge variant */
  variant?: 'warning' | 'info' | 'success' | 'danger';
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}
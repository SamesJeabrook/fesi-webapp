export interface StatCardProps {
  /** Label for the statistic */
  label: string;
  /** Main value to display */
  value: string | number;
  /** Optional icon/emoji to display */
  icon?: string;
  /** Optional trend indicator */
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  /** Optional subtitle/description */
  subtitle?: string;
  /** Color variant */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /** Additional CSS classes */
  className?: string;
}

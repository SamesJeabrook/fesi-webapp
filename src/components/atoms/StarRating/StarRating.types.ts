export interface StarRatingProps {
  /** Current rating value (1-5) */
  value: number;
  /** Maximum number of stars (default: 5) */
  maxStars?: number;
  /** Size of the stars */
  size?: 'small' | 'medium' | 'large';
  /** Whether the rating is interactive (clickable) */
  interactive?: boolean;
  /** Whether to show half stars */
  allowHalf?: boolean;
  /** Callback when rating changes (interactive mode only) */
  onChange?: (rating: number) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the numeric value */
  showValue?: boolean;
  /** Label for accessibility */
  ariaLabel?: string;
}

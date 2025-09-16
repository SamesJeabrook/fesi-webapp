import { Rating } from '../../../services/ratingService';

export interface RatingDisplayProps {
  /** List of ratings to display */
  ratings: Rating[];
  /** Whether to show individual menu item ratings */
  showMenuItemRatings?: boolean;
  /** Whether to show customer names */
  showCustomerNames?: boolean;
  /** Maximum number of ratings to display */
  maxRatings?: number;
  /** Whether the component is loading */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export interface RatingStatsDisplayProps {
  /** Rating statistics to display */
  stats: {
    total_ratings: number;
    average_overall_rating: number;
    average_food_rating?: number;
    average_service_rating?: number;
    average_value_rating?: number;
    five_star_count: number;
    four_star_count: number;
    three_star_count: number;
    two_star_count: number;
    one_star_count: number;
  };
  /** Additional CSS classes */
  className?: string;
}

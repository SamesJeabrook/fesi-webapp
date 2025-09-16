export interface MenuItemRating {
  menu_item_id: string;
  rating: number;
  comment?: string;
}

export interface RatingFormData {
  overall_rating: number;
  food_rating?: number;
  service_rating?: number;
  value_rating?: number;
  title?: string;
  comment?: string;
  menu_item_ratings?: MenuItemRating[];
}

export interface RatingFormProps {
  /** Order ID to rate */
  orderId: string;
  /** Customer ID (if logged in) */
  customerId?: string;
  /** Guest email (if not logged in) */
  guestEmail?: string;
  /** Guest name (if not logged in) */
  guestName?: string;
  /** Menu items from the order for individual rating */
  menuItems?: Array<{
    id: string;
    title: string;
    price: number;
  }>;
  /** Callback when form is submitted */
  onSubmit: (data: RatingFormData) => Promise<void>;
  /** Whether the form is submitting */
  isSubmitting?: boolean;
  /** Additional CSS classes */
  className?: string;
}

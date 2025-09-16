// Rating Service
// Frontend service for handling customer ratings and reviews

export interface Rating {
  id: string;
  order_id: string;
  customer_id?: string;
  merchant_id: string;
  overall_rating: number;
  food_rating?: number;
  service_rating?: number;
  value_rating?: number;
  title?: string;
  comment?: string;
  guest_name?: string;
  guest_email?: string;
  is_public: boolean;
  is_flagged: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  merchant_name?: string;
  menu_item_ratings?: MenuItemRating[];
}

export interface MenuItemRating {
  id: string;
  order_rating_id: string;
  menu_item_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  menu_item_name?: string;
}

export interface RatingStats {
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
}

export interface CreateRatingData {
  order_id: string;
  customer_id?: string;
  overall_rating: number;
  food_rating?: number;
  service_rating?: number;
  value_rating?: number;
  title?: string;
  comment?: string;
  guest_name?: string;
  guest_email?: string;
  menu_item_ratings?: Array<{
    menu_item_id: string;
    rating: number;
    comment?: string;
  }>;
}

export interface RatingListOptions {
  limit?: number;
  offset?: number;
  min_rating?: number;
  max_rating?: number;
  public_only?: boolean;
  order_by?: 'created_at' | 'overall_rating' | 'food_rating' | 'service_rating' | 'value_rating';
  order_direction?: 'ASC' | 'DESC';
}

class RatingService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  }

  async createRating(data: CreateRatingData): Promise<Rating> {
    const response = await fetch(`${this.baseUrl}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create rating');
    }

    const result = await response.json();
    return result.data;
  }

  async getMerchantRatings(merchantId: string, options: RatingListOptions = {}): Promise<Rating[]> {
    const params = new URLSearchParams();
    
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.min_rating) params.append('min_rating', options.min_rating.toString());
    if (options.max_rating) params.append('max_rating', options.max_rating.toString());
    if (options.public_only !== undefined) params.append('public_only', options.public_only.toString());
    if (options.order_by) params.append('order_by', options.order_by);
    if (options.order_direction) params.append('order_direction', options.order_direction);

    const response = await fetch(`${this.baseUrl}/ratings/merchant/${merchantId}?${params}`);

    if (!response.ok) {
      throw new Error('Failed to fetch merchant ratings');
    }

    const result = await response.json();
    return result.data;
  }

  async getMerchantRatingStats(merchantId: string): Promise<RatingStats> {
    const response = await fetch(`${this.baseUrl}/ratings/merchant/${merchantId}/stats`);

    if (!response.ok) {
      throw new Error('Failed to fetch rating statistics');
    }

    const result = await response.json();
    return result.data;
  }

  async getMenuItemRatings(menuItemId: string, options: { limit?: number; offset?: number } = {}): Promise<MenuItemRating[]> {
    const params = new URLSearchParams();
    
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());

    const response = await fetch(`${this.baseUrl}/ratings/menu-item/${menuItemId}?${params}`);

    if (!response.ok) {
      throw new Error('Failed to fetch menu item ratings');
    }

    const result = await response.json();
    return result.data;
  }

  async getRating(ratingId: string): Promise<Rating> {
    const response = await fetch(`${this.baseUrl}/ratings/${ratingId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch rating');
    }

    const result = await response.json();
    return result.data;
  }

  async canRateOrder(orderId: string, customerId?: string, guestEmail?: string): Promise<{ canRate: boolean; reason?: string }> {
    const params = new URLSearchParams();
    
    if (customerId) params.append('customer_id', customerId);
    if (guestEmail) params.append('guest_email', guestEmail);

    const response = await fetch(`${this.baseUrl}/ratings/check/${orderId}?${params}`);

    if (!response.ok) {
      throw new Error('Failed to check rating eligibility');
    }

    const result = await response.json();
    return result.data;
  }

  // Utility methods
  calculateRatingPercentages(stats: RatingStats): Record<number, number> {
    const { total_ratings, five_star_count, four_star_count, three_star_count, two_star_count, one_star_count } = stats;
    
    if (total_ratings === 0) {
      return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    }

    return {
      5: (five_star_count / total_ratings) * 100,
      4: (four_star_count / total_ratings) * 100,
      3: (three_star_count / total_ratings) * 100,
      2: (two_star_count / total_ratings) * 100,
      1: (one_star_count / total_ratings) * 100,
    };
  }

  formatRating(rating: number): string {
    return rating.toFixed(1);
  }

  getRatingLabel(rating: number): string {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.5) return 'Good';
    if (rating >= 3.0) return 'Average';
    if (rating >= 2.0) return 'Poor';
    return 'Very Poor';
  }
}

export const ratingService = new RatingService();

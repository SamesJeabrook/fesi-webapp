// Customer Navigation Types

export interface CustomerNavigationProps {
  /**
   * Current active path for highlighting the active nav item
   */
  activePath?: string;
  
  /**
   * User information (if logged in)
   */
  user?: {
    id: string;
    name?: string;
    email: string;
  } | null;
  
  /**
   * Callback when login button is clicked
   */
  onLoginClick?: () => void;
  
  /**
   * Callback when logout is requested
   */
  onLogoutClick?: () => void;
  
  /**
   * Number of items in cart (if applicable)
   */
  cartItemCount?: number;
  
  /**
   * Whether to show the cart icon
   */
  showCart?: boolean;
  
  /**
   * Number of active orders (for guest users)
   */
  orderCount?: number;
  
  /**
   * Callback when orders button is clicked
   */
  onOrdersClick?: () => void;
  
  /**
   * Whether there are active orders (for visual indicator)
   */
  hasActiveOrders?: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  requiresAuth?: boolean;
}

// Common shared types

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  auth0Id: string;
  email: string;
  name: string;
  profileImageUrl?: string;
  role: 'customer' | 'merchant' | 'admin';
  customerId?: string;
  merchantId?: string;
}

export interface Customer extends BaseEntity {
  userId: string;
  email: string;
  name: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postcode?: string;
  dietaryRestrictions?: string[];
  loyaltyCards?: LoyaltyCard[];
}

export interface Merchant extends BaseEntity {
  userId: string;
  businessName: string;
  businessType: 'restaurant' | 'cafe' | 'bakery' | 'grocery' | 'other';
  description?: string;
  email: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  cuisine?: string[];
  openingHours?: OpeningHours;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  rating?: number;
  totalReviews?: number;
  deliveryRadius?: number;
  minimumOrder?: number;
  deliveryFee?: number;
  stripeAccountId?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export interface OpeningHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string; // HH:mm format
  close: string; // HH:mm format
  closed?: boolean;
}

export interface MenuCategory extends BaseEntity {
  merchantId: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  items?: MenuItem[];
}

export interface MenuItem extends BaseEntity {
  merchantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: string; // Formatted price for display (e.g., "£5.99")
  basePrice?: number; // Raw price in smallest currency unit (pence) for calculations
  imageUrl?: string;
  isAvailable: boolean;
  isPopular?: boolean;
  preparationTime?: number; // minutes
  calories?: number;
  allergens?: string[];
  dietaryInfo?: ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'nut-free')[];
  option?: MenuItemOption[];
  displayOrder: number;
}

export interface MenuItemOption extends BaseEntity {
  menuItemId: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  maxSelections?: number;
  choices: MenuItemChoice[];
}

export interface MenuItemChoice extends BaseEntity {
  optionId: string;
  name: string;
  priceModifier: number; // positive or negative adjustment to base price
  isDefault?: boolean;
}

export interface Event extends BaseEntity {
    merchant_id: string,
    group_event_id: string | null,
    name: string,
    latitude: string,
    longitude: string,
    is_open: boolean,
    start_time: string,
    end_time: string,
  }

export interface Order extends BaseEntity {
  customerId: string;
  merchantId: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  total: number;
  currency: string;
  paymentIntentId?: string;
  paymentStatus: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  orderType: 'delivery' | 'pickup';
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  deliveryAddress?: Address;
  specialInstructions?: string;
  loyaltyCardId?: string;
}

export interface OrderItem extends BaseEntity {
  orderId: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedOptions?: OrderItemOption[];
  specialInstructions?: string;
}

export interface OrderItemOption {
  optionName: string;
  choiceName: string;
  priceModifier: number;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface LoyaltyCard extends BaseEntity {
  customerId: string;
  merchantId: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  lastActivity: string;
}

// Cart types (client-side only)
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: SelectedOption[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface SelectedOption {
  option: MenuItemOption;
  choices: MenuItemChoice[];
}

export interface Cart {
  merchantId: string;
  merchant: Merchant;
  items: CartItem[];
  subtotal: number;
  estimatedDeliveryFee: number;
  platformFee: number;
  estimatedTotal: number;
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: Address;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Form types
export interface CheckoutFormData {
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: Address;
  specialInstructions?: string;
  paymentMethodId: string;
  loyaltyCardId?: string;
}

export interface MerchantFilters {
  cuisine?: string[];
  minRating?: number;
  maxDeliveryFee?: number;
  maxDeliveryTime?: number;
  isOpen?: boolean;
  search?: string;
}

// Component prop types
export interface ComponentBaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data?: T | null;
}

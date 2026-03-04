import { DriveStep } from 'driver.js';

export interface TourStep extends DriveStep {
  page?: string; // URL path to navigate to before showing this step
  action?: 'navigate' | 'wait' | 'click'; // Action to perform
  actionDelay?: number; // Delay in ms before showing step after navigation
  showWhen?: (merchant: any) => boolean; // Conditional visibility
}

export interface TourConfig {
  id: string;
  name: string;
  description: string;
  steps: TourStep[];
}

/**
 * Main onboarding tour for new merchants
 * Guides them through setting up their first menu and event
 */
export const onboardingTour: TourConfig = {
  id: 'merchant-onboarding',
  name: 'Get Started with Fesi',
  description: 'Learn how to set up your menu and start taking orders',
  steps: [
    // Welcome
    {
      page: '/merchant/admin',
      popover: {
        title: '👋 Welcome to Fesi!',
        description: "Let's show you the recommended order for setting up your restaurant.",
        align: 'center',
      },
    },

    // ========== SETUP ORDER: Show the progression ==========
    
    // Step 1: Menu Categories
    {
      page: '/merchant/admin',
      element: '[data-tour="menu-categories-card"]',
      popover: {
        title: '📂 Step 1: Menu Categories',
        description: 'Start here. Create categories to organize your menu (e.g., Mains, Sides, Drinks, Desserts).',
        side: 'bottom',
        align: 'start',
      },
    },

    // Step 2: Sub Items
    {
      page: '/merchant/admin',
      element: '[data-tour="sub-items-card"]',
      popover: {
        title: '🎛️ Step 2: Sub Items & Options',
        description: 'Next, create customization options like Size, Spice Level, or Toppings that customers can choose.',
        side: 'bottom',
        align: 'start',
      },
    },

    // Step 3: Menu Items
    {
      page: '/merchant/admin',
      element: '[data-tour="menu-items-card"]',
      popover: {
        title: '🍔 Step 3: Menu Items',
        description: 'Now add your actual products with prices, images, and descriptions.',
        side: 'bottom',
        align: 'start',
      },
    },

    // Step 4: Menus
    {
      page: '/merchant/admin',
      element: '[data-tour="menus-card"]',
      popover: {
        title: '📋 Step 4: Menus',
        description: 'Group your items into menus. You can create different menus for different occasions.',
        side: 'bottom',
        align: 'start',
      },
    },

    // Step 5: Events (only for event-based mode)
    {
      page: '/merchant/admin',
      element: '[data-tour="events-card"]',
      popover: {
        title: '📅 Step 5: Events',
        description: '⚡ Important! Create an event to enable ordering. Events define when and where customers can order from your menu.',
        side: 'bottom',
        align: 'start',
      },
      showWhen: (merchant) => merchant?.operating_mode !== 'static',
    },

    // POS
    {
      page: '/merchant/admin',
      element: '[data-tour="pos-card"]',
      popover: {
        title: '🛒 Point of Sale',
        description: 'Once your menu is ready, use the POS to start taking orders from customers!',
        side: 'bottom',
        align: 'start',
      },
    },

    // Orders
    {
      page: '/merchant/admin',
      element: '[data-tour="orders-card"]',
      popover: {
        title: '📦 Order Management',
        description: 'Track and manage all your orders as they come in. Update order status as you prepare them.',
        side: 'bottom',
        align: 'start',
      },
    },

    // Mobile App Info
    {
      page: '/merchant/admin',
      element: '[data-tour="mobile-app-info"]',
      popover: {
        title: '📱 Pro Tip: Mobile App',
        description: 'Download the Fesi POS mobile app to accept contactless payments with Stripe Tap to Pay!',
        side: 'bottom',
        align: 'center',
      },
    },

    // ========== COMPLETION ==========
    
    {
      page: '/merchant/admin',
      popover: {
        title: '🎉 You\'re All Set!',
        description: 'Follow the steps above to get started. Need help? Click the Help button anytime!',
      },
    },
  ],
};

/**
 * Quick tour for existing users who want a refresher
 */
export const quickTour: TourConfig = {
  id: 'quick-overview',
  name: 'Quick Overview',
  description: 'A brief reminder of key features',
  steps: [
    {
      page: '/merchant/admin',
      element: '[data-tour="dashboard"]',
      popover: {
        title: '📊 Dashboard',
        description: 'Your central hub for managing all restaurant operations.',
        side: 'bottom',
      },
    },
    {
      page: '/merchant/admin',
      element: '[data-tour="menu-categories-card"]',
      popover: {
        title: '📂 Menu Management',
        description: 'Create categories, items, and menus here.',
        side: 'bottom',
      },
    },
    {
      page: '/merchant/admin',
      element: '[data-tour="events-card"]',
      popover: {
        title: '📅 Events',
        description: 'Manage your selling events.',
        side: 'bottom',
      },
    },
    {
      page: '/merchant/admin',
      element: '[data-tour="pos-card"]',
      popover: {
        title: '🛒 Point of Sale',
        description: 'Take orders directly.',
        side: 'bottom',
      },
    },
  ],
};

// Export all available tours
export const tours = {
  onboarding: onboardingTour,
  quick: quickTour,
};

export type TourId = keyof typeof tours;

/**
 * Filter tour steps based on merchant data
 */
export function getFilteredTourSteps(tourConfig: TourConfig, merchant: any): TourStep[] {
  return tourConfig.steps.filter(step => {
    if (!step.showWhen) return true;
    return step.showWhen(merchant);
  });
}

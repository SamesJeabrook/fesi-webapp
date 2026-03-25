import { merchantAdminOnboardingDocumentationPage } from './pages/merchantAdminOnboarding';
import { mobilePosAppleReviewDocumentationPage } from './pages/mobilePosAppleReview';
import { mobilePosGettingStartedDocumentationPage } from './pages/mobilePosGettingStarted';
import { mobilePosTapToPayDocumentationPage } from './pages/mobilePosTapToPay';
import { overviewDocumentationPage } from './pages/overview';
import type { DocumentationNavGroup, DocumentationPage } from './types';

function basicPage(page: DocumentationPage): DocumentationPage {
  return page;
}

export const documentationPages: DocumentationPage[] = [
  overviewDocumentationPage,
  basicPage({
    slug: ['merchant-admin'],
    title: 'Merchant Admin Overview',
    summary: 'Overview of the merchant web dashboard and the management areas available after onboarding.',
    audience: 'Merchant owners and support teams.',
    category: 'merchant-admin',
    blocks: [
      {
        type: 'routes',
        title: 'Key Dashboard Routes',
        routes: [
          { path: '/merchant/admin', description: 'Merchant dashboard home.' },
          { path: '/merchant/admin/pos', description: 'Web POS entrypoint.' },
          { path: '/merchant/admin/orders', description: 'Order management.' },
          { path: '/merchant/admin/settings', description: 'Merchant configuration.' },
        ],
      },
    ],
    related: [['merchant-admin', 'onboarding'], ['merchant-admin', 'menu'], ['merchant-admin', 'events']],
  }),
  merchantAdminOnboardingDocumentationPage,
  basicPage({
    slug: ['merchant-admin', 'menu'],
    title: 'Menu Management',
    summary: 'Web-only menu setup and editing guidance for categories, items, menus, and sub-items.',
    audience: 'Merchants configuring their catalog.',
    category: 'merchant-admin',
    blocks: [
      {
        type: 'routes',
        title: 'Menu Routes',
        routes: [
          { path: '/merchant/admin/menu/categories', description: 'Manage category structure.' },
          { path: '/merchant/admin/menu/items', description: 'Create and edit menu items.' },
          { path: '/merchant/admin/menu/menus', description: 'Assemble menus.' },
          { path: '/merchant/admin/menu/sub-items', description: 'Configure modifiers and add-ons.' },
        ],
      },
    ],
    related: [['mobile-pos'], ['merchant-admin']],
  }),
  basicPage({
    slug: ['merchant-admin', 'events'],
    title: 'Events And Operations',
    summary: 'Routes and documentation areas for events, orders, and operational management on web.',
    audience: 'Mobile vendors and operations teams.',
    category: 'merchant-admin',
    blocks: [
      {
        type: 'routes',
        title: 'Operational Routes',
        routes: [
          { path: '/merchant/admin/events', description: 'Manage merchant events.' },
          { path: '/merchant/admin/group-events', description: 'Coordinate group events.' },
          { path: '/merchant/admin/orders', description: 'Review and handle orders.' },
        ],
      },
    ],
    related: [['mobile-pos', 'orders'], ['merchant-admin']],
  }),
  basicPage({
    slug: ['merchant-admin', 'settings'],
    title: 'Settings, Billing, And Configuration',
    summary: 'Business settings, operating mode, reservations, staff, and subscription documentation.',
    audience: 'Merchant administrators.',
    category: 'merchant-admin',
    blocks: [
      {
        type: 'routes',
        title: 'Settings Routes',
        routes: [
          { path: '/merchant/admin/settings', description: 'General settings.' },
          { path: '/merchant/admin/settings/operating-mode', description: 'Operating mode configuration.' },
          { path: '/merchant/admin/settings/reservations', description: 'Reservation settings.' },
          { path: '/merchant/admin/subscription', description: 'Billing and plan management.' },
        ],
      },
    ],
    related: [['mobile-pos', 'staff-security'], ['merchant-admin', 'analytics']],
  }),
  basicPage({
    slug: ['merchant-admin', 'analytics'],
    title: 'Analytics And Reporting',
    summary: 'Reporting, inventory, and merchant performance documentation.',
    audience: 'Merchant owners and operations leads.',
    category: 'merchant-admin',
    blocks: [
      {
        type: 'routes',
        title: 'Reporting Routes',
        routes: [
          { path: '/merchant/admin/analytics', description: 'Merchant performance dashboards.' },
          { path: '/merchant/admin/stock', description: 'Stock and inventory workflows.' },
        ],
      },
    ],
    related: [['merchant-admin'], ['mobile-pos', 'orders']],
  }),
  basicPage({
    slug: ['mobile-pos'],
    title: 'Mobile POS Overview',
    summary: 'Overview of the Fesi POS app and the operational workflows it supports.',
    audience: 'Merchants and support teams.',
    category: 'mobile-pos',
    blocks: [
      {
        type: 'section',
        title: 'What The App Covers',
        bullets: [
          'Signup and account access',
          'Post-login onboarding',
          'POS checkout and Tap to Pay',
          'Orders, receipts, and staff-facing workflows',
        ],
      },
    ],
    related: [['mobile-pos', 'getting-started'], ['mobile-pos', 'tap-to-pay'], ['merchant-admin', 'onboarding']],
  }),
  mobilePosGettingStartedDocumentationPage,
  mobilePosTapToPayDocumentationPage,
  basicPage({
    slug: ['mobile-pos', 'orders'],
    title: 'Orders And Checkout',
    summary: 'Operational checkout flow documentation for the mobile POS app.',
    audience: 'Cashiers and merchant owners.',
    category: 'mobile-pos',
    blocks: [
      {
        type: 'section',
        title: 'Topics To Cover',
        bullets: [
          'Adding items to the cart',
          'Choosing Contactless or Cash',
          'Order success, decline, and timeout states',
          'Operational next steps after payment',
        ],
      },
    ],
    related: [['mobile-pos', 'receipts'], ['mobile-pos', 'tap-to-pay']],
  }),
  basicPage({
    slug: ['mobile-pos', 'receipts'],
    title: 'Receipts',
    summary: 'Digital receipt handling for the Fesi POS app.',
    audience: 'Cashiers and support teams.',
    category: 'mobile-pos',
    blocks: [
      {
        type: 'section',
        title: 'Current Receipt Options',
        bullets: [
          'Email receipt when an email address is available',
          'SMS receipt via the native SMS composer',
          'Receipt offering after successful payment',
        ],
      },
    ],
    related: [['mobile-pos', 'orders'], ['mobile-pos', 'tap-to-pay']],
  }),
  basicPage({
    slug: ['mobile-pos', 'staff-security'],
    title: 'Staff Access And Security',
    summary: 'Merchant security and staff access guidance for the mobile POS app.',
    audience: 'Merchant owners and administrators.',
    category: 'mobile-pos',
    blocks: [
      {
        type: 'section',
        title: 'Security Topics',
        bullets: [
          'Staff PIN entry',
          'Merchant biometric access',
          'Who can accept Tap to Pay terms',
        ],
      },
    ],
    related: [['merchant-admin', 'settings'], ['mobile-pos', 'getting-started']],
  }),
  mobilePosAppleReviewDocumentationPage,
];

export const documentationNavGroups: DocumentationNavGroup[] = [
  {
    title: 'Overview',
    slugs: [[]],
  },
  {
    title: 'Merchant Web Dashboard',
    slugs: [
      ['merchant-admin'],
      ['merchant-admin', 'onboarding'],
      ['merchant-admin', 'menu'],
      ['merchant-admin', 'events'],
      ['merchant-admin', 'settings'],
      ['merchant-admin', 'analytics'],
    ],
  },
  {
    title: 'Mobile POS App',
    slugs: [
      ['mobile-pos'],
      ['mobile-pos', 'getting-started'],
      ['mobile-pos', 'tap-to-pay'],
      ['mobile-pos', 'orders'],
      ['mobile-pos', 'receipts'],
      ['mobile-pos', 'staff-security'],
      ['mobile-pos', 'apple-review'],
    ],
  },
];
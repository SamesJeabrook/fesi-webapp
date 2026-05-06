import { merchantAdminAnalyticsDocumentationPage } from './pages/merchantAdminAnalytics';
import { merchantAdminDashboardDocumentationPage } from './pages/merchantAdminDashboard';
import { merchantAdminEventsDocumentationPage } from './pages/merchantAdminEvents';
import { merchantAdminMenuDocumentationPage } from './pages/merchantAdminMenu';
import { merchantAdminOnboardingDocumentationPage } from './pages/merchantAdminOnboarding';
import { merchantAdminSettingsDocumentationPage } from './pages/merchantAdminSettings';
import { mobilePosAppleReviewDocumentationPage } from './pages/mobilePosAppleReview';
import { mobilePosGettingStartedDocumentationPage } from './pages/mobilePosGettingStarted';
import { mobilePosOrdersDocumentationPage } from './pages/mobilePosOrders';
import { mobilePosReceiptsDocumentationPage } from './pages/mobilePosReceipts';
import { mobilePosTapToPayDocumentationPage } from './pages/mobilePosTapToPay';
import { mobilePosStaffSecurityDocumentationPage } from './pages/mobilePosStaffSecurity';
import { overviewDocumentationPage } from './pages/overview';
import { pricingFeesDocumentationPage } from './pages/pricingFees';
import { quickStartOverviewDocumentationPage } from './pages/quickStartOverview';
import { quickStartMenuCategoriesDocumentationPage } from './pages/quickStartMenuCategories';
import { quickStartCustomizationOptionsDocumentationPage } from './pages/quickStartCustomizationOptions';
import { quickStartMenuItemsDocumentationPage } from './pages/quickStartMenuItems';
import { quickStartCreatingMenusDocumentationPage } from './pages/quickStartCreatingMenus';
import { quickStartCreatingEventsDocumentationPage } from './pages/quickStartCreatingEvents';
import { quickStartManagingOrdersDocumentationPage } from './pages/quickStartManagingOrders';
import { quickStartPosAppDocumentationPage } from './pages/quickStartPosApp';
import type { DocumentationNavGroup, DocumentationPage } from './types';

function basicPage(page: DocumentationPage): DocumentationPage {
  return page;
}

export const documentationPages: DocumentationPage[] = [
  overviewDocumentationPage,
  pricingFeesDocumentationPage,
  quickStartOverviewDocumentationPage,
  quickStartMenuCategoriesDocumentationPage,
  quickStartCustomizationOptionsDocumentationPage,
  quickStartMenuItemsDocumentationPage,
  quickStartCreatingMenusDocumentationPage,
  quickStartCreatingEventsDocumentationPage,
  quickStartManagingOrdersDocumentationPage,
  quickStartPosAppDocumentationPage,
  merchantAdminDashboardDocumentationPage,
  merchantAdminOnboardingDocumentationPage,
  merchantAdminMenuDocumentationPage,
  merchantAdminEventsDocumentationPage,
  merchantAdminSettingsDocumentationPage,
  merchantAdminAnalyticsDocumentationPage,
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
  mobilePosOrdersDocumentationPage,
  mobilePosReceiptsDocumentationPage,
  mobilePosStaffSecurityDocumentationPage,
  mobilePosAppleReviewDocumentationPage,
];

export const documentationNavGroups: DocumentationNavGroup[] = [
  {
    title: 'Overview',
    slugs: [[], ['pricing-fees']],
  },
  {
    title: '🚀 Quick Start Guide',
    slugs: [
      ['quick-start'],
      ['quick-start', 'menu-categories'],
      ['quick-start', 'customization-options'],
      ['quick-start', 'menu-items'],
      ['quick-start', 'creating-menus'],
      ['quick-start', 'creating-events'],
      ['quick-start', 'managing-orders'],
      ['quick-start', 'pos-app'],
    ],
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
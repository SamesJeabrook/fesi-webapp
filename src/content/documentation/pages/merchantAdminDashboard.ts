import type { DocumentationPage } from '../types';

export const merchantAdminDashboardDocumentationPage: DocumentationPage = {
  slug: ['merchant-admin'],
  title: 'Merchant Admin Dashboard',
  summary:
    'Overview of the four main areas of the merchant dashboard: Daily Operations, Collaboration, Menus and Configuration, and how they connect to your business workflow.',
  audience: 'Merchants learning how to navigate and use the admin dashboard.',
  category: 'merchant-admin',
  blocks: [
    {
      type: 'section',
      title: 'Dashboard Overview',
      paragraphs: [
        'The merchant dashboard is your central control hub. It is organized into four main areas, each serving a distinct part of your business:',
      ],
    },
    {
      type: 'steps',
      title: 'The Four Main Areas',
      steps: [
        {
          title: 'Daily Operations',
          description:
            'The heart of your day-to-day business. Manage events (where applicable), accept and fulfill orders, and monitor live customer activity. For non-static merchants, events are mandatory — you cannot take orders outside of an active event. Use the built-in web POS to take orders directly, or download the mobile POS app for card payments on your personal device. The Customer Display can be shown on a screen in your venue, displaying your menu, the live order queue, and a QR code for customers to order online.',
        },
        {
          title: 'Collaboration',
          description:
            'Create and manage shared events with other merchants. Invite fellow merchants to join events you create, and manage invitations sent to you. This is ideal for pop-ups, catering, or joint ventures where multiple vendors operate together under one event.',
        },
        {
          title: 'Menus and Configuration',
          description:
            'Your publishing hub. Set up and manage your food and beverage menu, configure your online storefront, and update your company details. This is where you connect your menu to your online presence and control how customers see your business.',
        },
        {
          title: 'Account and Settings',
          description:
            'Manage your account security, billing, subscription tier, and profile information. This is also where you upload and maintain compliance documents required by Fesi.',
        },
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Key Concept: Events',
      paragraphs: [
        'For non-static merchants, events are the foundation. You create an event, set when it runs, and then all orders, customer displays, and operations happen within that event. Static merchants with a permanent location may have a single always-on event.',
      ],
    },
    {
      type: 'section',
      title: 'What You Can Do in Each Area',
      paragraphs: [
        'Each area contains multiple sub-sections and tools tailored to that function. Rather than duplicate detailed guides within this overview, each area has its own detailed documentation. Start with the section most relevant to your immediate task.',
      ],
    },
    {
      type: 'routes',
      title: 'Navigation',
      routes: [
        {
          path: '/merchant/admin',
          description: 'The merchant dashboard home.',
        },
        {
          path: '/merchant/onboarding',
          description: 'Setup and account creation.',
        },
      ],
    },
  ],
  related: [['merchant-admin', 'onboarding']],
};

import type { DocumentationPage } from '../types';

export const overviewDocumentationPage: DocumentationPage = {
  slug: [],
  title: 'Fesi Documentation',
  summary:
    'Central documentation for the merchant web dashboard and the Fesi POS mobile app, aligned to the actual routes and flows used in production.',
  audience: 'Merchants, operations staff, reviewers, and internal support teams.',
  category: 'overview',
  blocks: [
    {
      type: 'section',
      title: 'What Is Fesi',
      paragraphs: [
        'Fesi is an end-to-end management platform built for small businesses in the catering industry. It brings together the tools a modern food and beverage business needs to operate: online ordering, in-person payments via the Fesi POS app, event management, and a full analytics breakdown of business performance — all in one place.',
        'For businesses that need more, Fesi offers an extended tier that adds static site generation for customer-facing venues, table service and table ordering, booking management, and stock management.',
      ],
    },
    {
      type: 'section',
      title: 'How To Use This Documentation',
      paragraphs: [
        'The documentation is organized around the product surfaces merchants actually use: the merchant web dashboard and the Fesi POS mobile app.',
        'Use the merchant admin pages for setup, menus, analytics, and configuration. Use the mobile POS pages for in-person payment flows, staff operations, and Tap to Pay on iPhone guidance.',
      ],
    },
    {
      type: 'routes',
      title: 'Primary Entrypoints',
      routes: [
        {
          path: '/merchant/onboarding',
          description: 'Canonical merchant setup flow on the web.',
        },
        {
          path: '/merchant/admin',
          description: 'Main merchant dashboard and management surface.',
        },
        {
          path: '/documentation/mobile-pos/getting-started',
          description: 'Companion documentation for first-time mobile POS merchants.',
        },
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Why The Web Dashboard And Mobile POS Are Split',
      paragraphs: [
        'The web dashboard is the primary setup and configuration surface for merchants. It handles onboarding, menu management, settings, analytics, and billing.',
        'The mobile POS app focuses on operations: taking orders, accepting contactless payments, sending receipts, and handling staff-facing workflows in service.',
      ],
    },
  ],
  related: [
    ['merchant-admin'],
    ['merchant-admin', 'onboarding'],
    ['mobile-pos'],
    ['mobile-pos', 'tap-to-pay'],
    ['mobile-pos', 'apple-review'],
  ],
};
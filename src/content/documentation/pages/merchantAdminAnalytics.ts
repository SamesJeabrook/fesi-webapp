import type { DocumentationPage } from '../types';

export const merchantAdminAnalyticsDocumentationPage: DocumentationPage = {
  slug: ['merchant-admin', 'analytics'],
  title: 'Analytics and Reporting',
  summary:
    'View valuable insights into your business performance, including best-selling items, busy periods, refunds, refires, and staff activity.',
  audience: 'Merchant owners and operations leads.',
  category: 'merchant-admin',
  blocks: [
    {
      type: 'section',
      title: 'Overview',
      paragraphs: [
        'Analytics is where you gain valuable insights into your business performance. Understand what your customers are buying, when your busiest periods are, and where improvements can be made.',
      ],
    },
    {
      type: 'section',
      title: 'Key Performance Metrics',
      paragraphs: [
        'The analytics dashboard gives you visibility into:',
      ],
    },
    {
      type: 'routes',
      title: 'What You Can Track',
      routes: [
        {
          path: 'Best-selling items',
          description: 'See which menu items drive the most revenue.',
        },
        {
          path: 'Busiest times',
          description: 'Identify peak service periods to optimize staffing and inventory.',
        },
        {
          path: 'Refunds and refires',
          description: 'Monitor items with high refund or refire rates to identify quality issues.',
        },
        {
          path: 'Staff performance',
          description: 'Review individual staff performance (available on paid tiers).',
        },
      ],
    },
    {
      type: 'section',
      title: 'Viewing Your Data',
      paragraphs: [
        'You can view your business performance in two ways:',
        '**Overall analytics** — aggregate insights across all of your events and service periods.',
        '**Event-specific analytics** — drill down into individual events to understand performance on specific days.',
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Paid Tier Features',
      paragraphs: [
        'Staff performance tracking and advanced reporting features are available on the Business tier. Upgrade your account to unlock detailed staff analytics and operational insights.',
      ],
    },
    {
      type: 'routes',
      title: 'Related Routes',
      routes: [
        {
          path: '/merchant/admin/analytics',
          description: 'Merchant performance dashboards and business insights.',
        },
        {
          path: '/merchant/admin/stock',
          description: 'Stock and inventory workflows.',
        },
      ],
    },
  ],
  related: [['merchant-admin'], ['merchant-admin', 'events'], ['merchant-admin', 'menu']],
};

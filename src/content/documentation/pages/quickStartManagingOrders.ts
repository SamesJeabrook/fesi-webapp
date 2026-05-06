import type { DocumentationPage } from '../types';

export const quickStartManagingOrdersDocumentationPage: DocumentationPage = {
  slug: ['quick-start', 'managing-orders'],
  title: 'Step 6: Manage Orders',
  summary:
    'Learn how to view, accept, and fulfill orders as they come in. Keep customers informed with real-time status updates.',
  audience: 'Merchants managing their first orders.',
  category: 'quick-start',
  blocks: [
    {
      type: 'section',
      title: 'Order Workflow Overview',
      paragraphs: [
        'When a customer places an order, it flows through several stages. You control this flow and keep customers updated at each step.',
        'Good order management means fast turnaround, accurate preparation, and happy customers who know exactly when their food is ready.',
      ],
    },
    {
      type: 'steps',
      title: 'Order Management Process',
      steps: [
        {
          title: '1. New Order Arrives',
          description:
            'You\'ll receive a notification (web, mobile, and email) when an order comes in. Orders appear in your dashboard immediately.',
        },
        {
          title: '2. Review the Order',
          description:
            'Check the order details - items, customizations, customer info, and any special requests. Make sure you have everything in stock.',
        },
        {
          title: '3. Accept the Order',
          description:
            'Click "Accept" to confirm you\'ve received it and will prepare it. The customer gets notified that you\'re working on their order.',
        },
        {
          title: '4. Mark as Preparing',
          description:
            'When you start cooking, update status to "Preparing". This gives customers confidence and sets expectations.',
        },
        {
          title: '5. Mark as Ready',
          description:
            'When the order is complete and ready for pickup, mark it "Ready". The customer receives an automated notification with directions to your location.',
        },
        {
          title: '6. Complete the Order',
          description:
            'Once the customer has collected their order, mark it "Complete". This closes out the order and updates your sales records.',
        },
      ],
    },
    {
      type: 'section',
      title: 'Order Dashboard Features',
      bullets: [
        '**Real-Time Updates**: Orders appear instantly as they\'re placed',
        '**Column View**: Orders organized into columns by status (Pending, Preparing, Ready, Complete)',
        '**Drag & Drop**: Easily move orders between status columns',
        '**Order Details**: View full order breakdown including customizations',
        '**Customer Email**: Access customer email if you need to send updates',
        '**Live Stats**: See counts of total, pending, active, and ready orders at a glance',
      ],
    },
    {
      type: 'callout',
      tone: 'success',
      title: '✨ Status Update Best Practices',
      paragraphs: [
        'Update status promptly - customers appreciate knowing where their order is.',
        'Be realistic with preparation times - under-promise and over-deliver.',
        'If there\'s a delay, communicate it quickly through a status update.',
        'Mark items ready as soon as they are - don\'t wait until the customer arrives.',
      ],
    },
    {
      type: 'section',
      title: 'Handling Common Scenarios',
      bullets: [
        '**Out of Stock**: Mark the item unavailable in your menu settings, then contact the customer to offer alternatives or refund',
        '**Order Changes**: Customers can cancel within the allowed timeframe. Later changes require your approval.',
        '**Wrong Order**: Use the order notes to communicate with customers. Process refunds through your payment dashboard.',
        '**No-Show Customers**: Mark order as complete after reasonable wait time (usually 30 minutes)',
        '**Rush Orders**: Accept only if you can genuinely deliver on time. It\'s better to decline than disappoint.',
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: '⚠️ Important Notes',
      paragraphs: [
        'Orders with payment issues will show in a separate "Payment Required" section. Don\'t start preparing until payment is confirmed.',
        'Pre-orders appear in your dashboard at the scheduled time, not when placed. Check your pre-orders list regularly.',
      ],
    },
    {
      type: 'section',
      title: 'Order Notifications',
      paragraphs: [
        'You receive notifications via:',
        '• Web dashboard (real-time)',
        '• Mobile POS app (push notifications)',
        '• Email (immediate)',
        '• SMS (optional, configure in settings)',
        '',
        'Configure notification preferences in Settings → Notifications to avoid alert fatigue while staying informed.',
      ],
    },
    {
      type: 'section',
      title: '🎥 Video Tutorial',
      paragraphs: [
        'Watch our complete guide to order management, including tips for busy service periods and handling edge cases.',
        '[Video: Managing Orders Like a Pro - Duration: 9:15]',
      ],
    },
    {
      type: 'section',
      title: 'Next Steps',
      paragraphs: [
        'You\'re now managing orders! Consider downloading the mobile POS app for accepting in-person orders and using Tap to Pay.',
      ],
    },
  ],
  related: [
    ['quick-start', 'creating-events'],
    ['quick-start', 'pos-app'],
    ['mobile-pos', 'orders'],
  ],
};

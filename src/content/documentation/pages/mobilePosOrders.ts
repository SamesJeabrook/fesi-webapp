import type { DocumentationPage } from '../types';

export const mobilePosOrdersDocumentationPage: DocumentationPage = {
  slug: ['mobile-pos', 'orders'],
  title: 'Taking and Managing Orders',
  summary:
    'How to add items to a cart, take payments, and manage orders from creation through completion in the Fesi POS app.',
  audience: 'Staff taking orders and merchants operating the POS.',
  category: 'mobile-pos',
  blocks: [
    {
      type: 'section',
      title: 'How Orders Work',
      paragraphs: [
        'In Fesi POS, there are two ways orders come in: customers can place them online and collect in person, or you can key them in manually at the counter.',
        'Once an order arrives, your job is to prepare it and accept payment. This guide explains how to work with orders from start to finish.',
      ],
    },
    {
      type: 'steps',
      title: 'Order Workflow',
      steps: [
        {
          title: 'Take payment',
          description:
            'When the customer arrives (or for cash orders at the counter), process the payment using Tap to Pay, cash, or another method. Online orders automatically appear in your queue after a payment has been made.',
        },
        {
          title: 'View incoming orders',
          description:
            'Connected orders appear in the app in real time. You can see customer details, what they ordered, and any special requests.',
        },
        {
          title: 'Accept the order',
          description: 'Accept the order to confirm you have received it and have begun preparing it. The customer is notified about the status.',
        },
        {
          title: 'Prepare the items',
          description:
            'Make the order and move the ticket through its next stage when it is ready. Customers can track the overall order status, rather than individual item progress.',
        },
        {
          title: 'Mark order as complete',
          description: 'Once everything is ready, mark the order complete. If it was online, the customer is notified to come collect.',
        },
        {
          title: 'Send receipt',
          description:
            'If the customer wants a receipt, collect their email address before payment so the receipt can be sent automatically once the order is paid.',
        },
      ],
    },
    {
      type: 'section',
      title: 'If Something Goes Wrong',
      paragraphs: [
        'Sometimes orders need to be adjusted or cancelled. You have full control:',
      ],
    },
    {
      type: 'routes',
      title: 'Order Management Options',
      routes: [
        {
          path: 'Refire items',
          description: 'Remake part of an order if something was wrong the first time.',
        },
        {
          path: 'Refund payment',
          description: 'Reverse a payment if the customer changes their mind or there is an issue.',
        },
        {
          path: 'Reject order',
          description: 'Decline to fulfill an order (for example, if you run out of an item). Customer is notified.',
        },
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Customer Notifications',
      paragraphs: [
        'Whenever you accept, complete, or refund an order, your customer gets a live update. This helps them know exactly where their order is and when to arrive for collection.',
      ],
    },
    {
      type: 'routes',
      title: 'Related Topics',
      routes: [
        {
          path: '/documentation/mobile-pos/tap-to-pay',
          description: 'How to accept contactless payments.',
        },
        {
          path: '/documentation/mobile-pos/receipts',
          description: 'Digital receipt options.',
        },
      ],
    },
  ],
  related: [['mobile-pos', 'tap-to-pay'], ['mobile-pos', 'receipts'], ['merchant-admin', 'events']],
};

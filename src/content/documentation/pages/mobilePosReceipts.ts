import type { DocumentationPage } from '../types';

export const mobilePosReceiptsDocumentationPage: DocumentationPage = {
  slug: ['mobile-pos', 'receipts'],
  title: 'Digital Receipts',
  summary:
    'How digital receipts work in Fesi POS, including when the customer email is collected and how the receipt is sent after payment.',
  audience: 'Staff taking payments and merchants supporting customers.',
  category: 'mobile-pos',
  blocks: [
    {
      type: 'section',
      title: 'Receipt Basics',
      paragraphs: [
        'Fesi supports digital receipts by email. This keeps records tidy without needing a printer or paper receipts.',
        'To send a receipt, the customer email address needs to be collected before payment is taken. Once payment succeeds, the receipt is sent to that saved email address.',
      ],
    },
    {
      type: 'steps',
      title: 'Receipt Flow',
      steps: [
        {
          title: 'Collect the customer email first',
          description:
            'Before taking payment, enter the customer email address if they want a digital receipt. This ensures the receipt can be sent automatically once the transaction completes.',
        },
        {
          title: 'Take payment',
          description:
            'Process the payment as normal using Tap to Pay or cash after the customer email has been entered.',
        },
        {
          title: 'Receipt is sent immediately',
          description:
            'Once the payment succeeds, Fesi sends the receipt right away. It includes order details, items, and total.',
        },
        {
          title: 'Customer can decline a receipt',
          description:
            'If the customer does not want a receipt, you can leave the email blank and continue with payment. The transaction still completes normally.',
        },
      ],
    },
    {
      type: 'section',
      title: 'Receipt Content',
      paragraphs: [
        'Receipts include:',
      ],
    },
    {
      type: 'routes',
      title: 'What Appears on the Receipt',
      routes: [
        {
          path: 'Order items',
          description: 'Everything the customer ordered with prices and any add-ons.',
        },
        {
          path: 'Total and payment method',
          description: 'How much they paid and which payment method was used.',
        },
        {
          path: 'Your business details',
          description: 'Your business name and contact info so they know where the order came from.',
        },
        {
          path: 'Timestamp',
          description: 'When the order was completed.',
        },
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'No Printer Needed',
      paragraphs: [
        'Digital receipts are fast and paperless. Your customers receive them instantly in their inbox and can access them later without keeping a paper copy.',
      ],
    },
    {
      type: 'routes',
      title: 'Related Topics',
      routes: [
        {
          path: '/documentation/mobile-pos/tap-to-pay',
          description: 'How contactless payments work.',
        },
        {
          path: '/documentation/mobile-pos/orders',
          description: 'Full guide to order management.',
        },
      ],
    },
  ],
  related: [['mobile-pos', 'tap-to-pay'], ['mobile-pos', 'orders']],
};

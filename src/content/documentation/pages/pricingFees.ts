import type { DocumentationPage } from '../types';

export const pricingFeesDocumentationPage: DocumentationPage = {
  slug: ['pricing-fees'],
  title: 'Pricing & Fee Structure',
  summary:
    'Complete breakdown of Fesi subscription tiers, POS transaction fees, and online order fees. Understand how fees are calculated for different order types.',
  audience: 'Merchants, finance teams, and support staff.',
  category: 'overview',
  blocks: [
    {
      type: 'section',
      title: 'Subscription Tiers',
      paragraphs: [
        'Fesi offers three subscription tiers with different features and transaction fees. All tiers include core POS functionality, online ordering, and basic analytics.',
      ],
      bullets: [
        'Free Tier: £0/month - Perfect for getting started',
        'Professional: £29/month - Adds table service, staff management, reservations, and inventory',
        'Business: £79/month - Premium tier with custom branding, priority support, and advanced reporting',
      ],
    },
    {
      type: 'section',
      title: 'POS Transaction Fees (In-Person Payments)',
      paragraphs: [
        'When customers pay in person using the POS system (card terminal, Tap to Pay, etc.), the merchant absorbs the transaction fee. These fees use a percentage + fixed fee model to ensure profitability on all transaction sizes.',
        'The customer pays only the menu subtotal plus any optional tip.',
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'POS Fee Breakdown',
      paragraphs: [
        'Free Tier: 3.5% + £0.30 per transaction',
        'Professional: 3.0% + £0.40 per transaction',
        'Business: 2.9% + £0.50 per transaction',
        '',
        'Example (£20 order on Professional tier):',
        '• Customer pays: £20.00',
        '• Transaction fee: £1.00 (3.0% of £20 = £0.60, plus £0.40 fixed)',
        '• Merchant receives: £19.00',
        '',
        'These rates are highly competitive compared to standalone card readers like Sum Up (1.69%) and Zettle (1.75%), while providing a complete business management platform.',
      ],
    },
    {
      type: 'section',
      title: 'Online Order Fees (Customer Pays)',
      paragraphs: [
        'For online orders (QR code menus, web ordering), the customer pays a platform fee at checkout. This fee covers payment processing, platform maintenance, and fraud prevention.',
        'The merchant receives 100% of the menu subtotal plus any tips.',
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Online Fee Breakdown',
      paragraphs: [
        'Free Tier: 10% of order subtotal',
        'Professional: 8% of order subtotal',
        'Business: 6% of order subtotal',
        '',
        'Example (£25 order on Free tier):',
        '• Order subtotal: £25.00',
        '• Platform fee (10%): £2.50',
        '• Customer pays: £27.50',
        '• Merchant receives: £25.00',
        '',
        'Small Order Protection: Orders under £10 may have an additional small order fee to ensure the platform covers payment processing costs (Stripe charges 2.9% + £0.30 on all transactions).',
      ],
    },
    {
      type: 'section',
      title: 'Stripe Processing Fees',
      paragraphs: [
        'All payments are processed through Stripe, which charges 2.9% + £0.30 per transaction. This cost is built into our fee structure:',
      ],
      bullets: [
        'POS orders: Fee structure designed to cover Stripe costs + platform profit',
        'Online orders: Platform fee includes coverage of Stripe processing costs',
        'The merchant never sees separate Stripe charges - everything is handled through Fesi',
      ],
    },
    {
      type: 'section',
      title: 'Tips & Gratuities',
      paragraphs: [
        'Tips are always passed through to merchants at 100% with no platform fees deducted.',
      ],
      bullets: [
        'POS tips: Added to merchant payout immediately',
        'Online tips: Included in order payout at 100%',
        'No platform commission on tips - they belong entirely to your staff',
      ],
    },
    {
      type: 'section',
      title: 'Fee Comparison Table',
      paragraphs: [
        'How Fesi compares to other solutions:',
      ],
    },
    {
      type: 'callout',
      tone: 'success',
      title: 'Value Proposition',
      paragraphs: [
        'While our POS fees are slightly higher than standalone card readers, Fesi provides:',
        '• Complete menu management system',
        '• Online ordering and QR code menus',
        '• Event management and vendor coordination',
        '• Staff management with PIN security',
        '• Real-time analytics and reporting',
        '• Table service and reservations (Pro+)',
        '• Inventory management (Pro+)',
        '• No hardware costs for Tap to Pay on iPhone',
        '',
        'Sum Up or Zettle might charge 1.69-1.75%, but they\'re just card readers. Fesi is a complete business platform.',
      ],
    },
    {
      type: 'section',
      title: 'How Fees Are Calculated',
      paragraphs: [
        'Fees are calculated automatically based on:',
      ],
      bullets: [
        'Your subscription tier (Starter, Professional, or Business)',
        'Order source (POS vs Online)',
        'Order subtotal (before tips)',
        'Small order protection threshold (£10 for online orders)',
      ],
    },
    {
      type: 'steps',
      title: 'POS Fee Calculation Example',
      steps: [
        {
          title: '£50 order on Business tier (2.9% + £0.50)',
          description: 'Percentage fee: £50 × 2.9% = £1.45. Fixed fee: £0.50. Total fee: £1.95. Merchant receives: £48.05',
        },
        {
          title: '£10 order on Free tier (3.5% + £0.30)',
          description: 'Percentage fee: £10 × 3.5% = £0.35. Fixed fee: £0.30. Total fee: £0.65. Merchant receives: £9.35',
        },
        {
          title: '£5 order on Professional tier (3.0% + £0.40)',
          description: 'Percentage fee: £5 × 3.0% = £0.15. Fixed fee: £0.40. Total fee: £0.55. Merchant receives: £4.45',
        },
      ],
    },
    {
      type: 'steps',
      title: 'Online Fee Calculation Example',
      steps: [
        {
          title: '£30 online order on Professional tier (8%)',
          description: 'Platform fee: £30 × 8% = £2.40. Customer pays: £32.40. Merchant receives: £30.00',
        },
        {
          title: '£8 online order on Free tier (10% + small order fee)',
          description: 'Base platform fee: £8 × 10% = £0.80. Small order fee: ~£0.60 (to cover Stripe costs). Customer pays: £9.40. Merchant receives: £8.00',
        },
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'Important Notes',
      paragraphs: [
        'Fees are non-negotiable and set by subscription tier',
        'Downgrading your tier will increase your transaction fees',
        'The small order fee on online orders protects platform profitability on small transactions',
        'All fees are automatically deducted - no manual invoicing',
        'Tips are always 100% merchant-retained regardless of order type',
      ],
    },
  ],
  related: [
    ['merchant-admin', 'onboarding'],
    ['merchant-admin', 'settings'],
    ['mobile-pos', 'getting-started'],
  ],
};

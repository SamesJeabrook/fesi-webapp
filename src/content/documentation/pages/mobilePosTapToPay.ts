import type { DocumentationPage } from '../types';

export const mobilePosTapToPayDocumentationPage: DocumentationPage = {
  slug: ['mobile-pos', 'tap-to-pay'],
  title: 'Tap To Pay On iPhone',
  summary:
    'Operational guidance for using Tap to Pay on iPhone in the Fesi POS app, including contactless acceptance, digital wallets, receipts, verification prompts, and fallback handling.',
  audience: 'Merchant staff, merchant owners, and App Review reviewers.',
  category: 'mobile-pos',
  blocks: [
    {
      type: 'section',
      title: 'What This Page Should Explain',
      paragraphs: [
        'This page should document the merchant-facing Tap to Pay flow exactly as the app presents it.',
        'It should explain where the customer holds their card or device, which payment methods are supported, how digital receipts are offered, and what staff should do if the first attempt does not work.',
      ],
      bullets: [
        'Contactless cards',
        'Apple Pay and other digital wallets',
        'Customer verification prompts when shown by the system',
        'Fallback to another payment method if the card does not read',
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'UK Rollout Scope',
      paragraphs: [
        'The current rollout is UK-only, so the operational guidance should be specific to UK merchant expectations and supported payment behavior.',
        'Where verification prompts appear, the merchant should follow the system-led flow and allow the customer to complete any required action themselves.',
      ],
    },
    {
      type: 'assets',
      title: 'Suggested Screenshots To Add Later',
      assets: [
        {
          name: 'Tap to Pay education screen',
          description: 'Screenshot of the in-app education screen that shows where to hold the card near the top of the iPhone.',
        },
        {
          name: 'Contactless checkout action',
          description: 'Screenshot of the POS checkout showing Contactless as the primary payment option.',
        },
        {
          name: 'Payment processing state',
          description: 'Screenshot of the initializing or processing overlay while a Tap to Pay transaction is in progress.',
        },
        {
          name: 'Receipt options',
          description: 'Screenshot of the post-payment receipt modal showing email and SMS receipt choices.',
        },
      ],
    },
  ],
  related: [['mobile-pos', 'receipts'], ['mobile-pos', 'apple-review']],
};
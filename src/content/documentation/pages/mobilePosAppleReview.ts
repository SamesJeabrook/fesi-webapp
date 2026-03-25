import type { DocumentationPage } from '../types';

export const mobilePosAppleReviewDocumentationPage: DocumentationPage = {
  slug: ['mobile-pos', 'apple-review'],
  title: 'Apple App Review Information',
  summary:
    'Technical and product documentation supporting the Apple App Review process, including architecture, user flows, Tap to Pay compliance, and submission guidelines.',
  audience: 'App Review reviewers and internal review coordinators.',
  category: 'mobile-pos',
  blocks: [
    {
      type: 'section',
      title: 'Product Overview For Reviewers',
      paragraphs: [
        'Fesi POS is a point-of-sale application designed for small food and beverage merchants (caterers, independent venues, pop-up traders). The app enables contactless payment acceptance via Tap to Pay on iPhone, powered by Stripe Terminal.',
        'The app is part of a two-tier product: account creation and app setup happens in the mobile app, while business configuration (menus, events, analytics) takes place on the web dashboard. This documentation explains both flows.',
      ],
    },
    {
      type: 'section',
      title: 'Key User Flows',
      paragraphs: [
        '**Merchant signup:** Users create an account directly in the app using email or social login. Account creation is secured and does not require API keys or merchant configuration at signup time.',
        '**Web handoff:** After signup, the app prompts merchants to visit the web dashboard to configure their business, create menus, and set up payment accounts. This handoff is intentional and documented in the app.',
        '**Daily operations:** Once configured, merchants return to the mobile app to take orders and accept Tap to Pay payments during service.',
        '**Payment processing:** All card transactions are processed via Stripe Terminal, a PCI-compliant payment service. Card data never touches Fesi servers.',
      ],
    },
    {
      type: 'section',
      title: 'Tap to Pay Compliance',
      paragraphs: [
        'Tap to Pay is implemented using the Stripe Terminal SDK. The app meets the following requirements:',
      ],
    },
    {
      type: 'routes',
      title: 'Compliance Requirements',
      routes: [
        {
          path: 'Contactless first',
          description: 'Contactless is presented as the primary payment option in checkout.',
        },
        {
          path: 'Clear card placement',
          description: 'In-app education clearly shows customers where to hold their card/device.',
        },
        {
          path: 'Fallback handling',
          description: 'If Tap to Pay fails, merchants can retry, offer alternative payment methods, or use cash.',
        },
        {
          path: 'UK-only rollout',
          description: 'The current release is limited to UK merchants and UK-based transactions.',
        },
        {
          path: 'Digital receipts',
          description: 'Customers receive email or SMS receipts after each transaction.',
        },
      ],
    },
    {
      type: 'section',
      title: 'Suggested App Review Submission Materials',
      paragraphs: [
        'Include the following in your App Review notes:',
      ],
    },
    {
      type: 'routes',
      title: 'Recommended Submission Assets',
      routes: [
        {
          path: 'Account signup demo',
          description: 'Short screen recording of email signup, biometric setup, and handoff to web dashboard.',
        },
        {
          path: 'Web dashboard linkage',
          description: 'Screenshot showing the onboarding prompt that directs merchants to set up their business on the web.',
        },
        {
          path: 'Payment flow demo',
          description: 'Recording of a complete Tap to Pay transaction from cart to receipt, including card placement guidance.',
        },
        {
          path: 'Fallback handling demo',
          description: 'Example of payment retry, alternative payment method selection, or cash fallback.',
        },
        {
          path: 'Documentation link',
          description: 'Link to this documentation route to show reviewers the full product narrative.',
        },
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'Important Notes For Review Coordinators',
      paragraphs: [
        'This documentation is the canonical written reference for the app. Keep it in sync with the actual app behavior.',
        'App Review notes submitted in App Store Connect should reference this documentation and include live demos of the payment flow.',
        'The web dashboard is a separate product subject to its own terms and is not reviewed as part of the mobile app review.',
      ],
    },
  ],
  related: [['mobile-pos', 'tap-to-pay'], ['mobile-pos', 'getting-started']],
};
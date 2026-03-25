import type { DocumentationPage } from '../types';

export const mobilePosGettingStartedDocumentationPage: DocumentationPage = {
  slug: ['mobile-pos', 'getting-started'],
  title: 'Getting Started with Fesi POS',
  summary:
    'Your first steps with the Fesi mobile POS app: signing up, setting up your business on the web, and starting to take orders.',
  audience: 'New merchants using the mobile POS app for the first time.',
  category: 'mobile-pos',
  blocks: [
    {
      type: 'section',
      title: 'Welcome to Fesi POS',
      paragraphs: [
        'The Fesi mobile POS app is designed to let you take orders and accept payments on your personal iPhone. Think of it as your checkout counter in your pocket.',
        'The app works hand-in-hand with your business profile on the web dashboard — business setup happens there, while day-to-day operations happen here.',
      ],
    },
    {
      type: 'steps',
      title: 'Getting Started',
      steps: [
        {
          title: '1) Create your account in the app',
          description:
            'Download Fesi from the App Store and sign up with your email. You can also set up biometric unlock so you do not have to enter your password every time.',
        },
        {
          title: '2) Complete setup on the web dashboard',
          description:
            'After signup, you will be prompted to visit your web dashboard at /merchant/admin to set up your menu, create events, and configure payments. The app will guide you to the right place.',
        },
        {
          title: '3) Learn how the app works',
          description:
            'The app shows you a quick onboarding flow that explains Tap to Pay, checkout, and receipts. If you ever need to refresh yourself, these topics are covered in detail in the documentation.',
        },
        {
          title: '4) Start taking orders',
          description:
            'Once your menu and events are set up on the web, you can start accepting orders and payments right from your phone. Customers can order online and collect in person, or you can key in cash orders directly.',
        },
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Important: App vs Web',
      paragraphs: [
        'The mobile app is where you take payments and manage day-to-day operations. Menu creation, event setup, and business configuration all happen on the web dashboard.',
        'This split keeps the app focused on what you need during service and not cluttered with setup screens.',
      ],
    },
    {
      type: 'routes',
      title: 'Related Pages',
      routes: [
        {
          path: '/documentation/mobile-pos/tap-to-pay',
          description: 'Learn how Tap to Pay on iPhone works.',
        },
        {
          path: '/documentation/mobile-pos/orders',
          description: 'Guide to taking and fulfilling orders.',
        },
        {
          path: '/documentation/merchant-admin',
          description: 'Set up your business on the web dashboard.',
        },
      ],
    },
  ],
  related: [['merchant-admin', 'onboarding'], ['mobile-pos', 'tap-to-pay'], ['mobile-pos', 'orders']],
};
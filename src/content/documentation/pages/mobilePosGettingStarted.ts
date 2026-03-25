import type { DocumentationPage } from '../types';

export const mobilePosGettingStartedDocumentationPage: DocumentationPage = {
  slug: ['mobile-pos', 'getting-started'],
  title: 'Mobile POS Getting Started',
  summary:
    'First-run documentation for the Fesi POS app, including signup, login, post-login onboarding, and the handoff to the web dashboard for merchant setup.',
  audience: 'New merchants using the mobile POS app for the first time.',
  category: 'mobile-pos',
  blocks: [
    {
      type: 'steps',
      title: 'Current First-Run Flow',
      steps: [
        {
          title: 'Create An Account In The App',
          description:
            'Merchants can sign up inside the mobile app using the signup route and optional biometric enablement prompt.',
        },
        {
          title: 'Open The Web Dashboard For Merchant Setup',
          description:
            'After signup, the app prompts merchants to continue business setup on the web dashboard at /merchant/admin.',
        },
        {
          title: 'Review Documentation',
          description:
            'The post-login onboarding links to /documentation so merchants and reviewers can see the documented setup path.',
        },
        {
          title: 'Use The App For Day-To-Day Operations',
          description:
            'Once setup is complete, merchants use the app for operational POS work, including Tap to Pay and receipts.',
        },
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'Important Product Boundary',
      paragraphs: [
        'The mobile app is not the primary place for menu creation, category management, or advanced merchant configuration.',
        'Those tasks should be documented on the web dashboard pages and referenced from the mobile docs where needed.',
      ],
    },
  ],
  related: [['merchant-admin', 'onboarding'], ['mobile-pos', 'tap-to-pay']],
};
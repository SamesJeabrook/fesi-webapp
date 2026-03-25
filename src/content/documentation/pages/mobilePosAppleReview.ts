import type { DocumentationPage } from '../types';

export const mobilePosAppleReviewDocumentationPage: DocumentationPage = {
  slug: ['mobile-pos', 'apple-review'],
  title: 'Apple Review And Compliance Notes',
  summary:
    'A reviewer-facing documentation page that explains the Fesi POS signup, web onboarding handoff, Tap to Pay behavior, and what screenshots or recordings should accompany App Review.',
  audience: 'Internal team members preparing the Apple submission and App Review reviewers if shared publicly.',
  category: 'mobile-pos',
  blocks: [
    {
      type: 'section',
      title: 'Recommended Narrative For Review',
      paragraphs: [
        'Account creation starts in the mobile app. Merchant business setup and advanced configuration continue on the web dashboard at /merchant/admin.',
        'The mobile app is the operational point-of-sale surface for taking orders, accepting Tap to Pay transactions, and sending digital receipts.',
        'The documentation route can be used to make this split explicit to reviewers and merchants.',
      ],
    },
    {
      type: 'assets',
      title: 'Suggested Apple Submission Assets',
      assets: [
        {
          name: 'Signup flow recording',
          description: 'Capture account creation in the mobile app and the handoff prompt to the web dashboard.',
        },
        {
          name: 'Post-login onboarding screenshots',
          description: 'Show the mobile onboarding screens that link to the web dashboard and the documentation route.',
        },
        {
          name: 'Tap to Pay education screenshots',
          description: 'Show the merchant education screens including card placement, wallets, verification prompts, and fallback guidance.',
        },
        {
          name: 'Checkout and receipt screenshots',
          description: 'Show Contactless first in checkout, the processing flow, and receipt options after a successful payment.',
        },
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'What This Documentation Does Not Replace',
      paragraphs: [
        'This page helps explain your product and review posture, but it does not replace App Review notes, videos, or screenshots submitted directly in App Store Connect.',
        'Use this page as the canonical written reference and keep the submitted media in sync with the actual product behavior.',
      ],
    },
  ],
  related: [['mobile-pos', 'getting-started'], ['mobile-pos', 'tap-to-pay'], ['merchant-admin', 'onboarding']],
};
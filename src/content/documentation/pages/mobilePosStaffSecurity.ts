import type { DocumentationPage } from '../types';

export const mobilePosStaffSecurityDocumentationPage: DocumentationPage = {
  slug: ['mobile-pos', 'staff-security'],
  title: 'Staff Access and Security',
  summary:
    'Managing staff access to the Fesi POS app, including biometric unlock, PIN entry, and merchant-level security controls.',
  audience: 'Merchant owners setting up staff access.',
  category: 'mobile-pos',
  blocks: [
    {
      type: 'section',
      title: 'Keeping Your Device Secure',
      paragraphs: [
        'The Fesi POS app handles real payments and customer data, so security is important. This page explains how to set up safe access for your staff and yourself.',
      ],
    },
    {
      type: 'section',
      title: 'Biometric Unlock',
      paragraphs: [
        'When you first set up Fesi, the app may offer biometric unlock depending on your device. This lets you open the app quickly without typing your password every time.',
        'We recommend enabling biometric unlock for convenience, as long as only authorized staff have access to the device.',
      ],
    },
    {
      type: 'section',
      title: 'Staff PIN (Optional)',
      paragraphs: [
        'If you want to track which staff member processed each order, you can enable staff PINs on the POS.',
        'When staff sign into the app, they enter a personal PIN you have assigned to them. This helps you see in your analytics which team member completed each transaction.',
        'You set up and manage staff PIN numbers in your merchant dashboard on the web.',
      ],
    },
    {
      type: 'section',
      title: 'Accepting Tap to Pay Terms',
      paragraphs: [
        'Before your staff can process Tap to Pay payments, they must accept the Tap to Pay Terms of Service.',
        'Only you (the merchant account owner) or authorized staff can accept these terms. This is a one-time setup step.',
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Accessibility Notes',
      paragraphs: [
        'If staff members use accessibility features such as screen readers, display magnification, or larger text settings, these should be supported in the POS. Allow extra time for staff to complete biometric or PIN entry if they need assistance.',
      ],
    },
    {
      type: 'routes',
      title: 'Related Configuration',
      routes: [
        {
          path: '/merchant/admin/settings',
          description: 'Enable or disable staff PINs and manage security settings from your web dashboard.',
        },
        {
          path: '/documentation/mobile-pos/getting-started',
          description: 'Overview of the POS app.',
        },
      ],
    },
  ],
  related: [['merchant-admin', 'settings'], ['mobile-pos', 'getting-started']],
};

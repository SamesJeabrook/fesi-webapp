import type { DocumentationPage } from '../types';

export const quickStartPosAppDocumentationPage: DocumentationPage = {
  slug: ['quick-start', 'pos-app'],
  title: 'Step 7: Get the POS App',
  summary:
    'Download the Fesi POS app for iOS to accept in-person orders and use Apple Tap to Pay for contactless payments.',
  audience: 'Merchants wanting to accept in-person orders with mobile payments.',
  category: 'quick-start',
  blocks: [
    {
      type: 'section',
      title: 'Why Use the POS App?',
      paragraphs: [
        'The Fesi POS app transforms your iPhone into a complete point-of-sale system. Accept orders face-to-face, process payments with a tap, and manage your business on the go.',
        'Best of all: no extra hardware needed. Your iPhone is your card reader thanks to Apple Tap to Pay.',
      ],
    },
    {
      type: 'callout',
      tone: 'success',
      title: '💳 Apple Tap to Pay',
      paragraphs: [
        'Accept contactless payments directly on your iPhone - no dongles, no extra devices.',
        'Customers just tap their card, phone, or watch on your iPhone to pay. Fast, secure, and professional.',
        'Requires iPhone XS or newer running iOS 16+. Works with Visa, Mastercard, American Express, and mobile wallets.',
      ],
    },
    {
      type: 'section',
      title: 'Key Features',
      bullets: [
        '**Tap to Pay**: Accept contactless card and phone payments with no extra hardware',
        '**Quick Checkout**: Fast order entry with your complete menu at your fingertips',
        '**Cash Payments**: Accept cash and track it alongside card payments',
        '**Customer Info**: Capture email for receipts and marketing',
        '**Offline Mode**: Continue taking orders even without internet',
        '**Kitchen Sync**: Orders sync instantly with your kitchen display',
        '**Receipts**: Send digital receipts via email or SMS',
        '**Staff Management**: Multiple staff can use one device with PIN login',
      ],
    },
    {
      type: 'steps',
      title: 'Getting Started with the POS App',
      steps: [
        {
          title: 'Download from App Store',
          description:
            'Search for "Fesi POS" in the Apple App Store. Free to download for all Fesi merchants.',
        },
        {
          title: 'Sign In',
          description:
            'Use your merchant account credentials to log in. Same credentials as your web dashboard.',
        },
        {
          title: 'Set Up Tap to Pay',
          description:
            'Follow the in-app guide to enable Apple Tap to Pay. You\'ll accept the Apple terms and verify your business details.',
        },
        {
          title: 'Select Your Event',
          description:
            'Choose which event you\'re working at. The POS shows the menu for that event.',
        },
        {
          title: 'Take Your First Order',
          description:
            'Add items to cart, apply any customizations, and checkout. For cash, mark as paid. For card, use Tap to Pay.',
        },
        {
          title: 'Process Tap to Pay Transaction',
          description:
            'When ready to accept card payment, the customer taps their card/phone on your iPhone screen. Hold steady for 1-2 seconds until confirmed.',
        },
      ],
    },
    {
      type: 'section',
      title: 'Device Requirements',
      bullets: [
        '**iPhone XS or newer** (for Tap to Pay)',
        '**iOS 16.0 or later**',
        '**Active internet connection** (4G/5G or WiFi)',
        '**Stripe account** connected to your Fesi merchant account',
        '**UK merchant** (Tap to Pay currently UK only)',
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: '🔒 Security & Compliance',
      paragraphs: [
        'Tap to Pay uses the same secure technology as Apple Pay. Card data never touches your device.',
        'PCI DSS compliant - Stripe handles all payment processing securely.',
        'Optional staff PIN codes keep your POS secure when leaving device unattended.',
      ],
    },
    {
      type: 'section',
      title: 'POS Workflows',
      paragraphs: [
        '**Walk-Up Customer**: Customer orders → You enter order in POS → They pay → Instant confirmation → Kitchen receives order',
        '',
        '**Pre-Order Pickup**: Customer ordered online → Arrives → You find order in POS → They collect → Mark complete',
        '',
        '**Cash Sales**: Same flow but select "Cash" payment → Manually mark as paid → Drawer tracking if configured',
      ],
    },
    {
      type: 'section',
      title: 'Tips for Busy Service',
      bullets: [
        'Use multiple devices with staff PINs - one person takes orders, another handles payments',
        'Keep a power bank handy - payment processing can drain battery',
        'Enable sounds/haptics so you feel the successful tap confirmation',
        'Familiarize yourself with the menu layout before busy periods',
        'Set up customization defaults for faster order entry',
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: '⚠️ First-Time Setup',
      paragraphs: [
        'Apple Tap to Pay requires one-time setup that can take 24-48 hours for approval. Set this up before your first event!',
        'You\'ll need to accept Apple\'s Tap to Pay terms, which include displaying terms to customers. The app handles this automatically.',
      ],
    },
    {
      type: 'section',
      title: '🎥 Video Tutorial',
      paragraphs: [
        'Watch our comprehensive POS app tutorial covering setup, Tap to Pay, and handling your first transactions.',
        '[Video: Fesi POS App Complete Guide - Duration: 12:45]',
      ],
    },
    {
      type: 'section',
      title: 'Congratulations! 🎉',
      paragraphs: [
        'You\'ve completed the Quick Start guide! You now have:',
        '✅ A complete menu structure',
        '✅ Active events accepting orders',
        '✅ The skills to manage orders efficiently',
        '✅ The POS app for in-person sales',
        '',
        'You\'re ready to start serving customers! As you grow, explore our advanced features in the full documentation.',
      ],
    },
  ],
  related: [
    ['quick-start', 'managing-orders'],
    ['mobile-pos', 'getting-started'],
    ['mobile-pos', 'tap-to-pay'],
  ],
};

import type { DocumentationPage } from '../types';

export const quickStartOverviewDocumentationPage: DocumentationPage = {
  slug: ['quick-start'],
  title: 'Quick Start Guide',
  summary:
    'Get up and running with Fesi in minutes. Follow these guided steps to set up your menu, create events, and start taking orders.',
  audience: 'New merchants ready to launch their first event or service.',
  category: 'quick-start',
  blocks: [
    {
      type: 'section',
      title: 'Welcome to Fesi!',
      paragraphs: [
        'This guide walks you through the essential setup steps to get your business operational on Fesi. Whether you\'re running a street food stall, pop-up restaurant, or event catering, you\'ll be taking orders in no time.',
        'We recommend following these steps in order, as each builds on the previous one. The entire setup typically takes 15-30 minutes.',
      ],
    },
    {
      type: 'callout',
      tone: 'success',
      title: '🎥 Video Tutorials Available',
      paragraphs: [
        'Each step in this guide has an accompanying video tutorial on our YouTube channel. Watch along as we demonstrate each feature step-by-step.',
      ],
    },
    {
      type: 'steps',
      title: 'Quick Start Steps',
      steps: [
        {
          title: 'Step 1: Set Up Menu Categories',
          description:
            'Organize your products into logical groups (e.g., Mains, Sides, Drinks). Categories help customers navigate your menu and keep your offerings organized.',
        },
        {
          title: 'Step 2: Create Customization Options',
          description:
            'Define reusable options like Size, Toppings, or Extras. These can be applied to multiple items, saving you time and ensuring consistency.',
        },
        {
          title: 'Step 3: Add Menu Items',
          description:
            'Create your products with prices, descriptions, and images. Attach the customization options you created to make items customizable.',
        },
        {
          title: 'Step 4: Build Your Menu',
          description:
            'Assemble your categories and items into a complete menu that customers will see. You can create multiple menus for different events or seasons.',
        },
        {
          title: 'Step 5: Create Your First Event',
          description:
            'Set up an event with date, time, and location. Events are how you open for business and start accepting orders.',
        },
        {
          title: 'Step 6: Manage Orders',
          description:
            'Learn how to view, accept, and fulfill orders as they come in. Update order status to keep customers informed.',
        },
        {
          title: 'Step 7: Download the POS App',
          description:
            'Get the mobile POS app for iOS to accept in-person orders and use Apple Tap to Pay for contactless payments.',
        },
      ],
    },
    {
      type: 'section',
      title: 'What You\'ll Need',
      bullets: [
        'Business details (name, description)',
        'Menu information (items, prices, categories)',
        'Product images (optional but recommended)',
        'Event details (location, date, time)',
        'iOS device for mobile POS (iPhone XS or newer for Tap to Pay)',
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Already Set Up?',
      paragraphs: [
        'If you\'ve completed your initial setup, check out the individual sections in the documentation for advanced features like analytics, staff management, and payment settings.',
      ],
    },
  ],
  related: [
    ['quick-start', 'menu-categories'],
    ['quick-start', 'customization-options'],
    ['quick-start', 'menu-items'],
    ['merchant-admin', 'menu'],
  ],
};

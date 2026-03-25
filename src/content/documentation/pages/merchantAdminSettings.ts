import type { DocumentationPage } from '../types';

export const merchantAdminSettingsDocumentationPage: DocumentationPage = {
  slug: ['merchant-admin', 'settings'],
  title: 'Settings, Billing, and Configuration',
  summary:
    'Manage your business profile, operating mode, staff access, reservations, compliance documents, and billing settings.',
  audience: 'Merchant administrators and account owners.',
  category: 'merchant-admin',
  blocks: [
    {
      type: 'section',
      title: 'Overview',
      paragraphs: [
        'Settings is where you control how your business operates on Fesi. Some advanced features are available only on paid tiers—if you cannot see an option, upgrading your account will unlock it.',
      ],
    },
    {
      type: 'section',
      title: 'General Settings',
      paragraphs: [
        'This is where you manage the fundamentals of your business on Fesi. You can update the categories your business appears under, your trading name, and how you appear online. You can also manage your bank account details through our Stripe integration and upload new compliance documents as required.',
        'Staff PINs: If you want to track which staff member processed each order, you can enable staff PIN requirements on the POS. This helps with both accountability and analytics. You manage staff and assign PIN numbers in a dedicated staff area.',
      ],
    },
    {
      type: 'section',
      title: 'Operating Mode',
      paragraphs: [
        'This is where you choose how your business operates on Fesi. By default, Fesi supports event-based merchants who create individual events for each service.',
        'You can switch to Static Site mode, which completely changes how Fesi works for you. As a static merchant, you no longer need to create events — instead, you simply set whether you are open or closed. A static address is required before you can select this mode.',
      ],
    },
    {
      type: 'section',
      title: 'Reservations (Paid Tier)',
      paragraphs: [
        'Reservation settings control how table bookings work for your business. You can configure multiple table orders, set auto-acceptance rules, and choose whether to accept online orders.',
      ],
    },
    {
      type: 'routes',
      title: 'Reservation Configuration Options',
      routes: [
        {
          path: 'Table booking duration',
          description: 'How long each table booking lasts.',
        },
        {
          path: 'Maximum capacity',
          description: 'The maximum number of people that can book a table.',
        },
        {
          path: 'Slot intervals',
          description: 'How long each bookable time slot is.',
        },
        {
          path: 'Booking window',
          description: 'How many days in advance customers can make reservations.',
        },
        {
          path: 'Deposit enforcement',
          description: 'Optionally require upfront deposits on bookings.',
        },
      ],
    },
    {
      type: 'routes',
      title: 'Related Routes',
      routes: [
        {
          path: '/merchant/admin/settings',
          description: 'General business settings.',
        },
        {
          path: '/merchant/admin/settings/operating-mode',
          description: 'Operating mode configuration.',
        },
        {
          path: '/merchant/admin/settings/reservations',
          description: 'Reservation and table booking settings.',
        },
        {
          path: '/merchant/admin/subscription',
          description: 'Billing and plan management.',
        },
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Tier Information',
      paragraphs: [
        'Reservations and advanced operating modes are features of the Business tier. If you need these features on your current plan, upgrade your account to unlock them.',
      ],
    },
  ],
  related: [['merchant-admin'], ['merchant-admin', 'menu'], ['mobile-pos', 'staff-security']],
};

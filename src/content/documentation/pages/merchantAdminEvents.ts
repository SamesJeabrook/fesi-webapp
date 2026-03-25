import type { DocumentationPage } from '../types';

export const merchantAdminEventsDocumentationPage: DocumentationPage = {
  slug: ['merchant-admin', 'events'],
  title: 'Events and Operations',
  summary:
    'Create, schedule, and manage events so customers know where and when to collect orders, with quick controls for opening, closing, and reviewing performance.',
  audience: 'Non-static merchants and operations teams running service from events.',
  category: 'merchant-admin',
  blocks: [
    {
      type: 'section',
      title: 'Why Events Matter',
      paragraphs: [
        'For non-static merchants, events are how orders are taken. Events tell customers where you are trading and when you are available.',
        'This is especially important on the day of service, as customers placing online orders need clear pickup location and timing details.',
      ],
    },
    {
      type: 'steps',
      title: 'Recommended Event Workflow',
      steps: [
        {
          title: '1) Create an event',
          description:
            'Add a clear event name, choose which menu to use (or keep your default), and place your location on the map. Your current location is pre-filled to speed things up.',
        },
        {
          title: '2) Add schedule details',
          description:
            'Set the days and opening times for service. If you are trading across multiple days, such as a festival weekend, you can add all date and time windows in one event.',
        },
        {
          title: '3) Use Quick Event when needed',
          description:
            'If you are in a hurry, Quick Event auto-populates most fields. You only need to confirm the menu selection (default is available) and verify your location.',
        },
        {
          title: '4) Open and close service',
          description:
            'From the events page, you can open an event when service starts and close it when trading ends. Events will auto open and close between the hours you have set, but you can also manage this manually if your schedule changes.',
        },
        {
          title: '5) Review event performance',
          description:
            'Use the event analytics shortcut to review day-level insights and understand performance after service.',
        },
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Operational Tip',
      paragraphs: [
        'Keep event details accurate, especially location and times. Accurate event information reduces missed collections and helps customers trust live updates.',
      ],
    },
    {
      type: 'routes',
      title: 'Operational Routes',
      routes: [
        {
          path: '/merchant/admin/events',
          description: 'Create, edit, open, and close merchant events.',
        },
        {
          path: '/merchant/admin/group-events',
          description: 'Coordinate shared or collaborative events.',
        },
        {
          path: '/merchant/admin/orders',
          description: 'Review and action orders for active events.',
        },
      ],
    },
  ],
  related: [['merchant-admin'], ['merchant-admin', 'menu'], ['mobile-pos', 'orders']],
};
import type { DocumentationPage } from '../types';

export const quickStartCreatingEventsDocumentationPage: DocumentationPage = {
  slug: ['quick-start', 'creating-events'],
  title: 'Step 5: Create Your First Event',
  summary:
    'Set up an event to open for business. Events define when and where you\'re serving, and which menu you\'re offering.',
  audience: 'Merchants ready to start accepting orders.',
  category: 'quick-start',
  blocks: [
    {
      type: 'section',
      title: 'What Is an Event?',
      paragraphs: [
        'An event is how you "open for business" in Fesi. It defines the date, time, location, and menu for a specific service period. Think of it as opening your virtual doors.',
        'Every order belongs to an event. Whether you\'re at a festival, running a pop-up, or serving from a fixed location, you create an event for it.',
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: '💡 Event Examples',
      paragraphs: [
        '🎪 Festival Stand: "Notting Hill Carnival - Day 1" with specific location and times',
        '🍕 Regular Service: "Friday Night Service" - recurring weekly event',
        '🎉 Private Catering: "Johnson Wedding Reception" - one-time event',
        '☕ Coffee Cart: "Morning Market - Shoreditch" - regular market attendance',
      ],
    },
    {
      type: 'steps',
      title: 'Creating an Event',
      steps: [
        {
          title: 'Navigate to Events',
          description:
            'Go to Events Management from the main menu. Click "Create New Event".',
        },
        {
          title: 'Enter Event Details',
          description:
            'Give your event a clear name and description. Customers see this, so make it informative: "Summer Street Food Festival - Sunday" is better than "Event 1".',
        },
        {
          title: 'Set Date and Time',
          description:
            'Choose when you\'ll be serving. Set both start and end times. You can create recurring events if you have regular schedules (e.g., every Friday evening).',
        },
        {
          title: 'Add Location',
          description:
            'Set where you\'ll be located. You can enter an address, drop a pin on a map, or add coordinates. This helps customers find you and is used for delivery calculations.',
        },
        {
          title: 'Select Your Menu',
          description:
            'Choose which menu to use for this event. This is where your menu setup pays off - just select the appropriate menu from your list.',
        },
        {
          title: 'Configure Order Settings',
          description:
            'Set whether you\'re accepting pre-orders, walk-up orders, or both. Set any order cutoff times (e.g., pre-orders must be placed 1 hour before event).',
        },
        {
          title: 'Open the Event',
          description:
            'Toggle "Event is Live" to open for orders. Customers can now see your event and place orders!',
        },
      ],
    },
    {
      type: 'section',
      title: 'Event Management During Service',
      bullets: [
        '**Pause Orders**: Temporarily stop accepting new orders if you\'re backed up',
        '**Update Wait Times**: Let customers know current preparation times',
        '**Close Early**: End service before scheduled end time if you sell out',
        '**Manage Availability**: Mark items as unavailable without deleting them',
        '**View Live Orders**: See incoming orders in real-time',
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: '⚠️ Before Going Live',
      paragraphs: [
        'Test your event setup before opening to customers. Create a test order to ensure everything works.',
        'Have your mobile POS app ready if you\'re accepting in-person orders.',
        'Ensure your team knows how to access the order dashboard.',
        'Check your payment settings are configured correctly.',
      ],
    },
    {
      type: 'section',
      title: 'Event Types',
      paragraphs: [
        '**One-Time Events**: Festivals, private catering, special occasions',
        '**Recurring Events**: Weekly market stalls, regular pop-ups, daily service',
        '**Always-On Events**: For permanent locations that are always accepting orders',
        '**Pre-Order Events**: Events where customers must order in advance',
      ],
    },
    {
      type: 'section',
      title: '🎥 Video Tutorial',
      paragraphs: [
        'Watch our step-by-step guide on creating and managing events, including best practices for different event types.',
        '[Video: Creating and Managing Events - Duration: 7:30]',
      ],
    },
    {
      type: 'section',
      title: 'Next Steps',
      paragraphs: [
        'Your event is live! Now learn how to manage incoming orders and update customers on order status.',
      ],
    },
  ],
  related: [
    ['quick-start', 'creating-menus'],
    ['quick-start', 'managing-orders'],
    ['merchant-admin', 'events'],
  ],
};

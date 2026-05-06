import type { DocumentationPage } from '../types';

export const quickStartCreatingMenusDocumentationPage: DocumentationPage = {
  slug: ['quick-start', 'creating-menus'],
  title: 'Step 4: Build Your Menu',
  summary:
    'Assemble your categories and items into a complete, publishable menu that customers can order from.',
  audience: 'Merchants ready to publish their menu structure.',
  category: 'quick-start',
  blocks: [
    {
      type: 'section',
      title: 'What Is a Menu?',
      paragraphs: [
        'A menu is a curated collection of your categories and items that you present to customers. You can create multiple menus for different occasions - lunch menu, dinner menu, summer specials, event catering, etc.',
        'Think of it like creating different versions of a restaurant menu for different times or events.',
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: '💡 Why Multiple Menus?',
      paragraphs: [
        'Different events might need different offerings. A festival might show your full menu, while a corporate catering gig might show only lunch items.',
        'Seasonal rotation - create a "Summer Menu" and "Winter Menu" to match what\'s available.',
        'Time-based - separate breakfast, lunch, and dinner menus.',
      ],
    },
    {
      type: 'steps',
      title: 'Creating a Menu',
      steps: [
        {
          title: 'Navigate to Menus',
          description:
            'Go to Menu Management → Menus. This is where you assemble your complete menus.',
        },
        {
          title: 'Click "Create New Menu"',
          description:
            'Give your menu a clear name like "Main Menu", "Summer 2026", or "Lunch Menu".',
        },
        {
          title: 'Add Categories',
          description:
            'Select which categories should appear in this menu. You can include all categories or just some. For example, a breakfast menu might only show "Hot Drinks" and "Pastries" categories.',
        },
        {
          title: 'Select Items',
          description:
            'Within each category, choose which items to include. You don\'t have to include every item from every category.',
        },
        {
          title: 'Set Display Order',
          description:
            'Arrange categories and items in the order customers should see them. Put best sellers and high-margin items first.',
        },
        {
          title: 'Set as Default (Optional)',
          description:
            'Mark one menu as your "default" menu. This is what new events will use automatically unless you specify otherwise.',
        },
        {
          title: 'Publish',
          description:
            'Save and publish your menu. It\'s now ready to be used in events!',
        },
      ],
    },
    {
      type: 'section',
      title: 'Menu Management Tips',
      bullets: [
        'Start with one "Main Menu" containing everything - you can create specialized menus later',
        'Organize items by profitability - put your best margin items at the top',
        'Hide seasonal items by removing them from the active menu rather than deleting',
        'Test your menu by viewing it as a customer would see it',
        'Update menus based on what sells and what doesn\'t',
      ],
    },
    {
      type: 'callout',
      tone: 'success',
      title: '✨ Pro Strategy',
      paragraphs: [
        'Create a "Core Menu" with your signature items that never changes, then seasonal "Special Menus" that rotate. This gives customers consistency while keeping things fresh.',
      ],
    },
    {
      type: 'section',
      title: '🎥 Video Tutorial',
      paragraphs: [
        'Watch our video guide on building and publishing menus, including strategies for multiple menu management.',
        '[Video: Building and Publishing Menus - Duration: 5:20]',
      ],
    },
    {
      type: 'section',
      title: 'Next Steps',
      paragraphs: [
        'With your menu complete, you\'re ready to create your first event and start accepting orders!',
      ],
    },
  ],
  related: [
    ['quick-start', 'menu-items'],
    ['quick-start', 'creating-events'],
    ['merchant-admin', 'menu'],
  ],
};

import type { DocumentationPage } from '../types';

export const quickStartMenuCategoriesDocumentationPage: DocumentationPage = {
  slug: ['quick-start', 'menu-categories'],
  title: 'Step 1: Set Up Menu Categories',
  summary:
    'Create logical groupings for your menu items to help customers navigate your offerings.',
  audience: 'New merchants setting up their first menu structure.',
  category: 'quick-start',
  blocks: [
    {
      type: 'section',
      title: 'What Are Categories?',
      paragraphs: [
        'Categories are the top-level organization for your menu. Think of them as sections that group similar items together, like Pizzas, Sides, Drinks, or Desserts.',
        'Good categories make it easy for customers to find what they\'re looking for and help you organize your menu logically.',
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: '💡 Category Examples',
      paragraphs: [
        '🍕 Pizza Shop: Pizzas, Sides, Drinks, Desserts',
        '🍔 Burger Stand: Burgers, Loaded Fries, Drinks, Extras',
        '☕ Coffee Cart: Hot Drinks, Cold Drinks, Pastries, Snacks',
        '🌮 Taco Truck: Tacos, Burritos, Sides, Beverages',
      ],
    },
    {
      type: 'steps',
      title: 'Creating Categories',
      steps: [
        {
          title: 'Navigate to Categories',
          description:
            'From the main menu, go to Menu Management → Categories. This is where you\'ll create and manage all your menu categories.',
        },
        {
          title: 'Click "Create Category"',
          description:
            'Click the "Create New Category" button to open the category creation form.',
        },
        {
          title: 'Enter Category Details',
          description:
            'Give your category a clear, customer-friendly name. For example: "Wood-Fired Pizzas" is more appealing than just "Pizzas". Add a description if helpful (optional).',
        },
        {
          title: 'Set Display Order',
          description:
            'Categories appear in the order you create them. You can drag and drop to reorder them later. Put your most popular or highest-margin categories first.',
        },
        {
          title: 'Save and Repeat',
          description:
            'Save your category and repeat for all the sections you need. Most merchants start with 3-6 categories.',
        },
      ],
    },
    {
      type: 'section',
      title: 'Best Practices',
      bullets: [
        'Keep category names short and descriptive (2-3 words max)',
        'Use customer-friendly language, not kitchen jargon',
        'Start with 3-6 categories - you can always add more later',
        'Put your signature items or best sellers in the first category',
        'Consider seasonal categories (e.g., "Summer Specials")',
        'Use the display order field to control the sequence - lower numbers appear first',
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: '⚠️ Common Mistakes',
      paragraphs: [
        'Avoid creating too many categories - this can overwhelm customers. If you have lots of items, use sub-categories or organize by type within each category instead.',
        'Don\'t use internal codes or abbreviations - remember, customers see these names.',
      ],
    },
    {
      type: 'section',
      title: '🎥 Video Tutorial',
      paragraphs: [
        'Watch our step-by-step video guide on creating menu categories. We\'ll show you how to set up a complete category structure in under 5 minutes.',
        '[Video: Setting Up Menu Categories - Duration: 4:32]',
      ],
    },
    {
      type: 'section',
      title: 'Next Steps',
      paragraphs: [
        'Once you\'ve created your categories, you\'re ready to move on to Step 2: Creating customization options for your items.',
      ],
    },
  ],
  related: [
    ['quick-start'],
    ['quick-start', 'customization-options'],
    ['merchant-admin', 'menu'],
  ],
};

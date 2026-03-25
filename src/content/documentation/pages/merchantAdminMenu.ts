import type { DocumentationPage } from '../types';

export const merchantAdminMenuDocumentationPage: DocumentationPage = {
  slug: ['merchant-admin', 'menu'],
  title: 'Menu Management',
  summary:
    'Build, organize, and publish menus using categories, options, sub-items, and menu items that can be adjusted live during service.',
  audience: 'Merchants setting up or refining their online and POS menu structure.',
  category: 'merchant-admin',
  blocks: [
    {
      type: 'section',
      title: 'Why This Area Matters',
      paragraphs: [
        'Menus in food and beverage are naturally complex. Different products need different variants, extras, and selection rules. Some options apply to many items, while others apply only to specific dishes.',
        'You may also run different menus per event, season, or service style. This section gives you a practical way to build that structure without losing control.',
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Example: Pizza Merchant',
      paragraphs: [
        'A pizza merchant might create categories for Pizzas, Sides, and Drinks; options for Size and Toppings; then attach those options only to relevant items. Sizes could be single-select, while toppings allow multiple selections with a cap.',
        'This approach keeps menu setup flexible for customers while preserving operational control for the kitchen and checkout team.',
      ],
    },
    {
      type: 'steps',
      title: 'Recommended Setup Order',
      steps: [
        {
          title: '1) Create categories first',
          description:
            'Start by grouping your catalog into clear sections. For example: Pizzas, Sides, and Drinks. Categories are the foundation for everything else and make your menu easier for customers and staff to navigate.',
        },
        {
          title: '2) Define sub-items and options',
          description:
            'Create reusable options such as Size (Small, Medium, Large) and Extras (Pepperoni, Extra Cheese, Olives), including any price adjustments. This lets you apply the same logic across multiple items without rebuilding it each time.',
        },
        {
          title: '3) Configure selection limits',
          description:
            'Set how many options a customer can choose. For example, Size should usually allow only one selection, while toppings may allow multiple selections with an optional cap (for example, up to 4).',
        },
        {
          title: '4) Add your menu items',
          description:
            'Create your core products (for example Pepperoni Pizza, Meat Feast, Farmhouse), then attach the relevant options and add-ons. You can quickly mark items as unavailable during service so they disappear from online ordering and POS checkout.',
        },
        {
          title: '5) Build and publish menus',
          description:
            'Go to Menus to assemble your items into one or more published menus, then set the appropriate default menu for service. This is especially useful when rotating menus between events.',
        },
        {
          title: '6) Refine over time',
          description:
            'All categories, options, and items can be edited as your operations evolve. Most merchants improve structure after a few live services, so treat your first version as a starting point rather than a final state.',
        },
      ],
    },
    {
      type: 'routes',
      title: 'Menu Routes',
      routes: [
        {
          path: '/merchant/admin/menu/categories',
          description: 'Create and manage category structure.',
        },
        {
          path: '/merchant/admin/menu/sub-items',
          description: 'Configure options, modifiers, and add-ons.',
        },
        {
          path: '/merchant/admin/menu/items',
          description: 'Create and maintain core menu items.',
        },
        {
          path: '/merchant/admin/menu/menus',
          description: 'Assemble and publish menu sets for service.',
        },
      ],
    },
  ],
  related: [['merchant-admin'], ['merchant-admin', 'events'], ['mobile-pos', 'orders']],
};
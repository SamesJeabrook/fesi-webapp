import type { DocumentationPage } from '../types';

export const quickStartCustomizationOptionsDocumentationPage: DocumentationPage = {
  slug: ['quick-start', 'customization-options'],
  title: 'Step 2: Create Customization Options',
  summary:
    'Set up reusable options and modifiers that customers can select when ordering items.',
  audience: 'New merchants configuring customizable menu items.',
  category: 'quick-start',
  blocks: [
    {
      type: 'section',
      title: 'What Are Customization Options?',
      paragraphs: [
        'Customization options (also called "sub-items" or "modifiers") let customers personalize their orders. Think sizes, toppings, extras, or variations.',
        'The key advantage: create them once, then attach them to multiple items. For example, create "Size" options once, then use them on pizzas, drinks, and sides.',
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: '💡 Option Examples',
      paragraphs: [
        '📏 Size: Small, Medium, Large (with different prices)',
        '🍕 Toppings: Pepperoni, Mushrooms, Olives, Extra Cheese',
        '🌶️ Spice Level: Mild, Medium, Hot, Extra Hot',
        '🥛 Milk Choice: Whole, Oat, Almond, Soy',
        '➕ Extras: Extra Shot, Extra Patty, Side Salad',
      ],
    },
    {
      type: 'steps',
      title: 'Creating Option Groups',
      steps: [
        {
          title: 'Navigate to Sub-Items',
          description:
            'Go to Menu Management → Sub-Items & Options. This is where you manage all customization options.',
        },
        {
          title: 'Create an Option Group',
          description:
            'Click "Create New Group" and give it a name like "Size" or "Toppings". This groups related options together.',
        },
        {
          title: 'Set Selection Rules',
          description:
            'Choose if customers can select one option (e.g., Size) or multiple (e.g., Toppings). Set a maximum if needed (e.g., "Choose up to 4 toppings").',
        },
        {
          title: 'Add Individual Options',
          description:
            'Within each group, add the specific options. For example, in your "Size" group, add Small, Medium, and Large with their respective prices.',
        },
        {
          title: 'Set Price Modifiers',
          description:
            'Enter how much each option adds to the base price. Some options are free (£0.00), others add cost. Use negative values for discounts.',
        },
        {
          title: 'Mark as Required or Optional',
          description:
            'Decide if customers must select from this group (e.g., Size might be required) or if it\'s optional (e.g., Extra Toppings).',
        },
      ],
    },
    {
      type: 'section',
      title: 'Common Option Groups',
      bullets: [
        '**Size** - Single selection, required (Small +£0, Medium +£2, Large +£4)',
        '**Toppings** - Multiple selection, optional, max 5 (each +£0.50-£1.50)',
        '**Extras** - Multiple selection, optional (Extra Cheese +£1, Double Patty +£2)',
        '**Temperature** - Single selection, required (Hot, Warm, Cold)',
        '**Cooking Preference** - Single selection, optional (Rare, Medium, Well Done)',
      ],
    },
    {
      type: 'callout',
      tone: 'success',
      title: '✨ Pro Tips',
      paragraphs: [
        'Group similar options together (all sizes in one group, all toppings in another).',
        'Use clear, customer-friendly names - "Add Extra Cheese" not just "Cheese".',
        'Price options based on your actual costs plus desired margin.',
        'Start simple - you can always add more options later as you learn customer preferences.',
      ],
    },
    {
      type: 'section',
      title: '🎥 Video Tutorial',
      paragraphs: [
        'Watch our detailed video guide on creating and managing customization options. We cover single vs. multiple selection, pricing strategies, and best practices.',
        '[Video: Setting Up Customization Options - Duration: 6:45]',
      ],
    },
    {
      type: 'section',
      title: 'Next Steps',
      paragraphs: [
        'With your categories and customization options ready, you can now create your menu items and attach these options to make them customizable.',
      ],
    },
  ],
  related: [
    ['quick-start', 'menu-categories'],
    ['quick-start', 'menu-items'],
    ['merchant-admin', 'menu'],
  ],
};

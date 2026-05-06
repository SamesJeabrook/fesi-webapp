import type { DocumentationPage } from '../types';

export const quickStartMenuItemsDocumentationPage: DocumentationPage = {
  slug: ['quick-start', 'menu-items'],
  title: 'Step 3: Add Menu Items',
  summary:
    'Create your actual products with names, prices, descriptions, and images. Attach customization options to make items orderable.',
  audience: 'New merchants adding products to their menu.',
  category: 'quick-start',
  blocks: [
    {
      type: 'section',
      title: 'What Are Menu Items?',
      paragraphs: [
        'Menu items are the actual products your customers order - your pizzas, burgers, drinks, sides, etc. Each item has a base price, description, and can include the customization options you created earlier.',
        'Good menu items have clear names, appetizing descriptions, and professional photos when possible.',
      ],
    },
    {
      type: 'steps',
      title: 'Creating Menu Items',
      steps: [
        {
          title: 'Navigate to Menu Items',
          description:
            'Go to Menu Management → Menu Items. Click "Create New Item" to start.',
        },
        {
          title: 'Enter Basic Information',
          description:
            'Add the item name (e.g., "Margherita Pizza"), base price (£8.99), and category. Keep names short but descriptive.',
        },
        {
          title: 'Write a Description',
          description:
            'Add a brief description highlighting key ingredients or features. Example: "Classic tomato sauce, fresh mozzarella, basil, and olive oil on our signature sourdough base."',
        },
        {
          title: 'Upload an Image (Optional)',
          description:
            'Add a photo of your item. Good food photos significantly increase orders! Use natural lighting and show the actual product. Max 10MB, JPG/PNG/WebP.',
        },
        {
          title: 'Attach Customization Options',
          description:
            'Select which option groups apply to this item. For a pizza, you might attach "Size" and "Extra Toppings". For a drink, you might attach "Size" and "Milk Choice".',
        },
        {
          title: 'Set Dietary Information',
          description:
            'Mark if the item is vegetarian, vegan, gluten-free, or dairy-free. List allergens. This helps customers make informed choices and is legally required in many regions.',
        },
        {
          title: 'Configure Age Restrictions (if needed)',
          description:
            'For alcohol or age-restricted items, enable age verification. Set minimum age (18 for alcohol in UK) and choose if ID verification is required.',
        },
        {
          title: 'Save and Test',
          description:
            'Save your item. It will appear in the selected category and can be added to menus.',
        },
      ],
    },
    {
      type: 'section',
      title: 'Menu Item Best Practices',
      bullets: [
        '**Names**: Short, descriptive, and appetizing (3-5 words)',
        '**Descriptions**: Highlight key ingredients and unique features (20-50 words)',
        '**Prices**: Use psychology - £8.99 often outperforms £9.00',
        '**Images**: Professional food photography dramatically increases sales',
        '**Allergens**: Always complete - it\'s a legal requirement',
        '**Stock**: Mark items unavailable rather than deleting when sold out',
      ],
    },
    {
      type: 'callout',
      tone: 'success',
      title: '📸 Photo Tips',
      paragraphs: [
        'Take photos in natural daylight, not under yellow indoor lights.',
        'Use a simple, clean background - white plates on light wooden tables work well.',
        'Show the actual portion size customers will receive.',
        'Include garnishes and presentation as you\'ll serve them.',
        'Take multiple angles and choose the most appetizing shot.',
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: '⚠️ Legal Requirements',
      paragraphs: [
        'UK law requires allergen information for all food items. You must list all 14 major allergens.',
        'Age-restricted items (alcohol, tobacco) must have proper age verification enabled.',
        'Calorie information may be required for certain business sizes - check current regulations.',
      ],
    },
    {
      type: 'section',
      title: 'Managing Availability',
      paragraphs: [
        'During service, you can quickly mark items as unavailable (e.g., "86\'d" in kitchen terms). They\'ll be hidden from customers but you won\'t lose the item data.',
        'This is much better than deleting items, as you can easily make them available again and retain sales history.',
      ],
    },
    {
      type: 'section',
      title: '🎥 Video Tutorial',
      paragraphs: [
        'Watch our comprehensive video on creating menu items, attaching options, and managing availability during service.',
        '[Video: Creating and Managing Menu Items - Duration: 8:15]',
      ],
    },
    {
      type: 'section',
      title: 'Next Steps',
      paragraphs: [
        'Now that you have categories, options, and items, you\'re ready to assemble them into a complete menu that customers can order from.',
      ],
    },
  ],
  related: [
    ['quick-start', 'customization-options'],
    ['quick-start', 'creating-menus'],
    ['merchant-admin', 'menu'],
  ],
};

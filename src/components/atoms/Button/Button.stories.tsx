import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button.component';

// Example icons (in a real app these would come from an icon library)
const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component that supports multiple variants, sizes, loading states, and icons. Built with accessibility in mind and follows the atomic design pattern.',
      },
    },
  },
  argTypes: {
    children: {
      description: 'Button content (text, elements, etc.)',
      control: 'text',
    },
    variant: {
      description: 'Visual style of the button',
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      description: 'Size of the button',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: {
      description: 'Shows loading spinner and disables interaction',
      control: 'boolean',
    },
    isDisabled: {
      description: 'Disables the button',
      control: 'boolean',
    },
    fullWidth: {
      description: 'Makes button full width',
      control: 'boolean',
    },
    onClick: {
      description: 'Click handler function',
      action: 'clicked',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary Stories
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger Button',
    variant: 'danger',
  },
};

// Size variations
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};

// State variations
export const Loading: Story = {
  args: {
    children: 'Loading Button',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    isDisabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    children: 'Add Item',
    leftIcon: <PlusIcon />,
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'Continue',
    rightIcon: <ChevronRightIcon />,
  },
};

export const WithBothIcons: Story = {
  args: {
    children: 'Process',
    leftIcon: <PlusIcon />,
    rightIcon: <ChevronRightIcon />,
  },
};

// Interactive examples
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants displayed together for comparison.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button sizes displayed together for comparison.',
      },
    },
  },
};

// Food ordering context examples
export const AddToCart: Story = {
  args: {
    children: 'Add to Cart',
    variant: 'primary',
    rightIcon: <PlusIcon />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Example button for adding items to cart in the food ordering context.',
      },
    },
  },
};

export const ViewMenu: Story = {
  args: {
    children: 'View Menu',
    variant: 'outline',
    rightIcon: <ChevronRightIcon />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Example button for viewing restaurant menus.',
      },
    },
  },
};

export const PlaceOrder: Story = {
  args: {
    children: 'Place Order',
    variant: 'primary',
    size: 'lg',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Example checkout button for placing food orders.',
      },
    },
  },
};

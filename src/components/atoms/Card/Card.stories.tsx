import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card.component';

const meta: Meta<typeof Card> = {
  title: 'Atoms/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component that can be used as a container with different visual styles and interactions.',
      },
    },
  },
  argTypes: {
    children: {
      description: 'Content inside the card',
      control: 'text',
    },
    variant: {
      description: 'Visual style of the card',
      control: 'select',
      options: ['default', 'bordered', 'elevated', 'outlined'],
    },
    padding: {
      description: 'Internal padding of the card',
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    hover: {
      description: 'Enables hover animation',
      control: 'boolean',
    },
    interactive: {
      description: 'Makes card appear interactive',
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

// Basic examples
export const Default: Story = {
  args: {
    children: 'This is a default card with some content inside.',
  },
};

export const Bordered: Story = {
  args: {
    children: 'This is a bordered card with a thicker border.',
    variant: 'bordered',
  },
};

export const Elevated: Story = {
  args: {
    children: 'This is an elevated card with a shadow.',
    variant: 'elevated',
  },
};

export const Outlined: Story = {
  args: {
    children: 'This is an outlined card with brand colors.',
    variant: 'outlined',
  },
};

// Padding variations
export const NoPadding: Story = {
  args: {
    children: (
      <div style={{ padding: '1rem', background: '#f0f0f0' }}>
        This card has no internal padding, content provides its own spacing.
      </div>
    ),
    padding: 'none',
  },
};

export const SmallPadding: Story = {
  args: {
    children: 'This card has small padding.',
    padding: 'sm',
  },
};

export const MediumPadding: Story = {
  args: {
    children: 'This card has medium padding (default).',
    padding: 'md',
  },
};

export const LargePadding: Story = {
  args: {
    children: 'This card has large padding for more spacious content.',
    padding: 'lg',
  },
};

// Interactive examples
export const WithHover: Story = {
  args: {
    children: 'Hover over this card to see the animation effect.',
    hover: true,
  },
};

export const Interactive: Story = {
  args: {
    children: 'This card appears interactive with hover effects.',
    interactive: true,
  },
};

export const Clickable: Story = {
  args: {
    children: 'This card is clickable and responds to clicks.',
    onClick: () => alert('Card clicked!'),
  },
};

// Complex content examples
export const WithComplexContent: Story = {
  args: {
    children: (
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Restaurant Card</h3>
        <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
          This card contains multiple elements like headings, text, and could include images.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#888' }}>
          <span>⭐ 4.5</span>
          <span>🕒 25-35 min</span>
          <span>🚚 £2.99 delivery</span>
        </div>
      </div>
    ),
    variant: 'elevated',
    hover: true,
  },
};

export const ImageCard: Story = {
  args: {
    children: (
      <div>
        <img 
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
          alt="Pizza"
          style={{ 
            width: '100%', 
            height: '200px', 
            objectFit: 'cover',
            marginBottom: '1rem'
          }} 
        />
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Margherita Pizza</h4>
        <p style={{ margin: '0', color: '#666', fontSize: '0.875rem' }}>
          Fresh mozzarella, tomato sauce, and basil
        </p>
      </div>
    ),
    padding: 'none',
    variant: 'elevated',
    hover: true,
  },
};

// Layout examples
export const GridExample: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '1rem',
      width: '100%',
      maxWidth: '800px'
    }}>
      <Card variant="default">
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Default Card</h4>
        <p style={{ margin: '0', fontSize: '0.875rem' }}>Standard card style</p>
      </Card>
      <Card variant="bordered">
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Bordered Card</h4>
        <p style={{ margin: '0', fontSize: '0.875rem' }}>With thicker border</p>
      </Card>
      <Card variant="elevated">
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Elevated Card</h4>
        <p style={{ margin: '0', fontSize: '0.875rem' }}>With shadow effect</p>
      </Card>
      <Card variant="outlined">
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Outlined Card</h4>
        <p style={{ margin: '0', fontSize: '0.875rem' }}>With brand colors</p>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Cards displayed in a responsive grid layout.',
      },
    },
  },
};

// Food ordering context examples
export const RestaurantCard: Story = {
  args: {
    children: (
      <div>
        <div style={{ 
          height: '120px', 
          background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
          marginBottom: '1rem',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          Restaurant Image
        </div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Bella Vista Italian</h3>
        <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.875rem' }}>
          Authentic Italian cuisine with fresh ingredients
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
          <span>⭐ 4.5 (127 reviews)</span>
          <span style={{ color: '#666' }}>25-35 min</span>
        </div>
      </div>
    ),
    variant: 'elevated',
    hover: true,
    interactive: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Restaurant card example for the food ordering interface.',
      },
    },
  },
};

export const MenuItemCard: Story = {
  args: {
    children: (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
          borderRadius: '0.5rem',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '0.75rem',
          textAlign: 'center'
        }}>
          Food Image
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>Margherita Pizza</h4>
          <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.875rem' }}>
            Fresh mozzarella, tomato sauce, and basil
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>£14.99</span>
            <button style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.25rem 0.75rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}>
              Add
            </button>
          </div>
        </div>
      </div>
    ),
    variant: 'default',
    interactive: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu item card example showing food details and add button.',
      },
    },
  },
};

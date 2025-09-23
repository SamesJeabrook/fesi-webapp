import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Introduction',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Fesi Design System

Welcome to the Fesi Design System - a comprehensive collection of reusable components, design tokens, and guidelines that ensure consistency across our food delivery platform.

## Architecture

Our design system follows **Atomic Design** principles:

### 🔬 **Atoms**
Basic building blocks like buttons, inputs, typography, and colors. These are the smallest functional units.

### 🧬 **Molecules** 
Simple combinations of atoms that function together as a unit, like search inputs or menu item cards.

### 🧱 **Organisms**
Complex components made of groups of molecules and atoms, like headers, menus, or product lists.

### 📄 **Templates**
Page-level layouts that combine organisms to form complete interfaces.

## Design Tokens

Our design system is built on a foundation of design tokens that ensure consistency:

- **Colors**: Brand colors, semantic colors, and neutral palettes
- **Typography**: Font families, sizes, weights, and line heights  
- **Spacing**: Consistent spacing scale based on 8px grid
- **Breakpoints**: Responsive design breakpoints
- **Shadows**: Elevation and depth system

## Getting Started

### For Developers

\`\`\`tsx
// Import individual components
import { Button, Typography, Grid } from '@/components/atoms';
import { MenuItemCard } from '@/components/molecules';
import { MenuCategory } from '@/components/organisms';

// Import design tokens
import '@/styles/tokens/colors.scss';
import '@/styles/tokens/spacing.scss';
import '@/styles/tokens/typography.scss';
\`\`\`

### For Designers

Use this Storybook as a reference for:
- Component specifications and variants
- Color palettes and usage guidelines
- Typography scale and hierarchy
- Spacing system and layout patterns

## Principles

### Consistency
Every component follows the same design patterns and uses the same design tokens.

### Accessibility
All components meet WCAG 2.1 AA standards for accessibility.

### Flexibility
Components are designed to be composable and customizable while maintaining consistency.

### Performance
Optimized for fast loading and smooth user experiences.

## Contributing

When adding new components or tokens:

1. Follow the atomic design structure
2. Use existing design tokens when possible
3. Include comprehensive Storybook documentation
4. Add accessibility considerations
5. Include usage examples and guidelines
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Overview
export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Overview of the Fesi Design System structure and organization.',
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '2px solid #0ea5e9',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ 
            color: '#0369a1', 
            margin: '0 0 12px 0', 
            fontSize: '18px',
            fontWeight: '600'
          }}>
            🔬 Atoms
          </h3>
          <p style={{ 
            margin: '0 0 16px 0', 
            color: '#075985',
            fontSize: '14px'
          }}>
            Basic building blocks: buttons, inputs, typography, colors
          </p>
          <ul style={{ 
            margin: '0', 
            paddingLeft: '20px', 
            color: '#0c4a6e',
            fontSize: '13px'
          }}>
            <li>Button</li>
            <li>Typography</li>
            <li>Input</li>
            <li>Grid</li>
            <li>Card</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: '#f0fdf4',
          border: '2px solid #22c55e',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ 
            color: '#15803d', 
            margin: '0 0 12px 0', 
            fontSize: '18px',
            fontWeight: '600'
          }}>
            🧬 Molecules
          </h3>
          <p style={{ 
            margin: '0 0 16px 0', 
            color: '#166534',
            fontSize: '14px'
          }}>
            Simple combinations of atoms working together
          </p>
          <ul style={{ 
            margin: '0', 
            paddingLeft: '20px', 
            color: '#14532d',
            fontSize: '13px'
          }}>
            <li>Menu Item Card</li>
            <li>Search Input</li>
            <li>Form Field</li>
            <li>Navigation Link</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: '#fef3c7',
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ 
            color: '#d97706', 
            margin: '0 0 12px 0', 
            fontSize: '18px',
            fontWeight: '600'
          }}>
            🧱 Organisms
          </h3>
          <p style={{ 
            margin: '0 0 16px 0', 
            color: '#b45309',
            fontSize: '14px'
          }}>
            Complex components made of molecules and atoms
          </p>
          <ul style={{ 
            margin: '0', 
            paddingLeft: '20px', 
            color: '#92400e',
            fontSize: '13px'
          }}>
            <li>Menu Category</li>
            <li>Header</li>
            <li>Product List</li>
            <li>Cart Summary</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: '#fdf2f8',
          border: '2px solid #ec4899',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ 
            color: '#be185d', 
            margin: '0 0 12px 0', 
            fontSize: '18px',
            fontWeight: '600'
          }}>
            📄 Templates
          </h3>
          <p style={{ 
            margin: '0 0 16px 0', 
            color: '#9d174d',
            fontSize: '14px'
          }}>
            Page-level layouts combining all components
          </p>
          <ul style={{ 
            margin: '0', 
            paddingLeft: '20px', 
            color: '#831843',
            fontSize: '13px'
          }}>
            <li>Menu Display</li>
            <li>Product Page</li>
            <li>Checkout Flow</li>
            <li>Dashboard Layout</li>
          </ul>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '24px'
      }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '18px',
          fontWeight: '600',
          color: '#1e293b'
        }}>
          🎨 Design Tokens
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px'
        }}>
          <div>
            <h4 style={{ 
              color: '#475569', 
              fontSize: '14px', 
              fontWeight: '600',
              margin: '0 0 8px 0'
            }}>
              Colors
            </h4>
            <p style={{ 
              color: '#64748b', 
              fontSize: '12px',
              margin: '0'
            }}>
              Brand, semantic, and neutral color palettes
            </p>
          </div>
          <div>
            <h4 style={{ 
              color: '#475569', 
              fontSize: '14px', 
              fontWeight: '600',
              margin: '0 0 8px 0'
            }}>
              Typography
            </h4>
            <p style={{ 
              color: '#64748b', 
              fontSize: '12px',
              margin: '0'
            }}>
              Font families, sizes, weights, and line heights
            </p>
          </div>
          <div>
            <h4 style={{ 
              color: '#475569', 
              fontSize: '14px', 
              fontWeight: '600',
              margin: '0 0 8px 0'
            }}>
              Spacing
            </h4>
            <p style={{ 
              color: '#64748b', 
              fontSize: '12px',
              margin: '0'
            }}>
              Consistent spacing scale based on 8px grid
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};

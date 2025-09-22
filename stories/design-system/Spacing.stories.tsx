import type { Meta, StoryObj } from '@storybook/react';

// Spacing example component
const SpacingExample = ({ 
  name, 
  value, 
  pixels 
}: { 
  name: string; 
  value: string; 
  pixels: string;
}) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    marginBottom: '16px',
    gap: '16px'
  }}>
    <div style={{ 
      minWidth: '120px',
      fontWeight: '600',
      fontSize: '14px'
    }}>
      {name}
    </div>
    <div style={{ 
      minWidth: '60px',
      fontSize: '12px',
      color: '#666'
    }}>
      {pixels}
    </div>
    <div style={{ 
      backgroundColor: '#0ea5e9', 
      height: '24px',
      width: value,
      borderRadius: '4px'
    }} />
    <div style={{ 
      fontSize: '12px',
      color: '#666',
      fontFamily: 'monospace'
    }}>
      {value}
    </div>
  </div>
);

// Spacing grid component
const SpacingGrid = ({ 
  spaces 
}: { 
  spaces: { name: string; value: string; pixels: string }[]
}) => (
  <div style={{ marginBottom: '32px' }}>
    {spaces.map((space) => (
      <SpacingExample 
        key={space.name} 
        name={space.name} 
        value={space.value}
        pixels={space.pixels}
      />
    ))}
  </div>
);

// Spacing demo component
const SpacingDemo = ({ spacing }: { spacing: string }) => (
  <div style={{
    display: 'inline-block',
    backgroundColor: '#f0f9ff',
    border: '2px dashed #0ea5e9',
    padding: spacing,
    margin: '8px',
    borderRadius: '8px'
  }}>
    <div style={{
      backgroundColor: '#0ea5e9',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600'
    }}>
      {spacing}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Design System/Spacing',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Spacing System

Our spacing system provides consistent spacing values across the application, following an 8px grid system.

## Usage

### SCSS
\`\`\`scss
@use '@/styles/tokens/spacing' as spacing;

// Using spacing function
margin: spacing.space(4); // 16px

// Using direct variables
padding: spacing.$space-4; // 16px
margin-bottom: spacing.$space-lg; // 20px
\`\`\`

### CSS Custom Properties
\`\`\`css
/* Available as CSS custom properties */
padding: var(--space-4); /* 16px */
margin: var(--space-lg); /* 20px */
\`\`\`

## Spacing Scale

Our spacing scale is based on a 4px base unit:
- **Base unit**: 4px
- **Scale**: Multiples of 4px for consistency
- **Semantic names**: xs, sm, md, lg, xl for common use cases

## Guidelines

- Use consistent spacing values from the scale
- Prefer semantic names (sm, md, lg) for flexibility
- Use numeric values (4, 8, 16) for precise control
- Follow the 8px grid for visual rhythm
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Core Spacing Scale
export const CoreSpacing: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Core spacing values based on 4px increments. These form the foundation of our layout system.',
      },
    },
  },
  render: () => (
    <SpacingGrid
      spaces={[
        { name: 'space-0', value: '0px', pixels: '0px' },
        { name: 'space-1', value: '4px', pixels: '4px' },
        { name: 'space-2', value: '8px', pixels: '8px' },
        { name: 'space-3', value: '12px', pixels: '12px' },
        { name: 'space-4', value: '16px', pixels: '16px' },
        { name: 'space-5', value: '20px', pixels: '20px' },
        { name: 'space-6', value: '24px', pixels: '24px' },
        { name: 'space-8', value: '32px', pixels: '32px' },
        { name: 'space-10', value: '40px', pixels: '40px' },
        { name: 'space-12', value: '48px', pixels: '48px' },
      ]}
    />
  ),
};

// Large Spacing Scale
export const LargeSpacing: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Large spacing values for layouts, sections, and major spacing needs.',
      },
    },
  },
  render: () => (
    <SpacingGrid
      spaces={[
        { name: 'space-16', value: '64px', pixels: '64px' },
        { name: 'space-20', value: '80px', pixels: '80px' },
        { name: 'space-24', value: '96px', pixels: '96px' },
        { name: 'space-32', value: '128px', pixels: '128px' },
        { name: 'space-40', value: '160px', pixels: '160px' },
        { name: 'space-48', value: '192px', pixels: '192px' },
        { name: 'space-56', value: '224px', pixels: '224px' },
        { name: 'space-64', value: '256px', pixels: '256px' },
      ]}
    />
  ),
};

// Semantic Spacing
export const SemanticSpacing: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Semantic spacing names that map to core values. Use these for flexibility and semantic meaning.',
      },
    },
  },
  render: () => (
    <SpacingGrid
      spaces={[
        { name: 'space-2xs', value: '4px', pixels: '4px' },
        { name: 'space-xs', value: '8px', pixels: '8px' },
        { name: 'space-sm', value: '12px', pixels: '12px' },
        { name: 'space-md', value: '16px', pixels: '16px' },
        { name: 'space-lg', value: '20px', pixels: '20px' },
        { name: 'space-xl', value: '24px', pixels: '24px' },
        { name: 'space-2xl', value: '32px', pixels: '32px' },
        { name: 'space-3xl', value: '40px', pixels: '40px' },
        { name: 'space-4xl', value: '48px', pixels: '48px' },
        { name: 'space-5xl', value: '64px', pixels: '64px' },
      ]}
    />
  ),
};

// Spacing in Action
export const SpacingInAction: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Visual demonstration of how different spacing values appear in practice.',
      },
    },
  },
  render: () => (
    <div>
      <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
        Spacing Demonstration
      </h3>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '16px',
        marginBottom: '32px'
      }}>
        <SpacingDemo spacing="4px" />
        <SpacingDemo spacing="8px" />
        <SpacingDemo spacing="12px" />
        <SpacingDemo spacing="16px" />
        <SpacingDemo spacing="20px" />
        <SpacingDemo spacing="24px" />
        <SpacingDemo spacing="32px" />
        <SpacingDemo spacing="40px" />
      </div>
      
      <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
        Layout Example
      </h4>
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '24px',
        borderRadius: '8px',
        border: '1px solid #e5e5e5'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          marginBottom: '16px',
          borderRadius: '6px',
          border: '1px solid #e5e5e5'
        }}>
          <h5 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '14px', 
            fontWeight: '600' 
          }}>
            Card Title (margin-bottom: 8px)
          </h5>
          <p style={{ 
            margin: '0 0 12px 0', 
            fontSize: '13px', 
            color: '#666' 
          }}>
            Card content with 12px bottom margin
          </p>
          <button style={{
            backgroundColor: '#0ea5e9',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            Button (padding: 8px 16px)
          </button>
        </div>
      </div>
    </div>
  ),
};

// Usage Guidelines
export const UsageGuidelines: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Guidelines and best practices for using spacing in your designs.',
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ 
        backgroundColor: '#f0fdf4', 
        border: '1px solid #22c55e', 
        borderRadius: '8px', 
        padding: '16px', 
        marginBottom: '24px' 
      }}>
        <h4 style={{ 
          color: '#15803d', 
          margin: '0 0 8px 0', 
          fontSize: '16px', 
          fontWeight: '600' 
        }}>
          ✅ Do
        </h4>
        <ul style={{ 
          margin: '0', 
          paddingLeft: '20px', 
          color: '#166534' 
        }}>
          <li>Use consistent spacing values from the scale</li>
          <li>Prefer semantic names (sm, md, lg) for common patterns</li>
          <li>Follow the 8px grid for visual rhythm</li>
          <li>Use larger spacing for visual hierarchy</li>
          <li>Group related elements with smaller spacing</li>
        </ul>
      </div>
      
      <div style={{ 
        backgroundColor: '#fef2f2', 
        border: '1px solid #ef4444', 
        borderRadius: '8px', 
        padding: '16px', 
        marginBottom: '24px' 
      }}>
        <h4 style={{ 
          color: '#dc2626', 
          margin: '0 0 8px 0', 
          fontSize: '16px', 
          fontWeight: '600' 
        }}>
          ❌ Don't
        </h4>
        <ul style={{ 
          margin: '0', 
          paddingLeft: '20px', 
          color: '#991b1b' 
        }}>
          <li>Use arbitrary spacing values (3px, 7px, 15px)</li>
          <li>Break the 8px grid system</li>
          <li>Use inconsistent spacing between similar elements</li>
          <li>Overcrowd elements with insufficient spacing</li>
          <li>Use excessive spacing that breaks visual relationships</li>
        </ul>
      </div>

      <div style={{ 
        backgroundColor: '#eff6ff', 
        border: '1px solid #3b82f6', 
        borderRadius: '8px', 
        padding: '16px' 
      }}>
        <h4 style={{ 
          color: '#1d4ed8', 
          margin: '0 0 8px 0', 
          fontSize: '16px', 
          fontWeight: '600' 
        }}>
          💡 Common Patterns
        </h4>
        <ul style={{ 
          margin: '0', 
          paddingLeft: '20px', 
          color: '#1e40af' 
        }}>
          <li><strong>Component padding:</strong> 12px-16px (space-3 to space-4)</li>
          <li><strong>Element margins:</strong> 8px-12px (space-2 to space-3)</li>
          <li><strong>Section spacing:</strong> 24px-48px (space-6 to space-12)</li>
          <li><strong>Layout margins:</strong> 16px-32px (space-4 to space-8)</li>
          <li><strong>Text line spacing:</strong> 4px-8px (space-1 to space-2)</li>
        </ul>
      </div>
    </div>
  ),
};

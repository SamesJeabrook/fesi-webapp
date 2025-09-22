import type { Meta, StoryObj } from '@storybook/react';

// Color swatch component
const ColorSwatch = ({ 
  name, 
  value, 
  textColor = '#000000' 
}: { 
  name: string; 
  value: string; 
  textColor?: string;
}) => (
  <div 
    style={{ 
      backgroundColor: value,
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #e5e5e5',
      marginBottom: '8px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '80px'
    }}
  >
    <div style={{ color: textColor, fontWeight: '600', fontSize: '14px' }}>
      {name}
    </div>
    <div style={{ color: textColor, fontSize: '12px', marginTop: '4px' }}>
      {value}
    </div>
  </div>
);

// Color palette component
const ColorPalette = ({ 
  title, 
  colors 
}: { 
  title: string; 
  colors: { name: string; value: string; textColor?: string }[]
}) => (
  <div style={{ marginBottom: '32px' }}>
    <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
      {title}
    </h3>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
      gap: '16px' 
    }}>
      {colors.map((color) => (
        <ColorSwatch 
          key={color.name} 
          name={color.name} 
          value={color.value}
          textColor={color.textColor}
        />
      ))}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Design System/Colors',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Color System

Our color system provides a comprehensive palette of semantic and brand colors designed for consistency across the application.

## Usage

### SCSS
\`\`\`scss
@use '@/styles/tokens/colors' as colors;

// Using color function
background-color: colors.color('primary', 500);

// Using direct variables
background-color: colors.$primary-500;
\`\`\`

### CSS Custom Properties
\`\`\`css
/* Available as CSS custom properties */
background-color: var(--color-primary-500);
color: var(--color-neutral-700);
\`\`\`

## Color Guidelines

- **Primary**: Brand colors for main actions and highlights
- **Secondary**: Supporting brand colors for secondary elements  
- **Semantic**: Status colors (success, warning, error, info)
- **Neutral**: Grayscale colors for text and backgrounds

## Accessibility

All color combinations follow WCAG 2.1 AA contrast requirements for text and interactive elements.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Primary Colors
export const PrimaryColors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Primary brand colors ranging from light to dark. The 500 shade is the main brand color.',
      },
    },
  },
  render: () => (
    <ColorPalette
      title="Primary Colors"
      colors={[
        { name: 'primary-50', value: '#f0f9ff' },
        { name: 'primary-100', value: '#e0f2fe' },
        { name: 'primary-200', value: '#bae6fd' },
        { name: 'primary-300', value: '#7dd3fc' },
        { name: 'primary-400', value: '#38bdf8' },
        { name: 'primary-500', value: '#0ea5e9', textColor: '#ffffff' },
        { name: 'primary-600', value: '#0284c7', textColor: '#ffffff' },
        { name: 'primary-700', value: '#0369a1', textColor: '#ffffff' },
        { name: 'primary-800', value: '#075985', textColor: '#ffffff' },
        { name: 'primary-900', value: '#0c4a6e', textColor: '#ffffff' },
      ]}
    />
  ),
};

// Secondary Colors
export const SecondaryColors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Secondary brand colors for supporting elements and neutral backgrounds.',
      },
    },
  },
  render: () => (
    <ColorPalette
      title="Secondary Colors"
      colors={[
        { name: 'secondary-50', value: '#fafaf9' },
        { name: 'secondary-100', value: '#f5f5f4' },
        { name: 'secondary-200', value: '#e7e5e4' },
        { name: 'secondary-300', value: '#d6d3d1' },
        { name: 'secondary-400', value: '#a8a29e' },
        { name: 'secondary-500', value: '#78716c', textColor: '#ffffff' },
        { name: 'secondary-600', value: '#57534e', textColor: '#ffffff' },
        { name: 'secondary-700', value: '#44403c', textColor: '#ffffff' },
        { name: 'secondary-800', value: '#292524', textColor: '#ffffff' },
        { name: 'secondary-900', value: '#1c1917', textColor: '#ffffff' },
      ]}
    />
  ),
};

// Semantic Colors
export const SemanticColors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Semantic colors for status indicators, alerts, and user feedback. Each includes light, main, and dark variants.',
      },
    },
  },
  render: () => (
    <div>
      <ColorPalette
        title="Success Colors"
        colors={[
          { name: 'success-light', value: '#d1fae5' },
          { name: 'success-main', value: '#10b981', textColor: '#ffffff' },
          { name: 'success-dark', value: '#047857', textColor: '#ffffff' },
          { name: 'success-500', value: '#22c55e', textColor: '#ffffff' },
        ]}
      />
      <ColorPalette
        title="Warning Colors"
        colors={[
          { name: 'warning-light', value: '#fef3c7' },
          { name: 'warning-main', value: '#f59e0b', textColor: '#ffffff' },
          { name: 'warning-dark', value: '#d97706', textColor: '#ffffff' },
          { name: 'warning-500', value: '#f59e0b', textColor: '#ffffff' },
        ]}
      />
      <ColorPalette
        title="Error Colors"
        colors={[
          { name: 'error-light', value: '#fee2e2' },
          { name: 'error-main', value: '#ef4444', textColor: '#ffffff' },
          { name: 'error-dark', value: '#dc2626', textColor: '#ffffff' },
          { name: 'error-500', value: '#ef4444', textColor: '#ffffff' },
        ]}
      />
      <ColorPalette
        title="Info Colors"
        colors={[
          { name: 'info-light', value: '#dbeafe' },
          { name: 'info-main', value: '#3b82f6', textColor: '#ffffff' },
          { name: 'info-dark', value: '#1d4ed8', textColor: '#ffffff' },
          { name: 'info-500', value: '#3b82f6', textColor: '#ffffff' },
        ]}
      />
    </div>
  ),
};

// Neutral Colors
export const NeutralColors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Neutral grayscale colors for text, borders, and backgrounds. These form the foundation of the interface.',
      },
    },
  },
  render: () => (
    <ColorPalette
      title="Neutral Colors"
      colors={[
        { name: 'white', value: '#ffffff' },
        { name: 'neutral-50', value: '#fafafa' },
        { name: 'neutral-100', value: '#f5f5f5' },
        { name: 'neutral-200', value: '#e5e5e5' },
        { name: 'neutral-300', value: '#d4d4d4' },
        { name: 'neutral-400', value: '#a3a3a3' },
        { name: 'neutral-500', value: '#737373', textColor: '#ffffff' },
        { name: 'neutral-600', value: '#525252', textColor: '#ffffff' },
        { name: 'neutral-700', value: '#404040', textColor: '#ffffff' },
        { name: 'neutral-800', value: '#262626', textColor: '#ffffff' },
        { name: 'neutral-900', value: '#171717', textColor: '#ffffff' },
        { name: 'black', value: '#000000', textColor: '#ffffff' },
      ]}
    />
  ),
};

// All Colors Overview
export const AllColors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Complete overview of all available colors in the design system.',
      },
    },
  },
  render: () => (
    <div>
      <ColorPalette
        title="Primary Colors"
        colors={[
          { name: 'primary-50', value: '#f0f9ff' },
          { name: 'primary-100', value: '#e0f2fe' },
          { name: 'primary-200', value: '#bae6fd' },
          { name: 'primary-300', value: '#7dd3fc' },
          { name: 'primary-400', value: '#38bdf8' },
          { name: 'primary-500', value: '#0ea5e9', textColor: '#ffffff' },
          { name: 'primary-600', value: '#0284c7', textColor: '#ffffff' },
          { name: 'primary-700', value: '#0369a1', textColor: '#ffffff' },
          { name: 'primary-800', value: '#075985', textColor: '#ffffff' },
          { name: 'primary-900', value: '#0c4a6e', textColor: '#ffffff' },
        ]}
      />
      <ColorPalette
        title="Neutral Colors"
        colors={[
          { name: 'white', value: '#ffffff' },
          { name: 'neutral-50', value: '#fafafa' },
          { name: 'neutral-100', value: '#f5f5f5' },
          { name: 'neutral-200', value: '#e5e5e5' },
          { name: 'neutral-300', value: '#d4d4d4' },
          { name: 'neutral-400', value: '#a3a3a3' },
          { name: 'neutral-500', value: '#737373', textColor: '#ffffff' },
          { name: 'neutral-600', value: '#525252', textColor: '#ffffff' },
          { name: 'neutral-700', value: '#404040', textColor: '#ffffff' },
          { name: 'neutral-800', value: '#262626', textColor: '#ffffff' },
          { name: 'neutral-900', value: '#171717', textColor: '#ffffff' },
          { name: 'black', value: '#000000', textColor: '#ffffff' },
        ]}
      />
    </div>
  ),
};

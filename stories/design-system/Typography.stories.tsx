import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Typography showcase components
const TypographyExample = ({ 
  tag, 
  style, 
  children 
}: { 
  tag: React.ElementType; 
  style: React.CSSProperties; 
  children: React.ReactNode;
}) => {
  const Component = tag as any;
  return (
    <Component style={style}>
      {children}
    </Component>
  );
};

const FontShowcase = ({ 
  fontFamily, 
  title, 
  examples 
}: { 
  fontFamily: string;
  title: string;
  examples: { weight: string; text: string; style: React.CSSProperties }[];
}) => (
  <div style={{ marginBottom: '32px' }}>
    <h3 style={{ 
      marginBottom: '16px', 
      fontSize: '18px', 
      fontWeight: '600',
      fontFamily: 'var(--font-poppins)'
    }}>
      {title}
    </h3>
    <div style={{ 
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '20px'
    }}>
      {examples.map((example, index) => (
        <div key={index} style={{ marginBottom: '16px' }}>
          <div style={{ 
            fontSize: '12px', 
            color: '#64748b', 
            marginBottom: '4px',
            fontFamily: 'monospace'
          }}>
            {example.weight}
          </div>
          <div style={example.style}>
            {example.text}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Design System/Typography',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Typography System

Our typography system uses two carefully selected Google Fonts that provide excellent readability and a modern, friendly appearance:

- **Poppins** for headings - A modern, geometric sans-serif that provides excellent readability and a professional appearance
- **Quicksand** for body text - A friendly, rounded sans-serif that offers great legibility at various sizes

## Implementation

Fonts are loaded via Next.js Google Fonts optimization and available as CSS custom properties:

### SCSS Usage
\`\`\`scss
@use '@/styles/tokens/typography' as typo;

.heading {
  @extend %heading-1; // Uses Poppins Bold 48px
}

.body-text {
  @extend %body-medium; // Uses Quicksand Regular 16px
}
\`\`\`

### CSS Custom Properties
\`\`\`css
font-family: var(--font-poppins); /* For headings */
font-family: var(--font-quicksand); /* For body text */
\`\`\`

## Typography Component
Use the Typography component for consistent styling:

\`\`\`tsx
import { Typography } from '@/components/atoms';

<Typography variant="heading-1" as="h1">Page Title</Typography>
<Typography variant="body-medium">Body content</Typography>
\`\`\`

## Accessibility
- All typography follows WCAG 2.1 AA contrast requirements
- Proper heading hierarchy maintains semantic structure
- Font sizes are optimized for readability across devices
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Font Family Showcase
export const FontFamilies: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Overview of the two font families used in our design system with available weights.',
      },
    },
  },
  render: () => (
    <div>
      <FontShowcase
        fontFamily="Poppins"
        title="Poppins - Headings Font"
        examples={[
          { 
            weight: 'Regular (400)', 
            text: 'The quick brown fox jumps over the lazy dog',
            style: { fontFamily: 'var(--font-poppins)', fontWeight: 400, fontSize: '16px' }
          },
          { 
            weight: 'Medium (500)', 
            text: 'The quick brown fox jumps over the lazy dog',
            style: { fontFamily: 'var(--font-poppins)', fontWeight: 500, fontSize: '16px' }
          },
          { 
            weight: 'Semibold (600)', 
            text: 'The quick brown fox jumps over the lazy dog',
            style: { fontFamily: 'var(--font-poppins)', fontWeight: 600, fontSize: '16px' }
          },
          { 
            weight: 'Bold (700)', 
            text: 'The quick brown fox jumps over the lazy dog',
            style: { fontFamily: 'var(--font-poppins)', fontWeight: 700, fontSize: '16px' }
          },
          { 
            weight: 'Extrabold (800)', 
            text: 'The quick brown fox jumps over the lazy dog',
            style: { fontFamily: 'var(--font-poppins)', fontWeight: 800, fontSize: '16px' }
          }
        ]}
      />
      
      <FontShowcase
        fontFamily="Quicksand"
        title="Quicksand - Body Text Font"
        examples={[
          { 
            weight: 'Light (300)', 
            text: 'The quick brown fox jumps over the lazy dog',
            style: { fontFamily: 'var(--font-quicksand)', fontWeight: 300, fontSize: '16px' }
          },
          { 
            weight: 'Regular (400)', 
            text: 'The quick brown fox jumps over the lazy dog',
            style: { fontFamily: 'var(--font-quicksand)', fontWeight: 400, fontSize: '16px' }
          },
          { 
            weight: 'Medium (500)', 
            text: 'The quick brown fox jumps over the lazy dog',
            style: { fontFamily: 'var(--font-quicksand)', fontWeight: 500, fontSize: '16px' }
          },
          { 
            weight: 'Semibold (600)', 
            text: 'The quick brown fox jumps over the lazy dog',
            style: { fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: '16px' }
          },
          { 
            weight: 'Bold (700)', 
            text: 'The quick brown fox jumps over the lazy dog',
            style: { fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: '16px' }
          }
        ]}
      />
    </div>
  ),
};

// Typography Scale
export const TypographyScale: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Complete typography scale showing all heading and body text variants with their specifications.',
      },
    },
  },
  render: () => (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ 
          marginBottom: '24px', 
          fontSize: '18px', 
          fontWeight: '600',
          fontFamily: 'var(--font-poppins)'
        }}>
          Heading Scale
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              heading-1 • Poppins Bold • 48px
            </div>
            <h1 style={{ 
              fontFamily: 'var(--font-poppins)', 
              fontSize: '48px', 
              fontWeight: 700, 
              lineHeight: 1.25,
              margin: 0 
            }}>
              Main Page Title
            </h1>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              heading-2 • Poppins Bold • 36px
            </div>
            <h2 style={{ 
              fontFamily: 'var(--font-poppins)', 
              fontSize: '36px', 
              fontWeight: 700, 
              lineHeight: 1.25,
              margin: 0 
            }}>
              Section Title
            </h2>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              heading-3 • Poppins Semibold • 30px
            </div>
            <h3 style={{ 
              fontFamily: 'var(--font-poppins)', 
              fontSize: '30px', 
              fontWeight: 600, 
              lineHeight: 1.375,
              margin: 0 
            }}>
              Subsection Title
            </h3>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              heading-4 • Poppins Semibold • 24px
            </div>
            <h4 style={{ 
              fontFamily: 'var(--font-poppins)', 
              fontSize: '24px', 
              fontWeight: 600, 
              lineHeight: 1.375,
              margin: 0 
            }}>
              Article Title
            </h4>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              heading-5 • Poppins Semibold • 20px
            </div>
            <h5 style={{ 
              fontFamily: 'var(--font-poppins)', 
              fontSize: '20px', 
              fontWeight: 600, 
              lineHeight: 1.375,
              margin: 0 
            }}>
              Card Title
            </h5>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              heading-6 • Poppins Semibold • 18px
            </div>
            <h6 style={{ 
              fontFamily: 'var(--font-poppins)', 
              fontSize: '18px', 
              fontWeight: 600, 
              lineHeight: 1.5,
              margin: 0 
            }}>
              Small Title
            </h6>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ 
          marginBottom: '24px', 
          fontSize: '18px', 
          fontWeight: '600',
          fontFamily: 'var(--font-poppins)'
        }}>
          Body Text Scale
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              body-large • Quicksand Regular • 18px
            </div>
            <p style={{ 
              fontFamily: 'var(--font-quicksand)', 
              fontSize: '18px', 
              fontWeight: 400, 
              lineHeight: 1.625,
              margin: 0 
            }}>
              Large body text for important descriptions, featured content, or any text that needs to stand out while remaining highly readable.
            </p>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              body-medium • Quicksand Regular • 16px
            </div>
            <p style={{ 
              fontFamily: 'var(--font-quicksand)', 
              fontSize: '16px', 
              fontWeight: 400, 
              lineHeight: 1.5,
              margin: 0 
            }}>
              Standard body text for most content. This provides excellent readability while maintaining a clean, modern appearance throughout the application.
            </p>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              body-small • Quicksand Regular • 14px
            </div>
            <p style={{ 
              fontFamily: 'var(--font-quicksand)', 
              fontSize: '14px', 
              fontWeight: 400, 
              lineHeight: 1.5,
              margin: 0 
            }}>
              Small body text used for secondary information, captions, and supporting details that complement the main content.
            </p>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              caption • Quicksand Medium • 12px
            </div>
            <p style={{ 
              fontFamily: 'var(--font-quicksand)', 
              fontSize: '12px', 
              fontWeight: 500, 
              lineHeight: 1.5,
              margin: 0 
            }}>
              Caption text for image captions, helper text, or small descriptive content
            </p>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              overline • Quicksand Semibold • 12px • Uppercase
            </div>
            <p style={{ 
              fontFamily: 'var(--font-quicksand)', 
              fontSize: '12px', 
              fontWeight: 600, 
              lineHeight: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              margin: 0 
            }}>
              Overline text for labels and categories
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Real World Example
export const RealWorldExample: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example showing typography in a real menu context, demonstrating how the type scale works together.',
      },
    },
  },
  render: () => (
    <div style={{ 
      maxWidth: '600px',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '24px'
    }}>
      <div style={{ marginBottom: '8px' }}>
        <span style={{ 
          fontFamily: 'var(--font-quicksand)', 
          fontSize: '12px', 
          fontWeight: 600, 
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#64748b'
        }}>
          CATEGORY
        </span>
      </div>
      
      <h3 style={{ 
        fontFamily: 'var(--font-poppins)', 
        fontSize: '24px', 
        fontWeight: 600, 
        lineHeight: 1.375,
        margin: '0 0 20px 0',
        color: '#1e293b'
      }}>
        Pizza
      </h3>
      
      <div style={{ 
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '8px'
        }}>
          <h4 style={{ 
            fontFamily: 'var(--font-poppins)', 
            fontSize: '18px', 
            fontWeight: 600, 
            margin: 0,
            color: '#1e293b'
          }}>
            Margherita
          </h4>
          <span style={{ 
            fontFamily: 'var(--font-poppins)', 
            fontSize: '16px', 
            fontWeight: 600,
            color: '#0ea5e9'
          }}>
            £12.00
          </span>
        </div>
        
        <p style={{ 
          fontFamily: 'var(--font-quicksand)', 
          fontSize: '14px', 
          fontWeight: 400, 
          lineHeight: 1.5,
          margin: 0,
          color: '#64748b'
        }}>
          Fresh mozzarella, tomato sauce, and basil leaves on our signature wood-fired crust.
        </p>
      </div>
      
      <div style={{ 
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        padding: '16px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '8px'
        }}>
          <h4 style={{ 
            fontFamily: 'var(--font-poppins)', 
            fontSize: '18px', 
            fontWeight: 600, 
            margin: 0,
            color: '#1e293b'
          }}>
            Pepperoni
          </h4>
          <span style={{ 
            fontFamily: 'var(--font-poppins)', 
            fontSize: '16px', 
            fontWeight: 600,
            color: '#0ea5e9'
          }}>
            £14.00
          </span>
        </div>
        
        <p style={{ 
          fontFamily: 'var(--font-quicksand)', 
          fontSize: '14px', 
          fontWeight: 400, 
          lineHeight: 1.5,
          margin: 0,
          color: '#64748b'
        }}>
          Classic pepperoni with mozzarella cheese and our house tomato sauce.
        </p>
      </div>
    </div>
  ),
};

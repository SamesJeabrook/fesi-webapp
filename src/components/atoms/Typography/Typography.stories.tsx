import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './Typography.component';

const meta: Meta<typeof Typography> = {
  title: 'Atoms/Typography',
  component: Typography,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Typography Component

The Typography component provides a consistent way to apply design system typography styles while maintaining semantic HTML structure.

## Key Features
- ✅ **Consistent styling** from design system typography tokens
- ✅ **Semantic HTML** with flexible element choice via \`as\` prop  
- ✅ **Type safety** with comprehensive TypeScript support
- ✅ **Accessible** markup with proper semantic structure

## Usage
\`\`\`tsx
import { Typography } from '@/components/atoms';

// Basic usage (renders as <p>)
<Typography variant="body-medium">Regular text</Typography>

// Custom HTML element
<Typography variant="heading-2" as="h1">Page Title</Typography>

// With custom styling
<Typography variant="caption" className="custom-class">Caption text</Typography>
\`\`\`

## Available Variants
- **Headings**: \`heading-1\` through \`heading-8\` (Poppins font family)
- **Body**: \`body-large\`, \`body-medium\`, \`body-small\` (Quicksand font family)  
- **Special**: \`caption\`, \`overline\` (Quicksand font family)

## HTML Elements (\`as\` prop)
Supports semantic elements: \`h1-h6\`, \`p\` (default), \`span\`, \`div\`, \`label\`, \`figcaption\`, etc.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'heading-1',
        'heading-2', 
        'heading-3',
        'heading-4',
        'heading-5',
        'heading-6',
        'heading-7',
        'heading-8',
        'body-large',
        'body-medium',
        'body-small',
        'caption',
        'overline'
      ],
      description: 'Typography variant to apply from the design system',
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'label'],
      description: 'HTML element to render (defaults to p)',
    },
    children: {
      control: 'text',
      description: 'Content to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

// Default story
export const Default: Story = {
  args: {
    variant: 'body-medium',
    children: 'This is the default typography component',
  },
};

// All headings showcase
export const AllHeadings: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Complete hierarchy of heading variants from the design system. Each uses the Poppins font family with decreasing sizes and appropriate weights.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="heading-1" as="h1">Heading 1 - Main Title (48px, Bold)</Typography>
      <Typography variant="heading-2" as="h2">Heading 2 - Section Title (36px, Bold)</Typography>
      <Typography variant="heading-3" as="h3">Heading 3 - Subsection (30px, Semibold)</Typography>
      <Typography variant="heading-4" as="h4">Heading 4 - Article Title (24px, Semibold)</Typography>
      <Typography variant="heading-5" as="h5">Heading 5 - Card Title (20px, Semibold)</Typography>
      <Typography variant="heading-6" as="h6">Heading 6 - Small Title (18px, Semibold)</Typography>
      <Typography variant="heading-7" as="h6">Heading 7 - Tiny Title (16px, Semibold)</Typography>
      <Typography variant="heading-8" as="h6">Heading 8 - Micro Title (14px, Semibold)</Typography>
    </div>
  ),
};

// All body text variants
export const AllBodyText: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Body text variants using the Quicksand font family. Choose the appropriate size based on content hierarchy and importance.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="body-large">
        Body Large (18px) - This is larger body text suitable for introductory paragraphs or important content that needs emphasis.
      </Typography>
      <Typography variant="body-medium">
        Body Medium (16px) - This is the standard body text used for most content and reading material throughout the application.
      </Typography>
      <Typography variant="body-small">
        Body Small (14px) - This is smaller body text used for secondary information, compact layouts, or less important content.
      </Typography>
    </div>
  ),
};

// Special variants
export const SpecialVariants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Special purpose typography variants for specific use cases like captions and labels.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="caption">Caption (12px, Medium) - Used for image captions, helper text, or small descriptive content</Typography>
      <Typography variant="overline">Overline (12px, Semibold, Uppercase) - Used for labels, categories, and section identifiers</Typography>
    </div>
  ),
};

// Semantic HTML examples
export const SemanticExamples: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Examples showing how to use typography variants with different HTML elements for proper semantic structure. The `as` prop lets you maintain visual design while using appropriate HTML semantics.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="heading-2" as="h1">H1 element with heading-2 styling</Typography>
      <Typography variant="body-medium" as="p">Paragraph element with body-medium styling</Typography>
      <Typography variant="caption" as="span">Span element with caption styling</Typography>
      <Typography variant="overline" as="label">Label element with overline styling</Typography>
      <Typography variant="heading-4" as="div">Div element with heading-4 styling</Typography>
      <Typography variant="body-small" as="figcaption">Figure caption with body-small styling</Typography>
    </div>
  ),
};

// Custom styling
export const WithCustomStyling: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example showing how to extend the Typography component with custom CSS classes and inline styles while maintaining the base typography variant styling.',
      },
    },
  },
  args: {
    variant: 'heading-3',
    as: 'h2',
    children: 'Custom styled typography with blue color and underline',
    className: 'custom-class',
    style: { color: '#007bff', textDecoration: 'underline' },
  },
};

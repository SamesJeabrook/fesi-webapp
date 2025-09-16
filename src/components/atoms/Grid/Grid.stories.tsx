import type { Meta, StoryObj } from '@storybook/react';
import { Grid, GridContainer, GridItem } from './Grid.component';

const meta: Meta<typeof GridContainer> = {
  title: 'Atoms/Grid',
  component: GridContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
A flexible grid system built with CSS Flexbox that provides:
- Responsive columns (1-16 columns)
- Multiple breakpoints (sm, md, lg, xl, 2xl)
- Offset support
- Flexible alignment and spacing options
- Mobile-first responsive design

## Breakpoints
- **sm**: 640px (Large mobile/small tablet)
- **md**: 768px (Tablet)
- **lg**: 1024px (Desktop)  
- **xl**: 1280px (Large desktop)
- **2xl**: 1536px (Extra large desktop)

## Usage
\`\`\`tsx
<Grid.Container gap="md">
  <Grid.Item sm={16} md={8} lg={4}>
    Content
  </Grid.Item>
</Grid.Container>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    gap: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Gap between grid items',
    },
    justifyContent: {
      control: 'select',
      options: ['start', 'end', 'center', 'space-between', 'space-around', 'space-evenly'],
      description: 'Horizontal alignment of items',
    },
    alignItems: {
      control: 'select',
      options: ['start', 'end', 'center', 'stretch', 'baseline'],
      description: 'Vertical alignment of items',
    },
    direction: {
      control: 'select',
      options: ['row', 'column'],
      description: 'Flex direction',
    },
    wrap: {
      control: 'boolean',
      description: 'Whether items should wrap to new lines',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GridContainer>;

// Demo box component for visual examples
const DemoBox: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  style?: React.CSSProperties;
}> = ({ 
  children, 
  className = '',
  style = {}
}) => (
  <div
    style={{
      backgroundColor: 'var(--color-brand-100, #e3f2fd)',
      border: '2px solid var(--color-brand-300, #90caf9)',
      borderRadius: 'var(--radius-md, 8px)',
      padding: 'var(--space-4, 16px)',
      textAlign: 'center',
      minHeight: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'var(--font-weight-medium, 500)',
      color: 'var(--color-brand-700, #1976d2)',
      ...style
    }}
    className={className}
  >
    {children}
  </div>
);

// Basic Grid
export const Basic: Story = {
  args: {
    gap: 'md',
    wrap: true,
  },
  render: (args) => (
    <GridContainer {...args}>
      <GridItem sm={16} md={8} lg={4}>
        <DemoBox>sm=16, md=8, lg=4</DemoBox>
      </GridItem>
      <GridItem sm={16} md={8} lg={4}>
        <DemoBox>sm=16, md=8, lg=4</DemoBox>
      </GridItem>
      <GridItem sm={16} md={8} lg={4}>
        <DemoBox>sm=16, md=8, lg=4</DemoBox>
      </GridItem>
      <GridItem sm={16} md={8} lg={4}>
        <DemoBox>sm=16, md=8, lg=4</DemoBox>
      </GridItem>
    </GridContainer>
  ),
};

// Responsive Columns
export const ResponsiveColumns: Story = {
  args: {
    gap: 'md',
  },
  render: (args) => (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '20px' }}>Responsive Column Examples</h3>
      <GridContainer {...args}>
        <GridItem sm={16} md={8} lg={5} xl={4} {...{ '2xl': 3 }}>
          <DemoBox>Responsive</DemoBox>
        </GridItem>
        <GridItem sm={16} md={8} lg={6} xl={4} {...{ '2xl': 3 }}>
          <DemoBox>Column</DemoBox>
        </GridItem>
        <GridItem sm={16} md={8} lg={5} xl={4} {...{ '2xl': 3 }}>
          <DemoBox>Layout</DemoBox>
        </GridItem>
        <GridItem sm={16} md={8} lg={12} xl={4} {...{ '2xl': 3 }}>
          <DemoBox>System</DemoBox>
        </GridItem>
      </GridContainer>
    </div>
  ),
};

// Equal Columns
export const EqualColumns: Story = {
  args: {
    gap: 'lg',
  },
  render: (args) => (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '20px' }}>Equal Width Columns</h3>
      
      <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>2 Columns</h4>
      <GridContainer {...args}>
        <GridItem sm={8}>
          <DemoBox>50%</DemoBox>
        </GridItem>
        <GridItem sm={8}>
          <DemoBox>50%</DemoBox>
        </GridItem>
      </GridContainer>

      <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>3 Columns</h4>
      <GridContainer {...args}>
        <GridItem sm={16} md={5}>
          <DemoBox>33.33%</DemoBox>
        </GridItem>
        <GridItem sm={16} md={5}>
          <DemoBox>33.33%</DemoBox>
        </GridItem>
        <GridItem sm={16} md={6}>
          <DemoBox>33.33%</DemoBox>
        </GridItem>
      </GridContainer>

      <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>4 Columns</h4>
      <GridContainer {...args}>
        <GridItem sm={8} lg={4}>
          <DemoBox>25%</DemoBox>
        </GridItem>
        <GridItem sm={8} lg={4}>
          <DemoBox>25%</DemoBox>
        </GridItem>
        <GridItem sm={8} lg={4}>
          <DemoBox>25%</DemoBox>
        </GridItem>
        <GridItem sm={8} lg={4}>
          <DemoBox>25%</DemoBox>
        </GridItem>
      </GridContainer>
    </div>
  ),
};

// With Offsets
export const WithOffsets: Story = {
  args: {
    gap: 'md',
  },
  render: (args) => (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '20px' }}>Column Offsets</h3>
      <GridContainer {...args}>
        <GridItem sm={8} smOffset={4}>
          <DemoBox>Offset 4, Width 8</DemoBox>
        </GridItem>
        <GridItem sm={6} smOffset={2}>
          <DemoBox>Offset 2, Width 6</DemoBox>
        </GridItem>
        <GridItem sm={4} smOffset={6}>
          <DemoBox>Offset 6, Width 4</DemoBox>
        </GridItem>
        <GridItem sm={10} smOffset={3}>
          <DemoBox>Offset 3, Width 10</DemoBox>
        </GridItem>
      </GridContainer>
    </div>
  ),
};

// Alignment Examples
export const Alignment: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '20px' }}>Alignment Examples</h3>
      
      <h4 style={{ marginBottom: '10px' }}>Justify Content</h4>
      <GridContainer gap="sm" justifyContent="center" style={{ marginBottom: '20px' }}>
        <GridItem sm={3}>
          <DemoBox>Center</DemoBox>
        </GridItem>
        <GridItem sm={3}>
          <DemoBox>Aligned</DemoBox>
        </GridItem>
      </GridContainer>

      <GridContainer gap="sm" justifyContent="space-between" style={{ marginBottom: '20px' }}>
        <GridItem sm={3}>
          <DemoBox>Space</DemoBox>
        </GridItem>
        <GridItem sm={3}>
          <DemoBox>Between</DemoBox>
        </GridItem>
      </GridContainer>

      <h4 style={{ marginBottom: '10px' }}>Align Items</h4>
      <GridContainer gap="sm" alignItems="center" style={{ minHeight: '120px', border: '1px dashed #ccc', marginBottom: '20px' }}>
        <GridItem sm={4}>
          <DemoBox>Center</DemoBox>
        </GridItem>
        <GridItem sm={4}>
          <DemoBox style={{ minHeight: '80px' }}>Tall Item</DemoBox>
        </GridItem>
        <GridItem sm={4}>
          <DemoBox>Aligned</DemoBox>
        </GridItem>
      </GridContainer>
    </div>
  ),
};

// Complex Layout
export const ComplexLayout: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '20px' }}>Complex Layout Example</h3>
      <GridContainer gap="md">
        {/* Header */}
        <GridItem sm={16}>
          <DemoBox>Header (Full Width)</DemoBox>
        </GridItem>
        
        {/* Sidebar and Main Content */}
        <GridItem sm={16} lg={4}>
          <DemoBox>Sidebar</DemoBox>
        </GridItem>
        <GridItem sm={16} lg={12}>
          <GridContainer gap="sm">
            <GridItem sm={16} md={8}>
              <DemoBox>Main Content</DemoBox>
            </GridItem>
            <GridItem sm={16} md={8}>
              <DemoBox>Secondary</DemoBox>
            </GridItem>
          </GridContainer>
        </GridItem>
        
        {/* Three column section */}
        <GridItem sm={16} md={5} lg={5}>
          <DemoBox>Feature 1</DemoBox>
        </GridItem>
        <GridItem sm={16} md={6} lg={6}>
          <DemoBox>Feature 2</DemoBox>
        </GridItem>
        <GridItem sm={16} md={5} lg={5}>
          <DemoBox>Feature 3</DemoBox>
        </GridItem>
        
        {/* Footer */}
        <GridItem sm={16}>
          <DemoBox>Footer (Full Width)</DemoBox>
        </GridItem>
      </GridContainer>
    </div>
  ),
};

// Gap Variations
export const GapVariations: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '20px' }}>Gap Size Examples</h3>
      
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(gap => (
        <div key={gap} style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Gap: {gap}</h4>
          <GridContainer gap={gap}>
            <GridItem sm={4}>
              <DemoBox>Item 1</DemoBox>
            </GridItem>
            <GridItem sm={4}>
              <DemoBox>Item 2</DemoBox>
            </GridItem>
            <GridItem sm={4}>
              <DemoBox>Item 3</DemoBox>
            </GridItem>
            <GridItem sm={4}>
              <DemoBox>Item 4</DemoBox>
            </GridItem>
          </GridContainer>
        </div>
      ))}
    </div>
  ),
};

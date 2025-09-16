import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StarRating } from './StarRating.component';

const meta: Meta<typeof StarRating> = {
  title: 'Atoms/StarRating',
  component: StarRating,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 5, step: 0.5 },
    },
    maxStars: {
      control: { type: 'number', min: 3, max: 10 },
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    interactive: {
      control: { type: 'boolean' },
    },
    allowHalf: {
      control: { type: 'boolean' },
    },
    showValue: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 3.5,
    showValue: true,
  },
};

export const Interactive: Story = {
  args: {
    value: 2,
    interactive: true,
    showValue: true,
    onChange: (rating) => console.log('Rating changed to:', rating),
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h3>Small</h3>
        <StarRating value={4} size="small" showValue />
      </div>
      <div>
        <h3>Medium</h3>
        <StarRating value={4} size="medium" showValue />
      </div>
      <div>
        <h3>Large</h3>
        <StarRating value={4} size="large" showValue />
      </div>
    </div>
  ),
};

export const DifferentRatings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <StarRating value={1} showValue />
      <StarRating value={2.5} allowHalf showValue />
      <StarRating value={3} showValue />
      <StarRating value={4.5} allowHalf showValue />
      <StarRating value={5} showValue />
    </div>
  ),
};

export const WithoutHalfStars: Story = {
  args: {
    value: 3.7,
    allowHalf: false,
    showValue: true,
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    const [rating, setRating] = React.useState(0);
    
    return (
      <div>
        <h3>Click to rate:</h3>
        <StarRating
          value={rating}
          interactive
          showValue
          onChange={setRating}
        />
        <p>Current rating: {rating}</p>
      </div>
    );
  },
};

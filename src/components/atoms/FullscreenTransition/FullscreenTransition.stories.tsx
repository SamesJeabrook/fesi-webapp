import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FullscreenTransition from './FullscreenTransition';
import type { FullscreenTransitionProps } from './FullscreenTransition.types';

const meta: Meta<typeof FullscreenTransition> = {
  title: 'Atoms/FullscreenTransition',
  component: FullscreenTransition,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof FullscreenTransition>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)} style={{ margin: '2rem' }}>
          Show Fullscreen Transition
        </button>
        <FullscreenTransition
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        >
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Menu Item Details</h2>
            <p>This is where you would show the details for a menu item.</p>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </FullscreenTransition>
      </>
    );
  },
  args: {
    open: false,
    children: <div>Menu Item Details</div>,
  },
};

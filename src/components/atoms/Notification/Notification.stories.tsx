import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Notification from './Notification';
import type { NotificationProps } from './Notification.types';

const meta: Meta<typeof Notification> = {
  title: 'Atoms/Notification',
  component: Notification,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Notification>;

export const Success: Story = {
  args: {
    message: 'Operation completed successfully!',
    type: 'success',
  },
};

export const Warning: Story = {
  args: {
    message: 'This is a warning notification.',
    type: 'warning',
  },
};

export const Error: Story = {
  args: {
    message: 'An error occurred.',
    type: 'error',
  },
};

export const Closable: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    return open ? (
      <Notification {...args} onClose={() => setOpen(false)} />
    ) : null;
  },
  args: {
    message: 'You can close this notification.',
    type: 'success',
    persistent: false,
  },
};

export const Persistent: Story = {
  args: {
    message: 'This notification cannot be closed.',
    type: 'warning',
    persistent: true,
  },
};

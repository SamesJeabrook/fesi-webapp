import type { Meta, StoryObj } from '@storybook/react';
import QRScanner from './QRScanner.component';
import { QRScannerProps } from './QRScanner.types';

const meta: Meta<typeof QRScanner> = {
  title: 'Molecules/QRScanner',
  component: QRScanner,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'QR code scanner component for merchant order verification. Uses device camera to scan customer QR codes and automatically process order completion.'
      }
    }
  },
  argTypes: {
    isActive: {
      control: 'boolean',
      description: 'Whether the scanner is active and visible'
    },
    isProcessing: {
      control: 'boolean',
      description: 'Loading state while processing a scanned QR code'
    },
    onScan: {
      description: 'Handler for successful QR code scan'
    },
    onError: {
      description: 'Handler for scan errors'
    },
    onClose: {
      description: 'Handler for closing the scanner'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<QRScannerProps>;

// Default scanner state
export const Default: Story = {
  args: {
    isActive: true,
    isProcessing: false,
    onScan: (data) => console.log('QR code scanned:', data),
    onError: (error) => console.log('Scan error:', error),
    onClose: () => console.log('Scanner closed')
  }
};

// Processing state
export const Processing: Story = {
  args: {
    ...Default.args,
    isProcessing: true
  }
};

// Inactive scanner
export const Inactive: Story = {
  args: {
    ...Default.args,
    isActive: false
  }
};

// With custom styling
export const CustomStyling: Story = {
  args: {
    ...Default.args,
    className: 'custom-scanner'
  }
};
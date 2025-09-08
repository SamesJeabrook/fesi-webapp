import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from './Input.component';

// Example icons
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <circle cx="12" cy="16" r="1"></circle>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible input component with support for labels, validation, icons, addons, and multiple sizes. Built with accessibility in mind.',
      },
    },
  },
  argTypes: {
    id: {
      description: 'Unique identifier for the input',
      control: 'text',
    },
    label: {
      description: 'Label text for the input',
      control: 'text',
    },
    placeholder: {
      description: 'Placeholder text',
      control: 'text',
    },
    helperText: {
      description: 'Helper text below the input',
      control: 'text',
    },
    errorMessage: {
      description: 'Error message (overrides helper text)',
      control: 'text',
    },
    type: {
      description: 'Input type',
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    size: {
      description: 'Size of the input',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isRequired: {
      description: 'Shows required indicator',
      control: 'boolean',
    },
    isDisabled: {
      description: 'Disables the input',
      control: 'boolean',
    },
    isReadOnly: {
      description: 'Makes input read-only',
      control: 'boolean',
    },
    fullWidth: {
      description: 'Makes input full width',
      control: 'boolean',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic examples
export const Default: Story = {
  args: {
    id: 'default-input',
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    id: 'labeled-input',
    label: 'Full Name',
    placeholder: 'Enter your full name',
  },
};

export const WithHelperText: Story = {
  args: {
    id: 'helper-input',
    label: 'Email Address',
    placeholder: 'Enter your email',
    helperText: 'We will never share your email with anyone.',
  },
};

export const Required: Story = {
  args: {
    id: 'required-input',
    label: 'Required Field',
    placeholder: 'This field is required',
    isRequired: true,
  },
};

export const WithError: Story = {
  args: {
    id: 'error-input',
    label: 'Email Address',
    placeholder: 'Enter your email',
    errorMessage: 'Please enter a valid email address.',
    value: 'invalid-email',
  },
};

// Size variations
export const Small: Story = {
  args: {
    id: 'small-input',
    label: 'Small Input',
    size: 'sm',
    placeholder: 'Small size',
  },
};

export const Medium: Story = {
  args: {
    id: 'medium-input',
    label: 'Medium Input',
    size: 'md',
    placeholder: 'Medium size (default)',
  },
};

export const Large: Story = {
  args: {
    id: 'large-input',
    label: 'Large Input',
    size: 'lg',
    placeholder: 'Large size',
  },
};

// State variations
export const Disabled: Story = {
  args: {
    id: 'disabled-input',
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    isDisabled: true,
    value: 'Cannot edit this',
  },
};

export const ReadOnly: Story = {
  args: {
    id: 'readonly-input',
    label: 'Read-only Input',
    isReadOnly: true,
    value: 'This value cannot be changed',
  },
};

export const FullWidth: Story = {
  args: {
    id: 'fullwidth-input',
    label: 'Full Width Input',
    placeholder: 'This input takes full width',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    id: 'search-input',
    label: 'Search',
    placeholder: 'Search for restaurants...',
    leftIcon: <SearchIcon />,
  },
};

export const WithRightIcon: Story = {
  args: {
    id: 'email-input',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    rightIcon: <MailIcon />,
  },
};

export const PasswordInput: Story = {
  args: {
    id: 'password-input',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    leftIcon: <LockIcon />,
  },
};

// With addons
export const WithLeftAddon: Story = {
  args: {
    id: 'price-input',
    label: 'Price',
    type: 'number',
    placeholder: '0.00',
    leftAddon: '£',
  },
};

export const WithRightAddon: Story = {
  args: {
    id: 'weight-input',
    label: 'Weight',
    type: 'number',
    placeholder: '0',
    rightAddon: 'kg',
  },
};

// Input types
export const EmailInput: Story = {
  args: {
    id: 'email-type',
    label: 'Email Address',
    type: 'email',
    placeholder: 'user@example.com',
    leftIcon: <MailIcon />,
  },
};

export const NumberInput: Story = {
  args: {
    id: 'number-type',
    label: 'Quantity',
    type: 'number',
    placeholder: '1',
    min: 1,
    max: 10,
  },
};

export const TelInput: Story = {
  args: {
    id: 'tel-type',
    label: 'Phone Number',
    type: 'tel',
    placeholder: '+44 20 7946 0958',
  },
};

// Interactive example
export const ControlledInput: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      
      // Simple validation
      if (newValue.length > 0 && newValue.length < 3) {
        setError('Must be at least 3 characters');
      } else {
        setError('');
      }
    };

    return (
      <Input
        id="controlled-input"
        label="Controlled Input with Validation"
        placeholder="Type something..."
        value={value}
        onChange={handleChange}
        errorMessage={error}
        helperText={!error ? 'This input has real-time validation' : undefined}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a controlled input with real-time validation.',
      },
    },
  },
};

// Food ordering context examples
export const RestaurantSearch: Story = {
  args: {
    id: 'restaurant-search',
    label: 'Search Restaurants',
    type: 'search',
    placeholder: 'Search by name, cuisine, or location...',
    leftIcon: <SearchIcon />,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Search input for finding restaurants in the food ordering app.',
      },
    },
  },
};

export const DeliveryAddress: Story = {
  args: {
    id: 'delivery-address',
    label: 'Delivery Address',
    placeholder: 'Enter your delivery address',
    helperText: 'We use this to find restaurants that deliver to your area.',
    isRequired: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Address input for delivery location in food ordering.',
      },
    },
  },
};

export const PromoCode: Story = {
  args: {
    id: 'promo-code',
    label: 'Promo Code',
    placeholder: 'Enter promo code',
    rightAddon: 'Apply',
  },
  parameters: {
    docs: {
      description: {
        story: 'Promo code input for discounts during checkout.',
      },
    },
  },
};

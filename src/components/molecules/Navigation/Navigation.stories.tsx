import type { Meta, StoryObj } from '@storybook/react';
import { Navigation } from './Navigation.component';
import { Auth0Provider } from '@auth0/auth0-react';

// Mock Auth0 configuration
const mockAuth0Config = {
  domain: 'test.auth0.com',
  clientId: 'test-client-id',
  authorizationParams: {
    redirect_uri: 'http://localhost:3000',
  },
};

// Mock users for different states
const mockGuestUser = null;
const mockCustomerUser = {
  sub: 'auth0|123',
  email: 'customer@test.com',
  'https://fesi.app/roles': ['customer'],
};
const mockMerchantUser = {
  sub: 'auth0|456',
  email: 'merchant@test.com',
  'https://fesi.app/roles': ['merchant'],
};
const mockAdminUser = {
  sub: 'auth0|789',
  email: 'admin@test.com',
  'https://fesi.app/roles': ['admin'],
};

const meta: Meta<typeof Navigation> = {
  title: 'Molecules/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Navigation provides role-based navigation links and authentication controls.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Navigation>;

export const GuestUser: Story = {
  name: 'Guest User (Not Authenticated)',
  parameters: {
    docs: {
      description: {
        story: 'Shows navigation for non-authenticated users with login button.',
      },
    },
  },
  decorators: [
    (Story) => {
      // Mock Auth0 context for guest user
      const MockAuth0Provider = ({ children }: { children: React.ReactNode }) => {
        const mockHook = {
          isAuthenticated: false,
          user: mockGuestUser,
          loginWithRedirect: () => Promise.resolve(),
          logout: () => {},
        };
        
        return (
          <div>
            {/* Mock Auth0 context */}
            {children}
          </div>
        );
      };
      
      return (
        <MockAuth0Provider>
          <div style={{ minHeight: '200px', background: 'var(--color-background)' }}>
            <Story />
          </div>
        </MockAuth0Provider>
      );
    },
  ],
};

export const CustomerUser: Story = {
  name: 'Customer User',
  parameters: {
    docs: {
      description: {
        story: 'Shows navigation for authenticated customer users.',
      },
    },
  },
  decorators: [
    (Story) => (
      <Auth0Provider {...mockAuth0Config}>
        <div style={{ minHeight: '200px', background: 'var(--color-background)' }}>
          <Story />
        </div>
      </Auth0Provider>
    ),
  ],
};

export const MerchantUser: Story = {
  name: 'Merchant User',
  parameters: {
    docs: {
      description: {
        story: 'Shows navigation for authenticated merchant users with order management link.',
      },
    },
  },
  decorators: [
    (Story) => (
      <Auth0Provider {...mockAuth0Config}>
        <div style={{ minHeight: '200px', background: 'var(--color-background)' }}>
          <Story />
        </div>
      </Auth0Provider>
    ),
  ],
};

export const AdminUser: Story = {
  name: 'Admin User',
  parameters: {
    docs: {
      description: {
        story: 'Shows navigation for admin users with access to both admin dashboard and merchant orders.',
      },
    },
  },
  decorators: [
    (Story) => (
      <Auth0Provider {...mockAuth0Config}>
        <div style={{ minHeight: '200px', background: 'var(--color-background)' }}>
          <Story />
        </div>
      </Auth0Provider>
    ),
  ],
};
import type { Meta, StoryObj } from '@storybook/react';
import { AdminHeader } from './AdminHeader.component';
import { AdminProvider } from '@/components/providers/AdminProvider';
import { Auth0Provider } from '@auth0/auth0-react';

// Mock merchant data
const mockMerchant = {
  id: '1',
  business_name: 'Test Restaurant',
  name: 'Test Restaurant',
  email: 'test@restaurant.com',
  username: 'testrestaurant',
  phone: '+1234567890',
  status: 'active',
  created_at: '2024-01-01T00:00:00Z',
};

// Mock Auth0 configuration
const mockAuth0Config = {
  domain: 'test.auth0.com',
  clientId: 'test-client-id',
  authorizationParams: {
    redirect_uri: 'http://localhost:3000',
  },
};

// Mock user with admin role
const mockAdminUser = {
  sub: 'auth0|123',
  email: 'admin@test.com',
  'https://fesi.app/roles': ['admin'],
};

const meta: Meta<typeof AdminHeader> = {
  title: 'Molecules/AdminHeader',
  component: AdminHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'AdminHeader provides admin-specific navigation and impersonation controls.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Auth0Provider {...mockAuth0Config}>
        <AdminProvider>
          <div style={{ minHeight: '200px', background: 'var(--color-background)' }}>
            <Story />
          </div>
        </AdminProvider>
      </Auth0Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AdminHeader>;

export const AdminDashboard: Story = {
  name: 'Admin Dashboard',
  parameters: {
    docs: {
      description: {
        story: 'Shows the admin header when no merchant is selected for impersonation.',
      },
    },
  },
};

export const ImpersonatingMerchant: Story = {
  name: 'Impersonating Merchant',
  parameters: {
    docs: {
      description: {
        story: 'Shows the admin header when impersonating a merchant with change/exit options.',
      },
    },
  },
  decorators: [
    (Story) => {
      // Mock the admin context to have a selected merchant
      const MockAdminProvider = ({ children }: { children: React.ReactNode }) => {
        const mockContext = {
          selectedMerchant: mockMerchant,
          setSelectedMerchant: () => {},
          isImpersonating: true,
          isAdmin: true,
          clearImpersonation: () => {},
        };
        
        return (
          <div>
            {/* Mock context provider */}
            {children}
          </div>
        );
      };
      
      return (
        <Auth0Provider {...mockAuth0Config}>
          <MockAdminProvider>
            <div style={{ minHeight: '200px', background: 'var(--color-background)' }}>
              <Story />
            </div>
          </MockAdminProvider>
        </Auth0Provider>
      );
    },
  ],
};

export const NonAdminUser: Story = {
  name: 'Non-Admin User',
  parameters: {
    docs: {
      description: {
        story: 'Returns null for non-admin users - header should not be visible.',
      },
    },
  },
  decorators: [
    (Story) => {
      // Mock the admin context for non-admin user
      const MockAdminProvider = ({ children }: { children: React.ReactNode }) => {
        const mockContext = {
          selectedMerchant: null,
          setSelectedMerchant: () => {},
          isImpersonating: false,
          isAdmin: false,
          clearImpersonation: () => {},
        };
        
        return (
          <div>
            {/* Mock context provider */}
            {children}
          </div>
        );
      };
      
      return (
        <Auth0Provider {...mockAuth0Config}>
          <MockAdminProvider>
            <div style={{ minHeight: '200px', background: 'var(--color-background)', padding: '2rem' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>Non-admin users should not see the admin header</p>
              <Story />
            </div>
          </MockAdminProvider>
        </Auth0Provider>
      );
    },
  ],
};
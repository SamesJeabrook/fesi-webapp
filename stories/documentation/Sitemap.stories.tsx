import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from '@/components/atoms/Typography';

const meta: Meta = {
  title: 'Documentation/Sitemap',
  parameters: {
    docs: {
      description: {
        component: 'Application sitemap and navigation structure for the Fesi platform.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const ApplicationSitemap: Story = {
  render: () => (
    <div>
      <Typography as="h1" variant="heading-1">
        Fesi Application Sitemap
      </Typography>
      
      <Typography variant="body-large">
        The Fesi platform serves multiple user types with distinct workflows and requirements. 
        This sitemap outlines the complete application structure for customers, merchants, and general visitors.
      </Typography>

      <div>
        {/* Public Pages */}
        <section>
          <Typography as="h2" variant="heading-3">
            🌐 Public Pages
          </Typography>
          <div>
            <div>
              <Typography as="span" variant="overline">
                /
              </Typography>
              <Typography variant="body-medium">
                Homepage - Platform overview, featured vendors, value proposition
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /about
              </Typography>
              <Typography variant="body-medium">
                About Us - Company story, mission, team information
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /vendors
              </Typography>
              <Typography variant="body-medium">
                Browse Vendors - Directory of all available food vendors
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /vendors/[id]
              </Typography>
              <Typography variant="body-medium">
                Vendor Detail - Menu, info, and ordering interface
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /contact
              </Typography>
              <Typography variant="body-medium">
                Contact Us - Support, inquiries, feedback
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /privacy
              </Typography>
              <Typography variant="body-medium">
                Privacy Policy - Data handling and user privacy
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /terms
              </Typography>
              <Typography variant="body-medium">
                Terms of Service - Platform usage terms and conditions
              </Typography>
            </div>
          </div>
        </section>

        {/* Customer Authentication & Account */}
        <section>
          <Typography as="h2" variant="heading-3">
            👤 Customer Authentication & Account
          </Typography>
          <div>
            <div>
              <Typography as="span" variant="overline">
                /login
              </Typography>
              <Typography variant="body-medium">
                Customer Login - Email/password authentication
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /signup
              </Typography>
              <Typography variant="body-medium">
                Customer Registration - Account creation form
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /forgot-password
              </Typography>
              <Typography variant="body-medium">
                Password Reset - Email-based password recovery
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /verify-email
              </Typography>
              <Typography variant="body-medium">
                Email Verification - Account activation
              </Typography>
            </div>
          </div>
        </section>

        {/* Customer Dashboard */}
        <section>
          <Typography as="h2" variant="heading-3">
            🛒 Customer Dashboard & Ordering
          </Typography>
          <div>
            <div>
              <Typography as="span" variant="overline">
                /dashboard
              </Typography>
              <Typography variant="body-medium">
                Customer Dashboard - Order history, favorites, recommendations
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /profile
              </Typography>
              <Typography variant="body-medium">
                Profile Management - Personal info, preferences, addresses
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /orders
              </Typography>
              <Typography variant="body-medium">
                Order History - Past orders, reorder, track status
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /orders/[id]
              </Typography>
              <Typography variant="body-medium">
                Order Details - Specific order information and tracking
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /cart
              </Typography>
              <Typography variant="body-medium">
                Shopping Cart - Review items, modify quantities, checkout
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /checkout
              </Typography>
              <Typography variant="body-medium">
                Checkout Process - Payment, delivery info, order confirmation
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /favorites
              </Typography>
              <Typography variant="body-medium">
                Favorite Vendors - Saved vendors and menu items
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /loyalty
              </Typography>
              <Typography variant="body-medium">
                Loyalty Rewards - Points, stamps, rewards redemption
              </Typography>
            </div>
          </div>
        </section>

        {/* Merchant Authentication & Onboarding */}
        <section>
          <Typography as="h2" variant="heading-3">
            🏪 Merchant Authentication & Onboarding
          </Typography>
          <div>
            <div>
              <Typography as="span" variant="overline">
                /merchant/signup
              </Typography>
              <Typography variant="body-medium">
                Merchant Registration - Business information, verification
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /merchant/login
              </Typography>
              <Typography variant="body-medium">
                Merchant Login - Business account authentication
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /merchant/onboarding
              </Typography>
              <Typography variant="body-medium">
                Setup Wizard - Menu creation, payment setup, business profile
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /merchant/verification
              </Typography>
              <Typography variant="body-medium">
                Business Verification - Document upload, compliance checks
              </Typography>
            </div>
          </div>
        </section>

        {/* Merchant Dashboard */}
        <section>
          <Typography as="h2" variant="heading-3">
            📊 Merchant Dashboard & Management
          </Typography>
          <div>
            <div>
              <Typography as="span" variant="overline">
                /merchant/dashboard
              </Typography>
              <Typography variant="body-medium">
                Business Overview - Sales summary, pending orders, quick actions
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /merchant/orders
              </Typography>
              <Typography variant="body-medium">
                Order Management - Incoming orders, status updates, fulfillment
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /merchant/menu
              </Typography>
              <Typography variant="body-medium">
                Menu Management - Items, categories, pricing, availability
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /merchant/menu/add
              </Typography>
              <Typography variant="body-medium">
                Add Menu Item - Create new food items with details
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /merchant/menu/[id]
              </Typography>
              <Typography variant="body-medium">
                Edit Menu Item - Modify existing items, pricing, descriptions
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /merchant/profile
              </Typography>
              <Typography variant="body-medium">
                Business Profile - Business info, hours, location, photos
              </Typography>
            </div>
          </div>
        </section>

        {/* Merchant POS & Operations */}
        <section>
          <Typography as="h2" variant="heading-3">
            💳 Point of Sale & Operations
          </Typography>
          <div>
            <div>
              <Typography as="span" variant="overline">
                /merchant/pos
              </Typography>
              <Typography variant="body-medium">
                Point of Sale - In-person order taking, payment processing
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /merchant/inventory
              </Typography>
              <Typography variant="body-medium">
                Inventory Management - Stock levels, low stock alerts
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /merchant/reports
              </Typography>
              <Typography variant="body-medium">
                Analytics & Reports - Sales data, trends, performance metrics
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /merchant/reports/sales
              </Typography>
              <Typography variant="body-medium">
                Sales Reports - Revenue, top items, time-based analysis
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /merchant/reports/customers
              </Typography>
              <Typography variant="body-medium">
                Customer Analytics - Customer behavior, retention, preferences
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /merchant/loyalty
              </Typography>
              <Typography variant="body-medium">
                Loyalty Program Setup - Rewards configuration, stamp cards
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /merchant/settings
              </Typography>
              <Typography variant="body-medium">
                Business Settings - Notifications, payment methods, integrations
              </Typography>
            </div>
          </div>
        </section>

        {/* Special Pages */}
        <section>
          <Typography as="h2" variant="heading-3">
            ⚙️ Special Pages & Error Handling
          </Typography>
          <div>
            <div>
              <Typography as="span" variant="overline">
                /404
              </Typography>
              <Typography variant="body-medium">
                Page Not Found - Custom 404 error page
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /500
              </Typography>
              <Typography variant="body-medium">
                Server Error - Internal server error page
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /maintenance
              </Typography>
              <Typography variant="body-medium">
                Maintenance Mode - System maintenance notification
              </Typography>
            </div>
            <div>
              <Typography as="span" variant="overline">
                /loading
              </Typography>
              <Typography variant="body-medium">
                Loading States - Global loading component
              </Typography>
            </div>
          </div>
        </section>

        {/* Technical Notes */}
        <section>
          <Typography as="h3" variant="heading-4">
            📋 Implementation Notes
          </Typography>
          <ul>
            <li>
              <Typography variant="body-small">•</Typography>
              <Typography variant="body-medium">
                Routes use Next.js App Router with dynamic routing for vendor and order pages
              </Typography>
            </li>
            <li>
              <Typography variant="body-small">•</Typography>
              <Typography variant="body-medium">
                Authentication state determines available routes and redirects
              </Typography>
            </li>
            <li>
              <Typography variant="body-small">•</Typography>
              <Typography variant="body-medium">
                Merchant and customer areas have separate authentication flows
              </Typography>
            </li>
            <li>
              <Typography variant="body-small">•</Typography>
              <Typography variant="body-medium">
                POS system designed for tablet/mobile-first merchant interface
              </Typography>
            </li>
            <li>
              <Typography variant="body-small">•</Typography>
              <Typography variant="body-medium">
                All pages implement responsive design with mobile-first approach
              </Typography>
            </li>
          </ul>
        </section>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete application sitemap showing all routes and functionality for customers, merchants, and public users.',
      },
    },
  },
};

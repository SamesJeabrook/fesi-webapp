import type { Meta, StoryObj } from '@storybook/react';
import { ImpersonationBar } from './ImpersonationBar.component';

const meta: Meta<typeof ImpersonationBar> = {
  title: 'Molecules/ImpersonationBar',
  component: ImpersonationBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onChangeMerchant: { action: 'change merchant' },
    onExitAdminMode: { action: 'exit admin mode' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockMerchant = {
  business_name: "Mario's Authentic Pizzeria",
  name: "Mario's Authentic Pizzeria",
  email: 'mario@pizzeria.com',
};

export const Default: Story = {
  args: {
    merchant: mockMerchant,
  },
};

export const WithActions: Story = {
  args: {
    merchant: mockMerchant,
    onChangeMerchant: () => console.log('Change merchant clicked'),
    onExitAdminMode: () => console.log('Exit admin mode clicked'),
  },
};

export const WithoutEmail: Story = {
  args: {
    merchant: {
      business_name: "Joe's Coffee Shop",
      name: "Joe's Coffee Shop",
    },
    onChangeMerchant: () => console.log('Change merchant clicked'),
    onExitAdminMode: () => console.log('Exit admin mode clicked'),
  },
};

export const NoChangeMerchant: Story = {
  args: {
    merchant: mockMerchant,
    showChangeMerchant: false,
    onExitAdminMode: () => console.log('Exit admin mode clicked'),
  },
};

export const LongMerchantName: Story = {
  args: {
    merchant: {
      business_name: "Giuseppe's Authentic Italian Ristorante & Pizzeria Napoletana",
      name: "Giuseppe's Authentic Italian Ristorante & Pizzeria Napoletana",
      email: 'giuseppe@authentic-italian-ristorante.com',
    },
    onChangeMerchant: () => console.log('Change merchant clicked'),
    onExitAdminMode: () => console.log('Exit admin mode clicked'),
  },
};
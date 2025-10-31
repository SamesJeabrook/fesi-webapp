import React from "react";
import { MerchantQrModal } from "./MerchantQrModal";
import type { Meta, StoryObj } from "@storybook/react";

const merchant = {
  id: "merchant-123",
  business_name: "Fesi Test Merchant",
  name: "Test Merchant",
  email: "merchant@example.com",
  username: "fesimerchant",
  phone: "123-456-7890",
  status: "active",
  created_at: "2025-10-22T12:00:00Z",
};

const meta: Meta<typeof MerchantQrModal> = {
  title: "Molecules/MerchantQrModal",
  component: MerchantQrModal,
  parameters: {
    layout: "centered",
  },
  args: {
    merchant,
    open: true,
    onClose: () => alert("Modal closed"),
  },
};

export default meta;

type Story = StoryObj<typeof MerchantQrModal>;

export const Default: Story = {
  args: {
    merchant,
    open: true,
    onClose: () => alert("Modal closed"),
  },
};

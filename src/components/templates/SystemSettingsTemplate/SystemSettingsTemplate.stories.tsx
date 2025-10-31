import React from "react";
import { SystemSettingsTemplate } from "./SystemSettingsTemplate";
import type { Meta, StoryObj } from "@storybook/react";

const company = {
  id: "company-1",
  name: "Fesi Ltd.",
  description: "A modern merchant platform.",
  username: "fesiltd",
};

const meta: Meta<typeof SystemSettingsTemplate> = {
  title: "Templates/SystemSettingsTemplate",
  component: SystemSettingsTemplate,
  parameters: {
    layout: "centered",
  },
  args: {
    company,
    loading: false,
  },
};

export default meta;

type Story = StoryObj<typeof SystemSettingsTemplate>;

export const Default: Story = {
  args: {
    company,
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    company: null,
    loading: true,
  },
};

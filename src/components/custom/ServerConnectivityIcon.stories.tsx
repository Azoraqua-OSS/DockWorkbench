import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ServerConnectivityIcon } from "./ServerConnectivityIcon";

const meta = {
  title: "Custom/ServerConnectivityIcon",
  component: ServerConnectivityIcon,
  tags: ["autodocs"],
  args: {
    status: "online",
  },
  argTypes: {
    status: {
      control: {
        type: "select",
        options: ["online", "offline"],
      },
    },
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ServerConnectivityIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Online: Story = {};

export const Offline: Story = {
  args: {
    status: "offline",
  },
};

export const LargerDot: Story = {
  args: {
    className: "size-3",
  },
};

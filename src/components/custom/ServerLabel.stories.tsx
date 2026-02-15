import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ServerLabel } from "./ServerLabel";

const meta = {
  title: "Custom/ServerLabel",
  component: ServerLabel,
  tags: ["autodocs"],
  args: {
    name: "Local Docker",
    connectivity: "online",
  },
  argTypes: {
    connectivity: {
      control: {
        type: "select",
        options: ["online", "offline"],
      },
    },
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ServerLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Online: Story = {};

export const Offline: Story = {
  args: {
    connectivity: "offline",
  },
};

export const LongName: Story = {
  args: {
    name: "Production EU Central Docker Engine (Shared Control Plane)",
    connectivity: "online",
  },
};

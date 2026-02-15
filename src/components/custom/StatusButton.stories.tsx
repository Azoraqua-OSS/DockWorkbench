import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatusButton } from "./StatusButton";

const meta = {
  title: "UI/StatusButton",
  component: StatusButton,
  tags: ["autodocs"],
  args: {
    variant: "disconnected",
  },
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["connected", "disconnected", "syncing", "error"],
      },
    },
  },
} satisfies Meta<typeof StatusButton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Connected: Story = {
  args: {
    variant: "connected",
  },
};

export const Disconnected: Story = {
  args: {
    variant: "disconnected",
  },
};

export const Syncing: Story = {
  args: {
    variant: "syncing",
  },
};

export const ErrorState: Story = {
  args: {
    variant: "error",
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="inline-flex items-center gap-3">
      <StatusButton variant="connected" />
      <StatusButton variant="disconnected" />
      <StatusButton variant="syncing" />
      <StatusButton variant="error" />
    </div>
  ),
};

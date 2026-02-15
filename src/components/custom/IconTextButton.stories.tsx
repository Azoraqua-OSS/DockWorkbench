import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tag } from "lucide-react";
import { IconTextButton } from "./IconTextButton";

const meta = {
  title: "Custom/IconTextButton",
  component: IconTextButton,
  tags: ["autodocs"],
  args: {
    label: "v0.1.0",
    icon: <Tag className="size-[1em] shrink-0 align-middle" />,
    variant: "ghost",
    size: "xs",
  },
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["default", "secondary", "outline", "ghost"],
      },
    },
    size: {
      control: {
        type: "select",
        options: ["xs", "sm", "default", "lg"],
      },
    },
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof IconTextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

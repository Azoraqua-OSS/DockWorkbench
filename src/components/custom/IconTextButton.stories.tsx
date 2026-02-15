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
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof IconTextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

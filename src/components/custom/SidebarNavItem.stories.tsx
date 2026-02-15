import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Container } from "lucide-react";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarStoryFrame } from "./SidebarStoryFrame";

const meta = {
  title: "Custom/SidebarNavItem",
  component: SidebarNavItem,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <SidebarStoryFrame className="h-[240px]" withMenu>
        <Story />
      </SidebarStoryFrame>
    ),
  ],
  args: {
    icon: Container,
    label: "Containers",
  },
} satisfies Meta<typeof SidebarNavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

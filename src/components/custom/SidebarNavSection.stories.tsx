import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Container, HardDrive, Layers, Network } from "lucide-react";
import { SidebarNavSection } from "./SidebarNavSection";
import { SidebarStoryFrame } from "./SidebarStoryFrame";

const meta = {
  title: "Custom/SidebarNavSection",
  component: SidebarNavSection,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <SidebarStoryFrame>
        <Story />
      </SidebarStoryFrame>
    ),
  ],
  args: {
    title: "Workspace",
    items: [
      { icon: Container, label: "Containers" },
      { icon: Layers, label: "Images" },
      { icon: HardDrive, label: "Volumes" },
      { icon: Network, label: "Networks" },
    ],
  },
} satisfies Meta<typeof SidebarNavSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

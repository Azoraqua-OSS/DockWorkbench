import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Container, HardDrive, Layers, Network } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SidebarNavSection } from "./SidebarNavSection";

const meta = {
  title: "Custom/SidebarNavSection",
  component: SidebarNavSection,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="h-[320px] w-[280px]">
        <SidebarProvider defaultOpen>
          <Sidebar collapsible="none" className="h-full">
            <SidebarContent>
              <Story />
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </div>
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

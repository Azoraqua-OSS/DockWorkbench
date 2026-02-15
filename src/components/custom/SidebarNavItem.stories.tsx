import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Container } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SidebarNavItem } from "./SidebarNavItem";

const meta = {
  title: "Custom/SidebarNavItem",
  component: SidebarNavItem,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="h-[240px] w-[280px]">
        <SidebarProvider defaultOpen>
          <Sidebar collapsible="none" className="h-full">
            <SidebarContent>
              <SidebarMenu>
                <Story />
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </div>
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

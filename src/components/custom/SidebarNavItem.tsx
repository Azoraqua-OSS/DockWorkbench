import type { LucideIcon } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export type SidebarNavItemProps = {
  icon: LucideIcon;
  label: string;
};

function SidebarNavItem({ icon: Icon, label }: SidebarNavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip={label}>
        <Icon />
        {label}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export { SidebarNavItem };

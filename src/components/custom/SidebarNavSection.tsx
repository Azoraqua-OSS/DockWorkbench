import type { LucideIcon } from "lucide-react";
import { SidebarNavItem } from "@/components/custom/SidebarNavItem";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";

export type SidebarNavSectionItem = {
  icon: LucideIcon;
  label: string;
};

export type SidebarNavSectionProps = {
  title: string;
  items: SidebarNavSectionItem[];
};

function SidebarNavSection({ title, items }: SidebarNavSectionProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarNavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export { SidebarNavSection };

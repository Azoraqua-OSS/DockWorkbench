import type { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type SidebarStoryFrameProps = {
  children: ReactNode;
  className?: string;
  withMenu?: boolean;
};

function SidebarStoryFrame({
  children,
  className,
  withMenu = false,
}: SidebarStoryFrameProps) {
  return (
    <div className={cn("h-[320px] w-[280px]", className)}>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="none" className="h-full">
          <SidebarContent>
            {withMenu ? <SidebarMenu>{children}</SidebarMenu> : children}
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}

export { SidebarStoryFrame };

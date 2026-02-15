import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { description, name as title, version } from "../../package.json";
import "./globals.css";
import {
  Container,
  FileCode2,
  HardDrive,
  Layers,
  Network,
  Tag,
} from "lucide-react";
import { IconTextButton } from "@/components/custom/IconTextButton";
import {
  SidebarNavSection,
  type SidebarNavSectionItem,
} from "@/components/custom/SidebarNavSection";
import { StatusButton } from "@/components/custom/StatusButton";
import { Header } from "@/components/layout/header";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = { title, description };

const toolItems: SidebarNavSectionItem[] = [
  { icon: FileCode2, label: "Dockerfile" },
  { icon: Layers, label: "Docker Compose" },
];

const workspaceItems: SidebarNavSectionItem[] = [
  { icon: Container, label: "Containers" },
  { icon: Layers, label: "Images" },
  { icon: HardDrive, label: "Volumes" },
  { icon: Network, label: "Networks" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body
        data-tauri-drag-region
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark min-w-screen min-h-screen overflow-hidden`}
      >
        <SidebarProvider defaultOpen>
          <TooltipProvider>
            <Header />

            <Sidebar
              collapsible="icon"
              variant="sidebar"
              className="mt-12 h-full"
            >
              <SidebarContent>
                <SidebarNavSection title="Tools" items={toolItems} />
                <Separator
                  decorative
                  className="!w-56 mx-auto bg-neutral-700/70"
                />
                <SidebarNavSection title="Workspace" items={workspaceItems} />
              </SidebarContent>
            </Sidebar>

            <main className="fixed top-12 right-0 bottom-0 left-0 overflow-y-auto overflow-x-hidden pb-8 transition-[left] duration-200 ease-linear md:left-64 md:peer-data-[collapsible=icon]:left-12">
              {children}
            </main>

            <footer className="fixed bottom-0 w-full px-4 py-1 flex flex-1 justify-between items-center z-50 bg-neutral-950/70">
              <StatusButton variant="disconnected" />

              <IconTextButton
                icon={<Tag className="size-[1em] shrink-0 align-middle" />}
                label={`v${version}`}
              />
            </footer>
            <Toaster richColors position="bottom-right" />
          </TooltipProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}

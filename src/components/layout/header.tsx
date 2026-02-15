"use client";

import { Search, Settings, User } from "lucide-react";
import Link from "next/link";
import { ServerLabel } from "@/components/custom/ServerLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useServerStore } from "@/stores/server-store";

export function Header() {
  const servers = useServerStore((state) => state.servers);
  const selectedServerId = useServerStore((state) => state.selectedServerId);
  const setSelectedServer = useServerStore((state) => state.setSelectedServer);

  return (
    <header
      suppressHydrationWarning
      data-tauri-drag-region
      className="
        h-12 flex items-center gap-3 select-none
        bg-linear-to-r from-blue-900 via-blue-900 to-blue-800
        border-b border-white/10 text-white min-w-screen
        pl-21
      "
    >
      <div className="inline-flex w-40 flex-col pl-2" data-tauri-drag-region>
        <Link
          href="/"
          className="font-bold tracking-tight"
          data-tauri-drag-region
        >
          DockWorkbench
        </Link>

        <div className="text-xs tracking-tight text-white/70">alpha</div>
      </div>

      <Separator orientation="vertical" className="h-6 bg-white/10" />

      <div className="flex flex-1 items-center gap-3" data-tauri-drag-region>
        {servers.length > 0 ? (
          <div className="w-full max-w-60" data-no-drag>
            <Select
              value={selectedServerId ?? undefined}
              onValueChange={setSelectedServer}
            >
              <SelectTrigger className="w-full min-w-60">
                <SelectValue placeholder="Select a server" />
              </SelectTrigger>

              <SelectContent>
                {servers.map((server) => (
                  <SelectItem
                    key={server.id}
                    value={server.id}
                    textValue={server.name}
                  >
                    <ServerLabel
                      name={server.name}
                      connectivity={server.connectivity}
                    />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <div
          className={cn(
            "flex-1",
            servers.length > 0 ? "mx-auto" : "mx-auto max-w-3xl",
          )}
          data-no-drag
        >
          <div className="relative">
            <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-white/50" />
            <Input
              className="
                pl-8 h-9 bg-white/10 border-white/10 text-white placeholder:text-white/40
                focus-visible:ring-1 focus-visible:ring-white/30
              "
              placeholder="Search containers, images, volumes…"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2" data-no-drag>
          <Button variant="ghost">
            <User className="h-4 w-4" />
          </Button>

          <Button variant="ghost">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

"use client";

import {Plus, Search, Settings, User} from "lucide-react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Separator} from "@/components/ui/separator";

export function Header() {
    const [servers, setServers] = useState([
        {id: "server_a", name: "Server A"},
        {id: "server_b", name: "Server B"},
        {id: "server_c", name: "Server C"},
    ]);

    const addServer = () => {
        const name = prompt("Enter server name:");
        if (name) {
            const id = name.toLowerCase().replace(/\s+/g, "_");
            setServers([...servers, {id, name}]);
        }
    };

    return (
        <header
            suppressHydrationWarning
            data-tauri-drag-region
            className="
                        h-12 flex items-center gap-3  select-none
                        bg-linear-to-r from-blue-900 via-blue-900 to-blue-800
                        border-b border-white/10 text-white min-w-screen
                        pl-21
                     "
        >
            {/* Left: brand */}
            <div className="inline-flex flex-col w-40 pl-2" data-tauri-drag-region>
                <div className="font-bold tracking-tight" data-tauri-drag-region>
                    DockWorkbench
                </div>

                <div className="text-xs text-white/70 tracking-tight">alpha</div>
            </div>

            <Separator orientation="vertical" className="h-6 bg-white/10"/>

            <div
                className="flex flex-1 items-center gap-[15vw]"
                data-tauri-drag-region
            >
                {/* Center: search (non-draggable because it's interactive) */}
                <div className="mr-auto flex items-center gap-2" data-no-drag>
                    <Select>
                        <SelectTrigger className="w-full min-w-60">
                            <SelectValue placeholder="Select a server"/>
                        </SelectTrigger>

                        <SelectContent>
                            {servers.map((server) => (
                                <SelectItem key={server.id} value={server.id}>
                                    {server.name}
                                </SelectItem>
                            ))}
                            <SelectSeparator/>
                            <Button
                                variant="ghost"
                                className="w-full justify-start px-2 h-8 text-xs"
                                onClick={(e) => {
                                    e.preventDefault();
                                    addServer();
                                }}
                            >
                                <Plus className="h-3 w-3 mr-2"/>
                                Add Server
                            </Button>
                        </SelectContent>
                    </Select>
                </div>

                {/* Center: search (non-draggable because it's interactive) */}
                <div className="flex-1 mx-auto" data-no-drag>
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50"/>
                        <Input
                            className="
              pl-8 h-9 bg-white/10 border-white/10 text-white placeholder:text-white/40
              focus-visible:ring-1 focus-visible:ring-white/30
            "
                            placeholder="Search containers, images, volumes…"
                        />
                    </div>
                </div>

                {/* Right: actions */}
                <div className="ml-auto flex items-center gap-2" data-no-drag>
                    <Button variant="ghost">
                        <User className="h-4 w-4"/>
                    </Button>

                    <Button variant="ghost">
                        <Settings className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
        </header>
    );
}

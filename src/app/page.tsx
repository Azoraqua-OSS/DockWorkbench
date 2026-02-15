"use client";

import { AddServerCard } from "@/components/custom/AddServerCard";
import { ServerListCard } from "@/components/custom/ServerListCard";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pt-16 pb-20">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Connect a Docker Server
        </h1>
        <p className="text-sm text-muted-foreground">
          Pick a connector first, then enter connection details. Added servers
          are stored in localStorage and appear in the header selector.
        </p>
      </div>

      <AddServerCard />
      <ServerListCard />
    </div>
  );
}

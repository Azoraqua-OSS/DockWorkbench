"use client";

import { Trash2 } from "lucide-react";
import { ServerLabel } from "@/components/custom/ServerLabel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useServerStore } from "@/stores/server-store";

function ServerListCard() {
  const servers = useServerStore((state) => state.servers);
  const removeServer = useServerStore((state) => state.removeServer);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configured Servers</CardTitle>
        <CardDescription>
          Stored locally in your browser profile. Currently configured:{" "}
          {servers.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {servers.length > 0 ? (
          servers.map((server) => (
            <div
              key={server.id}
              className="flex items-start justify-between gap-3 rounded-md border bg-muted/20 px-3 py-2 text-sm"
            >
              <div>
                <ServerLabel
                  name={server.name}
                  connectivity={server.connectivity}
                  className="font-medium"
                />
                <div className="text-xs text-muted-foreground">
                  {server.protocol.toUpperCase()} - {server.endpoint}
                </div>
              </div>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeServer(server.id)}
                aria-label={`Remove ${server.name}`}
              >
                <Trash2 />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">
            No servers yet. Add your first connection above.
          </div>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="justify-end text-xs text-muted-foreground">
        Persistence key:{" "}
        <code className="ml-1">dockworkbench-server-store</code>
      </CardFooter>
    </Card>
  );
}

export { ServerListCard };

import { cn } from "@/lib/utils";
import type { ServerConnectivity } from "@/stores/server-store";

type ServerConnectivityIconProps = {
  status?: ServerConnectivity;
  className?: string;
};

function ServerConnectivityIcon({
  status = "offline",
  className,
}: ServerConnectivityIconProps) {
  const isOnline = status === "online";

  return (
    <span
      role="img"
      aria-label={isOnline ? "Online" : "Offline"}
      title={isOnline ? "Online" : "Offline"}
      className={cn(
        "inline-block size-2 rounded-full",
        isOnline ? "bg-emerald-500" : "bg-zinc-500 ring-1 ring-red-500/50",
        className,
      )}
    />
  );
}

export { ServerConnectivityIcon };

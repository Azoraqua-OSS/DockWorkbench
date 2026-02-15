import { ServerConnectivityIcon } from "@/components/custom/ServerConnectivityIcon";
import { cn } from "@/lib/utils";
import type { ServerConnectivity } from "@/stores/server-store";

export type ServerLabelProps = {
  name: string;
  connectivity?: ServerConnectivity;
  className?: string;
  nameClassName?: string;
};

function ServerLabel({
  name,
  connectivity = "offline",
  className,
  nameClassName,
}: ServerLabelProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <ServerConnectivityIcon status={connectivity} />
      <span className={cn("truncate", nameClassName)}>{name}</span>
    </div>
  );
}

export { ServerLabel };

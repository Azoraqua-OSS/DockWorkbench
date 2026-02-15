import { PlugZap, RefreshCw, TriangleAlert, Unplug } from "lucide-react";
import type { ComponentType } from "react";
import {
  IconTextButton,
  type IconTextButtonProps,
} from "@/components/custom/IconTextButton";
import { cn } from "@/lib/utils";

export type StatusButtonVariant =
  | "connected"
  | "disconnected"
  | "syncing"
  | "error";
export type StatusButtonProps = Omit<
  IconTextButtonProps,
  "icon" | "label" | "variant" | "size"
> & {
  variant: StatusButtonVariant;
};

const STATUS_CONTENT: Record<
  StatusButtonVariant,
  { icon: ComponentType<{ className?: string }>; label: string }
> = {
  connected: { icon: PlugZap, label: "Connected" },
  disconnected: { icon: Unplug, label: "Disconnected" },
  syncing: { icon: RefreshCw, label: "Syncing" },
  error: { icon: TriangleAlert, label: "Error" },
};

function StatusButton({ variant, className, ...props }: StatusButtonProps) {
  const { icon: Icon, label } = STATUS_CONTENT[variant];
  const iconClassName = cn(
    "size-[1em] shrink-0 align-middle",
    variant === "syncing" && "animate-spin",
  );

  return (
    <IconTextButton
      {...props}
      icon={<Icon className={iconClassName} />}
      label={label}
      variant="ghost"
      size="xs"
      className={className}
    />
  );
}

export { StatusButton };

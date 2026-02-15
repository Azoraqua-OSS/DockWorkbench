import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type IconTextButtonProps = Omit<
  ComponentProps<typeof Button>,
  "children"
> & {
  icon: ReactNode;
  label: ReactNode;
};

function IconTextButton({
  icon,
  label,
  className,
  variant = "ghost",
  size = "xs",
  ...props
}: IconTextButtonProps) {
  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      className={cn(
        "text-xs inline-flex items-center gap-1 leading-none",
        className,
      )}
    >
      {icon}
      <span className="leading-none text-sm">{label}</span>
    </Button>
  );
}

export { IconTextButton };

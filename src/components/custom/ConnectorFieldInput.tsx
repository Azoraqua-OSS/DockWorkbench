import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type ConnectorFieldInputProps = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  error?: string;
  warning?: string;
  onValueChange: (nextValue: string) => void;
};

function ConnectorFieldInput({
  id,
  label,
  value,
  placeholder,
  inputMode,
  error,
  warning,
  onValueChange,
}: ConnectorFieldInputProps) {
  return (
    <>
      <Label htmlFor={id} className="text-muted-foreground">
        {label}
      </Label>
      <div className="space-y-1">
        <Input
          id={id}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          aria-invalid={Boolean(error)}
          className={cn(
            warning &&
              "border-amber-500/60 focus-visible:border-amber-500 focus-visible:ring-amber-500/20",
          )}
        />
        {error ? (
          <p className="text-destructive text-xs" role="alert">
            {error}
          </p>
        ) : null}
        {!error && warning ? (
          <p className="text-xs text-amber-500">{warning}</p>
        ) : null}
      </div>
    </>
  );
}

export { ConnectorFieldInput };

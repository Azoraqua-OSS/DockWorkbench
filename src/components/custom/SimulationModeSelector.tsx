import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ConnectionSimulationMode = "random" | "success" | "failure";

export type SimulationModeSelectorProps = {
  value: ConnectionSimulationMode;
  onValueChange: (mode: ConnectionSimulationMode) => void;
  className?: string;
  disabled?: boolean;
};

const MODE_OPTIONS: {
  value: ConnectionSimulationMode;
  label: string;
}[] = [
  { value: "random", label: "Random" },
  { value: "success", label: "Force success" },
  { value: "failure", label: "Force failure" },
];

function SimulationModeSelector({
  value,
  onValueChange,
  className,
  disabled = false,
}: SimulationModeSelectorProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {MODE_OPTIONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          size="sm"
          variant={value === option.value ? "secondary" : "outline"}
          onClick={() => onValueChange(option.value)}
          aria-pressed={value === option.value}
          disabled={disabled}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

export { SimulationModeSelector };

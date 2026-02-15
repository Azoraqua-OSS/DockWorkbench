import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import type { ConnectionSimulationMode } from "./SimulationModeSelector";
import { SimulationModeSelector } from "./SimulationModeSelector";

const meta = {
  title: "Custom/SimulationModeSelector",
  component: SimulationModeSelector,
  tags: ["autodocs"],
  args: {
    value: "random",
    onValueChange: (_mode: ConnectionSimulationMode) => undefined,
  },
  argTypes: {
    value: {
      control: {
        type: "select",
        options: ["random", "success", "failure"],
      },
    },
    onValueChange: { action: "mode changed" },
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SimulationModeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Random: Story = {};

export const Success: Story = {
  args: {
    value: "success",
  },
};

export const Failure: Story = {
  args: {
    value: "failure",
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <SimulationModeSelector
        {...args}
        value={value}
        onValueChange={(nextValue) => {
          setValue(nextValue);
          args.onValueChange?.(nextValue);
        }}
      />
    );
  },
};

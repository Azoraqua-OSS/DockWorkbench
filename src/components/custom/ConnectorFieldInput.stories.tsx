import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ConnectorFieldInput } from "./ConnectorFieldInput";

const meta = {
  title: "Custom/ConnectorFieldInput",
  component: ConnectorFieldInput,
  tags: ["autodocs"],
  args: {
    id: "local-name",
    label: "Connection name",
    value: "Local Docker",
    placeholder: "Local Docker",
    onValueChange: (_nextValue: string) => undefined,
  },
  argTypes: {
    onValueChange: { action: "value changed" },
  },
  parameters: {
    layout: "padded",
  },
  render: (args) => (
    <div className="grid max-w-3xl gap-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center sm:gap-x-4">
      <ConnectorFieldInput {...args} />
    </div>
  ),
} satisfies Meta<typeof ConnectorFieldInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Warning: Story = {
  args: {
    warning:
      "SSH to localhost is usually unnecessary. Prefer Local Socket when available.",
  },
};

export const ErrorState: Story = {
  args: {
    error: "Connection name is required.",
    value: "",
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <div className="grid max-w-3xl gap-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center sm:gap-x-4">
        <ConnectorFieldInput
          {...args}
          value={value}
          onValueChange={(nextValue) => {
            setValue(nextValue);
            args.onValueChange?.(nextValue);
          }}
        />
      </div>
    );
  },
};

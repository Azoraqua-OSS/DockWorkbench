"use client";

import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import {
  CONNECTOR_IMPLEMENTATIONS,
  CONNECTOR_ORDER,
  createInitialConnectorValues,
  hasDuplicateServerConnection,
  type PreparedConnectorConnection,
  validateConnectorValues,
} from "@/app/_connectors";
import { ConnectorFieldInput } from "@/components/custom/ConnectorFieldInput";
import {
  type ConnectionSimulationMode,
  SimulationModeSelector,
} from "@/components/custom/SimulationModeSelector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ServerProtocol } from "@/stores/server-store";
import { useServerStore } from "@/stores/server-store";

type ConnectorSubmitState = Record<ServerProtocol, boolean>;

const createInitialConnectorSubmitState = (): ConnectorSubmitState =>
  CONNECTOR_ORDER.reduce((state, connectorId) => {
    state[connectorId] = false;
    return state;
  }, {} as ConnectorSubmitState);

function AddServerCard() {
  const addServer = useServerStore((state) => state.addServer);
  const servers = useServerStore((state) => state.servers);
  const [connectorValues, setConnectorValues] = useState(
    createInitialConnectorValues,
  );
  const [submittedConnectors, setSubmittedConnectors] = useState(
    createInitialConnectorSubmitState,
  );
  const [simulationMode, setSimulationMode] =
    useState<ConnectionSimulationMode>("random");
  const [isConnecting, setIsConnecting] = useState(false);

  const shouldSimulatedConnectionSucceed = () => {
    if (simulationMode === "success") {
      return true;
    }
    if (simulationMode === "failure") {
      return false;
    }
    return Math.random() >= 0.5;
  };

  const connectWithSimulation = async (
    connection: PreparedConnectorConnection,
  ) => {
    if (isConnecting) {
      return;
    }

    setIsConnecting(true);

    const loadingToastId = toast.loading(
      `Checking connection to ${connection.endpoint}...`,
    );

    await new Promise((resolve) => {
      setTimeout(resolve, 800);
    });

    toast.dismiss(loadingToastId);

    const isConnected = shouldSimulatedConnectionSucceed();

    if (isConnected) {
      addServer(connection);
      toast.success(`Connected to ${connection.name}.`);
    } else {
      toast.error(
        `Could not connect to ${connection.name}. Check configuration and retry.`,
      );
    }

    setIsConnecting(false);
  };

  const updateConnectorField = (
    connectorId: ServerProtocol,
    fieldKey: string,
    fieldValue: string,
  ) => {
    setConnectorValues((values) => ({
      ...values,
      [connectorId]: {
        ...values[connectorId],
        [fieldKey]: fieldValue,
      },
    }));
  };

  const connectConnector = async (
    event: FormEvent<HTMLFormElement>,
    connectorId: ServerProtocol,
  ) => {
    event.preventDefault();
    setSubmittedConnectors((state) => ({ ...state, [connectorId]: true }));

    const validation = validateConnectorValues(
      connectorId,
      connectorValues[connectorId],
      servers,
    );
    if (!validation.isValid) {
      const fieldCount = Object.keys(validation.errors).length;
      toast.error(
        `Please fix ${fieldCount} field${fieldCount === 1 ? "" : "s"} before connecting.`,
      );
      return;
    }

    const warningMessages = Object.values(validation.warnings);
    if (warningMessages.length > 0) {
      toast.warning(warningMessages[0]);
    }

    const connector = CONNECTOR_IMPLEMENTATIONS[connectorId];
    const result = connector.createConnection(connectorValues[connectorId]);
    if (!result.ok) {
      toast.warning(result.errorMessage);
      return;
    }
    if (hasDuplicateServerConnection(servers, result.connection)) {
      toast.error(
        "A server with the same connection details already exists. Duplicate connections are not allowed.",
      );
      return;
    }

    await connectWithSimulation(result.connection);
  };

  return (
    <Card className="border-border/70">
      <CardHeader className="space-y-2">
        <CardTitle>New Connection</CardTitle>
        <CardDescription>
          Choose one connector and provide only the fields needed for it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border/70 bg-muted/20 px-3 py-2">
          <div>
            <p className="text-sm font-medium">Simulated connection result</p>
            <p className="text-xs text-muted-foreground">
              Pick random or force a success/failure outcome.
            </p>
          </div>
          <SimulationModeSelector
            value={simulationMode}
            onValueChange={setSimulationMode}
            disabled={isConnecting}
          />
        </div>

        <Tabs defaultValue="local" className="gap-5">
          <TabsList className="h-auto w-full grid-cols-1 p-1 sm:grid sm:grid-cols-3">
            {CONNECTOR_ORDER.map((connectorId) => {
              const connector = CONNECTOR_IMPLEMENTATIONS[connectorId];
              const ConnectorIcon = connector.icon;

              return (
                <TabsTrigger
                  key={connector.id}
                  value={connector.id}
                  className="justify-start sm:justify-center"
                >
                  <ConnectorIcon className="size-4" />
                  {connector.title}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {CONNECTOR_ORDER.map((connectorId) => {
            const connector = CONNECTOR_IMPLEMENTATIONS[connectorId];
            const ConnectIcon = connector.connectIcon;
            const validation = validateConnectorValues(
              connector.id,
              connectorValues[connector.id],
              servers,
            );
            const showErrors = submittedConnectors[connector.id];

            return (
              <TabsContent key={connector.id} value={connector.id}>
                <form
                  className="space-y-5"
                  onSubmit={(event) => connectConnector(event, connector.id)}
                >
                  <p className="text-sm text-muted-foreground">
                    {connector.description}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center sm:gap-x-4">
                    {connector.fields.map((field) => {
                      const fieldError = showErrors
                        ? validation.errors[field.key]
                        : undefined;
                      const fieldWarning = fieldError
                        ? undefined
                        : validation.warnings[field.key];

                      return (
                        <ConnectorFieldInput
                          key={`${connector.id}-${field.key}`}
                          id={`${connector.id}-${field.key}`}
                          label={field.label}
                          value={connectorValues[connector.id][field.key] ?? ""}
                          onValueChange={(nextValue) =>
                            updateConnectorField(
                              connector.id,
                              field.key,
                              nextValue,
                            )
                          }
                          placeholder={field.placeholder}
                          inputMode={field.inputMode}
                          error={fieldError}
                          warning={fieldWarning}
                        />
                      );
                    })}
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isConnecting}>
                      <ConnectIcon className="size-4" />
                      {connector.connectLabel}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export { AddServerCard };

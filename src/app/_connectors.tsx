import type { LucideIcon } from "lucide-react";
import {
  Cable,
  HardDrive,
  Link as LinkIcon,
  Server,
  Shield,
} from "lucide-react";
import {
  connectionName as connectionNameSchema,
  http as httpSchema,
  socket as socketSchema,
  ssh as sshSchema,
} from "@/lib/schemas/connectors";
import type { ServerConnection, ServerProtocol } from "@/stores/server-store";

type ConnectorFieldDefinition = {
  key: string;
  label: string;
  placeholder?: string;
  inputMode?:
    | "text"
    | "numeric"
    | "decimal"
    | "tel"
    | "search"
    | "email"
    | "url";
};

export type PreparedConnectorConnection = {
  name: string;
  protocol: ServerProtocol;
  endpoint: string;
};

export type ConnectorValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
};

type ConnectorBuildResult =
  | { ok: true; connection: PreparedConnectorConnection }
  | { ok: false; errorMessage: string };

type ConnectorImplementation = {
  id: ServerProtocol;
  title: string;
  description: string;
  icon: LucideIcon;
  connectIcon: LucideIcon;
  connectLabel: string;
  fields: ConnectorFieldDefinition[];
  defaults: Record<string, string>;
  createConnection: (values: Record<string, string>) => ConnectorBuildResult;
};

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

const appendWarning = (
  warnings: Record<string, string>,
  field: string,
  message: string,
) => {
  warnings[field] = warnings[field] ? `${warnings[field]} ${message}` : message;
};

const firstIssueMessage = (
  issues: Array<{ message: string }>,
  fallback: string,
) => issues[0]?.message ?? fallback;

const normalizeHost = (host: string) =>
  host
    .trim()
    .replace(/^\[|\]$/g, "")
    .toLowerCase();

export const validateConnectorValues = (
  connectorId: ServerProtocol,
  values: Record<string, string>,
  existingServers: ServerConnection[] = [],
): ConnectorValidationResult => {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  const nameResult = connectionNameSchema.safeParse(values.name ?? "");
  if (!nameResult.success) {
    errors.name = firstIssueMessage(
      nameResult.error.issues,
      "Connection name is invalid.",
    );
  }
  if (nameResult.success) {
    const normalizedName = nameResult.data.trim().toLowerCase();
    const hasDuplicateName = existingServers.some(
      (server) => server.name.trim().toLowerCase() === normalizedName,
    );
    if (hasDuplicateName) {
      warnings.name =
        "A server with this name already exists. Allowed, but can be confusing.";
    }
  }

  if (connectorId === "local") {
    const localResult = socketSchema
      .pick({ path: true })
      .safeParse({ path: values.socketPath ?? "" });
    if (!localResult.success) {
      errors.socketPath = firstIssueMessage(
        localResult.error.issues,
        "Socket path is invalid.",
      );
    }
  }

  if (connectorId === "ssh") {
    const sshResult = sshSchema
      .pick({ host: true, user: true, port: true })
      .safeParse({
        host: values.host ?? "",
        user: values.user ?? "",
        port: values.port ?? "",
      });
    if (!sshResult.success) {
      for (const issue of sshResult.error.issues) {
        const field = String(issue.path[0] ?? "");
        if (!field || errors[field]) {
          continue;
        }
        errors[field] = issue.message;
      }
    }

    const host = values.host?.trim();
    if (host && !errors.host && LOOPBACK_HOSTS.has(normalizeHost(host))) {
      warnings.host =
        "SSH to localhost is usually unnecessary. Prefer Local Socket when available.";
    }
  }

  if (connectorId === "http") {
    const httpResult = httpSchema.pick({ url: true }).safeParse({
      url: values.url ?? "",
    });
    if (!httpResult.success) {
      errors.url = firstIssueMessage(
        httpResult.error.issues,
        "Endpoint URL is invalid.",
      );
    } else {
      const parsed = new URL(httpResult.data.url);
      if (LOOPBACK_HOSTS.has(normalizeHost(parsed.hostname))) {
        appendWarning(
          warnings,
          "url",
          "HTTP(S) to localhost is usually unnecessary. Prefer Local Socket when available.",
        );
      }
      if (parsed.protocol === "http:") {
        appendWarning(
          warnings,
          "url",
          "Unencrypted HTTP is discouraged. Prefer HTTPS for remote endpoints.",
        );
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
};

const normalizeEndpointForProtocol = (
  protocol: ServerProtocol,
  endpoint: string,
) => {
  const trimmedEndpoint = endpoint.trim();
  if (protocol === "local") {
    return trimmedEndpoint;
  }

  try {
    const parsed = new URL(trimmedEndpoint);
    const username = parsed.username ? `${parsed.username}@` : "";
    const host = parsed.hostname.toLowerCase();
    const port = parsed.port ? `:${parsed.port}` : "";
    const pathname = parsed.pathname === "/" ? "" : parsed.pathname;
    return `${parsed.protocol.toLowerCase()}//${username}${host}${port}${pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return trimmedEndpoint.toLowerCase();
  }
};

export const hasDuplicateServerConnection = (
  existingServers: ServerConnection[],
  candidateConnection: PreparedConnectorConnection,
) =>
  existingServers.some(
    (server) =>
      server.protocol === candidateConnection.protocol &&
      normalizeEndpointForProtocol(server.protocol, server.endpoint) ===
        normalizeEndpointForProtocol(
          candidateConnection.protocol,
          candidateConnection.endpoint,
        ),
  );

const localConnector: ConnectorImplementation = {
  id: "local",
  title: "Local Socket",
  description: "Connect to a Docker daemon exposed as a Unix domain socket.",
  icon: HardDrive,
  connectIcon: Cable,
  connectLabel: "Connect local socket",
  fields: [
    {
      key: "name",
      label: "Connection name",
    },
    {
      key: "socketPath",
      label: "Socket path",
      placeholder: "/var/run/docker.sock",
    },
  ],
  defaults: {
    name: "Local Docker",
    socketPath: "/var/run/docker.sock",
  },
  createConnection: (values) => ({
    ok: true,
    connection: {
      name: values.name?.trim() || "Local Docker",
      protocol: "local",
      endpoint: values.socketPath?.trim() || "/var/run/docker.sock",
    },
  }),
};

const sshConnector: ConnectorImplementation = {
  id: "ssh",
  title: "SSH",
  description: "Connect through SSH to a remote host that runs Docker.",
  icon: Shield,
  connectIcon: Server,
  connectLabel: "Connect over SSH",
  fields: [
    {
      key: "name",
      label: "Connection name",
    },
    {
      key: "host",
      label: "Host",
      placeholder: "docker.example.com",
    },
    {
      key: "user",
      label: "User",
    },
    {
      key: "port",
      label: "Port",
      inputMode: "numeric",
    },
  ],
  defaults: {
    name: "SSH Docker Host",
    host: "",
    user: "root",
    port: "22",
  },
  createConnection: (values) => {
    const host = values.host?.trim();
    if (!host) {
      return {
        ok: false,
        errorMessage: "Please provide an SSH host.",
      };
    }

    const port = Number.parseInt(values.port, 10) || 22;

    return {
      ok: true,
      connection: {
        name: values.name?.trim() || "SSH Docker Host",
        protocol: "ssh",
        endpoint: `ssh://${values.user?.trim() || "root"}@${host}:${port}`,
      },
    };
  },
};

const httpConnector: ConnectorImplementation = {
  id: "http",
  title: "HTTP(S)",
  description: "Connect to a remote Docker API endpoint over HTTP or HTTPS.",
  icon: LinkIcon,
  connectIcon: Cable,
  connectLabel: "Connect HTTP(S)",
  fields: [
    {
      key: "name",
      label: "Connection name",
    },
    {
      key: "url",
      label: "Endpoint URL",
      placeholder: "https://docker.example.com:2376",
      inputMode: "url",
    },
  ],
  defaults: {
    name: "Remote Docker API",
    url: "http://localhost:2375",
  },
  createConnection: (values) => {
    const url = values.url?.trim();
    if (!url) {
      return {
        ok: false,
        errorMessage: "Please provide an HTTP(S) endpoint URL.",
      };
    }

    return {
      ok: true,
      connection: {
        name: values.name?.trim() || "Remote Docker API",
        protocol: "http",
        endpoint: url,
      },
    };
  },
};

export const CONNECTOR_ORDER = [
  "local",
  "ssh",
  "http",
] satisfies ServerProtocol[];

export const CONNECTOR_IMPLEMENTATIONS: Record<
  ServerProtocol,
  ConnectorImplementation
> = {
  local: localConnector,
  ssh: sshConnector,
  http: httpConnector,
};

export type ConnectorFormValues = Record<
  ServerProtocol,
  Record<string, string>
>;

export const createInitialConnectorValues = (): ConnectorFormValues =>
  CONNECTOR_ORDER.reduce((values, connectorId) => {
    values[connectorId] = {
      ...CONNECTOR_IMPLEMENTATIONS[connectorId].defaults,
    };
    return values;
  }, {} as ConnectorFormValues);

import { type ZodRawShape, z } from "zod";

function createConnector<
  const TName extends string,
  const TShape extends ZodRawShape,
>(name: TName, schema: TShape) {
  return z.strictObject({
    name: z.literal(name),
    ...schema,
  });
}

const connectionName = z
  .string()
  .trim()
  .min(1, "Connection name is required.")
  .max(80, "Connection name must be 80 characters or fewer.");

const socket = createConnector("socket", {
  path: z
    .string()
    .trim()
    .min(1, "Socket path is required.")
    .default("/var/run/docker.sock"),
});
type SocketSchema = z.infer<typeof socket>;

const ssh = createConnector("ssh", {
  host: z
    .string()
    .trim()
    .min(1, "Host is required.")
    .refine(
      (host) =>
        z.hostname().safeParse(host).success ||
        z.ipv4().safeParse(host).success ||
        z.ipv6().safeParse(host).success,
      "Host must be a valid hostname or IP address.",
    ),
  user: z.string().trim().min(1, "User is required.").default("root"),
  port: z.coerce
    .number()
    .int("Port must be an integer.")
    .min(1, "Port must be between 1 and 65535.")
    .max(65535, "Port must be between 1 and 65535.")
    .default(22),
});
type SSHSchema = z.infer<typeof ssh>;

const http = createConnector("http", {
  url: z
    .url("Please provide a valid URL.")
    .refine(
      (url) => url.startsWith("http://") || url.startsWith("https://"),
      "URL must start with http:// or https://.",
    )
    .default("http://localhost:2375"),
});
type HTTPSchema = z.infer<typeof http>;

export {
  connectionName,
  socket,
  ssh,
  http,
  type SocketSchema,
  type SSHSchema,
  type HTTPSchema,
};

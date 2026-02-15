import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ServerProtocol = "local" | "ssh" | "http";
export type ServerConnectivity = "online" | "offline";

export type ServerConnection = {
  id: string;
  name: string;
  protocol: ServerProtocol;
  endpoint: string;
  connectivity: ServerConnectivity;
  createdAt: number;
};

type ServerStoreState = {
  servers: ServerConnection[];
  selectedServerId: string | null;
  addServer: (
    server: Omit<ServerConnection, "id" | "createdAt" | "connectivity"> & {
      id?: string;
      connectivity?: ServerConnectivity;
    },
  ) => void;
  setSelectedServer: (id: string | null) => void;
  removeServer: (id: string) => void;
};

const createServerId = () =>
  `srv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const DEFAULT_STATE = {
  servers: [] as ServerConnection[],
  selectedServerId: null as string | null,
};

export const useServerStore = create<ServerStoreState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      addServer: (server) => {
        const nextServer: ServerConnection = {
          ...server,
          id: server.id ?? createServerId(),
          connectivity: server.connectivity ?? "online",
          createdAt: Date.now(),
        };

        set((state) => ({
          servers: [nextServer, ...state.servers],
          selectedServerId: state.selectedServerId ?? nextServer.id,
        }));
      },
      setSelectedServer: (id) => {
        set({ selectedServerId: id });
      },
      removeServer: (id) => {
        set((state) => {
          const servers = state.servers.filter((server) => server.id !== id);
          const selectedServerId =
            state.selectedServerId === id
              ? (servers.at(0)?.id ?? null)
              : state.selectedServerId;

          return {
            servers,
            selectedServerId,
          };
        });
      },
    }),
    {
      name: "dockworkbench-server-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        servers: state.servers,
        selectedServerId: state.selectedServerId,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<ServerStoreState>;
        return {
          ...currentState,
          ...persisted,
          servers: (persisted.servers ?? []).map((server) => ({
            ...server,
            connectivity: server.connectivity ?? "offline",
          })),
        };
      },
    },
  ),
);

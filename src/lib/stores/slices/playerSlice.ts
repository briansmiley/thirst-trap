import { type StateCreator } from "zustand";
import { type AppStore, type InitAppStoreProps } from "@/lib/stores/appStore";
import { Player } from "@/app/types";

export interface PlayerSlice {
  players: Player[];
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Pick<Player, "playerId"> & Partial<Player>) => void;
}

export const createPlayerSlice: (
  initProps: InitAppStoreProps
) => StateCreator<AppStore, [], [], PlayerSlice> =
  ({ players }) =>
  (set, get) => ({
    players,
    addPlayer: (player) => {
      set({ players: [...players, player]});
    },
    updatePlayer: (player) => {
      const { players } = get();
      set({
        players: players.map((p) =>
          p.playerId === player.playerId ? {...p, ...player} : p
        ),
      });
    },
  });

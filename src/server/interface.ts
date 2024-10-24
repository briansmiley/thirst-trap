import { Player } from "@/app/types";

export interface ServerToClientEvents {
  addPlayer: (player: Player) => void;
}

export interface ClientToServerEvents {
  addPlayer: (
    player: Pick<Player, "name" | "playerId" | "picture">,
    callback: (response: { success: boolean; message?: string }) => void
  ) => void;
}

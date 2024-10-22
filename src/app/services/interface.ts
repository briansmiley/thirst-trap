import { Faction } from "@prisma/client";
import { Player } from "../types";
export type PlayerServiceT = {
  create: (player: Player) => Promise<Player>;
  update: (player: Player) => Promise<Player>;
  delete: (playerId: string) => Promise<void>;
  get: (playerId: string) => Promise<Player | null>;
  getAll: () => Promise<Player[]>;
  pauseAt: (playerId: string, pauseAt: Date) => Promise<Player>;
  pause: (playerId: string) => Promise<Player>;
  pauseAll: () => Promise<Player[]>;
  resume: (playerId: string) => Promise<Player>;
  resumeAll: () => Promise<Player[]>;
  recruit: (playerId: string, faction: Faction) => Promise<Player>;
  /**Reset the expiration time of a player**/
  resetExpirationTimer: (playerId: string, minutes: number) => Promise<Player>;
};

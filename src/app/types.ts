type Faction = "VAMPIRE" | "JACKAL" | "NEUTRAL" | "GHOST";

export type Player = {
  name: string;
  playerId: string;
  picture?: string | null;
  faction: Faction;
  isPaused: boolean;
  pausedAt: Date | null;
  expirationTime: Date | null;
  kills: number;
};

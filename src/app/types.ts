export type Faction = "VAMPIRE" | "JACKAL" | "NEUTRAL" | "GHOST";

export type Player = {
  name: string;
  playerId: string;
  picture: string;
  faction: Faction;
  isPaused: boolean;
  pausedAt: Date | null;
  expirationTime: Date | null;
  kills: number;
  recruits: number;
};

export type Settings = {
  maxDeathTimer: number;
  killTimeCredit: number;
  recruitTimeCredit: number;
};

type Faction = "VAMPIRE" | "HUNTER" | "NEUTRAL" | "GHOST";

export type Player = {
  id: string;
  name: string;
  playerId: string;
  picture?: string;
  faction: Faction;
  paused: boolean;
  expirationTime?: Date;
};

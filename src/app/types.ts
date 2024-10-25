export type Faction = 'VAMPIRE' | 'JACKAL' | 'NEUTRAL' | 'GHOST'

export type Player = {
  name: string
  playerId: string
  picture: string
  faction: Faction
  isPaused: boolean
  pausedAt: Date
  expirationTime: Date
  kills: number
  recruits: number
}

export type Settings = {
  maxDeathTimer: number
  killTimeCredit: number
  recruitTimeCredit: number
}

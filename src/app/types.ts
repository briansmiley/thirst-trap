export type Faction = 'VAMPIRE' | 'JACKAL' | 'HUMAN' | 'GHOST'

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
  flags: string[]
  marshmallow: boolean
}

export type Settings = {
  maxDeathTimer: number
  killTimeCredit: number
  recruitTimeCredit: number
  startingTimer: number
}

'use client'

import type { Player, Settings } from '@/app/types'

export const DEFAULT_SETTINGS: Settings = {
  maxDeathTimer: 45,
  killTimeCredit: 30,
  recruitTimeCredit: 20,
  startingTimer: 30,
}

type RawPlayer = Omit<Player, 'pausedAt' | 'expirationTime'> & {
  pausedAt: string
  expirationTime: string
}

type RawSeed = {
  players: RawPlayer[]
  settings: Settings[]
}

// Dynamic import keeps the 1.8MB seed (mostly base64 avatars) out of the main
// chunk; it only loads on first visit when localStorage is empty.
export async function loadSeed(): Promise<{
  players: Player[]
  settings: Settings
}> {
  const mod = await import('./seed.json')
  const seed = (mod.default ?? mod) as unknown as RawSeed
  const players: Player[] = seed.players.map((p) => ({
    name: p.name,
    playerId: p.playerId,
    picture: p.picture,
    faction: p.faction,
    isPaused: p.isPaused,
    pausedAt: new Date(p.pausedAt),
    expirationTime: new Date(p.expirationTime),
    kills: p.kills,
    recruits: p.recruits,
    flags: p.flags,
    marshmallow: p.marshmallow,
  }))
  const settings = seed.settings[0] ?? DEFAULT_SETTINGS
  return { players, settings }
}

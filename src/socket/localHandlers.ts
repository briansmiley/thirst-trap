'use client'

import type { Player, Faction, Settings } from '@/app/types'

type Snapshot = { players: Player[]; settings: Settings }
type StateGetter = () => Snapshot

type PlayerPatch = Partial<Player> & Pick<Player, 'playerId'>

export type LocalEvent =
  | { type: 'addPlayer'; player: Player }
  | { type: 'deletePlayer'; playerId: string }
  | { type: 'updatePlayer'; player: PlayerPatch }
  | { type: 'updateAllPlayers'; players: PlayerPatch[] }
  | { type: 'updateSettings'; settings: Partial<Settings> }

const min = (m: number) => m * 60000

export function createHandlers(getState: StateGetter) {
  const find = (id: string) => getState().players.find((p) => p.playerId === id)

  // Mirrors playerService.grantTime in src/server/services/player.ts
  const grantTimePatch = (
    playerId: string,
    additionalMinutes: number
  ): PlayerPatch | null => {
    const p = find(playerId)
    if (!p || !p.expirationTime) return null
    const additional = min(additionalMinutes)
    const maxTimer = min(getState().settings.maxDeathTimer)
    const now = Date.now()
    const prev =
      p.expirationTime.getTime() < now ? now : p.expirationTime.getTime()
    const newExp = new Date(Math.min(prev + additional, now + maxTimer))
    return { playerId, expirationTime: newExp }
  }

  // Mirrors playerService.takeTime
  const takeTimePatch = (
    playerId: string,
    deductionMinutes: number
  ): PlayerPatch | null => {
    const p = find(playerId)
    if (!p) return null
    const deductionFloor = min(5)
    const deduction = min(deductionMinutes)
    const remaining = p.expirationTime
      ? p.expirationTime.getTime() - Date.now()
      : 0
    const newRemaining =
      remaining < deductionFloor
        ? remaining
        : Math.max(remaining - deduction, deductionFloor)
    return {
      playerId,
      expirationTime: new Date(Date.now() + newRemaining),
    }
  }

  return {
    addPlayer: (
      input: Pick<Player, 'name' | 'playerId' | 'picture'>
    ): LocalEvent[] => {
      const now = new Date()
      const player: Player = {
        ...input,
        faction: 'HUMAN',
        isPaused: true,
        pausedAt: now,
        expirationTime: new Date(
          now.getTime() + min(getState().settings.maxDeathTimer)
        ),
        kills: 0,
        recruits: 0,
        flags: [],
        marshmallow: false,
      }
      return [{ type: 'addPlayer', player }]
    },

    deletePlayer: (playerId: string): LocalEvent[] => [
      { type: 'deletePlayer', playerId },
    ],

    updatePlayer: (player: PlayerPatch): LocalEvent[] => [
      { type: 'updatePlayer', player },
    ],

    pausePlayer: (playerId: string): LocalEvent[] => [
      {
        type: 'updatePlayer',
        player: { playerId, isPaused: true, pausedAt: new Date() },
      },
    ],

    pauseAll: (): LocalEvent[] => {
      const now = new Date()
      const patches = getState().players.map((p) => ({
        playerId: p.playerId,
        isPaused: true,
        pausedAt: now,
      }))
      return [{ type: 'updateAllPlayers', players: patches }]
    },

    resumePlayer: (playerId: string): LocalEvent[] => {
      const p = find(playerId)
      if (!p) throw new Error('Player not found')
      const now = Date.now()
      const pauseDuration = p.pausedAt ? now - p.pausedAt.getTime() : 0
      const defaultExp = new Date(
        now + min(getState().settings.maxDeathTimer)
      )
      const newExp = p.expirationTime
        ? new Date(p.expirationTime.getTime() + pauseDuration)
        : defaultExp
      return [
        {
          type: 'updatePlayer',
          player: { playerId, isPaused: false, expirationTime: newExp },
        },
      ]
    },

    resumeAll: (): LocalEvent[] => {
      const now = Date.now()
      const patches = getState()
        .players.filter((p) => p.isPaused)
        .map((p) => {
          if (!p.pausedAt || !p.expirationTime) {
            return { playerId: p.playerId, isPaused: false }
          }
          return {
            playerId: p.playerId,
            isPaused: false,
            expirationTime: new Date(
              p.expirationTime.getTime() + (now - p.pausedAt.getTime())
            ),
          }
        })
      return [{ type: 'updateAllPlayers', players: patches }]
    },

    recruitPlayer: ({
      playerId,
      faction,
    }: {
      playerId: string
      faction: Faction
    }): LocalEvent[] => {
      const now = new Date()
      const startingExp = min(getState().settings.startingTimer)
      return [
        {
          type: 'updatePlayer',
          player: {
            playerId,
            faction,
            expirationTime: new Date(now.getTime() + startingExp),
            pausedAt: now,
          },
        },
      ]
    },

    grantTime: (playerId: string, minutes: number): LocalEvent[] => {
      const patch = grantTimePatch(playerId, minutes)
      return patch ? [{ type: 'updatePlayer', player: patch }] : []
    },

    grantTimeToAll: (minutes: number): LocalEvent[] => {
      const now = Date.now()
      const patches = getState()
        .players.filter(
          (p) =>
            (p.faction === 'JACKAL' || p.faction === 'VAMPIRE') &&
            p.expirationTime &&
            p.expirationTime.getTime() > now
        )
        .map((p) => grantTimePatch(p.playerId, minutes))
        .filter((x): x is PlayerPatch => !!x)
      return [{ type: 'updateAllPlayers', players: patches }]
    },

    takeTime: (playerId: string, minutes: number): LocalEvent[] => {
      const patch = takeTimePatch(playerId, minutes)
      return patch ? [{ type: 'updatePlayer', player: patch }] : []
    },

    takeTimeFromAll: (minutes: number): LocalEvent[] => {
      const patches = getState()
        .players.filter(
          (p) => p.faction === 'JACKAL' || p.faction === 'VAMPIRE'
        )
        .map((p) => takeTimePatch(p.playerId, minutes))
        .filter((x): x is PlayerPatch => !!x)
      return [{ type: 'updateAllPlayers', players: patches }]
    },

    updateSettings: (settings: Partial<Settings>): LocalEvent[] => [
      { type: 'updateSettings', settings },
    ],

    creditKill: (playerId: string): LocalEvent[] => {
      const p = find(playerId)
      if (!p) return []
      const credit = getState().settings.killTimeCredit
      const grant = p.expirationTime ? grantTimePatch(playerId, credit) : null
      const merged: PlayerPatch = {
        playerId,
        kills: p.kills + 1,
        ...(grant ? { expirationTime: grant.expirationTime } : {}),
      }
      return [{ type: 'updatePlayer', player: merged }]
    },

    creditRecruit: (playerId: string): LocalEvent[] => {
      const p = find(playerId)
      if (!p) return []
      if (p.faction !== 'JACKAL') {
        throw new Error('Player is not a jackal and cannot recruit')
      }
      const credit = getState().settings.recruitTimeCredit
      const grant = p.expirationTime ? grantTimePatch(playerId, credit) : null
      const merged: PlayerPatch = {
        playerId,
        recruits: p.recruits + 1,
        ...(grant ? { expirationTime: grant.expirationTime } : {}),
      }
      return [{ type: 'updatePlayer', player: merged }]
    },

    removeKill: (playerId: string): LocalEvent[] => {
      const p = find(playerId)
      if (!p) return []
      return [
        { type: 'updatePlayer', player: { playerId, kills: p.kills - 1 } },
      ]
    },

    removeRecruit: (playerId: string): LocalEvent[] => {
      const p = find(playerId)
      if (!p) return []
      return [
        {
          type: 'updatePlayer',
          player: { playerId, recruits: p.recruits - 1 },
        },
      ]
    },

    addFlag: (playerId: string, flag: string): LocalEvent[] => {
      const p = find(playerId)
      if (!p) return []
      return [
        {
          type: 'updatePlayer',
          player: { playerId, flags: [...p.flags, flag] },
        },
      ]
    },

    updateFlags: (playerId: string, flags: string[]): LocalEvent[] => [
      { type: 'updatePlayer', player: { playerId, flags } },
    ],

    marshmallowProtocol: (
      playerId: string,
      marshmallow: boolean
    ): LocalEvent[] => {
      const p = find(playerId)
      if (!p) return []
      const patch: PlayerPatch = {
        playerId,
        marshmallow,
        isPaused: false,
      }
      if (p.faction === 'HUMAN') {
        patch.expirationTime = new Date()
      }
      return [{ type: 'updatePlayer', player: patch }]
    },
  }
}

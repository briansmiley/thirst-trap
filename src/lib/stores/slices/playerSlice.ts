import { type StateCreator } from 'zustand'
import { type AppStore, type InitAppStoreProps } from '@/lib/stores/appStore'
import { Player } from '@/app/types'

export interface PlayerSlice {
  players: Player[]
  addPlayer: (player: Player) => void
  updatePlayer: (player: Pick<Player, 'playerId'> & Partial<Player>) => void
}

export const createPlayerSlice: (
  initProps: InitAppStoreProps
) => StateCreator<AppStore, [], [], PlayerSlice> =
  ({ players }) =>
  (set, get) => ({
    players,
    addPlayer: (player) => {
      const { players } = get()
      set({
        players: [
          ...players,
          {
            ...player,
            pausedAt: new Date(player.pausedAt),
            expirationTime: new Date(player.expirationTime),
          },
        ],
      })
    },
    updatePlayer: (player) => {
      const { players } = get()
      if (player.pausedAt) {
        player.pausedAt = new Date(player.pausedAt)
      }
      if (player.expirationTime) {
        player.expirationTime = new Date(player.expirationTime)
      }
      set({
        players: players.map((p) =>
          p.playerId === player.playerId ? { ...p, ...player } : p
        ),
      })
    },
  })

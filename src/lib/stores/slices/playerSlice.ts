import { type StateCreator } from 'zustand'
import { type AppStore, type InitAppStoreProps } from '@/lib/stores/appStore'
import { Player } from '@/app/types'

export interface PlayerSlice {
  players: Player[]
  addPlayer: (player: Player) => void
  deletePlayer: (playerId: string) => void
  updatePlayer: (player: Pick<Player, 'playerId'> & Partial<Player>) => void
  updateAllPlayers: (
    players: (Pick<Player, 'playerId'> & Partial<Player>)[]
  ) => void
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
    deletePlayer: (playerId) => {
      const { players } = get()
      set({
        players: players.filter((p) => p.playerId !== playerId),
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
    updateAllPlayers: (updatedPlayers) => {
      const { players } = get()
      set({
        players: players.map((p) => {
          const updatedPlayer = updatedPlayers.find(
            (up) => up.playerId === p.playerId
          )
          if (updatedPlayer) {
            if (updatedPlayer.pausedAt) {
              updatedPlayer.pausedAt = new Date(updatedPlayer.pausedAt)
            }
            if (updatedPlayer.expirationTime) {
              updatedPlayer.expirationTime = new Date(
                updatedPlayer.expirationTime
              )
            }
            return { ...p, ...updatedPlayer }
          }
          return p
        }),
      })
    },
  })

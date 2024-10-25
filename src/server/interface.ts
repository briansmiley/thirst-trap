import { Player } from '@/app/types'

export interface ServerToClientEvents {
  addPlayer: (player: Player) => void
  updatePlayer: (player: Partial<Player> & Pick<Player, 'playerId'>) => void
  pausePlayer: (
    player: Pick<
      Player,
      'playerId' | 'isPaused' | 'expirationTime' | 'pausedAt'
    >
  ) => void
  resumePlayer: (
    player: Pick<
      Player,
      'playerId' | 'isPaused' | 'expirationTime' | 'pausedAt'
    >
  ) => void
}

export interface ClientToServerEvents {
  addPlayer: (
    player: Pick<Player, 'name' | 'playerId' | 'picture'>,
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  updatePlayer: (
    player: Partial<Player> & Pick<Player, 'playerId'>,
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  pausePlayer: (
    playerId: string,
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  resumePlayer: (
    playerId: string,
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
}

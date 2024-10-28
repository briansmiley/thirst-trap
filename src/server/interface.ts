import { Faction, type Player, type Settings } from '@/app/types'
import { type DisconnectDescription } from 'socket.io-client/build/esm/socket'
import { type Socket } from 'socket.io-client'

export interface DefaultServerToClientEvents {
  connect: () => void
  connect_error: (err: Error) => void
  disconnect: (
    reason: Socket.DisconnectReason,
    description?: DisconnectDescription
  ) => void
}

export interface ServerToClientEvents extends DefaultServerToClientEvents {
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
  recruitPlayer: (
    player: Omit<Player, 'picture' | 'kills' | 'recruits'>
  ) => void
  updateSettings: (settings: Partial<Settings>) => void
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
  recruitPlayer: (
    player: Pick<Player, 'playerId' | 'faction'>,
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  updateSettings: (
    settings: Partial<Settings>,
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
}

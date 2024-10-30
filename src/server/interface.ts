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
  deletePlayer: (playerId: string) => void
  updatePlayer: (player: Partial<Player> & Pick<Player, 'playerId'>) => void
  updateAllPlayers: (
    players: Partial<Player> & Pick<Player, 'playerId'>[]
  ) => void
  // pausePlayer: (player: Omit<Player, 'picture'>) => void
  // pauseAll: (players: Omit<Player, 'picture'>[]) => void
  // resumePlayer: (player: Omit<Player, 'picture'>) => void
  // resumeAll: (players: Omit<Player, 'picture'>[]) => void
  // recruitPlayer: (
  //   player: Omit<Player, 'picture' | 'kills' | 'recruits'>
  // ) => void
  updateSettings: (settings: Partial<Settings>) => void
}

export interface ClientToServerEvents {
  addPlayer: (
    player: Pick<Player, 'name' | 'playerId' | 'picture'>,
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  deletePlayer: (
    playerId: string,
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
  pauseAll: (
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  resumePlayer: (
    playerId: string,
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  resumeAll: (
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  recruitPlayer: (
    player: Pick<Player, 'playerId' | 'faction'>,
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  grantTime: (
    playerId: Player['playerId'],
    minutes: number,
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  takeTime: (
    playerId: Player['playerId'],
    minutes: number,
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  grantTimeToAll: (
    minutes: number,
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  takeTimeFromAll: (
    minutes: number,
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  updateSettings: (
    settings: Partial<Settings>,
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  creditKill: (
    playerId: Player['playerId'],
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  creditRecruit: (
    playerId: Player['playerId'],
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  removeKill: (
    playerId: Player['playerId'],
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  removeRecruit: (
    playerId: Player['playerId'],
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  addFlag: (
    playerId: Player['playerId'],
    flag: string,
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  updateFlags: (
    playerId: Player['playerId'],
    flags: string[],
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
  marshmallowProtocol: (
    playerId: Player['playerId'],
    marshmallow: boolean,
    callback: (response: { success: boolean; message?: string }) => void
  ) => void
}

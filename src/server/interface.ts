import { type Player, type Settings } from '@/app/types'
import { type DisconnectDescription } from 'socket.io-client/build/esm/socket'
import { type Socket } from 'socket.io-client'

export type EvtId = number

export interface DefaultServerToClientEvents {
  connect: () => void
  connect_error: (err: Error) => void
  disconnect: (
    reason: Socket.DisconnectReason,
    description?: DisconnectDescription
  ) => void
}

export interface ServerToClientEvents extends DefaultServerToClientEvents {
  addPlayer: ({ evtId, player }: { evtId: EvtId; player: Player }) => void
  deletePlayer: ({
    evtId,
    playerId,
  }: {
    evtId: EvtId
    playerId: string
  }) => void
  updatePlayer: ({
    evtId,
    player,
  }: {
    evtId: EvtId
    player: Partial<Player> & Pick<Player, 'playerId'>
  }) => void
  updateAllPlayers: ({
    evtId,
    players,
  }: {
    evtId: EvtId
    players: Partial<Player> & Pick<Player, 'playerId'>[]
  }) => void
  updateSettings: ({
    evtId,
    settings,
  }: {
    evtId: EvtId
    settings: Partial<Settings>
  }) => void
  reStore: ({
    evtId,
    players,
    settings,
  }: {
    evtId: EvtId
    players: Player[]
    settings: Settings
  }) => void
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

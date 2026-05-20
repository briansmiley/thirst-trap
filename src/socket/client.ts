'use client'

import { useEffect } from 'react'
import type { Socket } from 'socket.io-client'
import type {
  DefaultEventsMap,
  EventNames,
  EventsMap,
} from '@socket.io/component-emitter'
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  EvtId,
} from '@/server/interface'
import type { AppStoreApi } from '@/lib/stores/AppStoreProvider'
import { createHandlers, type LocalEvent } from './localHandlers'

// Local replacement for the original socket.io client. The exported `socket`
// keeps the same .emit / .on / .off / .id / .connected surface so existing
// call sites work unchanged, but mutations stay in-process and are routed
// straight back through the same event bus the StoreUpdater listens to.
//
// The original real-WebSocket client is preserved verbatim in
// src/socket/client.legacy.ts, and the matching server entry point in
// src/server/server.legacy.ts (run via the *:legacy npm scripts).

let storeRef: AppStoreApi | null = null

export function setLocalSocketStore(store: AppStoreApi) {
  storeRef = store
}

type Listener = (...args: unknown[]) => void
const bus = new Map<string, Set<Listener>>()

const busOn = (event: string, listener: Listener) => {
  let set = bus.get(event)
  if (!set) {
    set = new Set()
    bus.set(event, set)
  }
  set.add(listener)
}

const busOff = (event: string, listener: Listener) => {
  bus.get(event)?.delete(listener)
}

const busEmit = (event: string, ...args: unknown[]) => {
  const set = bus.get(event)
  if (!set) return
  for (const l of Array.from(set)) l(...args)
}

const publishEvents = (events: LocalEvent[]) => {
  for (const evt of events) {
    const evtId: EvtId = Date.now()
    switch (evt.type) {
      case 'addPlayer':
        busEmit('addPlayer', { evtId, player: evt.player })
        break
      case 'deletePlayer':
        busEmit('deletePlayer', { evtId, playerId: evt.playerId })
        break
      case 'updatePlayer':
        busEmit('updatePlayer', { evtId, player: evt.player })
        break
      case 'updateAllPlayers':
        busEmit('updateAllPlayers', { evtId, players: evt.players })
        break
      case 'updateSettings':
        busEmit('updateSettings', { evtId, settings: evt.settings })
        break
    }
  }
}

type Handlers = ReturnType<typeof createHandlers>
type EventDispatch = (h: Handlers, args: unknown[]) => LocalEvent[]

const dispatchTable: Record<string, EventDispatch> = {
  addPlayer: (h, [player]) =>
    h.addPlayer(player as Parameters<Handlers['addPlayer']>[0]),
  deletePlayer: (h, [playerId]) => h.deletePlayer(playerId as string),
  updatePlayer: (h, [player]) =>
    h.updatePlayer(player as Parameters<Handlers['updatePlayer']>[0]),
  pausePlayer: (h, [playerId]) => h.pausePlayer(playerId as string),
  pauseAll: (h) => h.pauseAll(),
  resumePlayer: (h, [playerId]) => h.resumePlayer(playerId as string),
  resumeAll: (h) => h.resumeAll(),
  recruitPlayer: (h, [arg]) =>
    h.recruitPlayer(arg as Parameters<Handlers['recruitPlayer']>[0]),
  grantTime: (h, [playerId, minutes]) =>
    h.grantTime(playerId as string, minutes as number),
  grantTimeToAll: (h, [minutes]) => h.grantTimeToAll(minutes as number),
  takeTime: (h, [playerId, minutes]) =>
    h.takeTime(playerId as string, minutes as number),
  takeTimeFromAll: (h, [minutes]) => h.takeTimeFromAll(minutes as number),
  updateSettings: (h, [settings]) =>
    h.updateSettings(settings as Parameters<Handlers['updateSettings']>[0]),
  creditKill: (h, [playerId]) => h.creditKill(playerId as string),
  creditRecruit: (h, [playerId]) => h.creditRecruit(playerId as string),
  removeKill: (h, [playerId]) => h.removeKill(playerId as string),
  removeRecruit: (h, [playerId]) => h.removeRecruit(playerId as string),
  addFlag: (h, [playerId, flag]) =>
    h.addFlag(playerId as string, flag as string),
  updateFlags: (h, [playerId, flags]) =>
    h.updateFlags(playerId as string, flags as string[]),
  marshmallowProtocol: (h, [playerId, marshmallow]) =>
    h.marshmallowProtocol(playerId as string, marshmallow as boolean),
}

type Ack = (response: { success: boolean; message?: string }) => void

const socketEmit = (event: string, ...args: unknown[]) => {
  const last = args[args.length - 1]
  const ack: Ack | undefined =
    typeof last === 'function' ? (args.pop() as Ack) : undefined

  if (!storeRef) {
    ack?.({ success: false, message: 'Local store not initialised' })
    return
  }
  const dispatch = dispatchTable[event]
  if (!dispatch) {
    ack?.({ success: false, message: `Unknown event: ${event}` })
    return
  }
  try {
    const events = dispatch(createHandlers(() => storeRef!.getState()), args)
    publishEvents(events)
    ack?.({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Local handler failed'
    ack?.({ success: false, message })
  }
}

export const socket = {
  id: 'local',
  connected: true,
  auth: { offset: undefined as EvtId | undefined },
  emit: socketEmit,
  on: busOn,
  off: busOff,
} as unknown as Socket<ServerToClientEvents, ClientToServerEvents>

export function updateSocketOffset(_evtId: EvtId) {
  // Single-process: no cross-client offset to sync.
}

function createUseSocketSubscription<STCE extends EventsMap = DefaultEventsMap>(
  s: typeof socket
) {
  return function useSocketSubscription<K extends EventNames<STCE>>(
    event: K,
    listener: STCE[K]
  ) {
    useEffect(() => {
      if (event === 'connect' && (s as unknown as Socket).connected) {
        ;(listener as unknown as () => void)()
      }
      ;(s as unknown as { on: typeof busOn }).on(
        event as string,
        listener as unknown as Listener
      )
      return () => {
        ;(s as unknown as { off: typeof busOff }).off(
          event as string,
          listener as unknown as Listener
        )
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  }
}

export const useSocketSubscription = createUseSocketSubscription(socket)

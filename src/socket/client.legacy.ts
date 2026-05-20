// LEGACY — the original socket.io-client entry point, preserved verbatim for
// reference. Was the live module at src/socket/client.ts until the conversion
// to local-only state. Pair with src/server/server.legacy.ts to restore the
// custom Next.js + Socket.IO server. Not imported by any live code path.

'use client'

import { io, type Socket } from 'socket.io-client'
import {
  type ServerToClientEvents,
  type ClientToServerEvents,
  type EvtId,
} from '@/server/interface'
import {
  type DefaultEventsMap,
  type EventNames,
  type EventsMap,
} from '@socket.io/component-emitter'
import { useEffect } from 'react'

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
  auth: {
    offset: undefined,
  },
})

export function updateSocketOffset(evtId: EvtId) {
  // @ts-expect-error: Socket.io docs recommendation causes type error
  socket.auth.offset = evtId
}

function createUseSocketSubscription<STCE extends EventsMap = DefaultEventsMap>(
  socket: Socket<STCE>
) {
  return function useSocketSubscription<K extends EventNames<STCE>>(
    event: K,
    listener: STCE[K]
  ) {
    useEffect(() => {
      if (event === 'connect' && socket.connected) {
        listener()
      }

      socket.on(event, listener)

      return () => {
        socket.off(event, listener)
      }
    }, [])
  }
}

export const useSocketSubscription = createUseSocketSubscription(socket)

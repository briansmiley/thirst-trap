'use client'

import { io, type Socket } from 'socket.io-client'
import {
  type ServerToClientEvents,
  type ClientToServerEvents,
} from '@/server/interface'

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io()
//   `http://localhost:3000`,
//   {
//     autoConnect: true,
//     transports: ["websocket", "polling"],
//   }

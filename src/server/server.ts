import { createServer } from 'node:http'
import next from 'next'
import { Server } from 'socket.io'
import playerService from './services/player'
import settingService from './services/setting'
import {
  type ClientToServerEvents,
  type ServerToClientEvents,
} from './interface'
import { loggable } from './utils'

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = Number(process.env.PORT) || 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(handler)

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    httpServer
    //   , {
    //   cors: {
    //     origin: "*",
    //     methods: ["GET", "POST"]
    //   }
    // }
  )

  io.on('connection', (socket) => {
    console.log('ON connected:', socket.id)

    socket.on('addPlayer', (player, callback) => {
      console.log('ON addPlayer:', socket.id, loggable(player))
      playerService
        .create(player)
        .then((newPlayer) => {
          console.log('EMIT addPlayer:', loggable(newPlayer))
          io.emit('addPlayer', newPlayer)
          callback({ success: true })
        })
        .catch((err) => {
          console.error(err)
          callback({ success: false, message: err.message })
        })
    })

    socket.on('updatePlayer', (player, callback) => {
      console.log('ON updatePlayer:', socket.id, loggable(player))
      const { playerId, ...rest } = player
      playerService
        .update(playerId, rest)
        .then((updatedPlayer) => {
          console.log('EMIT updatePlayer:', loggable(updatedPlayer))
          io.emit('updatePlayer', updatedPlayer)
          callback({ success: true })
        })
        .catch((err) => {
          console.error(err)
          callback({ success: false, message: err.message })
        })
    })

    socket.on('pausePlayer', (playerId, callback) => {
      console.log('ON pausePlayer:', socket.id, playerId)
      playerService
        .pause(playerId)
        .then((player) => {
          io.emit('updatePlayer', player)
          console.log('EMIT updatePlayer (pause):', loggable(player))
          callback({ success: true })
        })
        .catch((err) => {
          console.error(err)
          callback({ success: false, message: err.message })
        })
    })
    socket.on('pauseAll', (callback) => {
      console.log('ON pauseAll:', socket.id)
      playerService
        .pauseAll()
        .then((players) => {
          io.emit('updateAllPlayers', players)
          console.log('EMIT updateAllPlayers (pause)')
          callback({ success: true })
        })
        .catch((err) => {
          console.error(err)
          callback({ success: false, message: err.message })
        })
    })

    socket.on('resumePlayer', (playerId, callback) => {
      console.log('ON resumePlayer:', socket.id, playerId)
      playerService
        .resume(playerId)
        .then((player) => {
          console.log('EMIT updatePlayer (resume):', loggable(player))
          io.emit('updatePlayer', player)
          callback({ success: true })
        })
        .catch((err) => {
          console.error(err)
          callback({ success: false, message: err.message })
        })
    })
    socket.on('resumeAll', (callback) => {
      console.log('ON resumeAll:', socket.id)
      playerService.resumeAll().then((players) => {
        io.emit('updateAllPlayers', players)
        console.log('EMIT updateAllPlayers (resume)')
        callback({ success: true })
      })
    })
    socket.on('recruitPlayer', ({ playerId, faction }, callback) => {
      console.log('ON recruitPlayer:', socket.id, playerId, faction)
      playerService
        .recruit(playerId, faction)
        .then((player) => {
          console.log('EMIT updatePlayer (recruit):', loggable(player))
          io.emit('updatePlayer', player)
          callback({ success: true })
        })
        .catch((err) => {
          console.error(err)
          callback({ success: false, message: err.message })
        })
    })
    socket.on('grantTime', (playerId, minutes, callback) => {
      console.log('ON grantTime:', socket.id, playerId, minutes)
      playerService.grantTime(playerId, minutes).then((player) => {
        io.emit('updatePlayer', player)
        console.log('EMIT updatePlayer (grantTime):', loggable(player))
        callback({ success: true })
      })
    })
    socket.on('grantTimeToAll', (minutes, callback) => {
      console.log('ON grantTimeToAll:', socket.id, minutes)
      playerService.grantTimeToAll(minutes).then((players) => {
        io.emit('updateAllPlayers', players)
        console.log('EMIT updateAllPlayers (grantTimeToAll)')
        callback({ success: true })
      })
    })
    socket.on('takeTime', (playerId, minutes, callback) => {
      console.log('ON takeTime:', socket.id, playerId, minutes)
      playerService.takeTime(playerId, minutes).then((player) => {
        io.emit('updatePlayer', player)
        console.log('EMIT updatePlayer (takeTime):', loggable(player))
        callback({ success: true })
      })
    })
    socket.on('takeTimeFromAll', (minutes, callback) => {
      console.log('ON takeTimeFromAll:', socket.id, minutes)
      playerService.takeTimeFromAll(minutes).then((players) => {
        io.emit('updateAllPlayers', players)
        console.log('EMIT updateAllPlayers (takeTimeFromAll)')
        callback({ success: true })
      })
    })
    socket.on('updateSettings', (settings, callback) => {
      console.log('ON updateSettings:', socket.id, settings)
      settingService
        .update(settings)
        .then((newSettings) => {
          io.emit('updateSettings', newSettings)
          callback({ success: true })
        })
        .catch((err) => {
          console.error(err)
          callback({ success: false, message: err.message })
        })
    })
    socket.on('creditKill', (playerId, callback) => {
      console.log('ON creditKill:', socket.id, playerId)
      playerService.creditKill(playerId).then((player) => {
        io.emit('updatePlayer', player)
        callback({ success: true })
      })
    })
    socket.on('creditRecruit', (playerId, callback) => {
      console.log('ON creditRecruit:', socket.id, playerId)
      playerService.creditRecruit(playerId).then((player) => {
        io.emit('updatePlayer', player)
        callback({ success: true })
      })
    })
    socket.on('removeKill', (playerId, callback) => {
      console.log('ON removeKill:', socket.id, playerId)
      playerService.removeKill(playerId).then((player) => {
        io.emit('updatePlayer', player)
        callback({ success: true })
      })
    })
    socket.on('removeRecruit', (playerId, callback) => {
      console.log('ON removeRecruit:', socket.id, playerId)
      playerService.removeRecruit(playerId).then((player) => {
        io.emit('updatePlayer', player)
        callback({ success: true })
      })
    })
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, dev ? undefined : '127.0.0.1', () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})

import { createServer } from 'node:http'
import next from 'next'
import { Server } from 'socket.io'
import playerService from './services/player'
import settingService from './services/setting'
import {
  type ClientToServerEvents,
  type ServerToClientEvents,
} from './interface'
import { log, loggable } from './utils'
import { type Player } from '@/app/types'

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = Number(process.env.PORT) || 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(handler)

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer)

  let lastEvtId = new Date().getTime()

  io.on('connection', async (socket) => {
    const offset = socket.handshake.auth.offset
    log('ON connected:', socket.id, offset)

    if (offset !== lastEvtId) {
      log('EMIT reStore to', socket.id)
      socket.emit('reStore', {
        evtId: lastEvtId,
        players: (await playerService.getAll()) as Player[],
        settings: await settingService.get(),
      })
    }

    socket.on('addPlayer', (player, callback) => {
      log('ON addPlayer:', socket.id, loggable(player))
      playerService
        .create(player)
        .then((newPlayer) => {
          log('EMIT addPlayer:', loggable(newPlayer))
          const evtId = new Date().getTime()
          io.emit('addPlayer', { evtId, player: newPlayer })
          lastEvtId = evtId
          callback({ success: true })
        })
        .catch((err) => {
          console.error(err)
          callback({ success: false, message: err.message })
        })
    })
    socket.on('deletePlayer', (playerId, callback) => {
      log('ON deletePlayer:', socket.id, playerId)
      playerService.delete(playerId).then(() => {
        const evtId = new Date().getTime()
        io.emit('deletePlayer', { evtId, playerId })
        lastEvtId = evtId
        callback({ success: true })
      })
    })
    socket.on('updatePlayer', (player, callback) => {
      log('ON updatePlayer:', socket.id, loggable(player))
      const { playerId, ...rest } = player
      playerService
        .update(playerId, rest)
        .then((updatedPlayer) => {
          log('EMIT updatePlayer:', loggable(updatedPlayer))
          const evtId = new Date().getTime()
          io.emit('updatePlayer', { evtId, player: updatedPlayer })
          lastEvtId = evtId
          callback({ success: true })
        })
        .catch((err) => {
          console.error(err)
          callback({ success: false, message: err.message })
        })
    })

    socket.on('pausePlayer', (playerId, callback) => {
      log('ON pausePlayer:', socket.id, playerId)
      playerService
        .pause(playerId)
        .then((player) => {
          log('EMIT updatePlayer (pause):', loggable(player))
          const evtId = new Date().getTime()
          io.emit('updatePlayer', { evtId, player })
          lastEvtId = evtId
          callback({ success: true })
        })
        .catch((err) => {
          console.error(err)
          callback({ success: false, message: err.message })
        })
    })
    socket.on('pauseAll', (callback) => {
      log('ON pauseAll:', socket.id)
      playerService
        .pauseAll()
        .then((players) => {
          log('EMIT updateAllPlayers (pause)')
          const evtId = new Date().getTime()
          io.emit('updateAllPlayers', { evtId, players })
          lastEvtId = evtId
          callback({ success: true })
        })
        .catch((err) => {
          console.error(err)
          callback({ success: false, message: err.message })
        })
    })

    socket.on('resumePlayer', (playerId, callback) => {
      log('ON resumePlayer:', socket.id, playerId)
      playerService
        .resume(playerId)
        .then((player) => {
          log('EMIT updatePlayer (resume):', loggable(player))
          const evtId = new Date().getTime()
          io.emit('updatePlayer', { evtId, player })
          lastEvtId = evtId
          callback({ success: true })
        })
        .catch((err) => {
          console.error(err)
          callback({ success: false, message: err.message })
        })
    })
    socket.on('resumeAll', (callback) => {
      log('ON resumeAll:', socket.id)
      playerService.resumeAll().then((players) => {
        log('EMIT updateAllPlayers (resume)')
        const evtId = new Date().getTime()
        io.emit('updateAllPlayers', { evtId, players })
        lastEvtId = evtId
        callback({ success: true })
      })
    })
    socket.on('recruitPlayer', ({ playerId, faction }, callback) => {
      log('ON recruitPlayer:', socket.id, playerId, faction)
      playerService
        .recruit(playerId, faction)
        .then((player) => {
          log('EMIT updatePlayer (recruit):', loggable(player))
          const evtId = new Date().getTime()
          io.emit('updatePlayer', { evtId, player })
          lastEvtId = evtId
          callback({ success: true })
        })
        .catch((err) => {
          console.error(err)
          callback({ success: false, message: err.message })
        })
    })
    socket.on('grantTime', (playerId, minutes, callback) => {
      log('ON grantTime:', socket.id, playerId, minutes)
      playerService.grantTime(playerId, minutes).then((player) => {
        log('EMIT updatePlayer (grantTime):', loggable(player))
        const evtId = new Date().getTime()
        io.emit('updatePlayer', { evtId, player })
        lastEvtId = evtId
        callback({ success: true })
      })
    })
    socket.on('grantTimeToAll', (minutes, callback) => {
      log('ON grantTimeToAll:', socket.id, minutes)
      playerService.grantTimeToAll(minutes).then((players) => {
        log('EMIT updateAllPlayers (grantTimeToAll)')
        const evtId = new Date().getTime()
        io.emit('updateAllPlayers', { evtId, players })
        lastEvtId = evtId
        callback({ success: true })
      })
    })
    socket.on('takeTime', (playerId, minutes, callback) => {
      log('ON takeTime:', socket.id, playerId, minutes)
      playerService.takeTime(playerId, minutes).then((player) => {
        log('EMIT updatePlayer (takeTime):', loggable(player))
        const evtId = new Date().getTime()
        io.emit('updatePlayer', { evtId, player })
        lastEvtId = evtId
        callback({ success: true })
      })
    })
    socket.on('takeTimeFromAll', (minutes, callback) => {
      log('ON takeTimeFromAll:', socket.id, minutes)
      playerService.takeTimeFromAll(minutes).then((players) => {
        log('EMIT updateAllPlayers (takeTimeFromAll)')
        const evtId = new Date().getTime()
        io.emit('updateAllPlayers', { evtId, players })
        lastEvtId = evtId
        callback({ success: true })
      })
    })
    socket.on('updateSettings', (settings, callback) => {
      log('ON updateSettings:', socket.id, settings)
      settingService
        .update(settings)
        .then((newSettings) => {
          log('EMIT updateSettings:', newSettings)
          const evtId = new Date().getTime()
          io.emit('updateSettings', { evtId, settings: newSettings })
          lastEvtId = evtId
          callback({ success: true })
        })
        .catch((err) => {
          console.error(err)
          callback({ success: false, message: err.message })
        })
    })
    socket.on('creditKill', (playerId, callback) => {
      log('ON creditKill:', socket.id, playerId)
      playerService.creditKill(playerId).then((player) => {
        log('EMIT updatePlayer (creditKill):', loggable(player))
        const evtId = new Date().getTime()
        io.emit('updatePlayer', { evtId, player })
        lastEvtId = evtId
        callback({ success: true })
      })
    })
    socket.on('creditRecruit', (playerId, callback) => {
      log('ON creditRecruit:', socket.id, playerId)
      playerService.creditRecruit(playerId).then((player) => {
        log('EMIT updatePlayer (creditRecruit):', loggable(player))
        const evtId = new Date().getTime()
        io.emit('updatePlayer', { evtId, player })
        lastEvtId = evtId
        callback({ success: true })
      })
    })
    socket.on('removeKill', (playerId, callback) => {
      log('ON removeKill:', socket.id, playerId)
      playerService.removeKill(playerId).then((player) => {
        log('EMIT updatePlayer (removeKill):', loggable(player))
        const evtId = new Date().getTime()
        io.emit('updatePlayer', { evtId, player })
        lastEvtId = evtId
        callback({ success: true })
      })
    })
    socket.on('removeRecruit', (playerId, callback) => {
      log('ON removeRecruit:', socket.id, playerId)
      playerService.removeRecruit(playerId).then((player) => {
        log('EMIT updatePlayer (removeRecruit):', loggable(player))
        const evtId = new Date().getTime()
        io.emit('updatePlayer', { evtId, player })
        lastEvtId = evtId
        callback({ success: true })
      })
    })
    socket.on('addFlag', (playerId, flag, callback) => {
      log('ON addFlag:', socket.id, playerId, flag)
      playerService.addFlag(playerId, flag).then((player) => {
        log('EMIT updatePlayer (addFlag):', loggable(player))
        const evtId = new Date().getTime()
        io.emit('updatePlayer', { evtId, player })
        lastEvtId = evtId
        callback({ success: true })
      })
    })
    socket.on('updateFlags', (playerId, flags, callback) => {
      log('ON updateFlags:', socket.id, playerId, flags)
      playerService.updateFlags(playerId, flags).then((player) => {
        log('EMIT updatePlayer (updateFlags):', loggable(player))
        const evtId = new Date().getTime()
        io.emit('updatePlayer', { evtId, player })
        lastEvtId = evtId
        callback({ success: true })
      })
    })
    socket.on('marshmallowProtocol', (playerId, marshmallow, callback) => {
      log('ON marshmallowProtocol:', socket.id, playerId, marshmallow)
      playerService
        .marshmallowProtocol(playerId, marshmallow)
        .then((player) => {
          log('EMIT updatePlayer (marshmallowProtocol):', loggable(player))
          const evtId = new Date().getTime()
          io.emit('updatePlayer', { evtId, player })
          lastEvtId = evtId
          callback({ success: true })
        })
    })
    socket.on('disconnect', () => {
      log('User disconnected:', socket.id)
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

// import { PlayerServiceT as PlayerServiceI } from "./interface";
import prisma from '../../app/client'
import { Player } from '@/app/types'
import { Faction, Prisma } from '@prisma/client'
import settingService from './setting'

//Selects the properties of the Player schema from the database model
type PlayerSelect = {
  [K in keyof Player]: boolean
}
const selects: PlayerSelect = {
  name: true,
  playerId: true,
  picture: true,
  faction: true,
  isPaused: true,
  pausedAt: true,
  expirationTime: true,
  kills: true,
  recruits: true,
}

const playerService = {
  create: async (
    newPlayer: Omit<Prisma.PlayerCreateInput, 'pausedAt' | 'expirationTime'>
  ) => {
    const now = new Date()
    const killTimerMinutes = (await settingService.get()).maxDeathTimer
    const killTimer = killTimerMinutes * 60000
    const initialExpirationTime = new Date(now.getTime() + killTimer)
    const player = await prisma.player.create({
      data: {
        ...newPlayer,
        expirationTime: initialExpirationTime,
        pausedAt: now,
      },
      select: selects,
    })
    return player
  },
  update: async (
    playerId: Player['playerId'],
    data: Prisma.PlayerUpdateInput
  ) => {
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data,
      select: selects,
    })
    return updatedPlayer
  },
  delete: async (playerId: string) => {
    await prisma.player.delete({ where: { playerId } })
  },
  get: async (playerId: string) => {
    const player = await prisma.player.findFirst({
      where: {
        playerId: {
          equals: playerId,
          mode: 'insensitive',
        },
      },
      select: selects,
    })
    return player
  },
  getAll: async () => {
    const players = await prisma.player.findMany({ select: selects })
    return players
  },
  pauseAt: async (playerId: string, pauseAt: Date) => {
    const player = await prisma.player.update({
      where: { playerId },
      data: { isPaused: true, pausedAt: pauseAt },
      select: selects,
    })
    return player
  },
  pause: async (playerId: string) => {
    const now = new Date()
    return playerService.pauseAt(playerId, now)
  },
  pauseAll: async () => {
    const now = new Date()
    const players = await prisma.player.findMany()
    const updated = await Promise.all(
      players.map((player) => playerService.pauseAt(player.playerId, now))
    )
    return updated
  },
  resume: async (playerId: string) => {
    const now = new Date()
    const player = await prisma.player.findUnique({ where: { playerId } })
    if (!player) {
      throw new Error('Player not found')
    }
    //Default time til expiration if there isn't a preexisting timer/pause
    const defaultExpirationTime = new Date(
      now.getTime() + (await settingService.get()).maxDeathTimer
    )
    //Calculate the duration of the pause
    const pauseDuration = player.pausedAt
      ? now.getTime() - player.pausedAt.getTime()
      : 0
    //Calculate the new expiration time by adding the pause duration to the preexisting timer or default timer
    const newExpirationTime = player.expirationTime
      ? new Date(player.expirationTime.getTime() + pauseDuration)
      : defaultExpirationTime

    //Update the player's expiration time and remove the pause
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: {
        isPaused: false,
        expirationTime: newExpirationTime,
      },
      select: selects,
    })
    return updatedPlayer
  },
  resumeAll: async () => {
    const now = new Date()
    const pausedPlayers = await prisma.player.findMany({
      where: { isPaused: true },
    })
    const updatedPlayers = await Promise.all(
      pausedPlayers.map(async (player) => {
        if (!player.pausedAt || !player.expirationTime) {
          return player
        }
        const pauseDuration = now.getTime() - player.pausedAt.getTime()
        const newExpirationTime = new Date(
          player.expirationTime.getTime() + pauseDuration
        )
        return await prisma.player.update({
          where: { playerId: player.playerId },
          data: {
            isPaused: false,
            expirationTime: newExpirationTime,
          },
          select: selects,
        })
      })
    )
    return updatedPlayers
  },
  recruit: async (playerId: string, faction: Faction) => {
    const now = new Date()
    const startingExpirationTime = (await settingService.get()).startingTimer
    const startingExpirationDate = new Date(
      now.getTime() + startingExpirationTime
    )
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: { faction, expirationTime: startingExpirationDate },
      select: selects,
    })
    return updatedPlayer
  },
  setExpirationTime: async (playerId: string, minutes: number) => {
    const now = new Date()
    const duration = minutes * 60000 // Convert minutes to milliseconds
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: { expirationTime: new Date(now.getTime() + duration) },
      select: selects,
    })
    return updatedPlayer
  },
  kill: async (playerId: string) => {
    const killedPlayer = await prisma.player.update({
      where: { playerId },
      data: { faction: 'GHOST', expirationTime: new Date() },
      select: selects,
    })
    return killedPlayer
  },
  addTimeToAll: async (minutes: number) => {
    const players = await prisma.player.findMany({
      where: { faction: { not: 'GHOST' } },
    })
    const ms = minutes * 60000
    const updatedPlayers = await Promise.all(
      players.map((player) => playerService.addTime(player.playerId, ms))
    )
    return updatedPlayers
  },
  addTime: async (playerId: string, additionalMinutes: number) => {
    const player = await prisma.player.findUnique({
      where: { playerId },
      select: { expirationTime: true },
    })
    if (!player) {
      throw new Error('Player not found')
    }
    if (!player.expirationTime) {
      throw new Error('Player has no expiration time')
    }
    const additionalTime = additionalMinutes * 60000 // Convert minutes to milliseconds
    const maxTimer = (await settingService.get()).maxDeathTimer
    //set new expiration time to add on additional time but capped at maxTimer
    const newExpirationTime = new Date(
      Math.min(player.expirationTime.getTime() + additionalTime, maxTimer)
    )
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: { expirationTime: newExpirationTime },
      select: selects,
    })
    return updatedPlayer
  },
  creditKill: async (playerId: string) => {
    const player = await prisma.player.findUnique({
      where: { playerId },
      select: { faction: true, expirationTime: true },
    })
    if (!player) {
      throw new Error('Player not found')
    }
    const killTimeCredit = (await settingService.get()).killTimeCredit
    if (player.expirationTime) {
      await playerService.addTime(playerId, killTimeCredit)
    }
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: {
        kills: { increment: 1 },
      },
      select: selects,
    })
    return updatedPlayer
  },
  creditRecruit: async (playerId: string) => {
    const player = await prisma.player.findUnique({
      where: { playerId },
      select: { faction: true, expirationTime: true },
    })
    if (!player) {
      throw new Error('Player not found')
    }
    if (player.faction !== 'JACKAL') {
      throw new Error('Player is not a jackal and cannot recruit')
    }
    const recruitTimeCredit = (await settingService.get()).recruitTimeCredit
    if (player.expirationTime) {
      await playerService.addTime(playerId, recruitTimeCredit)
    }
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: { recruits: { increment: 1 } },
      select: selects,
    })
    return updatedPlayer
  },
}

export default playerService

// export const playerCreate = playerService.create;
// export const playerUpdate = playerService.update;
// export const playerDelete = playerService.delete;
// export const playerGet = playerService.get;
// export const playerGetAll = playerService.getAll;
// export const playerPauseAt = playerService.pauseAt;
// export const playerPause = playerService.pause;
// export const playerPauseAll = playerService.pauseAll;
// export const playerResume = playerService.resume;
// export const playerResumeAll = playerService.resumeAll;
// export const playerRecruit = playerService.recruit;
// export const playerResetExpirationTimer = playerService.resetExpirationTimer;
// export const playerKill = playerService.kill;
// export const playerCreditKill = playerService.creditKill;

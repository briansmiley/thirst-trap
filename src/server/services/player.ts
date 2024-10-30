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
  flags: true,
  marshmallow: true,
}
const baseSelects = {
  name: true,
  playerId: true,
  faction: true,
  isPaused: true,
  pausedAt: true,
  expirationTime: true,
  kills: true,
  recruits: true,
  flags: true,
  marshmallow: true,
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
  getAll: async <K extends keyof Player>(keys?: K[]) => {
    const keySelects = keys
      ? Object.fromEntries(keys.map((key) => [key, true]))
      : selects
    const players = await prisma.player.findMany({
      select: keySelects,
    })
    return players as K[] extends undefined ? Player[] : Pick<Player, K>[]
  },
  pauseAt: async (playerId: string, pauseAt: Date) => {
    const player = await prisma.player.update({
      where: { playerId },
      data: { isPaused: true, pausedAt: pauseAt },
      select: baseSelects,
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
      select: baseSelects,
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
          select: baseSelects,
        })
      })
    )
    return updatedPlayers
  },
  recruit: async (playerId: string, faction: Faction) => {
    const now = new Date()
    const startingExpirationTime =
      (await settingService.get()).startingTimer * 60000
    const startingExpirationDate = new Date(
      now.getTime() + startingExpirationTime
    )
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: {
        faction,
        expirationTime: startingExpirationDate,
      },
      select: baseSelects,
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
  takeTimeFromAll: async (minutes: number) => {
    const players = await prisma.player.findMany({
      where: { faction: { in: ['JACKAL', 'VAMPIRE'] } },
    })
    const updatedPlayers = await Promise.all(
      players.map((player) => playerService.takeTime(player.playerId, minutes))
    )
    return updatedPlayers
  },
  takeTime: async (playerId: string, minutes: number) => {
    const deductionFloor = 5 * 60000
    const deductionMs = minutes * 60000
    const player = await prisma.player.findUnique({ where: { playerId } })
    if (!player) {
      throw new Error('Player not found')
    }
    const currentRemainingTime = player.expirationTime
      ? player.expirationTime.getTime() - new Date().getTime()
      : 0
    //if they are already under the floor, do nothing, otherwise take the larger of removing full deduction or the floor
    const newRemainingTime =
      currentRemainingTime < deductionFloor
        ? currentRemainingTime
        : Math.max(currentRemainingTime - deductionMs, deductionFloor)
    const newExpirationTime = new Date(new Date().getTime() + newRemainingTime)
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: { expirationTime: newExpirationTime },
      select: baseSelects,
    })
    return updatedPlayer
  },
  grantTimeToAll: async (minutes: number) => {
    const players = await prisma.player.findMany({
      where: {
        faction: { in: ['JACKAL', 'VAMPIRE'] },
        expirationTime: { gt: new Date() }, //Only grant time to players that are not expired
      },
    })
    const updatedPlayers = await Promise.all(
      players.map((player) => playerService.grantTime(player.playerId, minutes))
    )
    return updatedPlayers
  },
  grantTime: async (playerId: string, additionalMinutes: number) => {
    const player = await prisma.player.findUnique({
      where: { playerId },
      select: { expirationTime: true },
    })
    const originalExpirationTime = player?.expirationTime
    if (!player) {
      throw new Error('Player not found')
    }
    if (!player.expirationTime) {
      throw new Error('Player has no expiration time')
    }
    const additionalTime = additionalMinutes * 60000 // Convert minutes to milliseconds
    const maxTimer = (await settingService.get()).maxDeathTimer * 60000

    //if they are expired, set prevExpirationTime to now so they actually get time
    const prevExpirationTime =
      player.expirationTime < new Date() ? new Date() : player.expirationTime
    // console.log('ADDITIONAL Minutes:', additionalTime / 60000)
    // console.log('MAX TIMER:', maxTimer)
    // console.log('PREVIOUS EXPIRATION TIME:', prevExpirationTime)
    // console.log(
    //   'PREVIOUS EXPIRATION TIME + ADDITIONAL TIME:',
    //   new Date(prevExpirationTime.getTime() + additionalTime)
    // )
    // console.log('NOW:', new Date())
    // console.log('MAX TIMER + NOW:', new Date(new Date().getTime() + maxTimer))
    const newExpirationTime = new Date(
      Math.min(
        prevExpirationTime.getTime() + additionalTime,
        new Date().getTime() + maxTimer
      )
    )
    // console.log('ORIGINAL EXPIRATION TIME:', originalExpirationTime)
    // console.log('NEW EXPIRATION TIME:', newExpirationTime)
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: { expirationTime: newExpirationTime },
      select: baseSelects,
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
      await playerService.grantTime(playerId, killTimeCredit)
    }
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: {
        kills: { increment: 1 },
      },
      select: baseSelects,
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
      await playerService.grantTime(playerId, recruitTimeCredit)
    }
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: { recruits: { increment: 1 } },
      select: selects,
    })
    return updatedPlayer
  },
  removeRecruit: async (playerId: string) => {
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: { recruits: { decrement: 1 } },
      select: selects,
    })
    return updatedPlayer
  },
  removeKill: async (playerId: string) => {
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: { kills: { decrement: 1 } },
      select: selects,
    })
    return updatedPlayer
  },
  addFlag: async (playerId: string, flag: string) => {
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: { flags: { push: flag } },
      select: baseSelects,
    })
    return updatedPlayer
  },
  marshmallowProtocol: async (
    playerId: string,
    marshmallow: boolean = true
  ) => {
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: { marshmallow: marshmallow, expirationTime: new Date() },
      select: baseSelects,
    })
    return updatedPlayer
  },
}

export default playerService

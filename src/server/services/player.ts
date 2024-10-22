import { PlayerServiceT as PlayerServiceI } from "./interface";
import prisma from "../../app/client";
import { Player } from "../../app/types";
import { Faction } from "@prisma/client";

//Selects the properties of the Player schema from the database model
type PlayerSelect = {
  [K in keyof Player]: boolean;
};
const selects: PlayerSelect = {
  name: true,
  playerId: true,
  picture: true,
  faction: true,
  isPaused: true,
  pausedAt: true,
  expirationTime: true,
  kills: true
};

const playerService: PlayerServiceI = {
  create: async (newPlayer: Player) => {
    const player = await prisma.player.create({
      data: newPlayer,
      select: selects
    });
    return player;
  },
  update: async (player: Player) => {
    const existingPlayer = await prisma.player.findUnique({
      where: { playerId: player.playerId }
    });
    if (!existingPlayer) {
      throw new Error("Player not found");
    }
    const updatedPlayer = await prisma.player.update({
      where: { playerId: player.playerId },
      data: player,
      select: selects
    });
    return updatedPlayer;
  },
  delete: async (playerId: string) => {
    await prisma.player.delete({ where: { playerId } });
  },
  get: async (playerId: string) => {
    const player = await prisma.player.findUnique({
      where: { playerId },
      select: selects
    });
    return player;
  },
  getAll: async () => {
    const players = await prisma.player.findMany({ select: selects });
    return players;
  },

  pauseAt: async (playerId: string, pauseAt: Date) => {
    const player = await prisma.player.update({
      where: { playerId },
      data: { isPaused: true, pausedAt: pauseAt },
      select: selects
    });
    return player;
  },
  pause: async (playerId: string) => {
    const now = new Date();
    return playerService.pauseAt(playerId, now);
  },
  pauseAll: async () => {
    const now = new Date();
    const players = await prisma.player.findMany();
    const updated = await Promise.all(
      players.map(player => playerService.pauseAt(player.playerId, now))
    );
    return updated;
  },

  resume: async (playerId: string) => {
    const now = new Date();
    const player = await prisma.player.findUnique({ where: { playerId } });
    if (!player) {
      throw new Error("Player not found");
    }
    if (!player.pausedAt) {
      throw new Error("Player is not paused");
    }
    if (!player.expirationTime) {
      throw new Error("Player has no expiration time");
    }
    const pauseDuration = now.getTime() - player.pausedAt.getTime();
    const newExpirationTime = new Date(
      player.expirationTime.getTime() + pauseDuration
    );
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: {
        isPaused: false,
        pausedAt: null,
        expirationTime: newExpirationTime
      },
      select: selects
    });
    return updatedPlayer;
  },
  resumeAll: async () => {
    const now = new Date();
    const pausedPlayers = await prisma.player.findMany({
      where: { isPaused: true }
    });
    const updatedPlayers = await Promise.all(
      pausedPlayers.map(async player => {
        if (!player.pausedAt || !player.expirationTime) {
          return player;
        }
        const pauseDuration = now.getTime() - player.pausedAt.getTime();
        const newExpirationTime = new Date(
          player.expirationTime.getTime() + pauseDuration
        );
        return await prisma.player.update({
          where: { playerId: player.playerId },
          data: {
            isPaused: false,
            pausedAt: null,
            expirationTime: newExpirationTime
          },
          select: selects
        });
      })
    );
    return updatedPlayers;
  },
  recruit: async (playerId: string, faction: Faction) => {
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: { faction },
      select: selects
    });
    return updatedPlayer;
  },
  resetExpirationTimer: async (playerId: string, minutes: number) => {
    const now = new Date();
    const duration = minutes * 60000; // Convert minutes to milliseconds
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: { expirationTime: new Date(now.getTime() + duration) },
      select: selects
    });
    return updatedPlayer;
  },
  kill: async (playerId: string) => {
    const killedPlayer = await prisma.player.update({
      where: { playerId },
      data: { faction: "GHOST", expirationTime: null },
      select: selects
    });
    return killedPlayer;
  },
  creditKill: async (playerId: string) => {
    const updatedPlayer = await prisma.player.update({
      where: { playerId },
      data: { kills: { increment: 1 } },
      select: selects
    });
    return updatedPlayer;
  }
};

export const playerCreate = playerService.create;
export const playerUpdate = playerService.update;
export const playerDelete = playerService.delete;
export const playerGet = playerService.get;
export const playerGetAll = playerService.getAll;
export const playerPauseAt = playerService.pauseAt;
export const playerPause = playerService.pause;
export const playerPauseAll = playerService.pauseAll;
export const playerResume = playerService.resume;
export const playerResumeAll = playerService.resumeAll;
export const playerRecruit = playerService.recruit;
export const playerResetExpirationTimer = playerService.resetExpirationTimer;
export const playerKill = playerService.kill;
export const playerCreditKill = playerService.creditKill;
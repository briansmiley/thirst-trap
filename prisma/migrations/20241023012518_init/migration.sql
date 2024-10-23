-- CreateEnum
CREATE TYPE "Faction" AS ENUM ('VAMPIRE', 'HUNTER', 'NEUTRAL', 'GHOST');

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Player',
    "playerId" TEXT NOT NULL,
    "picture" TEXT,
    "faction" "Faction" NOT NULL DEFAULT 'NEUTRAL',
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "pausedAt" TIMESTAMP(3),
    "expirationTime" TIMESTAMP(3),
    "kills" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_playerId_key" ON "Player"("playerId");

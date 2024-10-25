/*
  Warnings:

  - Made the column `pausedAt` on table `Player` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expirationTime` on table `Player` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "pausedAt" SET NOT NULL,
ALTER COLUMN "expirationTime" SET NOT NULL;

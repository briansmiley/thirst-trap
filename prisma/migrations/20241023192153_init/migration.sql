/*
  Warnings:

  - The values [HUNTER] on the enum `Faction` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Setting` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Faction_new" AS ENUM ('VAMPIRE', 'JACKAL', 'NEUTRAL', 'GHOST');
ALTER TABLE "Player" ALTER COLUMN "faction" DROP DEFAULT;
ALTER TABLE "Player" ALTER COLUMN "faction" TYPE "Faction_new" USING ("faction"::text::"Faction_new");
ALTER TYPE "Faction" RENAME TO "Faction_old";
ALTER TYPE "Faction_new" RENAME TO "Faction";
DROP TYPE "Faction_old";
ALTER TABLE "Player" ALTER COLUMN "faction" SET DEFAULT 'NEUTRAL';
COMMIT;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "recruits" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Setting";

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "maxDeathTimer" INTEGER NOT NULL,
    "killTimeCredit" INTEGER NOT NULL,
    "recruitTimeCredit" INTEGER NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

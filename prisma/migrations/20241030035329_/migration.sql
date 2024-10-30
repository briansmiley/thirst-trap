/*
  Warnings:

  - The values [NEUTRAL] on the enum `Faction` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Faction_new" AS ENUM ('VAMPIRE', 'JACKAL', 'HUMAN', 'GHOST');
ALTER TABLE "Player" ALTER COLUMN "faction" DROP DEFAULT;
ALTER TABLE "Player" ALTER COLUMN "faction" TYPE "Faction_new" USING ("faction"::text::"Faction_new");
ALTER TYPE "Faction" RENAME TO "Faction_old";
ALTER TYPE "Faction_new" RENAME TO "Faction";
DROP TYPE "Faction_old";
ALTER TABLE "Player" ALTER COLUMN "faction" SET DEFAULT 'HUMAN';
COMMIT;

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "faction" SET DEFAULT 'HUMAN';

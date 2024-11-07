import { PrismaClient } from '@prisma/client'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'

const prisma = new PrismaClient()

export async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupDir = join(process.cwd(), '/.backups')
  const backupPath = join(backupDir, `backup_${timestamp}.json`)

  try {
    // Get all data from your tables
    const data = {
      players: await prisma.player.findMany(),
      settings: await prisma.settings.findMany(),
      // Add other tables as needed
    }

    // Ensure backup directory exists
    await mkdir(backupDir, { recursive: true })

    // Write to file
    await writeFile(backupPath, JSON.stringify(data, null, 2))
    console.log(`Database backed up to ${backupPath}`)
    return backupPath
  } catch (error) {
    console.error('Backup failed:', error)
    throw error
  }
}

export async function restoreDatabase(backupPath: string) {
  try {
    const fileContent = await readFile(backupPath, 'utf-8')
    const data = JSON.parse(fileContent)

    // Clear existing data and restore from backup
    await prisma.$transaction(async (tx) => {
      // Delete existing data (reverse order of relationships)
      await tx.player.deleteMany()
      await tx.settings.deleteMany()
      // Add other tables as needed

      // Restore data
      await tx.player.createMany({ data: data.players })
      await tx.settings.createMany({ data: data.settings })
      // Add other tables as needed
    })

    console.log(`Database restored from ${backupPath}`)
  } catch (error) {
    console.error('Restore failed:', error)
    throw error
  }
}

import { backupDatabase, restoreDatabase } from './backup'

const command = process.argv[2]
const backupPath = process.argv[3]

async function main() {
  console.log(command, backupPath)
  switch (command) {
    case 'backup':
      await backupDatabase()
      break
    case 'restore':
      if (!backupPath) {
        console.error('Please provide a backup path')
        process.exit(1)
      }
      await restoreDatabase(backupPath)
      break
    default:
      console.error('Please specify either "backup" or "restore"')
      process.exit(1)
  }
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

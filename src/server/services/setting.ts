import prisma from '../../app/client'
import { Prisma } from '@prisma/client'

const settingService = {
  upsert: async (newValues: Prisma.SettingsCreateInput) => {
    const newSettings = await prisma.settings.upsert({
      where: { id: 1 },
      update: newValues,
      create: newValues,
      select: {
        maxDeathTimer: true,
        killTimeCredit: true,
        recruitTimeCredit: true,
      },
    })
    return newSettings
  },
  get: async () => {
    const settings = await prisma.settings.findFirst({
      select: {
        maxDeathTimer: true,
        killTimeCredit: true,
        recruitTimeCredit: true,
      },
    })
    if (!settings) {
      throw new Error('Settings not found')
    }
    return settings
  },
}

export default settingService

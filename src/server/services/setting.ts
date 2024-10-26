import prisma from '../../app/client'
import { Prisma } from '@prisma/client'

const settingService = {
  create: async (newValues: Omit<Prisma.SettingsCreateInput, 'id'>) => {
    const newSettings = await prisma.settings.upsert({
      where: { id: 1 },
      update: newValues,
      create: newValues,
      select: {
        maxDeathTimer: true,
        killTimeCredit: true,
        recruitTimeCredit: true,
        startingTimer: true,
      },
    })
    return newSettings
  },
  upsert: async (newValues: Omit<Prisma.SettingsUpdateInput, 'id'>) => {
    const newSettings = await prisma.settings.update({
      where: { id: 1 },
      select: {
        maxDeathTimer: true,
        killTimeCredit: true,
        recruitTimeCredit: true,
        startingTimer: true,
      },
      data: newValues,
    })
    return newSettings
  },
  get: async () => {
    const settings = await prisma.settings.findFirst({
      select: {
        maxDeathTimer: true,
        killTimeCredit: true,
        recruitTimeCredit: true,
        startingTimer: true,
      },
    })
    if (!settings) {
      throw new Error('Settings not found')
    }
    return settings
  },
}

export default settingService

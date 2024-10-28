import prisma from '../../app/client'
import { Prisma } from '@prisma/client'

const settingService = {
  create: async (newValues: Prisma.SettingsCreateInput) => {
    const newSettings = await prisma.settings.create({
      data: { id: 1, ...newValues },
    })
    return newSettings
  },
  update: async (newValues: Prisma.SettingsUpdateInput) => {
    const newSettings = await prisma.settings.update({
      where: { id: 1 },
      data: newValues,
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

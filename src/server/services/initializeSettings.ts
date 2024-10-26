// run with: tsx src/server/services/initializeSettings.ts

import settingService from './setting'

const settings = {
  maxDeathTimer: 45,
  killTimeCredit: 30,
  recruitTimeCredit: 15,
  startingTimer: 30,
}

async function initializeSettings() {
  try {
    const result = await settingService.create(settings)
    console.log(result)
  } catch (error) {
    console.error(`Error upserting settings: `, error)
  }
}

initializeSettings().catch((error) => {
  console.error('Failed to initialize settings:', error)
})

'use server'

import playerService from '@/server/services/player'

export const addTimeToAll = async (formData: FormData) => {
  const minutes = Number(formData.get('minutes'))
  if (!isNaN(minutes)) {
    playerService.addTimeToAll(minutes)
  }
}

export const takeTimeFromAll = async (formData: FormData) => {
  const minutes = Number(formData.get('minutes'))
  if (!isNaN(minutes)) {
    playerService.takeTimeFromAll(minutes)
  }
}

export const pauseAll = () => {
  playerService.pauseAll()
}

export const unpauseAll = () => {
  playerService.resumeAll()
}

import { Player } from '@/app/types'

export type Duration = {
  hours: number
  minutes: number
  seconds: number
  sign: '' | '-'
}

export function toDuration(ms: number): Duration {
  const totalSeconds = Math.floor(Math.abs(ms) / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60)
  const seconds = totalSeconds - hours * 3600 - minutes * 60
  return { hours, minutes, seconds, sign: ms < 0 ? '-' : '' }
}

export function toDurationString(durationOrMs: Duration | number) {
  const duration =
    typeof durationOrMs === 'number' ? toDuration(durationOrMs) : durationOrMs
  return `${duration.sign}${duration.hours ? `${String(duration.hours).padStart(2, '0')}:` : ''}${String(duration.minutes).padStart(2, '0')}:${String(duration.seconds).padStart(2, '0')}`
}

/**
 * @param player - The player to calculate the time left for.
 * @param floor - Whether to floor the time left at 0.
 * @returns The time left until (or negative since) player expiration in milliseconds.
 */
export function calcMsLeft(player: Player, floor = false) {
  const startingPoint = player.isPaused ? player.pausedAt.getTime() : Date.now()
  return floor
    ? Math.max(Math.floor(player.expirationTime.getTime() - startingPoint), 0)
    : player.expirationTime.getTime() - startingPoint
}

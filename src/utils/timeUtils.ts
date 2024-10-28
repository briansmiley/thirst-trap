import { Player } from '@/app/types'

export type Duration = {
  minutes: number
  seconds: number
}

export function toDuration(ms: number): Duration {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds - minutes * 60
  return { minutes, seconds }
}

export function toDurationString(durationOrMs: Duration | number) {
  const duration =
    typeof durationOrMs === 'number' ? toDuration(durationOrMs) : durationOrMs
  return `${duration.minutes}:${String(duration.seconds).padStart(2, '0')}`
}

export function calcMsLeft(player: Player) {
  const startingPoint = player.isPaused ? player.pausedAt.getTime() : Date.now()
  return Math.max(player.expirationTime.getTime() - startingPoint, 0)
}

import { Player } from '@/app/types'

export function loggable(player: Partial<Player>) {
  return {
    ...player,
    ...(player.picture ? { picture: player.picture.slice(0, 50) } : {}),
  }
}

export function log(...args: Parameters<typeof console.log>) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args)
  }
}

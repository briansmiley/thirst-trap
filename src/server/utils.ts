import { Player } from '@/app/types'

export function loggable(player: Partial<Player>) {
  return {
    ...player,
    ...(player.picture ? { picture: player.picture.slice(0, 50) } : {}),
  }
}

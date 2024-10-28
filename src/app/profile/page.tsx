import { useSocketSubscription } from '@/socket/client'
import PlayerProfileFinder from './PlayerProfileFinder'
import { Player } from '../types'
import { useState } from 'react'
import playerService from '@/server/services/player'

const fetchPlayerIds = async () => {
  const playerIds = await playerService.getAll(['playerId'])
  const sortedPlayerIds = playerIds.sort()
  return sortedPlayerIds
}

export default async function ProfilePage() {
  const playerIds = (await fetchPlayerIds()).map((player) => player.playerId)
  return <PlayerProfileFinder playerIds={playerIds} />
}

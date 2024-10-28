'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Player } from '../types'
import { PlayersDropdown } from './PlayersDropdown'
import { useSocketSubscription } from '@/socket/client'

type PlayerProfileFinderProps = {
  playerIds: string[]
}
export default function ProfilePage({ playerIds }: PlayerProfileFinderProps) {
  const [playerIdsState, setPlayerIds] = useState<string[]>(playerIds)
  const [currentPlayerId, setCurrentPlayerId] = useState<Player['playerId']>()
  const router = useRouter()

  useSocketSubscription('addPlayer', (player: Player) => {
    setPlayerIds((playerNames) => {
      const updatedPlayerNames = [...playerNames, player.name]
      return updatedPlayerNames.sort()
    })
  })
  const handleSubmit = () => {
    if (!currentPlayerId) return
    router.push(`/profile/${currentPlayerId}`)
  }

  const handleSelect = (playerId: string) => {
    setCurrentPlayerId(playerId)
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="my_box flex flex-col items-center justify-center gap-4 p-12">
        <h1 className="satisfy text-4xl font-bold">Player Profiles</h1>
        <div className="flex flex-col items-center justify-center gap-4">
          {/* <input
            type="text"
            className="rounded border-2 border-neutral-700 px-1"
            name="id"
            placeholder="Player Badge ID"
          /> */}
          <PlayersDropdown
            playerIds={playerIds}
            onSelect={handleSelect}
            currentSelection={currentPlayerId ?? ''}
          />
          <Button onClick={handleSubmit}>Go to Profile</Button>
        </div>
      </div>
    </div>
  )
}

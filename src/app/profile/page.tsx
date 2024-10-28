'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Player } from '@/app/types'
import { useAppStore } from '@/lib/stores/AppStoreProvider'
import { Button } from '@/components/ui/button'
import { PlayersDropdown } from '@/app/profile/PlayersDropdown'

export default function ProfilePage() {
  const playerIds = useAppStore((state) => state.players.map((p) => p.playerId).sort())
  const [currentPlayerId, setCurrentPlayerId] = useState<Player['playerId']>()
  const router = useRouter()

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

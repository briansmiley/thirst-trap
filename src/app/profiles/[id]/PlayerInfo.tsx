'use client'

import { useEffect, useState } from 'react'
import { socket } from '@/socket'
import { Faction, Player } from '@/app/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Minus, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function PlayerInfo(props: Player) {
  const [playerData, setPlayerData] = useState(props)

  const handleFactionChange = (faction: Faction) => {
    console.log('EMIT updatePlayer:', { playerId: props.playerId, faction })
    socket.emit(
      'updatePlayer',
      { playerId: props.playerId, faction },
      (response) => {
        console.log('ACK updatePlayer:', response)
      }
    )
  }

  const handleCountChange =
    (type: 'kills' | 'recruits') => (change: number) => {
      console.log('EMIT updatePlayer:', {
        playerId: props.playerId,
        [type]: playerData[type] + change,
      })
      socket.emit(
        'updatePlayer',
        { playerId: props.playerId, [type]: playerData[type] + change },
        (response) => {
          console.log('ACK updatePlayer:', response)
        }
      )
    }

  useEffect(() => {
    function onUpdatePlayer({
      playerId,
      ...changes
    }: Partial<Player> & Pick<Player, 'playerId'>) {
      if (playerId === props.playerId) {
        setPlayerData({ ...playerData, ...changes })
      }
    }

    socket.on('updatePlayer', onUpdatePlayer)

    return () => {
      socket.off('updatePlayer', onUpdatePlayer)
    }
  })

  return (
    <div className="flex h-[100dvh] flex-col items-center gap-4 p-8">
      <img
        alt={`Profile photo for ${playerData.name}`}
        src={playerData.picture ?? ''}
        className="m-auto h-72 w-72 border object-cover"
      />
      <div className="grow-1 flex h-full flex-col justify-between">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-semibold">{playerData.name}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Badge variant="outline">
                  {playerData.faction.charAt(0) +
                    playerData.faction.slice(1).toLowerCase()}
                </Badge>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
              <DropdownMenuLabel>Faction</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={playerData.faction}
                onValueChange={(value) => {
                  handleFactionChange(value as Faction)
                }}
              >
                <DropdownMenuRadioItem value="NEUTRAL">
                  <Badge variant="outline">Neutral</Badge>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="VAMPIRE">
                  <Badge variant="outline">Vampire</Badge>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="JACKAL">
                  <Badge variant="outline">Jackal</Badge>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="GHOST">
                  <Badge variant="outline">Ghost</Badge>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex w-48 items-center justify-between gap-2">
            <Button
              className="rounded-full"
              variant="outline"
              size="icon"
              onClick={() => handleCountChange('kills')(-1)}
              disabled={playerData.kills < 1}
            >
              <Minus />
            </Button>
            <div className="font-semibold">Kills: {playerData.kills} </div>
            <Button
              className="rounded-full"
              variant="outline"
              size="icon"
              onClick={() => handleCountChange('kills')(1)}
            >
              <Plus />
            </Button>
          </div>
          <div className="flex w-48 items-center justify-between gap-2">
            <Button
              className="rounded-full"
              variant="outline"
              size="icon"
              onClick={() => handleCountChange('recruits')(-1)}
              disabled={playerData.recruits < 1}
            >
              <Minus />
            </Button>
            <div className="font-semibold">
              Recruits: {playerData.recruits || 0}
            </div>
            <Button
              className="rounded-full"
              variant="outline"
              size="icon"
              onClick={() => handleCountChange('recruits')(1)}
            >
              <Plus />
            </Button>
          </div>
        </div>
        <div className="text-center text-xl">
          {playerData.isPaused
            ? 'PAUSED'
            : `Expires: ${
                playerData.expirationTime
                  ? playerData.expirationTime.toDateString()
                  : '-'
              }`}
        </div>
      </div>
    </div>
  )
}

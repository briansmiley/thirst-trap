'use client'

import { useEffect, useState } from 'react'
import {
  ChevronDownIcon,
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
} from 'lucide-react'
import { socket } from '@/socket/client'
import { Faction, Player } from '@/app/types'
import { calcMsLeft, toDurationString } from '@/utils/timeUtils'
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
import { Badge } from '@/components/ui/badge'

type PlayerInfoProps = {
  playerData: Player
}
export default function PlayerInfo({ playerData }: PlayerInfoProps) {
  const [msLeft, setMsLeft] = useState(calcMsLeft(playerData.expirationTime))
  const hasExpiration =
    playerData.faction === 'VAMPIRE' || playerData.faction === 'JACKAL'
  useEffect(() => {
    let interval: NodeJS.Timeout
    setMsLeft(calcMsLeft(playerData.expirationTime))
    if (!playerData.isPaused) {
      interval = setInterval(() => {
        setMsLeft(calcMsLeft(playerData.expirationTime))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [playerData.isPaused, playerData.expirationTime])

  const handleFactionChange = (faction: Faction) => {
    console.log('EMIT recruitPlayer:', {
      playerId: playerData.playerId,
      faction,
    })
    socket.emit(
      'recruitPlayer',
      { playerId: playerData.playerId, faction },
      (res) => {
        console.log('ACK updatePlayer:', res)
      }
    )
  }

  const handleCountChange =
    (type: 'kills' | 'recruits') => (change: number) => {
      console.log('EMIT updatePlayer:', {
        playerId: playerData.playerId,
        [type]: playerData[type] + change,
      })
      socket.emit(
        'updatePlayer',
        { playerId: playerData.playerId, [type]: playerData[type] + change },
        (res) => {
          console.log('ACK updatePlayer:', res)
        }
      )
    }

  const pauseOrResume = () => {
    if (playerData.isPaused) {
      socket.emit('resumePlayer', playerData.playerId, (res) => {
        console.log('ACK updatePlayer:', res)
      })
    } else {
      socket.emit('pausePlayer', playerData.playerId, (res) => {
        console.log('ACK pausePlayer:', res)
      })
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 p-8">
      <img
        alt={`Profile photo for ${playerData.name}`}
        src={playerData.picture}
        className="m-auto mb-4 h-72 w-72 border object-cover"
      />
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-semibold">{playerData.name}</h1>
        <h2 className="text-sm font-semibold text-neutral-400 opacity-50">
          id: {playerData.playerId}
        </h2>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Badge
              className="capitalize"
              variant={
                playerData.faction.toLowerCase() as
                  | 'neutral'
                  | 'vampire'
                  | 'jackal'
                  | 'ghost'
              }
            >
              {playerData.faction.toLowerCase()}
            </Badge>
            <ChevronDownIcon />
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
              <Badge variant="neutral">Neutral</Badge>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="VAMPIRE">
              <Badge variant="vampire">Vampire</Badge>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="JACKAL">
              <Badge variant="jackal">Jackal</Badge>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="GHOST">
              <Badge variant="ghost">Ghost</Badge>
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
          <MinusIcon />
        </Button>
        <div className="font-semibold">Kills: {playerData.kills} </div>
        <Button
          className="rounded-full"
          variant="outline"
          size="icon"
          onClick={() => handleCountChange('kills')(1)}
        >
          <PlusIcon />
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
          <MinusIcon />
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
          <PlusIcon />
        </Button>
      </div>

      {hasExpiration && (
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14"
            onClick={pauseOrResume}
          >
            {playerData.isPaused ? (
              <PlayIcon className="!size-8" />
            ) : (
              <PauseIcon className="!size-8" />
            )}
          </Button>
          <div className="text-center text-xl" suppressHydrationWarning>
            Expires:{' '}
            {msLeft === 0 ? (
              <span className="animate-pulse text-red-500">0:00</span>
            ) : (
              toDurationString(msLeft)
            )}
          </div>
        </div>
      )}
    </div>
  )
}

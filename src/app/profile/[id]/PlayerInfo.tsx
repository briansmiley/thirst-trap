'use client'

import { useEffect, useState } from 'react'
import {
  ChevronDownIcon,
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
} from 'lucide-react'
import { socket } from '@/socket'
import { Faction, Player } from '@/app/types'
import { toDurationString } from '@/utils/timeUtils'
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

export default function PlayerInfo(props: Player) {
  const [playerData, setPlayerData] = useState(props)
  const [msLeft, setMsLeft] = useState(
    Math.max(props.expirationTime.getTime() - Date.now(), 0)
  )

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (!playerData.isPaused) {
      interval = setInterval(() => {
        setMsLeft((p) => p - 1000)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [playerData.isPaused])

  useEffect(() => {
    function onUpdatePlayer({
      playerId,
      ...changes
    }: Partial<Player> & Pick<Player, 'playerId'>) {
      if (playerId === props.playerId) {
        setPlayerData({ ...playerData, ...changes })
      }
    }

    function onPausePlayer({
      playerId,
      ...changes
    }: Pick<Player, 'playerId' | 'isPaused' | 'expirationTime' | 'pausedAt'>) {
      if (playerId === props.playerId) {
        const isPaused = changes.isPaused
        const expirationTime = new Date(changes.expirationTime)
        const pausedAt = new Date(changes.pausedAt)
        console.log('ON pausePlayer:', socket.id, {
          isPaused,
          expirationTime,
          pausedAt,
        })
        setPlayerData({ ...playerData, isPaused, expirationTime, pausedAt })
        setMsLeft(expirationTime.getTime() - pausedAt.getTime())
      }
    }
    function onResumePlayer({
      playerId,
      ...changes
    }: Pick<Player, 'playerId' | 'isPaused' | 'expirationTime' | 'pausedAt'>) {
      if (playerId === props.playerId) {
        const isPaused = changes.isPaused
        const expirationTime = new Date(changes.expirationTime)
        const pausedAt = new Date(changes.pausedAt)
        console.log('ON resumePlayer:', socket.id, {
          isPaused,
          expirationTime,
          pausedAt,
        })
        setPlayerData({ ...playerData, isPaused, expirationTime, pausedAt })
        setMsLeft(Math.max(expirationTime.getTime() - Date.now(), 0))
      }
    }

    socket.on('updatePlayer', onUpdatePlayer)
    socket.on('pausePlayer', onPausePlayer)
    socket.on('resumePlayer', onResumePlayer)

    return () => {
      socket.off('updatePlayer', onUpdatePlayer)
      socket.off('pausePlayer', onPausePlayer)
      socket.off('resumePlayer', onResumePlayer)
    }
  })

  const handleFactionChange = (faction: Faction) => {
    console.log('EMIT updatePlayer:', { playerId: props.playerId, faction })
    socket.emit(
      'updatePlayer',
      { playerId: props.playerId, faction },
      (res) => {
        console.log('ACK updatePlayer:', res)
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
        (res) => {
          console.log('ACK updatePlayer:', res)
        }
      )
    }

  const pauseOrResume = () => {
    if (playerData.isPaused) {
      socket.emit('resumePlayer', props.playerId, (res) => {
        console.log('ACK updatePlayer:', res)
      })
    } else {
      socket.emit('pausePlayer', props.playerId, (res) => {
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
      <h1 className="text-3xl font-semibold">{playerData.name}</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Badge variant="outline">
              {playerData.faction.charAt(0) +
                playerData.faction.slice(1).toLowerCase()}
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
      <div className="text-center text-xl">
        Expires: {toDurationString(msLeft)}
      </div>
    </div>
  )
}

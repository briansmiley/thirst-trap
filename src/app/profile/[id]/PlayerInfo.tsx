'use client'

import { useEffect, useState } from 'react'
import {
  CheckIcon,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

type PlayerInfoProps = {
  playerData: Player
}
export default function PlayerInfo({ playerData }: PlayerInfoProps) {
  const [msLeft, setMsLeft] = useState(calcMsLeft(playerData))
  const [timeGrant, setTimeGrant] = useState(10)
  const [timeTake, setTimeTake] = useState(10)

  const hasExpiration =
    playerData.faction === 'VAMPIRE' || playerData.faction === 'JACKAL'
  useEffect(() => {
    let interval: NodeJS.Timeout
    setMsLeft(calcMsLeft(playerData))
    if (!playerData.isPaused) {
      interval = setInterval(() => {
        setMsLeft(calcMsLeft(playerData))
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

  const creditKill = () => {
    socket.emit('creditKill', playerData.playerId, (res) => {
      console.log('ACK creditKill:', res)
    })
  }
  const creditRecruit = () => {
    socket.emit('creditRecruit', playerData.playerId, (res) => {
      console.log('ACK creditRecruit:', res)
    })
  }
  const removeKill = () => {
    socket.emit('removeKill', playerData.playerId, (res) => {
      console.log('ACK removeKill:', res)
    })
  }
  const removeRecruit = () => {
    socket.emit('removeRecruit', playerData.playerId, (res) => {
      console.log('ACK removeRecruit:', res)
    })
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
  const grantTime = () => {
    socket.emit('grantTime', playerData.playerId, timeGrant, (res) => {
      console.log('ACK grantTime:', res)
    })
  }
  const takeTime = () => {
    socket.emit('takeTime', playerData.playerId, timeTake, (res) => {
      console.log('ACK takeTime:', res)
    })
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
      {['VAMPIRE', 'JACKAL', 'NEUTRAL'].includes(playerData.faction) && (
        <div className="flex w-48 items-center justify-between gap-2">
          <Button
            className="rounded-full"
            variant="outline"
            size="icon"
            onClick={removeKill}
            disabled={playerData.kills < 1}
          >
            <MinusIcon />
          </Button>
          <div className="font-semibold">
            {playerData.faction === 'VAMPIRE' ? 'Bites' : 'Kills'}:{' '}
            {playerData.kills}{' '}
          </div>
          <Button
            className="rounded-full"
            variant="outline"
            size="icon"
            onClick={creditKill}
          >
            <PlusIcon />
          </Button>
        </div>
      )}
      {playerData.faction === 'JACKAL' && (
        <div className="flex w-48 items-center justify-between gap-2">
          <Button
            className="rounded-full"
            variant="outline"
            size="icon"
            onClick={removeRecruit}
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
            onClick={creditRecruit}
          >
            <PlusIcon />
          </Button>
        </div>
      )}

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
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <MinusIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="flex w-fit items-center gap-2"
              >
                <Input
                  type="number"
                  value={timeTake}
                  className="w-16"
                  onChange={(e) => setTimeTake(parseInt(e.target.value))}
                />
                <Button variant="outline" size="icon" onClick={takeTime}>
                  <CheckIcon />
                </Button>
              </PopoverContent>
            </Popover>
            <div className="text-center text-xl" suppressHydrationWarning>
              Expires:{' '}
              {msLeft === 0 ? (
                <span className="animate-pulse text-red-500">0:00</span>
              ) : (
                toDurationString(msLeft)
              )}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <PlusIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="flex w-fit items-center gap-2"
              >
                <Input
                  type="number"
                  className="w-16"
                  value={timeGrant}
                  onChange={(e) => setTimeGrant(parseInt(e.target.value))}
                />
                <Button variant="outline" size="icon" onClick={grantTime}>
                  <CheckIcon />
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { HeaderContext, type CellContext } from '@tanstack/react-table'
import { Player } from '@/app/types'
import { Badge } from '@/components/ui/badge'
import {
  ClockIcon,
  HandshakeIcon,
  ImageIcon,
  PauseIcon,
  PlayIcon,
  SkullIcon,
} from 'lucide-react'
import { calcMsLeft, toDurationString } from '@/utils/timeUtils'
import { cn } from '@/lib/utils'

export function PictureNameHeader({
  column,
}: HeaderContext<Player, Player['name']>) {
  return (
    <div className="flex items-center">
      <ImageIcon size={16} className="mx-4" />
      <span className="ms-4">Name</span>
    </div>
  )
}

export function PictureNameCell({ row }: CellContext<Player, Player['name']>) {
  return (
    <div className="flex items-center gap-4">
      <img
        alt="picture"
        className="h-12 !w-12 shrink-0 object-cover"
        src={row.original.picture ?? ''}
      />
      <div className="font-bold">{row.original.name}</div>
    </div>
  )
}

export function FactionHeader({
  column,
}: HeaderContext<Player, Player['faction']>) {
  return <div>Faction</div>
}

export function FactionCell({ row }: CellContext<Player, Player['faction']>) {
  return (
    <Badge
      className="capitalize"
      variant={
        row.original.faction.toLowerCase() as
          | 'neutral'
          | 'vampire'
          | 'jackal'
          | 'ghost'
      }
    >
      {row.original.faction.toLowerCase()}
    </Badge>
  )
}

export function KillsHeader({
  column,
}: HeaderContext<Player, Player['kills']>) {
  return (
    <div className="flex w-full justify-end">
      <SkullIcon size={16} />
    </div>
  )
}

export function KillsCell({ row }: CellContext<Player, Player['kills']>) {
  return <div className="text-right tabular-nums">{row.original.kills}</div>
}

export function RecruitsHeader({
  column,
}: HeaderContext<Player, Player['recruits']>) {
  return (
    <div className="flex w-full justify-end">
      <HandshakeIcon size={16} />
    </div>
  )
}

export function RecruitsCell({ row }: CellContext<Player, Player['recruits']>) {
  return <div className="text-right tabular-nums">{row.original.recruits}</div>
}

export function PausedHeader({
  column,
}: HeaderContext<Player, Player['isPaused']>) {
  return <></>
}

export function PausedCell({ row }: CellContext<Player, Player['isPaused']>) {
  return (
    <div className="flex items-center justify-center">
      {row.original.isPaused ? (
        <PauseIcon size={14} fill="currentColor" />
      ) : (
        <PlayIcon size={14} fill="currentColor" />
      )}
    </div>
  )
}

export function TimerHeader({
  column,
}: HeaderContext<Player, Player['expirationTime']>) {
  return (
    <div className="flex items-center justify-end">
      <ClockIcon size={15} />
    </div>
  )
}

export function TimerCell({
  row,
}: CellContext<Player, Player['expirationTime']>) {
  const [msLeft, setMsLeft] = useState(calcMsLeft(row.original))
  const hasExpiration =
    row.original.faction === 'VAMPIRE' || row.original.faction === 'JACKAL'

  useEffect(() => {
    let interval: NodeJS.Timeout
    setMsLeft(calcMsLeft(row.original))
    if (!row.original.isPaused) {
      interval = setInterval(() => {
        setMsLeft(calcMsLeft(row.original))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [row.original.isPaused, row.original.expirationTime])

  if (hasExpiration) {
    return (
      <div
        suppressHydrationWarning
        className={cn(
          'text-right tabular-nums',
          msLeft === 0 ? 'animate-pulse text-red-500' : ''
        )}
      >
        {msLeft === 0 ? (
          <span className="animate-pulse text-red-500">0:00</span>
        ) : (
          toDurationString(msLeft)
        )}
      </div>
    )
  } else {
    return <div className="text-right">—</div>
  }
}

import { HeaderContext, type CellContext } from '@tanstack/react-table'
import { type ExtendedCellContext } from '@/app/dashboard/ProfileTable/ProfileTableRow'
import { Player } from '@/app/types'
import { Badge } from '@/components/ui/badge'
import { ClockIcon, HandshakeIcon, SkullIcon } from 'lucide-react'
import { toDurationString } from '@/utils/timeUtils'
import Link from 'next/link'
import { useState } from 'react'

export function PictureHeader({
  column,
}: HeaderContext<Player, Player['picture']>) {
  return <></>
}

export function PictureCell({ row }: CellContext<Player, Player['picture']>) {
  const [showZoomed, setShowZoomed] = useState(false)

  return (
    <>
      {showZoomed && (
        <div
          className="fixed inset-0 flex h-[100dvh] w-[100dvw] items-center justify-center"
          onClick={() => setShowZoomed(false)}
        >
          <img
            alt="picture"
            className="w-[95%] object-cover"
            src={row.original.picture ?? ''}
          />
        </div>
      )}
      <img
        alt="picture"
        onClick={() => setShowZoomed(true)}
        className="h-12 w-12 object-cover"
        src={row.original.picture ?? ''}
      />
    </>
  )
}

export function NameHeader({ column }: HeaderContext<Player, Player['name']>) {
  return <div>Name</div>
}

export function NameCell({ row }: CellContext<Player, Player['name']>) {
  return (
    <Link
      className="text-cyan-500 underline"
      href={`/profile/${row.original.playerId}`}
    >
      {row.original.name}
    </Link>
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
  return <SkullIcon size={16} />
}

export function KillsCell({ row }: CellContext<Player, Player['kills']>) {
  return <div>{row.original.kills}</div>
}

export function RecruitsHeader({
  column,
}: HeaderContext<Player, Player['recruits']>) {
  return <HandshakeIcon size={16} />
}

export function RecruitsCell({ row }: CellContext<Player, Player['recruits']>) {
  return <div>{row.original.recruits}</div>
}

export function StatusHeader({
  column,
}: HeaderContext<Player, Player['isPaused']>) {
  return <div>Status</div>
}

export function StatusCell({ row }: CellContext<Player, Player['isPaused']>) {
  return <div>{`${row.original.isPaused}`}</div>
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

export function TimerCell(
  props: CellContext<Player, Player['expirationTime']>
) {
  const { player } = props as ExtendedCellContext<
    Player,
    Player['expirationTime']
  >
  const { isPaused, expirationTime } = player

  if (isPaused && expirationTime) {
    // TODO: calculate remaining time when paused? show blinking
    const remainingTime = Math.max(expirationTime.getTime() - Date.now(), 0)
    return (
      <div
        suppressHydrationWarning
        className={`${remainingTime === 0 ? 'animate-pulse text-red-500' : ''}`}
      >
        {toDurationString(remainingTime)}
      </div>
    )
  } else {
    return <div className="text-center">—</div>
  }
}

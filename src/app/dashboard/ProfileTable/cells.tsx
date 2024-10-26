import { HeaderContext, type CellContext } from '@tanstack/react-table'
import { type ExtendedCellContext } from '@/app/dashboard/ProfileTable/ProfileTableRow'
import { Player } from '@/app/types'
import { Badge } from '@/components/ui/badge'
import { ClockIcon } from 'lucide-react'
import { toDurationString } from '@/utils/timeUtils'

export function PictureHeader({
  column,
}: HeaderContext<Player, Player['picture']>) {
  return <></>
}

export function PictureCell({ row }: CellContext<Player, Player['picture']>) {
  return (
    <img
      alt="picture"
      className="h-12 w-12 object-cover"
      src={row.original.picture ?? ''}
    />
  )
}

export function NameHeader({ column }: HeaderContext<Player, Player['name']>) {
  return <div>Name</div>
}

export function NameCell({ row }: CellContext<Player, Player['name']>) {
  return <div>{row.original.name}</div>
}

export function FactionHeader({
  column,
}: HeaderContext<Player, Player['faction']>) {
  return <div>Faction</div>
}

export function FactionCell({ row }: CellContext<Player, Player['faction']>) {
  return <Badge>{row.original.faction}</Badge>
}

export function KillsHeader({
  column,
}: HeaderContext<Player, Player['kills']>) {
  return <div>Kills</div>
}

export function KillsCell({ row }: CellContext<Player, Player['kills']>) {
  return <div>{row.original.kills}</div>
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
      <ClockIcon size={14} />
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
    return <div>{toDurationString(expirationTime.getTime() - Date.now())}</div>
  } else {
    return <div className="text-center">—</div>
  }
}

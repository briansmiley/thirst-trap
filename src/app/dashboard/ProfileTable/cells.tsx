import { useEffect, useState } from 'react'
import { HeaderContext, type CellContext } from '@tanstack/react-table'
import { Player } from '@/app/types'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  ClockIcon,
  HandshakeIcon,
  ImageIcon,
  PauseIcon,
  PlayIcon,
  ShieldAlertIcon,
  SkullIcon,
} from 'lucide-react'
import { calcMsLeft, hasExpiration, toDurationString } from '@/utils/timeUtils'
import { cn } from '@/lib/utils'

export function PictureHeader({
  column,
}: HeaderContext<Player, Player['picture']>) {
  return (
    <div className="flex items-center">
      <ImageIcon size={16} className="mx-4" />
    </div>
  )
}

export function PictureCell({ row }: CellContext<Player, Player['picture']>) {
  const [showZoomed, setShowZoomed] = useState(false)
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowZoomed(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <>
      {showZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(evt) => {
            evt.stopPropagation()
            setShowZoomed(false)
          }}
        >
          <div className="relative flex aspect-square size-[600px] flex-col items-center overflow-hidden">
            <img
              alt="picture"
              className="z-10 size-full object-cover"
              src={row.original.picture ?? ''}
            />
            <div className="satisfy absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center bg-black bg-opacity-75 px-10 py-5 text-center text-4xl">
              <span className="text-center">{row.original.name}</span>
              <span className="text-lg text-neutral-300">
                id: {row.original.playerId}
              </span>
            </div>
          </div>
        </div>
      )}
      <img
        alt="picture"
        className="size-12 shrink-0 cursor-pointer object-cover"
        src={row.original.picture ?? ''}
        onClick={(e) => {
          e.stopPropagation()
          setShowZoomed(true)
        }}
      />
    </>
  )
}

export function NameHeader({ column }: HeaderContext<Player, Player['name']>) {
  return <div>Name</div>
}

export function NameCell({ row }: CellContext<Player, Player['name']>) {
  return <div className="font-bold">{row.original.name}</div>
}

export function PlayerIdHeader({
  column,
}: HeaderContext<Player, Player['playerId']>) {
  return <div>ID</div>
}

export function PlayerIdCell({ row }: CellContext<Player, Player['playerId']>) {
  return (
    <div className="text-sm font-semibold text-neutral-400 opacity-50">
      {row.original.playerId}
    </div>
  )
}

export function FlagsHeader({
  column,
}: HeaderContext<Player, Player['flags']>) {
  return (
    <div className="flex items-center justify-center">
      <ShieldAlertIcon size={16} />
    </div>
  )
}

export function FlagsCell({ row }: CellContext<Player, Player['flags']>) {
  return (
    <div className="text-center">
      {row.original.flags.length > 0 ? (
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="link"
                onClick={(event) => {
                  event.stopPropagation()
                }}
              >
                <div
                  className={`underline ${row.original.flags.length > 1 ? 'animate-alertFlash' : 'text-yellow-500'}`}
                >
                  {row.original.flags.length}
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent
              onClick={(event) => {
                event.stopPropagation()
              }}
              className="max-w-[80%]"
            >
              <DialogHeader>
                <DialogTitle>Flags</DialogTitle>
                <DialogDescription>
                  <ul className="list-disc pl-5 text-start">
                    {row.original.flags.map((flag, index) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </ul>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        row.original.flags.length
      )}
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
          | 'human'
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
  const [mounted, setMounted] = useState(false)
  const [msLeft, setMsLeft] = useState(0)

  useEffect(() => {
    setMounted(true)
    setMsLeft(calcMsLeft(row.original))

    let interval: NodeJS.Timeout
    if (!row.original.isPaused) {
      interval = setInterval(() => {
        setMsLeft(calcMsLeft(row.original))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [row.original.isPaused, row.original.expirationTime])

  if (hasExpiration(row.original)) {
    return (
      <div
        className={cn(
          'text-right tabular-nums',
          msLeft === 0 ? 'animate-pulse text-red-500' : ''
        )}
      >
        <span className={msLeft <= 0 ? 'animate-pulse text-red-500' : ''}>
          {mounted ? toDurationString(msLeft) : '...'}
        </span>
      </div>
    )
  } else {
    return <div className="text-right">—</div>
  }
}

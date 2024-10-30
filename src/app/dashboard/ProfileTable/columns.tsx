import { createColumnHelper } from '@tanstack/react-table'
import { type Player } from '@/app/types'
import { calcMsLeft, hasExpiration } from '@/utils/timeUtils'

import {
  FactionHeader,
  FactionCell,
  KillsHeader,
  KillsCell,
  RecruitsCell,
  RecruitsHeader,
  PausedHeader,
  PausedCell,
  TimerHeader,
  TimerCell,
  PlayerIdCell,
  PlayerIdHeader,
  FlagsHeader,
  FlagsCell,
  NameCell,
  NameHeader,
  PictureCell,
  PictureHeader,
} from '@/app/dashboard/ProfileTable/cells'

const columnHelper = createColumnHelper<Player>()

const columns = [
  columnHelper.accessor('picture', {
    header: PictureHeader,
    cell: PictureCell,
  }),
  columnHelper.accessor('name', {
    header: NameHeader,
    cell: NameCell,
  }),

  columnHelper.accessor('expirationTime', {
    sortingFn: (rowA, rowB) => {
      const hasExpirationA = hasExpiration(rowA.original)
      const hasExpirationB = hasExpiration(rowB.original)

      if (!hasExpirationA && hasExpirationB) return 1
      if (hasExpirationA && !hasExpirationB) return -1

      const timeLeftA = calcMsLeft(rowA.original)
      const timeLeftB = calcMsLeft(rowB.original)
      return timeLeftA - timeLeftB
    },
    header: TimerHeader,
    cell: TimerCell,
  }),
  columnHelper.accessor('playerId', {
    header: PlayerIdHeader,
    cell: PlayerIdCell,
  }),
  columnHelper.accessor('faction', {
    header: FactionHeader,
    cell: FactionCell,
  }),
  columnHelper.accessor('flags', {
    header: FlagsHeader,
    cell: FlagsCell,
  }),
  columnHelper.accessor('kills', {
    header: KillsHeader,
    cell: KillsCell,
  }),
  columnHelper.accessor('recruits', {
    header: RecruitsHeader,
    cell: RecruitsCell,
  }),
  columnHelper.accessor('isPaused', {
    header: PausedHeader,
    cell: PausedCell,
  }),
]

export default columns

import { createColumnHelper } from '@tanstack/react-table'
import { type Player } from '@/app/types'

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
    sortingFn: 'datetime',
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

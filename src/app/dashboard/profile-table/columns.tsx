import { createColumnHelper } from '@tanstack/react-table'
import { type Player } from '@/app/types'

import {
  PictureHeader,
  PictureCell,
  NameHeader,
  NameCell,
  FactionHeader,
  FactionCell,
  KillsHeader,
  KillsCell,
  StatusHeader,
  StatusCell,
  TimerHeader,
  TimerCell,
} from '@/app/dashboard/profile-table/cells'

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
  columnHelper.accessor('faction', {
    header: FactionHeader,
    cell: FactionCell,
  }),
  columnHelper.accessor('kills', {
    header: KillsHeader,
    cell: KillsCell,
  }),
  columnHelper.accessor('isPaused', {
    header: StatusHeader,
    cell: StatusCell,
  }),
  columnHelper.accessor('expirationTime', {
    header: TimerHeader,
    cell: TimerCell,
  }),
]

export default columns

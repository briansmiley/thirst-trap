'use client'

import { useState, useEffect } from 'react'
import {
  flexRender,
  type Row,
  type CellContext,
  type RowData,
} from '@tanstack/react-table'
import { TableRow, TableCell } from '@/components/ui/table'
import { type Player } from '@/app/types'

export type ExtendedCellContext<TData extends RowData, TValue> = CellContext<
  TData,
  TValue
> & {
  player: Player
}

export default function ProfileTableRow({ row }: { row: Row<Player> }) {
  const [player, setPlayer] = useState(row.original)

  useEffect(() => {
    // socket updates state
  }, [])

  return (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && 'selected'}
      // className="group/row"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, {
            ...cell.getContext(),
            player,
          })}
        </TableCell>
      ))}
    </TableRow>
  )
}

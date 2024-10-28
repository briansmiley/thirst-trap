'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  type SortingState,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table'
import columns from '@/app/dashboard/ProfileTable/columns'

import ProfileTableRow from '@/app/dashboard/ProfileTable/ProfileTableRow'
import { useAppStore } from '@/lib/stores/AppStoreProvider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ProfileTable() {
  const { players } = useAppStore(({ players }) => ({ players }))
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: players,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  const toggleSort = (label?: string) => () =>
    setSorting(
      label
        ? [{ id: label, desc: !(sorting[0]?.id !== label || sorting[0]?.desc) }]
        : []
    )

  return (
    <main>
      <div className="flex gap-4 px-4">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex justify-between gap-2 capitalize"
              variant="outline"
            >
              Sort:{' '}
              <span className="font-extrabold">
                {sorting.length
                  ? sorting[0].id === 'expirationTime'
                    ? 'Time'
                    : sorting[0].id
                  : 'none'}
              </span>
              {sorting.length ? (
                sorting[0]?.desc ? (
                  <ArrowDownIcon size={18} />
                ) : (
                  <ArrowUpIcon size={18} />
                )
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className={cn(
                'flex justify-between gap-4',
                !sorting.length ? 'font-extrabold' : ''
              )}
              onClick={toggleSort()}
            >
              None
            </DropdownMenuItem>
            <DropdownMenuItem
              className={cn(
                'flex justify-between gap-4',
                sorting[0]?.id === 'kills' ? 'font-extrabold' : ''
              )}
              onClick={toggleSort('kills')}
            >
              Kills
              {sorting[0]?.id === 'kills' ? (
                sorting[0]?.desc ? (
                  <ArrowDownIcon size={18} />
                ) : (
                  <ArrowUpIcon size={18} />
                )
              ) : null}
            </DropdownMenuItem>
            <DropdownMenuItem
              className={cn(
                'flex justify-between gap-4',
                sorting[0]?.id === 'recruits' ? 'font-extrabold' : ''
              )}
              onClick={toggleSort('recruits')}
            >
              Recruits
              {sorting[0]?.id === 'recruits' ? (
                sorting[0]?.desc ? (
                  <ArrowDownIcon size={18} />
                ) : (
                  <ArrowUpIcon size={18} />
                )
              ) : null}
            </DropdownMenuItem>
            <DropdownMenuItem
              className={cn(
                'flex justify-between gap-4',
                sorting[0]?.id === 'expirationTime' ? 'font-extrabold' : ''
              )}
              onClick={toggleSort('expirationTime')}
            >
              Time
              {sorting[0]?.id === 'expirationTime' ? (
                sorting[0]?.desc ? (
                  <ArrowDownIcon size={18} />
                ) : (
                  <ArrowUpIcon size={18} />
                )
              ) : null}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table
              .getRowModel()
              .rows.map((row) => <ProfileTableRow key={row.id} row={row} />)
          ) : (
            <TableRow className="block">
              <TableCell className="h-24 justify-center">No results.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
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
  type ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  getSortedRowModel,
  useReactTable,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
} from '@tanstack/react-table'
import columns from '@/app/dashboard/ProfileTable/columns'

import { useAppStore } from '@/lib/stores/AppStoreProvider'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowDownIcon,
  ArrowDownNarrowWideIcon,
  ArrowDownWideNarrowIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ArrowUpNarrowWideIcon,
  ArrowUpWideNarrowIcon,
  ChevronDownIcon,
  EyeIcon,
  FilterIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function ProfileTable() {
  const {
    players,
    columnVisibility,
    setColumnVisibility,
    initializeFromStorage,
    columnFilters,
    setColumnFilters,
    columnSorting,
    setColumnSorting,
  } = useAppStore((state) => ({
    players: state.players,
    columnVisibility: state.columnVisibility,
    setColumnVisibility: state.setColumnVisibility,
    columnFilters: state.columnFilters,
    setColumnFilters: state.setColumnFilters,
    columnSorting: state.columnSorting,
    setColumnSorting: state.setColumnSorting,
    initializeFromStorage: state.initializeFromStorage,
  }))
  const router = useRouter()

  const [globalFilter, setGlobalFilter] = useState('')

  useEffect(() => {
    initializeFromStorage()
    setColumnSorting([{ id: 'expirationTime', desc: false }])
  }, [initializeFromStorage])

  const handleVisibilityChange: OnChangeFn<VisibilityState> = (
    updaterOrValue
  ) => {
    const newValue =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(columnVisibility)
        : updaterOrValue
    setColumnVisibility(newValue)
  }

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    const newValue =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(columnSorting)
        : updaterOrValue
    setColumnSorting(newValue)
  }

  const handleFiltersChange: OnChangeFn<ColumnFiltersState> = (
    updaterOrValue
  ) => {
    const newValue =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(columnFilters)
        : updaterOrValue
    setColumnFilters(newValue)
  }

  const table = useReactTable({
    data: players,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleFiltersChange,
    onColumnVisibilityChange: handleVisibilityChange,
    state: {
      sorting: columnSorting,
      columnFilters,
      columnVisibility,
    },
  })

  const sortIcon = () => {
    if (columnSorting.length === 0) return <ArrowUpDownIcon /> // None
    if (columnSorting[0]?.desc) return <ArrowDownWideNarrowIcon /> // Descending
    return <ArrowUpNarrowWideIcon /> // Ascending
  }
  const toggleSort = (label?: string) => () =>
    handleSortingChange(
      label
        ? [
            {
              id: label,
              desc: !(columnSorting[0]?.id !== label || columnSorting[0]?.desc),
            },
          ]
        : []
    )
  return (
    <main className="mx-auto w-full max-w-[750px] px-4">
      <div className="flex items-start justify-start gap-1 py-4 sm:gap-4 sm:py-4">
        {/* Sorting */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button className="pr-1 capitalize" variant="outline">
              {sortIcon()}
              <span className="font-extrabold">
                {columnSorting.length
                  ? columnSorting[0].id === 'expirationTime'
                    ? 'Time'
                    : columnSorting[0].id
                  : 'Sort'}
              </span>
              <ChevronDownIcon size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className={cn(
                'flex justify-between gap-4',
                !columnSorting.length ? 'font-extrabold' : ''
              )}
              onClick={toggleSort()}
            >
              None
            </DropdownMenuItem>
            <DropdownMenuItem
              className={cn(
                'flex justify-between gap-4',
                columnSorting[0]?.id === 'kills' ? 'font-extrabold' : ''
              )}
              onClick={toggleSort('kills')}
            >
              Kills
              {columnSorting[0]?.id === 'kills' ? (
                columnSorting[0]?.desc ? (
                  <ArrowDownIcon size={18} />
                ) : (
                  <ArrowUpIcon size={18} />
                )
              ) : null}
            </DropdownMenuItem>
            <DropdownMenuItem
              className={cn(
                'flex justify-between gap-4',
                columnSorting[0]?.id === 'recruits' ? 'font-extrabold' : ''
              )}
              onClick={toggleSort('recruits')}
            >
              Recruits
              {columnSorting[0]?.id === 'recruits' ? (
                columnSorting[0]?.desc ? (
                  <ArrowDownIcon size={18} />
                ) : (
                  <ArrowUpIcon size={18} />
                )
              ) : null}
            </DropdownMenuItem>
            <DropdownMenuItem
              className={cn(
                'flex justify-between gap-4',
                columnSorting[0]?.id === 'expirationTime'
                  ? 'font-extrabold'
                  : ''
              )}
              onClick={toggleSort('expirationTime')}
            >
              Time
              {columnSorting[0]?.id === 'expirationTime' ? (
                columnSorting[0]?.desc ? (
                  <ArrowDownIcon size={18} />
                ) : (
                  <ArrowUpIcon size={18} />
                )
              ) : null}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Filtering */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="pr-1">
              <FilterIcon />{' '}
              {table.getColumn('faction')?.getFilterValue() ? (
                <Badge
                  className="capitalize"
                  variant={
                    String(
                      table.getColumn('faction')?.getFilterValue()
                    ).toLowerCase() as 'human' | 'vampire' | 'jackal' | 'ghost'
                  }
                >
                  {String(
                    table.getColumn('faction')?.getFilterValue()
                  ).toLowerCase()}
                </Badge>
              ) : (
                <span className="font-extrabold">None</span>
              )}
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32">
            <DropdownMenuLabel>Faction</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={table.getColumn('faction')?.getFilterValue() as string}
              onValueChange={(value) => {
                table.getColumn('faction')?.setFilterValue(value)
              }}
            >
              <DropdownMenuRadioItem value="">None</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="HUMAN">
                <Badge variant="human">Human</Badge>
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
        {/* Visibility   */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="pr-1">
              <EyeIcon /> <ChevronDownIcon size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-x-auto">
        <Table className="max-w-full overflow-x-auto border border-neutral-700">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.column.columnDef.size
                        ? `${header.column.columnDef.size}px`
                        : 'auto',
                    }}
                  >
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() =>
                    router.push(`/profile/${row.original.playerId}`)
                  }
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.columnDef.size
                          ? `${cell.column.columnDef.size}px`
                          : 'auto',
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, {
                        ...cell.getContext(),
                      })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="block">
                <TableCell className="h-24 justify-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}

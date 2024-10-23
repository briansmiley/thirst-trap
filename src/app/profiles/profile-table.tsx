"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import ProfileTableRow from "@/app/profiles/profile-table/profile-table-row";
import columns from "@/app/profiles/profile-table/columns";
import { type Player } from "@/app/types";

export default function ProfileTable({ data }: { data: Player[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
  );
}

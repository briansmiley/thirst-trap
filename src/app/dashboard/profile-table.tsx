"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from "@/components/ui/table";
import {
  useReactTable,
  flexRender,
  getCoreRowModel
} from "@tanstack/react-table";
import columns from "@/app/dashboard/profile-table/columns";
import { type Player } from "@/app/types";

import { socket } from "@/socket";
import ProfileTableRow from "@/app/dashboard/profile-table/profile-table-row";

export default function ProfileTable(props: { data: Player[] }) {
  const [data, setData] = useState(props.data);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  useEffect(() => {
    function onAddPlayer(player: Player) {
      console.log("onAddPlayer");
      setData(data => [...data, player]);
    }

    socket.on("addPlayer", onAddPlayer);

    return () => {
      socket.off("addPlayer", onAddPlayer);
    };
  }, []);

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
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
            .rows.map(row => <ProfileTableRow key={row.id} row={row} />)
        ) : (
          <TableRow className="block">
            <TableCell className="h-24 justify-center">No results.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

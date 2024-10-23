"use client";

import { useState } from "react";
import {
  flexRender,
  type Row,
  type CellContext,
  type RowData,
} from "@tanstack/react-table";
import { TableRow, TableCell } from "@/components/ui/table";
import { type Player } from "@/app/types";

export type ExtendedCellContext<TData extends RowData, TValue> = CellContext<
  TData,
  TValue
> & {
  // state passed into cells
};

export default function ProfileTableRow({ row }: { row: Row<Player> }) {
  return (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && "selected"}
      // className="group/row"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, {
            ...cell.getContext(),
            // state passed into cells
          })}
        </TableCell>
      ))}
    </TableRow>
  );
}

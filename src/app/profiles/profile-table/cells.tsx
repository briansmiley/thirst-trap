import { HeaderContext, type CellContext } from "@tanstack/react-table";
import { type ExtendedCellContext } from "@/app/profiles/profile-table/profile-table-row";
import { Player } from "@/app/types";

export function IdHeader({
  column,
}: HeaderContext<Player, Player["playerId"]>) {
  return <div>Id</div>;
}

export function IdCell({ row }: CellContext<Player, Player["playerId"]>) {
  return <div>{row.original.playerId}</div>;
}

export function NameHeader({ column }: HeaderContext<Player, Player["name"]>) {
  return <div>Name</div>;
}

export function NameCell({ row }: CellContext<Player, Player["name"]>) {
  return <div>{row.original.name}</div>;
}

export function FactionHeader({
  column,
}: HeaderContext<Player, Player["faction"]>) {
  return <div>Faction</div>;
}

export function FactionCell({ row }: CellContext<Player, Player["faction"]>) {
  return <div>{row.original.faction}</div>;
}

export function KillsHeader({
  column,
}: HeaderContext<Player, Player["kills"]>) {
  return <div>Kills</div>;
}

export function KillsCell({ row }: CellContext<Player, Player["kills"]>) {
  return <div>{row.original.kills}</div>;
}

export function StatusHeader({
  column,
}: HeaderContext<Player, Player["isPaused"]>) {
  return <div>Status</div>;
}

export function StatusCell({ row }: CellContext<Player, Player["isPaused"]>) {
  return <div>{row.original.isPaused}</div>;
}

export function TimerHeader({
  column,
}: HeaderContext<Player, Player["expirationTime"]>) {
  return <div>Kill Timer</div>;
}

export function TimerCell({
  row,
}: CellContext<Player, Player["expirationTime"]>) {
  return <div>{row.original.expirationTime?.toDateString()}</div>;
}

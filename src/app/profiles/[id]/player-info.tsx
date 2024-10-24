"use client";

import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { Player } from "@/app/types";
import { Badge } from "@/components/ui/badge";

export default function PlayerInfo(props: Player) {
  const [playerData, setPlayerData] = useState(props);

  useEffect(() => {
    // placeholder boilerplate for handling websocket state changes to this data
    // maybe use specific events? or player based events? idk
    // function onPlayerChange(changes: Partial<Player>) {
    //   setPlayerData({ ...playerData, ...changes });
    // }
    // socket.on("playerChange", onPlayerChange);

    // return () => {
    //   socket.off("playerChange", onPlayerChange);
    // };
  });

  return (
    <div className="flex flex-col gap-4 p-8 items-center">
      <img
        src={playerData.picture ?? ""}
        className="w-72 h-72 border m-auto object-cover"
      />
      <div className="flex flex-col gap-2 items-center">
        <h1 className="font-semibold text-3xl">{playerData.name}</h1>
        <Badge variant="default" className="p-2">
          {playerData.faction}
        </Badge>
        <div className="font-semibold">{playerData.kills} kills</div>
        <div>
          {playerData.isPaused
            ? "PAUSED"
            : `Expires: ${playerData.expirationTime?.toDateString()}`}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { Faction, Player } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function PlayerInfo(props: Player) {
  const [playerData, setPlayerData] = useState(props);

  const handleFactionChange = (faction: Faction) => {
    //TODO: send faction change to server
    console.log(`Update sending: ${playerData.name} to ${faction}`);
  };

  useEffect(() => {
    // placeholder boilerplate for handling websocket state changes to this data
    // maybe use specific events? or player based events? idk
    function onPlayerChange(changes: Partial<Player>) {
      setPlayerData({ ...playerData, ...changes });
    }
    socket.on("playerChange", onPlayerChange);

    return () => {
      socket.off("playerChange", onPlayerChange);
    };
  });

  return (
    <div className="flex flex-col gap-4 p-8 items-center">
      <img
        alt={`Profile photo for ${playerData.name}`}
        src={playerData.picture ?? ""}
        className="w-72 h-72 border m-auto object-cover"
      />
      <div className="flex flex-col gap-2 items-center">
        <h1 className="font-semibold text-3xl">{playerData.name}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {playerData.faction.charAt(0) +
                playerData.faction.slice(1).toLowerCase()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Faction</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={playerData.faction}
              onValueChange={value => {
                setPlayerData({
                  ...playerData,
                  faction: value as Faction
                });
                handleFactionChange(value as Faction);
              }}
            >
              <DropdownMenuRadioItem value="NEUTRAL">
                Neutral
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="VAMPIRE">
                Vampire
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="JACKAL">
                Jackal
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="GHOST">Ghost</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="font-semibold">{playerData.kills} kills</div>
        <div className="font-semibold">{playerData.recruits} kills</div>
        <div>
          {playerData.isPaused
            ? "PAUSED"
            : `Expires: ${playerData.expirationTime?.toDateString()}`}
        </div>
      </div>
    </div>
  );
}

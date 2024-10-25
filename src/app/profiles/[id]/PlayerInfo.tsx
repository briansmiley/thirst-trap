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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PlayerInfo(props: Player) {
  const [playerData, setPlayerData] = useState(props);

  const handleFactionChange = (faction: Faction) => {
    console.log("EMIT updatePlayer:", { playerId: props.playerId, faction });
    socket.emit(
      "updatePlayer",
      { playerId: props.playerId, faction },
      (response) => {
        console.log("ACK updatePlayer:", response);
      }
    );
  };

  const handleCountChange =
    (type: "kills" | "recruits") => (change: number) => {
      console.log("EMIT updatePlayer:", {
        playerId: props.playerId,
        [type]: playerData[type] + change,
      });
      socket.emit(
        "updatePlayer",
        { playerId: props.playerId, [type]: playerData[type] + change },
        (response) => {
          console.log("ACK updatePlayer:", response);
        }
      );
    };

  useEffect(() => {
    function onUpdatePlayer({
      playerId,
      ...changes
    }: Partial<Player> & Pick<Player, "playerId">) {
      if (playerId === props.playerId) {
        setPlayerData({ ...playerData, ...changes });
      }
    }

    socket.on("updatePlayer", onUpdatePlayer);

    return () => {
      socket.off("updatePlayer", onUpdatePlayer);
    };
  });

  return (
    <div className="flex flex-col gap-4 p-8 items-center h-[100dvh]">
      <img
        alt={`Profile photo for ${playerData.name}`}
        src={playerData.picture ?? ""}
        className="w-72 h-72 border m-auto object-cover"
      />
      <div className="flex flex-col justify-between h-full grow-1">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="font-semibold text-3xl">{playerData.name}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Badge variant="outline">
                  {playerData.faction.charAt(0) +
                    playerData.faction.slice(1).toLowerCase()}
                </Badge>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
              <DropdownMenuLabel>Faction</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={playerData.faction}
                onValueChange={(value) => {
                  handleFactionChange(value as Faction);
                }}
              >
                <DropdownMenuRadioItem value="NEUTRAL">
                  <Badge variant="outline">Neutral</Badge>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="VAMPIRE">
                  <Badge variant="outline">Vampire</Badge>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="JACKAL">
                  <Badge variant="outline">Jackal</Badge>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="GHOST">
                  <Badge variant="outline">Ghost</Badge>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex gap-2 items-center justify-between w-48">
            <Button
              className="rounded-full"
              variant="outline"
              size="icon"
              onClick={() => handleCountChange("kills")(-1)}
              disabled={playerData.kills < 1}
            >
              <Minus />
            </Button>
            <div className="font-semibold">Kills: {playerData.kills} </div>
            <Button
              className="rounded-full"
              variant="outline"
              size="icon"
              onClick={() => handleCountChange("kills")(1)}
            >
              <Plus />
            </Button>
          </div>
          <div className="flex gap-2 items-center justify-between w-48">
            <Button
              className="rounded-full"
              variant="outline"
              size="icon"
              onClick={() => handleCountChange("recruits")(-1)}
              disabled={playerData.recruits < 1}
            >
              <Minus />
            </Button>
            <div className="font-semibold">
              Recruits: {playerData.recruits || 0}
            </div>
            <Button
              className="rounded-full"
              variant="outline"
              size="icon"
              onClick={() => handleCountChange("recruits")(1)}
            >
              <Plus />
            </Button>
          </div>
        </div>
        <div className="text-xl text-center">
          {playerData.isPaused
            ? "PAUSED"
            : `Expires: ${
                playerData.expirationTime
                  ? playerData.expirationTime.toDateString()
                  : "-"
              }`}
        </div>
      </div>
    </div>
  );
}

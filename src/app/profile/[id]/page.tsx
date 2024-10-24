import playerService from "@/server/services/player";

import NewProfileForm from "./NewProfileForm";
import PlayerInfo from "./PlayerInfo";

async function getPlayerData(id: string) {
  "use server";
  return await playerService.get(id);
}

export default async function ProfilePage({
  params
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const playerData = await getPlayerData(id);

  return playerData ? (
    <PlayerInfo {...playerData} />
  ) : (
    <NewProfileForm id={id} />
  );
}

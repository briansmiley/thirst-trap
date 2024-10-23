import playerService from "@/server/services/player";

import NewProfileForm from "./new-profile-form";
import PlayerInfo from "./player-info";

async function getPlayerData(id: string) {
  "use server";
  return await playerService.get(id);
}

export default async function ProfilePage({
  params,
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

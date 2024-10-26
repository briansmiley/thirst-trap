import playerService from '@/server/services/player'
import ProfileTable from '@/app/dashboard/ProfileTable'

async function getPlayersData() {
  'use server'
  return await playerService.getAll()
}

export default async function ProfilesPage() {
  const data = await getPlayersData()
  return (
    <div>
      <h1>Players</h1>
      <ProfileTable data={data} />
    </div>
  )
}

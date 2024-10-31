'use client'
import { useAppStore } from '@/lib/stores/AppStoreProvider'
import NewProfileForm from './NewProfileForm'
import PlayerInfo from './PlayerInfo'

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { player } = useAppStore((state) => ({
    player: state.players.find(
      (p) => p.playerId.toLowerCase() === params.id.toLowerCase()
    ),
  }))

  return player ? (
    <PlayerInfo playerData={player} />
  ) : (
    <NewProfileForm id={params.id} />
  )
}

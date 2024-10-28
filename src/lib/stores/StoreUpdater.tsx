'use client'

import { useSocketSubscription } from '@/socket/client'
import { useAppStore } from '@/lib/stores/AppStoreProvider'
import { socket } from '@/socket/client'

export default function StoreUpdater() {
  const { addPlayer, updatePlayer, updateAllPlayers, updateSettings } =
    useAppStore((state) => ({
      addPlayer: state.addPlayer,
      updatePlayer: state.updatePlayer,
      updateAllPlayers: state.updateAllPlayers,
      updateSettings: state.updateSettings,
    }))

  useSocketSubscription('addPlayer', (player) => {
    console.log('ON addPlayer:', socket.id, player)
    addPlayer(player)
  })

  useSocketSubscription('updatePlayer', (player) => {
    console.log('ON updatePlayer:', socket.id, player)
    updatePlayer(player)
  })

  useSocketSubscription('updateSettings', (settings) => {
    console.log('ON updateSettings:', socket.id, settings)
    updateSettings(settings)
  })
  useSocketSubscription('updateAllPlayers', (players) => {
    console.log('ON updateAllPlayers:', socket.id, players)
    updateAllPlayers(players)
  })
  return <></>
}

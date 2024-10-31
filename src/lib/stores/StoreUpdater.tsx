'use client'

import { useSocketSubscription, updateSocketOffset } from '@/socket/client'
import { useAppStore } from '@/lib/stores/AppStoreProvider'
import { socket } from '@/socket/client'

export default function StoreUpdater() {
  const {
    addPlayer,
    deletePlayer,
    updatePlayer,
    updateAllPlayers,
    updateSettings,
  } = useAppStore((state) => ({
    addPlayer: state.addPlayer,
    deletePlayer: state.deletePlayer,
    updatePlayer: state.updatePlayer,
    updateAllPlayers: state.updateAllPlayers,
    updateSettings: state.updateSettings,
  }))

  useSocketSubscription('addPlayer', ({ evtId, player }) => {
    console.log('ON addPlayer:', socket.id, player)
    addPlayer(player)
    updateSocketOffset(evtId)
  })
  useSocketSubscription('deletePlayer', ({ evtId, playerId }) => {
    console.log('ON deletePlayer:', socket.id, playerId)
    deletePlayer(playerId)
    updateSocketOffset(evtId)
  })
  useSocketSubscription('updatePlayer', ({ evtId, player }) => {
    console.log('ON updatePlayer:', socket.id, player)
    updatePlayer(player)
    updateSocketOffset(evtId)
  })

  useSocketSubscription('updateSettings', ({ evtId, settings }) => {
    console.log('ON updateSettings:', socket.id, settings)
    updateSettings(settings)
    updateSocketOffset(evtId)
  })
  useSocketSubscription('updateAllPlayers', ({ evtId, players }) => {
    console.log('ON updateAllPlayers:', socket.id, players)
    updateAllPlayers(players)
    updateSocketOffset(evtId)
  })
  useSocketSubscription('reStore', ({ evtId, players, settings }) => {
    console.log('ON reStore:', socket.id)
    updateAllPlayers(players)
    updateSettings(settings)
    updateSocketOffset(evtId)
  })

  return <></>
}

import { createStore } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  type PlayerSlice,
  createPlayerSlice,
} from '@/lib/stores/slices/playerSlice'
import {
  type SettingsSlice,
  createSettingsSlice,
} from '@/lib/stores/slices/settingsSlice'
import { createTableSlice, TableStoreSlice } from './slices/tableSlice'
import type { Player } from '@/app/types'

export type AppStore = PlayerSlice & SettingsSlice & TableStoreSlice

export interface InitAppStoreProps {
  players: PlayerSlice['players']
  settings: SettingsSlice['settings']
}

const STORAGE_KEY = 'thirst-trap-store'

// localStorage serializes Date as ISO strings; rehydrate them back to Date so
// the rest of the app keeps the same shape it had with the live socket setup.
const reviveDates = (players: Player[]): Player[] =>
  players.map((p) => ({
    ...p,
    pausedAt: new Date(p.pausedAt),
    expirationTime: new Date(p.expirationTime),
  }))

export const createAppStore = (initProps: InitAppStoreProps) => {
  return createStore<AppStore>()(
    persist(
      (...a) => ({
        ...createPlayerSlice(initProps)(...a),
        ...createSettingsSlice(initProps)(...a),
        ...createTableSlice()(...a),
      }),
      {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          players: state.players,
          settings: state.settings,
        }),
        onRehydrateStorage: () => (state) => {
          if (!state) return
          state.players = reviveDates(state.players)
        },
        // Wait for an explicit rehydrate call after mount so SSR/CSR markup
        // matches on the first paint.
        skipHydration: true,
      }
    )
  )
}

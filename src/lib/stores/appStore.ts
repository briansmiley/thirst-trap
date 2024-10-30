import { createStore } from 'zustand'
import {
  type PlayerSlice,
  createPlayerSlice,
} from '@/lib/stores/slices/playerSlice'
import {
  type SettingsSlice,
  createSettingsSlice,
} from '@/lib/stores/slices/settingsSlice'
import { createTableSlice, TableStoreSlice } from './slices/tableSlice'

export type AppStore = PlayerSlice & SettingsSlice & TableStoreSlice

export interface InitAppStoreProps {
  players: PlayerSlice['players']
  settings: SettingsSlice['settings']
}

export const createAppStore = (initProps: InitAppStoreProps) => {
  return createStore<AppStore>()((...a) => ({
    ...createPlayerSlice(initProps)(...a),
    ...createSettingsSlice(initProps)(...a),
    ...createTableSlice()(...a),
  }))
}

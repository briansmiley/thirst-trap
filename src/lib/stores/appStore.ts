import { createStore } from 'zustand'
import {
  type PlayerSlice,
  createPlayerSlice,
} from '@/lib/stores/slices/playerSlice'
import {
  type SettingsSlice,
  createSettingsSlice,
} from '@/lib/stores/slices/settingsSlice'

export type AppStore = PlayerSlice & SettingsSlice

export interface InitAppStoreProps {
  players: PlayerSlice['players'],
  settings: SettingsSlice['settings'],
}

export const createAppStore = (initProps: InitAppStoreProps) => {
  return createStore<AppStore>()((...a) => ({
    ...createPlayerSlice(initProps)(...a),
    ...createSettingsSlice(initProps)(...a),
  }))
}

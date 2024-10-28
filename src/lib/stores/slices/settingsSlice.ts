import { type StateCreator } from 'zustand'
import { type AppStore, type InitAppStoreProps } from '@/lib/stores/appStore'
import { Settings } from '@/app/types'

export interface SettingsSlice {
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void
}

export const createSettingsSlice: (
  initProps: InitAppStoreProps
) => StateCreator<AppStore, [], [], SettingsSlice> =
  ({ settings }) =>
  (set, get) => ({
    settings,
    updateSettings: (newSettings) => {
      const { settings } = get()
      set({ settings: { ...settings, ...newSettings } })
    },
  })

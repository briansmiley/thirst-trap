import { createStore } from 'zustand'
import {
  type PlayerSlice,
  createPlayerSlice,
} from '@/lib/stores/slices/playerSlice'

export type AppStore = PlayerSlice

export interface InitAppStoreProps {
  players: PlayerSlice['players']
}

export const createAppStore = (initProps: InitAppStoreProps) => {
  return createStore<AppStore>()((...a) => ({
    ...createPlayerSlice(initProps)(...a),
  }))
}

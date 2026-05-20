'use client'
import 'client-only'
import { createContext, useEffect, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import {
  type AppStore,
  type InitAppStoreProps,
  createAppStore,
} from '@/lib/stores/appStore'
import { setLocalSocketStore } from '@/socket/client'
import { loadSeed } from '@/lib/seed'

export type AppStoreApi = ReturnType<typeof createAppStore>

export const AppStoreContext = createContext<AppStoreApi | undefined>(undefined)

export interface AppStoreProviderProps {
  children: React.ReactNode
  initProps: InitAppStoreProps
}

export const AppStoreProvider = ({
  children,
  initProps,
}: AppStoreProviderProps) => {
  const storeRef = useRef<AppStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createAppStore(initProps)
    setLocalSocketStore(storeRef.current)
  }

  useEffect(() => {
    const store = storeRef.current
    if (!store) return
    let cancelled = false

    const finish = async () => {
      // persist middleware uses skipHydration: true so SSR/CSR markup matches.
      // Pull persisted state in now, then fall back to the seed JSON on a
      // browser that hasn't visited before.
      await store.persist.rehydrate()
      if (cancelled) return
      if (store.getState().players.length === 0) {
        try {
          const seed = await loadSeed()
          if (cancelled) return
          store.setState({ players: seed.players, settings: seed.settings })
        } catch (err) {
          console.error('Failed to load seed data', err)
        }
      }
    }
    finish()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  )
}

export const useAppStore = <T,>(selector: (store: AppStore) => T): T => {
  const storeContext = useContext(AppStoreContext)

  if (!storeContext) {
    throw new Error(`useAppStore must be used within AppStoreProvider`)
  }

  return useStore(storeContext, selector)
}

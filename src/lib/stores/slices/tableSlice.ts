import { type StateCreator } from 'zustand'
import { type AppStore } from '@/lib/stores/appStore'
import { VisibilityState } from '@tanstack/react-table'

const STORAGE_KEY = 'tableVisibility'

// Helper to safely handle localStorage
const getStoredVisibility = (): VisibilityState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export interface TableStoreSlice {
  columnVisibility: VisibilityState
  setColumnVisibility: (visibility: VisibilityState) => void
  initializeFromStorage: () => void
}

export const createTableSlice: () => StateCreator<
  AppStore,
  [],
  [],
  TableStoreSlice
> = () => (set) => ({
  columnVisibility: {}, // Start with empty object for SSR
  setColumnVisibility: (newVisibility) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVisibility))
    }
    set((state) => ({ ...state, columnVisibility: newVisibility }))
  },
  initializeFromStorage: () => {
    if (typeof window !== 'undefined') {
      set((state) => ({
        ...state,
        columnVisibility: getStoredVisibility(),
      }))
    }
  },
})

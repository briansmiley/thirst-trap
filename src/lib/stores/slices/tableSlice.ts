import { type StateCreator } from 'zustand'
import { type AppStore } from '@/lib/stores/appStore'
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'

const STORAGE_KEY = 'tableState'

// Helper to safely handle localStorage
const getStoredState = (): {
  columnVisibility: VisibilityState
  columnFilters: ColumnFiltersState
  columnSorting: SortingState
} => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored
      ? JSON.parse(stored)
      : { columnVisibility: {}, columnFilters: [], columnSorting: [] }
  } catch {
    return { columnVisibility: {}, columnFilters: [], columnSorting: [] }
  }
}

export interface TableStoreSlice {
  columnVisibility: VisibilityState
  columnFilters: ColumnFiltersState
  columnSorting: SortingState
  setColumnVisibility: (visibility: VisibilityState) => void
  setColumnFilters: (filters: ColumnFiltersState) => void
  setColumnSorting: (sorting: SortingState) => void
  initializeFromStorage: () => void
}

export const createTableSlice: () => StateCreator<
  AppStore,
  [],
  [],
  TableStoreSlice
> = () => (set) => ({
  columnVisibility: {}, // Start with empty object for SSR
  columnFilters: [],
  columnSorting: [],
  setColumnVisibility: (newVisibility) => {
    if (typeof window !== 'undefined') {
      const storedState = getStoredState()
      storedState.columnVisibility = newVisibility
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedState))
    }
    set((state) => ({ ...state, columnVisibility: newVisibility }))
  },
  setColumnFilters: (newFilters) => {
    if (typeof window !== 'undefined') {
      const storedState = getStoredState()
      storedState.columnFilters = newFilters
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedState))
    }
    set((state) => ({ ...state, columnFilters: newFilters }))
  },
  setColumnSorting: (newSorting) => {
    if (typeof window !== 'undefined') {
      const storedState = getStoredState()
      storedState.columnSorting = newSorting
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedState))
    }
    set((state) => ({ ...state, columnSorting: newSorting }))
  },
  initializeFromStorage: () => {
    if (typeof window !== 'undefined') {
      const storedState = getStoredState()
      set((state) => ({
        ...state,
        columnVisibility: storedState.columnVisibility,
        columnFilters: storedState.columnFilters,
        columnSorting: storedState.columnSorting,
      }))
    }
  },
})

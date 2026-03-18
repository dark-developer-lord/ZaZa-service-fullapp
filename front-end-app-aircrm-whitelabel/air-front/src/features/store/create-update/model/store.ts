import { create } from 'zustand'

import { StoreItem } from '@entities/stores'

interface Store {
  createOpened: boolean
  updateOpened: StoreItem | null
  openCreate: () => void
  closeCreate: () => void
  openUpdate: (category: StoreItem) => void
  closeUpdate: () => void
}

export const useStore = create<Store>((set) => ({
  createOpened: false,
  updateOpened: null,
  openCreate: () => set({ createOpened: true }),
  closeCreate: () => set({ createOpened: false }),
  openUpdate: (category) => set({ updateOpened: category }),
  closeUpdate: () => set({ updateOpened: null }),
}))

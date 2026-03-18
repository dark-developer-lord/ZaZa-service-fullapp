import { create } from 'zustand'

import { Courier } from '@entities/courier'

interface Store {
  createOpened: boolean
  updateOpened: Courier | null
  openCreate: () => void
  closeCreate: () => void
  openUpdate: (category: Courier) => void
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

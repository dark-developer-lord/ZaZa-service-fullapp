import { create } from 'zustand'

import { AddOn } from '@entities/add-on'

interface Store {
  createOpened: boolean
  updateOpened: AddOn | null
  openCreate: () => void
  closeCreate: () => void
  openUpdate: (category: AddOn) => void
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

import { create } from 'zustand'

import { CategoryItem } from '@entities/category'

interface Store {
  createOpened: boolean
  updateOpened: CategoryItem | null
  openCreate: () => void
  closeCreate: () => void
  openUpdate: (category: CategoryItem) => void
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

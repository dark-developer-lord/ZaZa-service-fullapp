import { create } from 'zustand'

import { WarehouseItem } from '@entities/warehouses'

interface Store {
  createOpened: boolean
  updateOpened: WarehouseItem | null
  openCreate: () => void
  closeCreate: () => void
  openUpdate: (category: WarehouseItem) => void
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

import { create } from 'zustand'

import { Attribute } from '@entities/attribute'

interface Store {
  createOpened: boolean
  updateOpened: Attribute | null
  openCreate: () => void
  closeCreate: () => void
  openUpdate: (attribute: Attribute) => void
  closeUpdate: () => void
}

export const useStore = create<Store>((set) => ({
  createOpened: false,
  updateOpened: null,
  openCreate: () => set({ createOpened: true }),
  closeCreate: () => set({ createOpened: false }),
  openUpdate: (attribute) => set({ updateOpened: attribute }),
  closeUpdate: () => set({ updateOpened: null }),
}))

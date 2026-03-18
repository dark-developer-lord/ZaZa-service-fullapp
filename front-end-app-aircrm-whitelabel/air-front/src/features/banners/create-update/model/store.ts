import { create } from 'zustand'

import { Banner } from '@entities/banner'

interface Store {
  createOpened: boolean
  updateOpened: Banner | null
  openCreate: () => void
  closeCreate: () => void
  openUpdate: (banner: Banner) => void
  closeUpdate: () => void
}

export const useStore = create<Store>((set) => ({
  createOpened: false,
  updateOpened: null,
  openCreate: () => set({ createOpened: true }),
  closeCreate: () => set({ createOpened: false }),
  openUpdate: (banner) => set({ updateOpened: banner }),
  closeUpdate: () => set({ updateOpened: null }),
}))

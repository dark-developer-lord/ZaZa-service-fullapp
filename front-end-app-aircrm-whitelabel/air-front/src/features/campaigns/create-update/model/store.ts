import { create } from 'zustand'

import { Campaign } from '@entities/campaign'

interface Store {
  createOpened: boolean
  updateOpened: Campaign | null
  openCreate: () => void
  closeCreate: () => void
  openUpdate: (campaign: Campaign) => void
  closeUpdate: () => void
}

export const useStore = create<Store>((set) => ({
  createOpened: false,
  updateOpened: null,
  openCreate: () => set({ createOpened: true }),
  closeCreate: () => set({ createOpened: false }),
  openUpdate: (campaign) => set({ updateOpened: campaign }),
  closeUpdate: () => set({ updateOpened: null }),
}))

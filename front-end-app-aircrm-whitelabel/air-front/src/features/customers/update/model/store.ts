import { create } from 'zustand'

import { CustomerItem } from '@entities/customer'

interface Store {
  createOpened: boolean
  updateOpened: CustomerItem | null
  openCreate: () => void
  closeCreate: () => void
  openUpdate: (customer: CustomerItem) => void
  closeUpdate: () => void
}

export const useStore = create<Store>((set) => ({
  createOpened: false,
  updateOpened: null,
  openCreate: () => set({ createOpened: true }),
  closeCreate: () => set({ createOpened: false }),
  openUpdate: (customer) => set({ updateOpened: customer }),
  closeUpdate: () => set({ updateOpened: null }),
}))

import { create } from 'zustand'

import { CounterpartyTypeItem } from '@entities/counterparty-type'

interface Store {
  createOpened: boolean
  updateOpened: CounterpartyTypeItem | null
  openCreate: () => void
  closeCreate: () => void
  openUpdate: (type: CounterpartyTypeItem) => void
  closeUpdate: () => void
}

export const useStore = create<Store>((set) => ({
  createOpened: false,
  updateOpened: null,
  openCreate: () => set({ createOpened: true }),
  closeCreate: () => set({ createOpened: false }),
  openUpdate: (type) => set({ updateOpened: type }),
  closeUpdate: () => set({ updateOpened: null }),
}))


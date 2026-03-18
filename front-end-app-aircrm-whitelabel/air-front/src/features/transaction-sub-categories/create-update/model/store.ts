import { create } from 'zustand'

import { TransactionSubCategoryItem } from '@entities/transaction-sub-categories'

interface Store {
  createOpened: boolean
  updateOpened: TransactionSubCategoryItem | null
  openCreate: () => void
  closeCreate: () => void
  openUpdate: (category: TransactionSubCategoryItem) => void
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

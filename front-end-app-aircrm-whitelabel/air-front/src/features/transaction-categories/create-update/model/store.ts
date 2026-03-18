import { create } from 'zustand'

import { TransactionCategoryItem } from '@entities/transaction-category'

interface Store {
  createOpened: boolean
  updateOpened: TransactionCategoryItem | null
  openCreate: () => void
  closeCreate: () => void
  openUpdate: (category: TransactionCategoryItem) => void
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

import { create } from 'zustand'

interface Store {
  createOpened: boolean
  updateOpened: number | null
  isEditMode: boolean
  openCreate: () => void
  closeCreate: () => void
  openUpdate: (transactionId: number) => void
  closeUpdate: () => void
  setEditMode: (enabled: boolean) => void
}

export const useStore = create<Store>((set) => ({
  createOpened: false,
  updateOpened: null,
  isEditMode: false,
  openCreate: () => set({ createOpened: true }),
  closeCreate: () => set({ createOpened: false }),
  openUpdate: (transactionId) => set({ updateOpened: transactionId, isEditMode: false }),
  closeUpdate: () => set({ updateOpened: null, isEditMode: false }),
  setEditMode: (enabled) => set({ isEditMode: enabled }),
}))

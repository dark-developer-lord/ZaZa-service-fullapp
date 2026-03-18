import { create } from 'zustand'

interface Store {
  createOpened: boolean
  openCreate: () => void
  closeCreate: () => void
}

export const useStore = create<Store>((set) => ({
  createOpened: false,
  openCreate: () => set({ createOpened: true }),
  closeCreate: () => set({ createOpened: false }),
}))

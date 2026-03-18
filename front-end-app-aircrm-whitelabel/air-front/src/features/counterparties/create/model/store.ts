import { create } from 'zustand'

interface State {
  createOpened: boolean
  openCreate: () => void
  closeCreate: () => void
}

export const useStore = create<State>((set) => ({
  createOpened: false,
  openCreate: () => set({ createOpened: true }),
  closeCreate: () => set({ createOpened: false }),
}))


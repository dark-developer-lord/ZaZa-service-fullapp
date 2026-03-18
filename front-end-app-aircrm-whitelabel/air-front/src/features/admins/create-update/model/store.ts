import { create } from 'zustand'

import { Admin } from '@entities/admin'

interface Store {
  createOpened: boolean
  updateOpened: Admin | null
  openCreate: () => void
  closeCreate: () => void
  openUpdate: (employee: Admin) => void
  closeUpdate: () => void
}

export const useStore = create<Store>((set) => ({
  createOpened: false,
  updateOpened: null,
  openCreate: () => set({ createOpened: true }),
  closeCreate: () => set({ createOpened: false }),
  openUpdate: (employee) => set({ updateOpened: employee }),
  closeUpdate: () => set({ updateOpened: null }),
}))

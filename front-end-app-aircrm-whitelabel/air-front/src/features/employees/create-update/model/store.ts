import { create } from 'zustand'

import { Employee } from '@entities/employee'

interface Store {
  createOpened: boolean
  updateOpened: Employee | null
  openCreate: () => void
  closeCreate: () => void
  openUpdate: (employee: Employee) => void
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

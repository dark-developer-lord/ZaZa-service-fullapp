import { create } from 'zustand'

interface State {
  filterOpened: boolean
  orderType: 'general' | 'imported'
}

interface Action {
  openFilter: () => void
  closeFilter: () => void
  changeOrderType: (type: 'general' | 'imported') => void
  clearFilter: () => void
}

export const useCustomerFilterStore = create<State & Action>((set) => ({
  filterOpened: false,
  orderType: 'general',
  
  openFilter: () => set({ filterOpened: true }),
  closeFilter: () => set({ filterOpened: false }),
  changeOrderType: (type) => set({ orderType: type }),
  clearFilter: () => set({ orderType: 'general' }),
}))

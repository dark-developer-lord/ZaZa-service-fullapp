import { create } from 'zustand'

import { FilterKeys } from '../lib/items'

interface Store {
  activeKey: FilterKeys
  setActiveId: (id: FilterKeys) => void
}

export const useStore = create<Store>((set) => ({
  activeKey: 'today',
  setActiveId: (id) => set({ activeKey: id }),
}))

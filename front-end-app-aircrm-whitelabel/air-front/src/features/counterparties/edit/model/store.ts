import { create } from 'zustand'

interface EditCounterpartyModalStore {
  opened: boolean
  counterpartyId: number | null
  open: (id: number) => void
  close: () => void
}

export const useEditCounterpartyModal = create<EditCounterpartyModalStore>((set) => ({
  opened: false,
  counterpartyId: null,
  open: (id) => set({ opened: true, counterpartyId: id }),
  close: () => set({ opened: false, counterpartyId: null }),
}))


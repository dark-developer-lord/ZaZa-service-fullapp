import { create } from 'zustand'

interface UpdateImageStore {
  isOpen: boolean
  productId: number | null
  openModal: (productId: number) => void
  closeModal: () => void
}

export const useUpdateImageStore = create<UpdateImageStore>((set) => ({
  isOpen: false,
  productId: null,
  openModal: (productId: number) => set({ isOpen: true, productId }),
  closeModal: () => set({ isOpen: false, productId: null }),
}))

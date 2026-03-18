import { GridPaginationModel } from '@mui/x-data-grid'
import { create } from 'zustand'

interface State {
  paginationModel: GridPaginationModel
  searchValue: string
  warehouseId: number | null
  setPaginationModel: (model: GridPaginationModel) => void
  setSearchValue: (value: string) => void
  setWarehouseId: (id: number | null) => void
  clear: () => void
}

export const useProductsStore = create<State>((set) => ({
  paginationModel: {
    page: 0,
    pageSize: 12,
  },
  searchValue: '',
  warehouseId: null,
  setPaginationModel: (model) => set({ paginationModel: model }),
  setSearchValue: (value) =>
    set({ searchValue: value, paginationModel: { page: 0, pageSize: 12 } }),
  setWarehouseId: (id) =>
    set({ warehouseId: id, paginationModel: { page: 0, pageSize: 12 } }),
  clear: () =>
    set({
      searchValue: '',
      warehouseId: null,
      paginationModel: {
        page: 0,
        pageSize: 12,
      },
    }),
}))

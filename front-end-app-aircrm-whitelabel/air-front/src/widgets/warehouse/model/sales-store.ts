import { GridPaginationModel } from '@mui/x-data-grid'
import { create } from 'zustand'

interface State {
  paginationModel: GridPaginationModel
  searchValue: string
  setPaginationModel: (model: GridPaginationModel) => void
  setSearchValue: (value: string) => void
  clear: () => void
}

export const useSaleStore = create<State>((set) => ({
  paginationModel: {
    page: 0,
    pageSize: 12,
  },
  searchValue: '',
  setPaginationModel: (model) => set({ paginationModel: model }),
  setSearchValue: (value) =>
    set({ searchValue: value, paginationModel: { page: 0, pageSize: 12 } }),
  clear: () =>
    set({
      searchValue: '',
      paginationModel: {
        page: 0,
        pageSize: 12,
      },
    }),
}))

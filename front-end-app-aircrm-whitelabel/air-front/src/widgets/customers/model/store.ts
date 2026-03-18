import { GridPaginationModel } from '@mui/x-data-grid'
import { create } from 'zustand'

interface State {
  paginationModel: GridPaginationModel
  searchValue: string
  filterParams: Record<string, string>
  setPaginationModel: (model: GridPaginationModel) => void
  setSearchValue: (value: string) => void
  setFilterParams: (params: Record<string, string>) => void
  clear: () => void
}

export const useStore = create<State>((set) => ({
  paginationModel: {
    page: 0,
    pageSize: 12,
  },
  searchValue: '',
  filterParams: {},
  setPaginationModel: (model) => set({ paginationModel: model }),
  setSearchValue: (value) =>
    set({ searchValue: value, paginationModel: { page: 0, pageSize: 12 } }),
  setFilterParams: (params) =>
    set({ filterParams: params, paginationModel: { page: 0, pageSize: 12 } }),
  clear: () =>
    set({
      searchValue: '',
      filterParams: {},
      paginationModel: {
        page: 0,
        pageSize: 12,
      },
    }),
}))

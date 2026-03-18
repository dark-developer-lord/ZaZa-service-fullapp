import { GridPaginationModel } from '@mui/x-data-grid'
import { create } from 'zustand'

interface State {
  paginationModel: GridPaginationModel
  searchValue: string
}

interface Actions {
  setPaginationModel: (model: GridPaginationModel) => void
  setSearchValue: (value: string) => void
  clear: () => void
}

const initialState: State = {
  paginationModel: {
    page: 0,
    pageSize: 12,
  },
  searchValue: '',
}

export const useIncomingTransferStore = create<State & Actions>((set) => ({
  ...initialState,
  setPaginationModel: (model) => set({ paginationModel: model }),
  setSearchValue: (value) =>
    set({
      searchValue: value,
      paginationModel: { page: 0, pageSize: 12 },
    }),
  clear: () => set(initialState),
}))


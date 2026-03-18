import { create } from 'zustand'
import { GridPaginationModel } from '@mui/x-data-grid'

interface State {
  paginationModel: GridPaginationModel
}

interface Actions {
  setPaginationModel: (model: GridPaginationModel) => void
  clear: () => void
}

export const useInstallmentsStore = create<State & Actions>((set) => ({
  paginationModel: {
    page: 0,
    pageSize: 12,
  },

  setPaginationModel: (paginationModel) => set({ paginationModel }),
  clear: () =>
    set({
      paginationModel: {
        page: 0,
        pageSize: 12,
      },
    }),
}))

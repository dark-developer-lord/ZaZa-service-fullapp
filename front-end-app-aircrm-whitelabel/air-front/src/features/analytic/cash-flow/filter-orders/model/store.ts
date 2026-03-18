import { GridPaginationModel } from '@mui/x-data-grid'
import { DateRange } from '@mui/x-date-pickers-pro'
import { Dayjs } from 'dayjs'
import { create } from 'zustand'

export type TransactionType = "income" | "expense"

interface State {
  filterOpened: boolean
  searchValue: string
  paginationModel: GridPaginationModel

  type: TransactionType | null
  category_id: number | null
  subcategory_id: number | null
  date: DateRange<Dayjs>
}

interface Action {
  openFilter: () => void
  closeFilter: () => void
  setSearchValue: (value: string) => void
  clear: () => void
  changePaginationModel: (model: GridPaginationModel) => void

  changeType: (type: TransactionType | null) => void
  changeCategory: (category_id: number |  null) => void
  changeSubCategory: (subcategory_id: number |  null) => void
  changeDate: (date: DateRange<Dayjs>) => void
  clearFilter: () => void
}

export const useStore = create<State & Action>((set, getState) => ({
  filterOpened: false,
  searchValue: '',
  paginationModel: {
    page: 0,
    pageSize: 12,
  },
  type: null,
  category_id: null,
  subcategory_id: null,
  date: [null, null],
  openFilter: () => set({ filterOpened: true }),
  closeFilter: () => set({ filterOpened: false }),
  setSearchValue: (value) =>
    set({
      searchValue: value,
      paginationModel: {
        page: 0,
        pageSize: getState().paginationModel.pageSize,
      },
    }),
  clear: () =>
    set({
      searchValue: '',
      paginationModel: {
        page: 0,
        pageSize: getState().paginationModel.pageSize,
      },
    }),
  changePaginationModel: (model) => set({ paginationModel: model }),
  changeType: (type) => {
    set({
      type,
      paginationModel: {
        page: 0,
        pageSize: getState().paginationModel.pageSize,
      },
    })
  },
  changeCategory: (category_id) => {
    set({
      category_id,
      paginationModel: {
        page: 0,
        pageSize: getState().paginationModel.pageSize,
      },
    })
  },
  changeSubCategory: (subcategory_id) => {
    set({
      subcategory_id,
      paginationModel: {
        page: 0,
        pageSize: getState().paginationModel.pageSize,
      },
    })
  },
  changeDate: (date) =>
    set({
      date,
      paginationModel: {
        page: 0,
        pageSize: getState().paginationModel.pageSize,
      },
    }),
  clearFilter: () =>
    set({
      type: null,
      category_id: null,
      subcategory_id: null,
      date: [null, null],
      paginationModel: {
        page: 0,
        pageSize: getState().paginationModel.pageSize,
      },
    }),
}))

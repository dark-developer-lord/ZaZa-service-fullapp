import { GridPaginationModel } from '@mui/x-data-grid'
import { DateRange } from '@mui/x-date-pickers-pro'
import { Dayjs } from 'dayjs'
import { create } from 'zustand'

import { FilterKeys } from '@widgets/orders/lib/items'

interface State {
  filterOpened: boolean
  searchValue: string
  paginationModel: GridPaginationModel

  restaurantId: number | null
  warehouseId: number | null
  statuses: string[]
  date: DateRange<Dayjs>
  activeKey: FilterKeys
  hasInstallment: boolean | null
}

interface Action {
  openFilter: () => void
  closeFilter: () => void
  search: (value: string) => void
  clear: () => void
  changePaginationModel: (model: GridPaginationModel) => void

  changeRestaurant: (restaurant: number | null) => void
  changeWarehouse: (warehouse: number | null) => void
  changeSource: (restaurant: number | null, warehouse: number | null) => void
  changeStatuses: (statuses: string[]) => void
  changeDate: (date: DateRange<Dayjs>) => void
  changeInstallment: (hasInstallment: boolean | null) => void

  clearFilter: () => void

  setActiveId: (id: FilterKeys) => void
  clearDate: () => void
  clearDuration: () => void
}

export const useStore = create<State & Action>((set, getState) => ({
  filterOpened: false,
  searchValue: '',
  paginationModel: {
    page: 0,
    pageSize: 12,
  },
  activeKey: 'none',
  restaurantId: null,
  warehouseId: null,
  statuses: [],
  date: [null, null],
  hasInstallment: null,
  openFilter: () => set({ filterOpened: true }),
  closeFilter: () => set({ filterOpened: false }),
  search: (value) =>
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
  changeRestaurant: (restaurant) =>
    set({
      restaurantId: restaurant,
      warehouseId: null,
      paginationModel: {
        page: 0,
        pageSize: getState().paginationModel.pageSize,
      },
    }),
  changeWarehouse: (warehouse) =>
    set({
      restaurantId: null,
      warehouseId: warehouse,
      paginationModel: {
        page: 0,
        pageSize: getState().paginationModel.pageSize,
      },
    }),
  changeSource: (restaurant, warehouse) => 
    set({
      restaurantId: restaurant,
      warehouseId: warehouse,
      paginationModel: {
        page: 0,
        pageSize: getState().paginationModel.pageSize,
      },
    }),
  changeStatuses: (statuses) =>
    set({
      statuses,
      paginationModel: {
        page: 0,
        pageSize: getState().paginationModel.pageSize,
      },
    }),
  changeDate: (date) =>
    set({
      date,
      paginationModel: {
        page: 0,
        pageSize: getState().paginationModel.pageSize,
      },
    }),
  changeInstallment: (hasInstallment) =>
    set({
      hasInstallment,
      paginationModel: {
        page: 0,
        pageSize: getState().paginationModel.pageSize,
      },
    }),
  clearDate: () => {
    set({
      date: [null, null],
    })
  },
  setActiveId: (id) =>
    set({
      activeKey: id,
      paginationModel: {
        page: 0,
        pageSize: getState().paginationModel.pageSize,
      },
    }),
  clearDuration: () => {
    set({
      activeKey: 'none',
    })
  },
  clearFilter: () =>
    set({
      restaurantId: null,
      warehouseId: null,
      statuses: [],
      activeKey: 'none',
      date: [null, null],
      hasInstallment: null,
      paginationModel: {
        page: 0,
        pageSize: getState().paginationModel.pageSize,
      },
    }),
}))

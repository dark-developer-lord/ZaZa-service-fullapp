import { FC } from 'react'
import { GridPaginationModel } from '@mui/x-data-grid'

import { DataPagination } from '@shared/api'
import { TablePagination } from '@shared/ui'

import { warehouseColumns } from '../model/columns'
import { WarehouseItem } from '../model/restaurant'


interface Props {
  data?: DataPagination<WarehouseItem>
  isFetching: boolean
  paginationModel: GridPaginationModel
  changePaginationModel: (model: GridPaginationModel) => void
  Actions: FC<{ row: WarehouseItem }>
  StatusToggle: FC<{ row: WarehouseItem }>
  error?: unknown
}

export const Table = ({
  isFetching,
  data,
  paginationModel,
  changePaginationModel,
  Actions,
  StatusToggle,
  error,
}: Props) => {
  return (
    <TablePagination
      columns={warehouseColumns(Actions, StatusToggle )}
      rows={data?.data}
      loading={isFetching}
      paginationModel={paginationModel}
      rowCount={data?.meta.total || 0}
      changePaginationModel={changePaginationModel}
      pageCount={data?.meta.last_page || 0}
      error={error}
    />
  )
}

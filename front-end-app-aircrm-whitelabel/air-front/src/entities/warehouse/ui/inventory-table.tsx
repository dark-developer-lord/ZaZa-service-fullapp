import { FC } from 'react'

import { GridPaginationModel } from '@mui/x-data-grid'

import { DataPagination } from '@shared/api'
import { TablePagination } from '@shared/ui'

import { inventoryColumns } from '../model/columns'

import { InventoryItem } from '../model/warehouse'

interface Props {
  data?: DataPagination<InventoryItem>
  isFetching: boolean
  paginationModel: GridPaginationModel
  changePaginationModel: (model: GridPaginationModel) => void
  Actions: FC<{ row: InventoryItem }>
  error?: unknown,
}

export const Table = ({
  isFetching,
  data,
  paginationModel,
  changePaginationModel,
  Actions,
  error,
}: Props) => {

  return (
    <TablePagination
      columns={inventoryColumns(Actions)}
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


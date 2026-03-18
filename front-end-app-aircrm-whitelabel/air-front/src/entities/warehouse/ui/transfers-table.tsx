import { FC } from 'react'

import { GridPaginationModel, GridSlotsComponent } from '@mui/x-data-grid'

import { DataPagination } from '@shared/api'
import { TablePagination } from '@shared/ui'

import { transferColumns } from '../model/columns'

import { TransferItem } from '../model/warehouse'

interface Props {
  data?: DataPagination<TransferItem>
  isFetching: boolean
  paginationModel: GridPaginationModel
  changePaginationModel: (model: GridPaginationModel) => void
  Actions: FC<{ row: TransferItem }>
  StatusDropdown: FC<{ row: TransferItem }>
  error?: unknown
  slots?: Partial<GridSlotsComponent>
  statusHeaderName?: string
}

export const Table = ({
  isFetching,
  data,
  paginationModel,
  changePaginationModel,
  Actions,
  StatusDropdown,
  error,
  slots,
  statusHeaderName = 'Статус',
}: Props) => {

  return (
    <TablePagination
      columns={transferColumns(Actions, StatusDropdown, statusHeaderName)}
      rows={data?.data}
      loading={isFetching}
      paginationModel={paginationModel}
      rowCount={data?.meta.total || 0}
      changePaginationModel={changePaginationModel}
      pageCount={data?.meta.last_page || 0}
      error={error}
      slots={slots}
    />
  )
}


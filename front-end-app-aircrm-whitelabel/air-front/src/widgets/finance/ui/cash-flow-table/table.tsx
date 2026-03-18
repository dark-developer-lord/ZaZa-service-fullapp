import { FC } from 'react'
import { GridPaginationModel } from '@mui/x-data-grid'

import { DataPagination } from '@shared/api'
import { TablePagination } from '@shared/ui'

import { columns, TransactionTypeItem } from './columns'
import { useMediaQuery, useTheme } from '@mui/material'

interface Props {
  data?: DataPagination<TransactionTypeItem>
  isFetching: boolean
  paginationModel: GridPaginationModel
  changePaginationModel: (model: GridPaginationModel) => void
  Actions: FC<{ row: TransactionTypeItem }>
  error?: unknown
}

export const Table = ({ data, isFetching, paginationModel, changePaginationModel, Actions, error }: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  return (
    <TablePagination
      columns={columns(Actions, isMobile)}
      rows={data?.data}
      loading={isFetching}
      paginationModel={paginationModel}
      rowCount={data?.meta.total || 0}
      changePaginationModel={changePaginationModel}
      pageCount={data?.meta.last_page || 0}
      error={error}
      getRowId={(row) => {
        // Ensure we always return a valid id
        return row.id ?? row.transaction_number ?? `row_${row.transaction_number ?? Math.random()}`
      }}
    />
  )
}

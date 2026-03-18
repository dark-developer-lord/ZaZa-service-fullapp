import { FC } from 'react'
import { GridPaginationModel } from '@mui/x-data-grid'

import { DataPagination } from '@shared/api'
import { TablePagination } from '@shared/ui'

import { columns, callResultsColumns } from '../model/columns'
import { CustomerItem } from '../model/customer-type'
import { useMediaQuery, useTheme } from '@mui/material'

interface Props {
  data?: DataPagination<CustomerItem>
  isFetching: boolean
  paginationModel: GridPaginationModel
  changePaginationModel: (model: GridPaginationModel) => void
  Actions: FC<{ row: CustomerItem }>
  error?: unknown
  viewType?: 'default' | 'call_results'
}

export const Table = ({
  isFetching,
  data,
  paginationModel,
  changePaginationModel,
  Actions,
  error,
  viewType = 'default',
}: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  const tableColumns = viewType === 'call_results'
    ? callResultsColumns(isMobile)
    : columns(Actions, isMobile)

  return (
    <TablePagination
      columns={tableColumns}
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

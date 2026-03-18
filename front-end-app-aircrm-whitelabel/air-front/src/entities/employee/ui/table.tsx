import { FC } from 'react'
import { GridPaginationModel } from '@mui/x-data-grid'

import { DataPagination } from '@shared/api'
import { TablePagination } from '@shared/ui'

import { columns } from '../model/columns'
import { Employee } from '../model/types'

interface Props {
  data?: DataPagination<Employee>
  isFetching: boolean
  paginationModel: GridPaginationModel
  changePaginationModel: (model: GridPaginationModel) => void
  Actions: FC<{ row: Employee }>
  error?: unknown
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
      columns={columns(Actions)}
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

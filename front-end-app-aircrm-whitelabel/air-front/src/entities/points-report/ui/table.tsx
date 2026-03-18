import { GridPaginationModel } from '@mui/x-data-grid'

import { DataPagination } from '@shared/api'
import { TablePagination } from '@shared/ui'

import { columns } from '../model/columns'
import { PointReport } from '../model/types'

interface Props {
  data?: DataPagination<PointReport>
  isFetching: boolean
  paginationModel: GridPaginationModel
  changePaginationModel: (model: GridPaginationModel) => void
  error?: unknown
}

export const Table = ({
  isFetching,
  data,
  paginationModel,
  changePaginationModel,
  error,
}: Props) => {
  return (
    <TablePagination
      rows={data?.data}
      columns={columns}
      loading={isFetching}
      paginationModel={paginationModel}
      rowCount={data?.meta.total || 0}
      changePaginationModel={changePaginationModel}
      pageCount={data?.meta.last_page || 0}
      error={error}
    />
  )
}

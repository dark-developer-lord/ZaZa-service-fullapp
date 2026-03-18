import { FC } from 'react'
import { GridPaginationModel } from '@mui/x-data-grid'

import { DataPagination } from '@shared/api'
import { useGetLoginSource } from '@shared/auth'
import { TablePagination } from '@shared/ui'

import { columns } from '../model/columns'
import { AddOn } from '../model/types'  

interface Props {
  data?: DataPagination<AddOn>
  isFetching: boolean
  paginationModel: GridPaginationModel
  changePaginationModel: (model: GridPaginationModel) => void
  Actions: FC<{ row: AddOn }>
  StatusToggle: FC<{ row: AddOn }>
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
  const loginSource = useGetLoginSource()
  return (
    <TablePagination
      columns={columns({
        Actions,
        StatusToggle,
        loginSource,
      })}
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

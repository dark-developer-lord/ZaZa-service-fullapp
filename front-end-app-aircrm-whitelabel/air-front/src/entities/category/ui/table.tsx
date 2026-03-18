/* eslint-disable prettier/prettier */
import { FC } from 'react'
import { GridPaginationModel } from '@mui/x-data-grid'

import { DataPagination } from '@shared/api'
import { useGetLoginSource } from '@shared/auth'
import { TablePagination } from '@shared/ui'

import { CategoryItem } from '../model/category'
import { columns } from '../model/columns'

interface Props {
  data?: DataPagination<CategoryItem>
  isFetching: boolean
  paginationModel: GridPaginationModel
  changePaginationModel: (model: GridPaginationModel) => void
  Actions?: FC<{ row: CategoryItem }>
  PrioritySelect?: FC<{ row: CategoryItem }>
  StatusToggle?: FC<{ row: CategoryItem }>
  error?: unknown
}

export const Table = ({
  isFetching,
  data,
  paginationModel,
  changePaginationModel,
  Actions,
  PrioritySelect,
  StatusToggle,
  error,
}: Props) => {
  const loginSource = useGetLoginSource()
  return (
    <TablePagination
      columns={columns({
        Actions,
        PrioritySelect,
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

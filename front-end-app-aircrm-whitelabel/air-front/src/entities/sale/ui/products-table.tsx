import { FC } from 'react'
import { GridPaginationModel } from '@mui/x-data-grid'

import { DataPagination } from '@shared/api'
import { useGetLoginSource } from '@shared/auth'
import { TablePagination, DataTable } from '@shared/ui'

import { columns } from '../model/columns'
import { Product } from '../model/product'

interface Props {
  data?: Product[]
  isFetching: boolean
  Actions?: FC<{ row: Product }>
  error?: unknown
}

export const Table = ({
  isFetching,
  data,
  error,
}: Props) => {
  return (
    <DataTable
        columns={columns()}
        rows={data}
        loading={isFetching}
        error={error}
        hideFooter
    />
  )
}

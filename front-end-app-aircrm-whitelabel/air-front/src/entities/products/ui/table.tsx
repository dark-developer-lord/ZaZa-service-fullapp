import { FC } from 'react'

import { GridPaginationModel } from '@mui/x-data-grid'

import { DataPagination } from '@shared/api'
import { TablePagination } from '@shared/ui'

import { columns } from '../model/columns'
import {
  FoodItem,
  ProductArrivalItem,
  ProductFlowItem,
  ProductSalesItem,
  ProductWriteOffItem
} from '../model/food'

interface Props {
  data?: DataPagination<FoodItem | ProductArrivalItem>
  isFetching: boolean
  paginationModel: GridPaginationModel
  changePaginationModel: (model: GridPaginationModel) => void
  Actions: FC<{ row: FoodItem | ProductArrivalItem | ProductFlowItem | ProductSalesItem | ProductWriteOffItem }>
  StatusToggle: FC<{ row: FoodItem | ProductArrivalItem | ProductFlowItem | ProductSalesItem | ProductWriteOffItem }>
  error?: unknown,
  type: string | null
}

export const Table = ({
  isFetching,
  data,
  paginationModel,
  changePaginationModel,
  Actions,
  StatusToggle,
  error,
  type
}: Props) => {

  return (
    <TablePagination
      columns={columns({
        type,
        Actions,
        StatusToggle,
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

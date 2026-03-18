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
} from '../../products/model/food'

interface Props {
  data?: DataPagination<FoodItem | ProductArrivalItem>
  isFetching: boolean
  paginationModel: GridPaginationModel
  changePaginationModel: (model: GridPaginationModel) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Actions: FC<{ row: any }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  StatusToggle: FC<{ row: any }>
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
        Actions: Actions as FC<{ row: any }>,
        StatusToggle: StatusToggle as FC<{ row: any }>,
      })}
      rows={data?.data as any}
      loading={isFetching}
      paginationModel={paginationModel}
      rowCount={data?.meta.total || 0}
      changePaginationModel={changePaginationModel}
      pageCount={data?.meta.last_page || 0}
      error={error}
    />
  )
}

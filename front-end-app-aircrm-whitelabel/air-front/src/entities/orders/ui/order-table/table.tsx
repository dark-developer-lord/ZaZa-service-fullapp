import { FC } from 'react'
import { GridPaginationModel } from '@mui/x-data-grid'

import { DataPagination } from '@shared/api'
import { useProfile } from '@shared/auth'
import { TablePagination } from '@shared/ui'

import { columns } from '../../model/columns'
import { Order } from '../../model/order-type'
// import { OrderStatusType } from '@shared/lib'
import { useMediaQuery, useTheme } from '@mui/material'

interface Props {
  data?: DataPagination<Order>
  isFetching: boolean
  paginationModel: GridPaginationModel
  changePaginationModel: (model: GridPaginationModel) => void
  ChangeStatus: FC<{ row: Order }>
  Actions?: FC<{ row: Order }>
  error?: unknown
}

export const OrdersTable = ({
  isFetching,
  data,
  paginationModel,
  changePaginationModel,
  ChangeStatus,
  Actions,
  error,
}: Props) => {
  const source = useProfile((profile) => profile.source)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  return (
    <TablePagination
      columns={columns(ChangeStatus, Actions, source, isMobile)}
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

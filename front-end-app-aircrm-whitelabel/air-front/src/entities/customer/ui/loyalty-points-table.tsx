import { useMediaQuery, useTheme } from '@mui/material'
import { GridPaginationModel } from '@mui/x-data-grid'

import { TablePagination } from '@shared/ui'
import { DataPagination } from '@shared/api'

import { CustomerLoyaltyPoint } from '../model/customer-loyalty-points'
import { loyaltyPointsColumns } from '../model/loyalty-points-columns'

interface Props {
  data?: DataPagination<CustomerLoyaltyPoint>
  isFetching: boolean
  error?: unknown
  paginationModel: GridPaginationModel
  changePaginationModel: (model: GridPaginationModel) => void
}

export const CustomerLoyaltyPointsTable = ({
  isFetching,
  data,
  error,
  paginationModel,
  changePaginationModel,
}: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  return (
    <TablePagination
      columns={loyaltyPointsColumns(isMobile)}
      rows={data?.data || []}
      loading={isFetching}
      paginationModel={paginationModel}
      rowCount={data?.meta?.total || 0}
      changePaginationModel={changePaginationModel}
      pageCount={data?.meta?.last_page || 1}
      error={error}
    />
  )
}

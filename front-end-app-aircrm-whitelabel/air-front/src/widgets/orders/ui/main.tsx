import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, Stack, Typography, Chip, Skeleton } from '@mui/material'

import {
  ExportOrders,
  FilterToggleButton,
  OrderActions,
  SearchOrders,
  useOrdersFilterStore,
} from '@features/orders'
import { OrdersDuration } from '@features/orders/filter-orders/ui/orders-duration'
import { OrdersTable } from '@entities/orders'
import { orderStatusLabels } from '@shared/lib'
import { SelectOrderStatus } from '@features/orders/change-status/ui/select-order-status'
import { Board } from '@shared/ui'

import { useGetOrders } from '../api/get-orders'
import { useGetOrdersTotalPrice } from '../api/get-orders-total-price'
import { useGetStatus } from '../lib/use-get-status'
import { Filter } from './filter'

export const Main = () => {
  const { data, isFetching, error } = useGetOrders()
  const { data: totalPriceData, isFetching: isFetchingTotalPrice } = useGetOrdersTotalPrice()
  const status = useGetStatus()
  const [searchParams] = useSearchParams()
  const statusPage = searchParams.get('status')
  
  const {
    paginationModel,
    changePaginationModel,
    changeStatuses,
    clearFilter,
  } = useOrdersFilterStore(
    ({
      paginationModel,
      changePaginationModel,
      changeStatuses,
      clearFilter,
    }) => ({
      paginationModel,
      changePaginationModel,
      changeStatuses,
      clearFilter,
    }),
  )
  const isStatusPage = Object.keys(orderStatusLabels).includes(statusPage || '')

  useEffect(() => {
    return clearFilter
  }, [])

  useEffect(() => {
    if (status) {
      clearFilter()
      changeStatuses([status])
    } else {
      changeStatuses([])
    }
  }, [changeStatuses, clearFilter, status])

  return (
    <Board>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: '24px',
          gap: '16px',
        }}
      >
        <Box sx={{ minWidth: '280px', flex: '1 1 auto' }}>
          <SearchOrders />
        </Box>
        <Stack
          columnGap="12px"
          direction="row"
          sx={{
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <OrdersDuration />
          {!isStatusPage && <FilterToggleButton />}
          {!isStatusPage && <ExportOrders />}
        </Stack>
        {!isStatusPage && <Filter />}
      </Box>

      {/* Display total price always */}
      {(totalPriceData || isFetchingTotalPrice) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
            p: 2,
            bgcolor: 'primary.main',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'primary.main',
          }}
        >
          <Typography variant="body1" fontWeight="medium" color="white">
            Все:
          </Typography>
          {isFetchingTotalPrice ? (
            <Skeleton width={100} height={32} variant="rounded" />
          ) : (
            <Chip
              label={`${parseFloat(totalPriceData?.total_price.toString() || '0').toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} с.`}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 'bold'
              }}
            />
          )}
          {totalPriceData?.total_orders && (
            <Typography variant="body2" color="white">
              ({totalPriceData.total_orders} заказов)
            </Typography>
          )}
        </Box>
      )}

      <OrdersTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={changePaginationModel}
        ChangeStatus={SelectOrderStatus}
        Actions={OrderActions}
        error={error}
      />
    </Board>
  )
}

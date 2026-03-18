import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Button, TextField, InputAdornment, useTheme } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { GridPaginationModel } from '@mui/x-data-grid'

import { LayoutContent } from '@widgets/layout'
import { Board } from '@shared/ui'
import {
  useGetCustomer,
  useGetCustomerOrders,
  useGetCustomerLoyaltyPoints,
  CustomerOrderHistoryTable,
  CustomerLoyaltyPointsTable
} from '@entities/customer'
import { CustomerEditForm } from '@features/customers'
import { FilterButton, FilterDrawer, useCustomerFilterStore } from '@features/customers/filter'
import { RouterPaths } from '@shared/lib'

type TabType = 'general' | 'loyalty'

export const CustomerEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [searchQuery, setSearchQuery] = useState('')
  const { orderType } = useCustomerFilterStore()
  const [ordersPaginationModel, setOrdersPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 12,
  })
  const [loyaltyPaginationModel, setLoyaltyPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 12,
  })

  const { data: customerData } = useGetCustomer(id || '')
  const { data: ordersData, isFetching: ordersFetching, error: ordersError } = useGetCustomerOrders({
    customerId: id || '',
    paginationModel: ordersPaginationModel,
    imported: orderType === 'imported',
  })
  const { data: loyaltyData, isFetching: loyaltyFetching, error: loyaltyError } = useGetCustomerLoyaltyPoints({
    customerId: id || '',
    paginationModel: loyaltyPaginationModel,
    enabled: activeTab === 'loyalty'
  })

  const handleOrdersPaginationChange = (model: GridPaginationModel) => {
    setOrdersPaginationModel(model)
  }

  const handleLoyaltyPaginationChange = (model: GridPaginationModel) => {
    setLoyaltyPaginationModel(model)
  }

  return (
    <LayoutContent
      title="Карточка клиента"
      breadcrumbs={[
        {
          label: 'Список клиентов',
          name: 'customers',
          path: RouterPaths.customers,
        },
        {
          label: 'Карточка клиента',
          name: 'customer-edit',
        }
      ]}

    >
      <Board sx={{ mb: 3 }}>
        <CustomerEditForm
          key={customerData?.data?.loyalty_points}
          customer={customerData?.data}
        />
      </Board>

      <Board>
        <Box sx={{ mb: 3 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <TextField
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{ width: '300px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FilterButton />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Button
              variant="contained"
              onClick={() => setActiveTab('general')}
              sx={{
                backgroundColor: activeTab === 'general' ? theme.palette.primary.main : theme.palette.secondary.main,
                color: activeTab === 'general' ? 'white' : theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: activeTab === 'general' ? theme.palette.primary.dark : theme.palette.secondary.dark,
                },
              }}
            >
              Общие сведения
            </Button>

            <Button
              variant="contained"
              onClick={() => setActiveTab('loyalty')}
              sx={{
                backgroundColor: activeTab === 'loyalty' ? theme.palette.primary.main : theme.palette.secondary.main,
                color: activeTab === 'loyalty' ? 'white' : theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: activeTab === 'loyalty' ? theme.palette.primary.dark : theme.palette.secondary.dark,
                },
              }}
            >
              История баллов
            </Button>
          </Box>
        </Box>

        {activeTab === 'general' && (
          <CustomerOrderHistoryTable
            data={ordersData}
            isFetching={ordersFetching}
            error={ordersError}
            paginationModel={ordersPaginationModel}
            changePaginationModel={handleOrdersPaginationChange}
          />
        )}

        {activeTab === 'loyalty' && (
          <CustomerLoyaltyPointsTable
            data={loyaltyData}
            isFetching={loyaltyFetching}
            error={loyaltyError}
            paginationModel={loyaltyPaginationModel}
            changePaginationModel={handleLoyaltyPaginationChange}
          />
        )}
      </Board>

      <FilterDrawer />
    </LayoutContent>
  )
}

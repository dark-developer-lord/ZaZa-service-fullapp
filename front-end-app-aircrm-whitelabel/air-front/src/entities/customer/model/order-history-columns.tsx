import { GridColDef } from '@mui/x-data-grid'
import { Box, Avatar, AvatarGroup, IconButton } from '@mui/material'

import ActionIcon from '@icons/action.svg?react'
import { CustomerOrderHistory } from './customer-order-history'

// Format date from YYYY-MM-DD to DD.MM.YYYY
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Format currency amount
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    // style: 'currency',
    // currency: 'TJS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const orderHistoryColumns = (isMobile?: boolean): GridColDef<CustomerOrderHistory>[] => {
  const columnsDesktop: GridColDef<CustomerOrderHistory>[] = [
    {
      field: 'order_number',
      headerName: 'ID заказа',
      width: 100,
      renderCell: ({ row }) => {
        const displayNumber = row.order_number || row.id;
        return Intl.NumberFormat().format(Number(displayNumber));
      },
    },
    {
      field: 'date',
      headerName: 'Дата заказа',
      width: 130,
      renderCell: ({ row }) => row.date,
    },
    {
      field: 'order_amount',
      headerName: 'Сумма',
      width: 120,
      renderCell: ({ row }) => formatAmount(row.order_amount),
    },
    {
      field: 'order_quantity',
      headerName: 'Количество',
      width: 100,
      renderCell: ({ row }) => `${row.order_quantity} шт.`,
    },
    {
      field: 'products',
      headerName: 'Товары',
      width: 150,
      renderCell: ({ row }) => {
        return(
        <AvatarGroup
          max={3}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            '& .MuiAvatar-root': { width: 32, height: 32 }
          }}
        >
          {row.products?.map((product) => (
            <Avatar
              key={product.id}
              src={product.image}
              alt={product.name}
              sx={{ width: 32, height: 32 }}
            />
          ))}
        </AvatarGroup>
      )},
    },
    {
      field: 'discount',
      headerName: 'Скидка',
      width: 100,
      renderCell: ({ row }) => (
        <Box color={row.discount > 0 ? 'error.main' : 'text.secondary'}>
          {row.discount > 0 ? `-${formatAmount(row.discount)} с.` : 'Нет скидки'}
        </Box>
      ),
    },
    {
      field: 'points',
      headerName: 'Начислено баллов',
      flex: 1,
      minWidth: 100,
      renderCell: ({ row }) => (
        <Box color="success.main">
          +{row.points}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Действия',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <IconButton
          size="small"
          onClick={() => {
            console.log('Action clicked for row:', row.id)
          }}
          sx={{
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.light'
            }
          }}
        >
          <ActionIcon width={16} height={16} />
        </IconButton>
      ),
    },
  ]

  const columnsMobile: GridColDef<CustomerOrderHistory>[] = [
    {
      field: 'order_number',
      headerName: 'ID',
      width: 60,
      renderCell: ({ row }) => {
        const displayNumber = row.order_number || row.id;
        return Intl.NumberFormat().format(Number(displayNumber));
      },
    },
    {
      field: 'date',
      headerName: 'Дата',
      width: 100,
      renderCell: ({ row }) => row.date,
    },
    {
      field: 'order_amount',
      headerName: 'Сумма',
      width: 80,
      renderCell: ({ row }) => formatAmount(row.order_amount),
    },
    {
      field: 'order_quantity',
      headerName: 'Кол-во',
      width: 60,
      renderCell: ({ row }) => `${row.order_quantity}`,
    },
  ]

  return isMobile ? columnsMobile : columnsDesktop
}

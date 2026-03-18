import { GridColDef } from '@mui/x-data-grid'
import { Box, IconButton } from '@mui/material'

import ActionIcon from '@icons/action.svg?react'
import { CustomerLoyaltyPoint } from './customer-loyalty-points'

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const loyaltyPointsColumns = (isMobile?: boolean): GridColDef<CustomerLoyaltyPoint>[] => {
  const columnsDesktop: GridColDef<CustomerLoyaltyPoint>[] = [
    {
      field: 'id',
      headerName: '№',
      width: 80,
    },
    {
      field: 'date',
      headerName: 'Дата',
      width: 120,
      renderCell: ({ row }) => row.date,
    },
    {
      field: 'balance',
      headerName: 'Баланс',
      width: 100,
      renderCell: ({ row }) => formatAmount(row.balance),
    },
    {
      field: 'conditions',
      headerName: 'Условия',
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => row.transaction_type,
    },
    {
      field: 'deducted',
      headerName: 'Списано',
      width: 100,
      renderCell: ({ row }) => (
        <Box color="error.main">
          -{formatAmount(row.points_used)}
        </Box>
      ),
    },
    {
      field: 'credited',
      headerName: 'Начислено',
      width: 100,
      renderCell: ({ row }) => (
        <Box color="success.main">
          +{formatAmount(row.accrual)}
        </Box>
      ),
    },
    {
      field: 'remaining',
      headerName: 'Остаток',
      width: 100,
      renderCell: ({ row }) => formatAmount(row.remaining),
    },
    {
      field: 'action',
      headerName: 'Действие',
      width: 80,
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

  const columnsMobile: GridColDef<CustomerLoyaltyPoint>[] = [
    {
      field: 'id',
      headerName: '№',
      width: 60,
    },
    {
      field: 'date',
      headerName: 'Дата',
      flex: 1,
      minWidth: 100,
      renderCell: ({ row }) => row.date,
    },
    {
      field: 'credited',
      headerName: 'Начислено',
      width: 80,
      renderCell: ({ row }) => `+${formatAmount(row.accrual)}`,
    },
    {
      field: 'deducted',
      headerName: 'Списано',
      width: 80,
      renderCell: ({ row }) => `-${formatAmount(row.points_used)}`,
    },
    {
      field: 'action',
      headerName: '',
      width: 50,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <IconButton
          size="small"
          onClick={() => {
            console.log('Action clicked for row:', row.id)
            // TODO: Implement action functionality
          }}
          sx={{
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.light'
            }
          }}
        >
          <ActionIcon width={14} height={14} />
        </IconButton>
      ),
    },
  ]

  return isMobile ? columnsMobile : columnsDesktop
}

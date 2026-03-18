import { FC } from 'react'

import { GridColDef } from '@mui/x-data-grid'
import { Typography, alpha, Box } from '@mui/material'
import dayjs from 'dayjs'
import { EditButton } from '@shared/ui'
import { useStore } from '@features/analytic/cash-flow/create-update/model/store'


export interface TransactionTypeItem {
  id: number
  transaction_number?: string | number
  name: string
  category_id: number
  subcategory_id: number | null
  type: "income" | "expense"
  description: string
  amount: string
  status: "success" | "cancelled"
  created_at: string
  wallet_id?: number
  // API response structure
  wallet?: {
    id: number
    name: string
  }
  wallets?: Array<{
    id: number
    name: string
  }>
  category?: {
    id: number
    name: string
  }
  subcategory?: {
    id: number
    name: string
  } | null
}


export const columns = (Actions: FC<{ row: TransactionTypeItem }>, isMobile?: boolean): GridColDef<TransactionTypeItem>[] => {
  const columnsDesktop: GridColDef<TransactionTypeItem>[] = [
    {
      field: 'transaction_number',
      headerName: 'ID',
      width: 60,
      renderCell: ({ row }) => {
        const displayNumber = row.transaction_number || row.id;
        return Intl.NumberFormat().format(Number(displayNumber));
      },
    },
    {
      field: 'created_at',
      headerName: 'Дата',
      width: 150,
      renderCell: ({ row }) => dayjs(row['created_at']).format("DD.MM.YY")
    },
    {
      field: 'name',
      headerName: 'Наименование',
      flex: 1,
    },
    {
      field: 'income',
      headerName: 'Доход',
      renderCell: ({ row }) => row.type === 'income' ? row.amount : 0
    },
    {
      field: 'expense',
      headerName: 'Расход',
      renderCell: ({ row }) => row.type === 'expense' ? row.amount : 0
    },
    {
      field: 'description',
      headerName: 'Комментарий',
      flex: 1
    },
    {
      field: 'status',
      headerName: 'Статус',
      renderCell: ({ row: { status } }) => (
        <Typography
          component='span'
          fontSize={14}
          fontWeight={600}
          color={status === 'success' ? '#9A9DA3' : '#0E9F6E'}
          sx={{
            backgroundColor: theme => status === "success" ? "success.main" : alpha(theme.palette.primary.main, 0.1),
            borderRadius: "12px",
            color: status === "success" ? "success.contrastText" : "primary.main",
            display: "inline-block",
            fontSize: "11px",
            fontWeight: "600",
            lineHeight: "14px",
            padding: "8px 12px"
          }}
        >{status === 'success' ? 'Проведен' : 'Отменен'}</Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 110,
      renderCell: ({ row }) => <Actions row={row} />,
    }
  ]

  const columnsMobile: GridColDef<TransactionTypeItem>[] = [
    {
      field: 'created_at',
      headerName: 'Дата',
      width: 65,
      renderCell: ({ row }) => dayjs(row['created_at']).format("DD.MM.YY")
    },
    {
      field: 'name',
      headerName: 'Наименование',
      flex: 1,
      minWidth: 120,
      renderCell: ({ row }) => (
        <Box sx={{ width: '100%', py: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mb: 0.5,
            }}
          >
            {row.name}
          </Typography>
          {row.description && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {row.description}
            </Typography>
          )}
        </Box>
      )
    },
    {
      field: 'income',
      headerName: 'Доход',
      width: 70,
      renderCell: ({ row }) => row.type === 'income' ? row.amount : 0
    },
    {
      field: 'expense',
      headerName: 'Расход',
      width: 60,
      renderCell: ({ row }) => row.type === 'expense' ? row.amount : 0
    },
    {
      field: 'status',
      headerName: 'Статус',
      width: 87,
      renderCell: ({ row }) => (
        <Typography
          component='span'
          fontSize={14}
          fontWeight={600}
          color={row.status === 'success' ? '#9A9DA3' : '#0E9F6E'}
          sx={{
            backgroundColor: theme => row.status === "success" ? "success.main" : alpha(theme.palette.primary.main, 0.1),
            borderRadius: "12px",
            color: row.status === "success" ? "success.contrastText" : "primary.main",
            display: "inline-block",
            fontSize: {xs: '9px', mobile: "11px"},
            fontWeight: "600",
            lineHeight: "14px",
            padding: "8px 12px"
          }}
        >
          {row.status === 'success' ? 'Проведен' : 'Отменен'}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Действие',
      width: 50,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => {
        const openUpdate = useStore.getState().openUpdate
        // row.id should be the actual API id (not transaction_number)
        // transaction_number is only for display purposes
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <EditButton onClick={() => openUpdate(row.id)} />
          </Box>
        )
      },
    }
  ]

  return isMobile ? columnsMobile : columnsDesktop
}

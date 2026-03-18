import { FC } from 'react'
import { Avatar, Box, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

import EditIcon from '@icons/edit.svg?react'

export type Installment = {
  id: number
  order_id?: number
  transfer_id?: number
  transfer_number?: string
  created_at: string
  customer?: string
  vendor?: string
  vendor_phone?: string
  store?: string
  warehouse?: string
  product?: {
    id: number
    details: {
      name: string
      image: string
    }
  }[]
  products?: {
    id: number
    quantity: string
    price: number
    details: {
      name: string
      image: string | null
    }
  }[]
  due_date: string
  remaining_balance: string
  is_paid: boolean
  installment_type?: 'orders' | 'transfer'
}

interface Props {
  Actions: FC<{ row: Installment }>
  isMobile?: boolean
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)

  const formattedDate = new Intl.DateTimeFormat('ru-RU').format(date)

  const formattedTime = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)

  return { formattedDate, formattedTime }
}

export const columns = ({
  Actions,
  isMobile = false,
}: Props): GridColDef<Installment>[] => {
  const columnsDesktop: GridColDef<Installment>[] = [
    {
      field: 'order_id',
      headerName: '№ заказа',
      width: 120,
      renderCell: ({ row }) => (
        <Box>
            {row.order_id ? `№ ${row.order_id}` : row.transfer_number || `№ ${row.transfer_id}`}
        </Box>
      ),
    },
    {
      field: 'created_at',
      headerName: 'Дата',
      width: 140,
      renderCell: ({ row }) => {
        const { formattedDate, formattedTime } = formatDate(row.created_at)
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography variant="body2" fontWeight="bold" lineHeight={1.2}>
              {formattedDate}
            </Typography>
            <Typography variant="caption" color="text.secondary" lineHeight={1.2}>
              {formattedTime}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'customer',
      headerName: 'Клиент',
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Box>
          {row.customer || row.vendor || '-'}
        </Box>
      ),
    },
    {
      field: 'store',
      headerName: 'Магазин',
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Box>
          {row.store || row.warehouse || '-'}
        </Box>
      ),
    },
    {
      field: 'product',
      headerName: 'Товар',
      width: 160,
      renderCell: ({ row }) => {
        const products = row.product || row.products || []
        if (products.length === 0) return <Box>-</Box>
        
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',      
            }}
          >
            {products.slice(0, 5).map((p: any, index: number) => (
              <Avatar
                key={p.id}
                src={p.details?.image || p.image}
                alt={p.details?.name || p.name}
                sx={{
                  width: 32,
                  height: 32,
                  border: '2px solid white',
                  marginLeft: index === 0 ? 0 : -1.5,
                  zIndex: products.length - index,
                }}
              />
            ))}
            {products.length > 5 && (
              <Typography variant="caption" sx={{ ml: 1 }}>
                +{products.length - 5}
              </Typography>
            )}
          </Box>
        )
      }
    },
    {
      field: 'due_date',
      headerName: 'Дата погашения',
      width: 140,
    },
    {
      field: 'remaining_balance',
      headerName: 'Остаток',
      width: 120,
      renderCell: ({ row }) => (
        <Box sx={{ fontWeight: 'bold' }} component="span">
          {Number(row.remaining_balance)} c.
        </Box>
      ),
    },
    {
      field: 'is_paid',
      headerName: 'Статус',
      width: 120,
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }}
          color={row.is_paid ? 'success.main' : 'warning.main'}
        >
          {row.is_paid ? 'Оплачен' : 'Не оплачен'}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Действие',
      width: 100,
      renderCell: ({ row }) => <Actions row={row} />,
    },
  ]

  const columnsMobile: GridColDef<Installment>[] = [
    {
      field: 'order_info',
      headerName: 'Информация о заказе',
      flex: 1,
      renderCell: ({ row }) => {
        const { formattedDate, formattedTime } = formatDate(row.created_at)
        const orderNumber = row.order_id ? `№ ${row.order_id}` : row.transfer_number || `№ ${row.transfer_id}`
        const customer = row.customer || row.vendor || '-'
        const location = row.store || row.warehouse || '-'
        
        return (
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {orderNumber} • {customer}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formattedDate} {formattedTime}
            </Typography>
            <Typography variant="caption" display="block">
              {location}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: 'payment_info',
      headerName: 'Платеж',
      width: 120,
      renderCell: ({ row }) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {row.remaining_balance}
          </Typography>
          <Typography
            variant="caption"
            color={row.is_paid ? 'success.main' : 'warning.main'}
          >
            {row.is_paid ? 'Оплачен' : 'Не оплачен'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Действие',
      width: 80,
      renderCell: ({ row }) => <Actions row={row} />,
    },
  ]

  return isMobile ? columnsMobile : columnsDesktop
}

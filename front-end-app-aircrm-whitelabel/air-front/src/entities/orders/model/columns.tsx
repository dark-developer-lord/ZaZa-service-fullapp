import { FC } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

import { formatPhoneNumber } from '@shared/lib'

import { Order } from './order-type'

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const formattedDate = new Intl.DateTimeFormat('ru-RU').format(date);
  const formattedTime = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
  return { formattedDate, formattedTime };
};

export const columns = (
  SelectOrderStatus?: FC<{ row: Order }>,
  ActionsSlot?: FC<{ row: Order }>,
  source?: string,
  isMobile?: boolean
): GridColDef<Order>[] => {
  const columnsDesktop: GridColDef<Order>[] = [
    {
      field: 'order_number',
      headerName: '№',
      width: 80,
      renderCell: ({ row }) => {
        const displayNumber = row.order_number || row.id;
        return Intl.NumberFormat().format(Number(displayNumber));
      },
    },
    {
      field: 'created_at',
      headerName: 'Дата заказа',
      width: 160,
      renderCell: ({ row: { created_at } }) => {
        const { formattedDate, formattedTime } = formatDate(created_at);
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
        );
      },
    },
    {
      field: 'customer_name',
      headerName: 'Клиент',
      width: 160,
      renderCell: ({ row: { customer } }) => {
        return `${customer.f_name || ''} ${customer.l_name || ''}`
      },
    },
    {
      field: 'customer_phone',
      headerName: 'Номер телефона',
      width: 200,
      renderCell: ({ row: { customer } }) => formatPhoneNumber(customer.phone),
    },
    {
      field: 'total',
      headerName: 'Сумма',
      width: 120,
      renderCell: ({ row: { total, status } }) => (
        <Box
          color={
            status === 'canceled' ||
            // status === 'failed' ||
            status === 'refunded'
              ? 'error.main'
              : 'success.main'
          }
        >
          {total} с.
        </Box>
      ),
    },
    {
      field: 'installment',
      headerName: 'Долг',
      width: 160,
      renderCell: ({ row }) =>
        (<Box
          color={
            row.installment > 0 ? 'error.main' : 'success.main'}>
            {Number(row.installment)} c.
          </Box>),
    },
    {
      field: 'wallets',
      headerName: 'Кошелек',
      width: 120,
      renderCell: ({ row }) => {
        if (!row.wallets || row.wallets.length === 0) {
          return <Typography variant="body2" color="text.secondary" sx={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>-</Typography>
        }

        return (
          <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{height: '100%'}}>
            {row.wallets.slice(0, 2).map((wallet, index) => (
              <Box
                key={wallet.id}
                component="img"
                src={wallet.logo ? `${import.meta.env.VITE_APP_BACK_URL}/${wallet.logo}` : '/icons/wallet.svg'}
                alt={wallet.name}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            ))}
            {row.wallets.length > 2 && (
              <Typography variant="caption" color="text.secondary">
                +{row.wallets.length - 2}
              </Typography>
            )}
          </Stack>
        )
      },
    },
    {
      field: 'status',
      headerName: 'Статус',
      width: 200,
      renderCell: ({ row }) => SelectOrderStatus && <SelectOrderStatus row={row} /> ,
    },
    {
      field: 'actions',
      headerName: 'Изменить',
      width: 150,
      renderCell: ({ row }) => ActionsSlot && <ActionsSlot row={row} />,
    },
  ]

  const columnsMobile: GridColDef<Order>[] = [
    {
      field: 'order_number',
      headerName: '№',
      width: 50,
      renderCell: ({ row }) => {
        const displayNumber = row.order_number || row.id;
        return Intl.NumberFormat().format(Number(displayNumber));
      },
    },
    {
      field: 'customer_name',
      headerName: 'Клиент',
      width: 70,
      renderCell: ({ row: { customer } }) => {
        return `${customer.f_name || ''} ${customer.l_name || ''}`
      },
    },
    {
      field: 'total',
      headerName: 'Сумма',
      width: 55,
      renderCell: ({ row: { total, status } }) => (
        <Box
          color={
            status === 'canceled' ||
            // status === 'failed' ||
            status === 'refunded'
              ? 'error.main'
              : 'success.main'
          }
        >
          {total} с.
        </Box>
      ),
    },
    {
      field: 'installment',
      headerName: 'Долг',
      width: 55,
      renderCell: ({ row }) =>
        (<Box
          color={
            row.installment > 0 ? 'error.main' : 'success.main'}>
            {row.installment} c.
          </Box>),
    },
    {
      field: 'wallets',
      headerName: 'Кошелек',
      width: 60,
      renderCell: ({ row }) => {
        if (!row.wallets || row.wallets.length === 0) {
          return <Typography variant="body2" color="text.secondary">-</Typography>
        }

        return (
          <Stack direction="row" spacing={0.25} alignItems="center" justifyContent="center">
            {row.wallets.slice(0, 1).map((wallet) => (
              <Box
                key={wallet.id}
                component="img"
                src={wallet.logo ? `${import.meta.env.VITE_APP_BACK_URL}/${wallet.logo}` : '/icons/wallet.svg'}
                alt={wallet.name}
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            ))}
            {row.wallets.length > 1 && (
              <Typography variant="caption" color="text.secondary" fontSize="10px">
                +{row.wallets.length - 1}
              </Typography>
            )}
          </Stack>
        )
      },
    },
    {
      field: 'status',
      headerName: 'Статус',
      width: 110,
      renderCell: ({ row }) => SelectOrderStatus && <SelectOrderStatus row={row} /> ,
    },
    {
      field: 'actions',
      headerName: 'Изменить',
      width: 100,
      renderCell: ({ row }) => ActionsSlot && <ActionsSlot row={row} />,
    },
  ]

  if (source === 'admin') {
    columnsDesktop.splice(4, 0, {
      field: 'store_name',
      headerName: 'Магазин',
      width: 200,
      renderCell: ({ row: { store } }) => store?.name,
    },
    {
      field: 'warehouse',
      headerName: 'Действия',
      width: 130,
      renderCell: ({ row: { warehouse } }) => warehouse?.name
    })
  }

  return isMobile ? columnsMobile : columnsDesktop
}

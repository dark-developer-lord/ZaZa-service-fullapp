import { FC } from 'react'
import { Avatar, Box, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

import { formatPhoneNumber } from '@shared/lib'

import { Courier } from './courier'

export const columns = (
  Actions: FC<{ row: Courier }>,
): GridColDef<Courier>[] => [
  {
    field: 'delivery_man_number',
    headerName: 'ID',
    width: 50,
    renderCell: ({ row }) => {
      const displayNumber = row.delivery_man_number || row.id;
      return Intl.NumberFormat().format(Number(displayNumber));
    },
  },
  {
    field: 'avatar',
    headerName: 'Аватар',
    width: 60,
    renderCell: ({ row }) => (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={row.avatar}
          alt={row.f_name || row.l_name || ''}
          sx={{ width: 40, height: 40 }}
        />
      </Box>
    ),
  },
  {
    field: 'name',
    headerName: 'ФИО',
    flex: 1,
    renderCell: ({ row }) => `${row.f_name || ''} ${row.l_name || ''}`,
  },
  {
    field: 'phone',
    headerName: 'Телефон',
    flex: 1,
    renderCell: ({ row }) => formatPhoneNumber(row.phone),
  },
  {
    field: 'status',
    headerName: 'Статус',
    flex: 1,
    renderCell: ({ row }) => (
      <Typography
        variant="small"
        fontWeight={600}
        color={row.status ? 'success.main' : 'error.main'}
      >
        {row.status ? 'Онлайн' : 'Оффлайн'}
      </Typography>
    ),
  },
  {
    field: 'actions',
    headerName: 'Действия',
    flex: 1,
    renderCell: ({ row }) => <Actions row={row} />,
  },
]

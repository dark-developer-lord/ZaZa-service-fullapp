import { FC } from 'react'
import { Avatar, Box, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

import { formatPhoneNumber } from '@shared/lib'

import { RestaurantItem, WarehouseItem } from './restaurant'

export const columns = (
  Actions: FC<{ row: RestaurantItem }>,
): GridColDef<RestaurantItem>[] => [
  {
    field: 'id',
    headerName: 'ID',
    width: 90,
  },
  {
    field: 'logo',
    headerName: 'Лого',
    width: 90,
    renderCell: ({ row }) => (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={row.logo}
          alt={row.name}
          sx={{ width: 40, height: 40 }}
        />
      </Box>
    ),
  },
  {
    field: 'image',
    headerName: 'Баннер',
    width: 90,
    renderCell: ({ row }) => (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={row.banner}
          alt={row.name}
          sx={{ width: 40, height: 40 }}
        />
      </Box>
    ),
  },
  {
    field: 'name',
    headerName: 'Название',
    flex: 1,
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
    width: 90,
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
    width: 110,
    renderCell: ({ row }) => <Actions row={row} />,
  },
]

export const warehouseColumns = (
  Actions: FC<{ row: WarehouseItem }>,
  StatusToggle: FC<{ row: WarehouseItem }>
): GridColDef<WarehouseItem>[] => [
  {
    field: 'id',
    headerName: '№',
    width: 60,
  },
  {
    field: 'name',
    headerName: 'Название',
    flex: 1,
    minWidth: 135,
  },
  {
    field: 'address',
    headerName: 'Локация',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'responsible',
    headerName: 'Отвественный',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'phone',
    headerName: 'Телефон',
    flex: 1,
    minWidth: 100,
    renderCell: ({ row }) => formatPhoneNumber(row.phone),
  },
  {
    field: 'status',
    headerName: 'Статус',
    width: 90,
    renderCell: ({ row }) => <StatusToggle row={row} />
  },
  {
    field: 'actions',
    headerName: 'Действия',
    width: 110,
    renderCell: ({ row }) => <Actions row={row} />,
  },
]

import { FC } from 'react'
import { Avatar, Box } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

import { formatPhoneNumber } from '@shared/lib'

import { Admin } from './types'

export const columns = (Actions: FC<{ row: Admin }>): GridColDef<Admin>[] => [
  {
    field: 'id',
    headerName: 'ID',
    width: 90,
  },
  {
    field: 'image',
    headerName: 'Фото',
    width: 90,
    renderCell: ({ row }) => (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={row.image}
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
    field: 'role',
    headerName: 'Роль',
    flex: 1,
    renderCell: ({ row }) => row.role.name || '',
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
  },
  {
    field: 'phone',
    headerName: 'Телефон',
    flex: 1,
    renderCell: ({ row }) => formatPhoneNumber(row.phone),
  },
  {
    field: 'created_at',
    headerName: 'Дата создания',
    flex: 1,
    renderCell: ({ row }) => new Date(row.created_at).toLocaleString(),
  },
  {
    field: 'actions',
    headerName: 'Действия',
    renderCell: ({ row }) => <Actions row={row} />,
    width: 150,
  },
]

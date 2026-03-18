import { GridColDef } from '@mui/x-data-grid'

import { formatPhoneNumber } from '@shared/lib'

import { PointReport } from './types'

export const columns: GridColDef<PointReport>[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 90,
  },
  {
    field: 'name',
    headerName: 'ФИО',
    flex: 1,
    renderCell: ({ row }) => `${row.f_name || ''} ${row.l_name || ''}`,
  },
  {
    field: 'points_spent',
    headerName: 'Потраченные баллы',
  },
  {
    field: 'phone',
    headerName: 'Телефон',
    flex: 1,
    renderCell: ({ row }) => formatPhoneNumber(row.phone),
  },
  {
    field: 'date',
    headerName: 'Дата',
    flex: 1,
    renderCell: ({ row }) => new Date(row.created_at).toLocaleString('ru'),
  },
]

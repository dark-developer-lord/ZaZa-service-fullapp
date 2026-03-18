import { FC } from 'react'
import { GridColDef } from '@mui/x-data-grid'

import { formatPhoneNumber } from '@shared/lib'

import { StoreItem } from './store'

export const columns = (
  Actions: FC<{ row: StoreItem }>,
  StatusToggle: FC<{ row: StoreItem } >
): GridColDef<StoreItem>[] => [
  {
    field: 'store_number',
    headerName: 'ID',
    width: 60,
    renderCell: ({ row }) => {
      const displayNumber = row.store_number || row.id;
      return Intl.NumberFormat().format(Number(displayNumber));
    },
  },
  {
    field: 'name',
    headerName: 'Название',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'address',
    headerName: 'Локация',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'responsible',
    headerName: 'Ответственный',
    flex: 1,
    minWidth: 100,
    renderCell: ({ row }) => (row.vendor?.f_name || ''),
  },
  {
    field: 'phone',
    headerName: 'Номер телефона',
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

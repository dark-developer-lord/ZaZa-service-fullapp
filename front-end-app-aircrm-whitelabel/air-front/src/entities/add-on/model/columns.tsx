import { FC } from 'react'
import { GridColDef } from '@mui/x-data-grid'

import { LoginSource } from '@shared/auth'

import { AddOn } from './types'

interface Props {
  Actions: FC<{ row: AddOn }>
  StatusToggle: FC<{ row: AddOn }>
  loginSource: LoginSource
}

export const columns = ({
  Actions,
  StatusToggle,
  loginSource,
}: Props): GridColDef<AddOn>[] => {
  const columns: GridColDef<AddOn>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 90,
    },
    {
      field: 'name',
      headerName: 'Название',
      flex: 1,
    },
    {
      field: 'restaurant',
      headerName: 'Ресторан',
      flex: 1,
      renderCell: ({ row }) =>
        `${row.restaurant.name} (${row.restaurant.zone.name})`,
    },
    {
      field: 'price',
      headerName: 'Цена',
      flex: 1,
      renderCell: ({ row }) => `${row.price} с.`,
    },
    {
      field: 'status',
      headerName: 'Статус',
      renderCell: ({ row }) => <StatusToggle row={row} />,
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Действия',
      flex: 1,
      renderCell: ({ row }) => <Actions row={row} />,
    },
  ]

  if (loginSource !== 'admin') {
    columns.splice(2, 1)
  }

  return columns
}

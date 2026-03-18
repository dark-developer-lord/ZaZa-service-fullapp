import { FC } from 'react'
import { Avatar, Box } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

import { LoginSource } from '@shared/auth'

import { CategoryItem } from './category'

interface Props {
  Actions?: FC<{ row: CategoryItem }>
  StatusToggle?: FC<{ row: CategoryItem }>
  PrioritySelect?: FC<{ row: CategoryItem }>
  loginSource: LoginSource
}

export const columns = ({
  Actions,
  StatusToggle,
  loginSource,
}: Props): GridColDef<CategoryItem>[] => {
  const columns: GridColDef<CategoryItem>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 90,
    },
    {
      field: 'image',
      headerName: 'Иконка',
      width: 90,
      renderCell: ({ row }) => (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={row.image}
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
      field: 'status',
      headerName: 'Статус',
      renderCell: ({ row }) => StatusToggle && <StatusToggle row={row} />,
      flex: 1,
    },
  ]

  if (loginSource !== 'vendor') {
    columns.splice(3, 3)
    columns.push({
      field: 'store',
      headerName: 'Магазин',
      flex: 1,
    })
  }
  columns.push({
    field: 'actions',
    headerName: 'Действия',
    flex: 1,
    renderCell: ({ row }) => Actions && <Actions row={row} />,
  })
  return columns
}

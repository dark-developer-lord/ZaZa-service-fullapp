import { FC } from 'react'
import { Avatar, Box } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

import { LoginSource } from '@shared/auth'

import { SubCategory } from './sub-category'

interface Props {
  Actions?: FC<{ row: SubCategory }>
  StatusToggle?: FC<{ row: SubCategory }>
  PrioritySelect?: FC<{ row: SubCategory }>
  loginSource: LoginSource
}

export const columns = ({
  Actions,
  StatusToggle,
  loginSource,
}: Props): GridColDef<SubCategory>[] => {
  const columns: GridColDef<SubCategory>[] = [
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
            alt={row?.name}
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
      field: 'category',
      headerName: 'Категория',
      flex: 1,
      renderCell: ({ row }) => row.parent?.name || null,
    },
    {
      field: 'status',
      headerName: 'Статус',
      renderCell: ({ row }) => StatusToggle && <StatusToggle row={row} />,
      width: 80,
    },
  ]

  if (loginSource !== 'vendor') {
    columns.splice(4, 3)
    columns.push({
      field: 'store',
      headerName: 'Магазин',
      flex: 1,
      renderCell: ({ row }) => row.parent?.store || null,
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

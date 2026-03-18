import { FC } from 'react'
import { Avatar, Box } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

import { Banner } from './types'

interface Props {
  Actions: FC<{ row: Banner }>
  StatusToggle: FC<{ row: Banner }>
}

export const columns = ({
  Actions,
  StatusToggle,
}: Props): GridColDef<Banner>[] => [
  {
    field: 'id',
    headerName: 'ID',
    width: 90,
  },
  {
    field: 'image',
    headerName: 'Баннер',
    width: 90,
    renderCell: ({ row }) => (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={row.image}
          alt={row.title}
          sx={{ width: 40, height: 40 }}
        />
      </Box>
    ),
  },
  {
    field: 'title',
    headerName: 'Заголовок',
    flex: 1,
  },
  {
    field: 'restaurant',
    headerName: 'Ресторан',
    flex: 1,
    renderCell: ({ row }) => row.restaurant.name,
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
    renderCell: ({ row }) => <Actions row={row} />,
    width: 150,
  },
]

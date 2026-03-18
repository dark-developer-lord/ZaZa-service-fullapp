import { FC } from 'react'
import { Avatar, Box } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'

import { Campaign } from './types'

interface Props {
  Actions: FC<{ row: Campaign }>
  StatusToggle: FC<{ row: Campaign }>
}

export const columns = ({
  Actions,
  StatusToggle,
}: Props): GridColDef<Campaign>[] => [
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
    field: 'date-range',
    headerName: 'Дата',
    flex: 1,
    renderCell: ({ row }) =>
      `${new Date(row.start_date).toLocaleDateString('ru')} / ${new Date(row.end_date).toLocaleDateString('ru')}`,
  },
  {
    field: 'time-range',
    headerName: 'Время',
    flex: 1,
    renderCell: ({ row }) =>
      `${dayjs(row.start_time, 'HH:mm').format('HH:mm')} / ${dayjs(row.end_time, 'HH:mm').format('HH:mm')}`,
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

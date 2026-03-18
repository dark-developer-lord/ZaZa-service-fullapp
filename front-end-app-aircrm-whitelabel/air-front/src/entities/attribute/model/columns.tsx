import { FC } from 'react'
import { GridColDef } from '@mui/x-data-grid'

import { Attribute } from './types'

import { LoginSource } from '@shared/auth'

export const columns = (
  Actions: FC<{ row: Attribute }>,
  loginSource: LoginSource
): GridColDef<Attribute>[] => {
  const columns: GridColDef<Attribute>[] = [
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
  ]

  if (loginSource !== 'vendor') {
    columns.splice(2, 1)
    columns.push(
      {
        field: 'store',
        headerName: 'Магазин',
        flex: 1,
      }
    )
  }

  columns.push({
    field: 'actions',
    headerName: 'Действия',
    renderCell: ({ row }) => Actions && <Actions row={row} />,
    width: 150,
  })

  return columns
}
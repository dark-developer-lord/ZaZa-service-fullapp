import { FC } from 'react'
import { GridColDef } from '@mui/x-data-grid'

import { TransactionCategoryItem } from './category'

interface Props {
  Actions?: FC<{ row: TransactionCategoryItem }>
  StatusToggle?: FC<{ row: TransactionCategoryItem }>
  PrioritySelect?: FC<{ row: TransactionCategoryItem }>
}

export const columns = ({
  Actions,
}: Props): GridColDef<TransactionCategoryItem>[] => {
  const columns: GridColDef<TransactionCategoryItem>[] = [
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

  columns.push({
    field: 'actions',
    headerName: 'Действия',
    flex: 1,
    renderCell: ({ row }) => Actions && <Actions row={row} />,
  })
  return columns
}

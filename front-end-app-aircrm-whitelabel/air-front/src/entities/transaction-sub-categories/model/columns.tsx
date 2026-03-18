import { FC } from 'react'
import { GridColDef } from '@mui/x-data-grid'

import { TransactionSubCategoryItem } from './sub-category'

interface Props {
  Actions?: FC<{ row: TransactionSubCategoryItem }>
}

export const columns = ({
  Actions
}: Props): GridColDef<TransactionSubCategoryItem>[] => {
  const columns: GridColDef<TransactionSubCategoryItem>[] = [
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
      field: 'category',
      headerName: 'Категория',
      flex: 1,
      renderCell: ({ row }) => row.parent?.name || null,
    },
    {
      field: 'actions',
      headerName: 'Действия',
      flex: 1,
      renderCell: ({ row }) => Actions && <Actions row={row} />,
    }
  ]

  return columns
}

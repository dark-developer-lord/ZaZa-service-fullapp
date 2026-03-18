import { FC } from 'react'
import { GridColDef } from '@mui/x-data-grid'

import { CounterpartyTypeItem } from './type'

interface Props {
  Actions?: FC<{ row: CounterpartyTypeItem }>
  paginationModel?: { page: number; pageSize: number }
  data?: CounterpartyTypeItem[]
}

export const columns = ({
  Actions,
  paginationModel,
  data,
}: Props): GridColDef<CounterpartyTypeItem>[] => {
  const columns: GridColDef<CounterpartyTypeItem>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 90,
      renderCell: ({ row }) => {
        // Find the index of the row in the current page's data array using value as unique identifier
        const rowIndex = data?.findIndex((item) => item.value === row.value) ?? 0
        // Calculate display ID: (page * pageSize) + rowIndex + 1
        // Since data is already paginated, rowIndex is the index within the current page
        const page = paginationModel?.page || 0
        const pageSize = paginationModel?.pageSize || 10
        return (page * pageSize) + rowIndex + 1
      },
    },
    {
      field: 'value',
      headerName: 'Значение',
      flex: 1,
    },
    {
      field: 'label',
      headerName: 'Название',
      flex: 1,
    },
  ]

  if (Actions) {
    columns.push({
      field: 'actions',
      headerName: 'Действия',
      flex: 1,
      renderCell: ({ row }) => row.is_custom ? <Actions row={row} /> : null,
    })
  }
  
  return columns
}


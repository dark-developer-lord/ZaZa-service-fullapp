import { FC } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { Chip } from '@mui/material'

import { TransactionApproval } from '../api/get-transaction-approvals'

const formatAmount = (amount: string | number) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return `${num.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c.`
}

export const columns = (
  ActionsSlot: FC<{ row: TransactionApproval }>
): GridColDef<TransactionApproval>[] => [
  {
    field: 'id',
    headerName: '№',
    width: 70,
  },
  {
    field: 'title',
    headerName: 'Название',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'transaction_type_label',
    headerName: 'Тип',
    width: 120,
    renderCell: ({ row }) => (
      <Chip
        label={row.transaction_type_label}
        size="small"
        sx={{
          bgcolor: row.transaction_type === 'income' 
            ? '#BCF0DA' 
            : row.transaction_type === 'expense'
            ? '#FBD5D5'
            : '#E0E7FF',
          color: row.transaction_type === 'income'
            ? '#065F46'
            : row.transaction_type === 'expense'
            ? '#991B1B'
            : '#3730A3',
          fontWeight: 600,
        }}
      />
    ),
  },
  {
    field: 'category',
    headerName: 'Категория',
    flex: 1,
    minWidth: 130,
  },
  {
    field: 'amount',
    headerName: 'Сумма',
    width: 130,
    renderCell: ({ row }) => formatAmount(row.amount),
  },
  {
    field: 'cycle_type_label',
    headerName: 'Цикличность',
    width: 140,
  },
  {
    field: 'wallet',
    headerName: 'Кошелек',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'created_at',
    headerName: 'Создано',
    width: 110,
  },
  {
    field: 'actions',
    headerName: 'Действия',
    width: 100,
    sortable: false,
    renderCell: ({ row }: { row: TransactionApproval }) => <ActionsSlot row={row} />,
  },
]


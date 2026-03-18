import { FC } from 'react'
import { GridColDef } from '@mui/x-data-grid'

import { Counterparty } from './types'

// Format date from YYYY-MM-DD to DD.MM.YYYY
const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Не указано'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Не указано'
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Format currency amount
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'TJS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const columns = (
  ActionsSlot: FC<{ row: Counterparty }>
): GridColDef<Counterparty>[] => [
  {
    field: 'counterparty_number',
    headerName: '№',
    width: 90,
    renderCell: ({ row }) => {
      const displayNumber = row.counterparty_number || row.id
      return Intl.NumberFormat().format(Number(displayNumber))
    },
  },
  {
    field: 'counterparty',
    headerName: 'Контрагент',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'name',
    headerName: 'Наименование',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'type',
    headerName: 'Тип',
    width: 120,
  },
  {
    field: 'balance',
    headerName: 'Баланс',
    width: 130,
    renderCell: ({ row }) => formatAmount(row.balance),
  },
  {
    field: 'comment',
    headerName: 'Комментарий',
    flex: 1,
    minWidth: 150,
    renderCell: ({ row }) => row.comment || 'Нет комментария',
  },
  {
    field: 'status',
    headerName: 'Статус',
    width: 120,
  },
  {
    field: 'created_at',
    headerName: 'Дата создания',
    width: 130,
    renderCell: ({ row }) => formatDate(row.created_at),
  },
  {
    field: 'actions',
    headerName: 'Действие',
    width: 100,
    renderCell: ({ row }) => ActionsSlot && <ActionsSlot row={row} />,
  },
]


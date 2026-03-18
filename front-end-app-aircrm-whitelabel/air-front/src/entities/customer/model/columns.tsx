import { FC } from 'react'
import { GridColDef } from '@mui/x-data-grid'

import { formatPhoneNumber } from '@shared/lib'

import { CustomerItem } from './customer-type'

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
  ActionsSlot: FC<{ row: CustomerItem }>,
  isMobile?: boolean
): GridColDef<CustomerItem>[] => {
  const columnsDesktop: GridColDef<CustomerItem>[] = [
    {
      field: 'user_number',
      headerName: '№',
      width: 90,
      renderCell: ({ row }) => {
        const displayNumber = row.user_number || row.id;
        return Intl.NumberFormat().format(Number(displayNumber));
      },
    },
    {
      field: 'name',
      headerName: 'ФИО',
      flex: 1,
      renderCell: ({ row }) => `${row.f_name || ''} ${row.l_name || ''}`,
    },
    {
      field: 'phone',
      headerName: 'Номер телефона',
      flex: 1,
      renderCell: ({ row }) => formatPhoneNumber(row.phone),
    },
    {
      field: 'birth_date',
      headerName: 'Дата рождения',
      width: 130,
      renderCell: ({ row }) => formatDate(row.birth_date),
    },
    {
      field: 'total_order_amount',
      headerName: 'Сумма',
      width: 120,
      sortable: true,
      renderCell: ({ row }) => formatAmount(row.total_order_amount),
    },
    {
      field: 'total_order_count',
      headerName: 'Кол-во заказов',
      width: 120,
    },
    {
      field: 'source',
      headerName: 'Источник',
      width: 120,
      renderCell: ({ row }) => row.source || 'Не указано',
    },
    {
      field: 'absence_days',
      headerName: 'Отсутствие',
      width: 100,
      sortable: true,
      renderCell: ({ row }) => row.absence_days !== null ? `${row.absence_days} дн.` : 'Никогда',
    },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 100,
      renderCell: ({ row }) => ActionsSlot && <ActionsSlot row={row} />,
    },
  ]

  const columnsMobile: GridColDef<CustomerItem>[] = [
    {
      field: 'name',
      headerName: 'ФИО',
      width: 120,
      renderCell: ({ row }) => `${row.f_name || ''} ${row.l_name || ''}`,
    },
    {
      field: 'total_order_count',
      headerName: 'Заказы',
      width: 60
    },
    {
      field: 'phone',
      headerName: 'Телефон',
      flex: 1,
      renderCell: ({ row }) => formatPhoneNumber(row.phone),
    },
    {
      field: 'total_order_amount',
      headerName: 'Сумма',
      width: 80,
      sortable: true,
      renderCell: ({ row }) => formatAmount(row.total_order_amount),
    },
  ]

  return isMobile ? columnsMobile : columnsDesktop
}

export const callResultsColumns = (
  isMobile?: boolean
): GridColDef<any>[] => {
  const columnsDesktop: GridColDef<any>[] = [
    {
      field: 'user_number',
      headerName: '№',
      width: 90,
      renderCell: ({ row }) => {
        const displayNumber = row.user_number || row.id;
        return Intl.NumberFormat().format(Number(displayNumber));
      },
    },
    {
      field: 'name',
      headerName: 'ФИО',
      flex: 1,
      renderCell: ({ row }) => {
        // Handle both formats: full name string or separate f_name/l_name
        if (typeof row.name === 'string') {
          return row.name;
        }
        return `${row.f_name || ''} ${row.l_name || ''}`.trim();
      },
    },
    {
      field: 'phone',
      headerName: 'Номер телефона',
      flex: 1,
      renderCell: ({ row }) => formatPhoneNumber(row.phone),
    },
    {
      field: 'total_order_amount',
      headerName: 'Сумма',
      width: 120,
      renderCell: ({ row }) => formatAmount(row.total_order_amount || 0),
    },
    {
      field: 'total_orders',
      headerName: 'Кол-во заказов',
      width: 120,
      renderCell: ({ row }) => row.total_orders || row.total_order_count || 0,
    },
    {
      field: 'absence_days',
      headerName: 'Отсутствие',
      width: 100,
      renderCell: ({ row }) => row.absence_days || 'Не указано',
    },
    {
      field: 'call_status',
      headerName: 'Статус',
      width: 120,
      renderCell: ({ row }) => row.call_status || 'Не указано',
    },
    {
      field: 'call_result',
      headerName: 'Результат',
      flex: 1,
      renderCell: ({ row }) => row.call_result || '',
    },
  ]

  const columnsMobile: GridColDef<any>[] = [
    {
      field: 'name',
      headerName: 'ФИО',
      width: 120,
      renderCell: ({ row }) => {
        if (typeof row.name === 'string') {
          return row.name;
        }
        return `${row.f_name || ''} ${row.l_name || ''}`.trim();
      },
    },
    {
      field: 'phone',
      headerName: 'Телефон',
      flex: 1,
      renderCell: ({ row }) => formatPhoneNumber(row.phone),
    },
    {
      field: 'call_status',
      headerName: 'Статус',
      width: 100,
      renderCell: ({ row }) => row.call_status || 'Не указано',
    },
  ]

  return isMobile ? columnsMobile : columnsDesktop
}

import { FC } from 'react'
import { GridColDef } from '@mui/x-data-grid'

import { ProfitabilityItem } from '@widgets/finance/ui/analytic/api/get-products'

interface Props {
  Actions?: FC<{ row: ProfitabilityItem }>
}

export const columns = ({
}: Props): GridColDef<ProfitabilityItem>[] => [
  {
    field: 'id',
    headerName: '№',
    width: 90,
    renderCell: ({ row }) => row.id,
  },
  {
    field: 'name',
    headerName: 'Наименование товара',
    flex: 1,
  },
  {
    field: 'price',
    headerName: 'Цена продажи',
    flex: 1,
    renderCell: ({ row }) => `${row.price} с`,
  },
  {
    field: 'purchase_price',
    headerName: 'Себестоимость товара',
    flex: 1,
    renderCell: ({ row }) => `${row.purchase_price} с`,
  },
  {
    field: 'profit_per_unit',
    headerName: 'Прибыль на единицу',
    flex: 1,
    renderCell: ({ row }) => `${row.profit_per_unit} с`,
  },
  {
    field: 'sales_count',
    headerName: 'Объем продаж',
    flex: 1,
    renderCell: ({ row }) => `${row.sales_count} шт`,
  },
  {
    field: 'total_profit',
    headerName: 'Общая прибыльность',
    flex: 1,
    renderCell: ({ row }) => `${row.total_profit} с`,
  },
  {
    field: 'profitability',
    headerName: 'Рентабельность по цене продажи',
    flex: 1,
    renderCell: ({ row }) => `${row.profitability}%`,
  },
  {
    field: 'cost-effectiveness',
    headerName: 'Рентабельность по себестоимости',
    flex: 1,
    renderCell: ({ row }) => row['cost-effectiveness'] ? `${row['cost-effectiveness']}%` : 'Н/Д',
  },
]

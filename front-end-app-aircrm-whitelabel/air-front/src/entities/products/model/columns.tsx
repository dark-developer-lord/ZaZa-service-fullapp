import { FC } from 'react'
import { Avatar, Box, Tooltip } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'


import {
  FoodItem,
  ProductArrivalItem,
  ProductFlowItem,
  ProductSalesItem,
  ProductWriteOffItem
} from './food'

import { ProductItem } from '@entities/warehouse'

interface Props {
  type: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Actions: FC<{ row: any }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  StatusToggle: FC<{ row: any }>
}


export const productColumns = ({
  Actions,
  StatusToggle
}: Props): GridColDef<ProductItem>[] => [
  {
    field: 'image',
    headerName: 'Изображение',
    width: 90,
    renderCell: ({ row }) => (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={row.image}
          alt={row.name}
          sx={{ width: 40, height: 40 }}
        />
      </Box>
    ),
  },
  {
    field: 'name',
    headerName: 'Название продукта',
    flex: 1,
  },
  {
    field: 'warehouse',
    headerName: 'Склад',
    flex: 1,
    renderCell: ({ row }) => row.warehouse?.name
  },
  {
    field: 'category',
    headerName: 'Категория',
    flex: 1,
    renderCell: ({ row }) => row.category.name,
  },
  {
    field: 'subCategories',
    headerName: 'Подкатегории',
    flex: 1,
    width: 300,
    renderCell: ({ row }) => {
      const subCategories = row.category.sub_categories
        .map((subCategory) => subCategory.name)
        .join(', ')
      return (
        <Tooltip title={subCategories}>
          <span>{subCategories}</span>
        </Tooltip>
      )
    },
  },
  {
    field: 'price',
    headerName: 'Цена',
    flex: 1,
    renderCell: ({ row }) => `${row.price} с`,
  },
  {
    field: 'warehouse_quantity',
    headerName: 'Количество',
    flex: 1,
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
    flex: 1,
    renderCell: ({ row }) => <Actions row={row} />,
  },
]

export const columns = ({
  type,
  Actions,
  StatusToggle,
}: Props): GridColDef<FoodItem | ProductArrivalItem | ProductFlowItem | ProductSalesItem | ProductWriteOffItem>[] => {
  if (type === 'arrival') {
    return [
      {
        field: 'id',
        headerName: 'ID',
        width: 90,
      },
      {
        field: 'name',
        headerName: 'Название продукта',
        flex: 1,
      },
      {
        field: 'status',
        headerName: 'Статус',
        flex: 1,
      },
      {
        field: 'date',
        headerName: 'Дата',
        flex: 1,
        renderCell: ({ row }) => dayjs((row as any)['created_at']).format("DD MMMM YYYY")
      },
      {
        field: 'warehouse',
        headerName: 'Склад',
        flex: 1,
        renderCell: ({ row }) => (row as any).warehouse?.name || '-'
      },
      {
        field: 'counterparty',
        headerName: 'Поставщик',
        flex: 1,
        renderCell: ({ row }) => (row as any).counterparty?.name || '-'
      },
      {
        field: 'total_amount',
        headerName: 'Сумма',
        flex: 1,
        renderCell: ({ row }) => `${(row as any)?.total_amount || 0} c.`
      },
      {
        field: 'actions',
        headerName: 'Действия',
        flex: 1,
        renderCell: ({ row }) => <Actions row={row} />,
      },
    ]
  } else if (type === 'sales') {
    return   [
      {
        field: 'name',
        headerName: 'Название продукта',
        flex: 1,
      },
      {
        field: 'order_number',
        headerName: 'ID заказа',
        flex: 1,
        renderCell: ({ row }) => {
          const displayNumber = (row as any).order_number || (row as any).deal_id;
          return Intl.NumberFormat().format(Number(displayNumber));
        },
      },
      {
        field: 'state',
        headerName: 'Статус',
        flex: 1,
      },
      {
        field: 'date',
        headerName: 'Дата',
        flex: 1,
      },
      {
        field: 'warehouse',
        headerName: 'Склад',
        flex: 1,
      },
      {
        field: 'client',
        headerName: 'Клиент',
        flex: 1,
      },
      {
        field: 'quantity',
        headerName: 'Количество',
        flex: 1,
      },
      {
        field: 'sum',
        headerName: 'Сумма',
        flex: 1,
      },
      {
        field: 'actions',
        headerName: 'Действия',
        flex: 1,
        renderCell: ({ row }) => <Actions row={row} />,
      }
    ]

  } else if (type === 'flow') {
    return [
      {
        field: 'name',
        headerName: 'Название продукта',
        flex: 1,
      },
      {
        field: 'state',
        headerName: 'Статус',
        flex: 1,
      },
      {
        field: 'date',
        headerName: 'Дата',
        flex: 1,
      },
      {
        field: 'warehouse_from',
        headerName: 'Склад-отправитель',
        flex: 1,
      },
      {
        field: 'warehouse_in',
        headerName: 'Склад-получатель',
        flex: 1,
      },
      {
        field: 'quantity',
        headerName: 'Количество',
        flex: 1,
      },
      {
        field: 'sum',
        headerName: 'Сумма',
        flex: 1,
      },
      {
        field: 'actions',
        headerName: 'Действия',
        flex: 1,
        renderCell: ({ row }) => <Actions row={row} />,
      }
    ]
  } else if (type === 'write-off') {
    return [
      {
        field: 'name',
        headerName: 'Название продукта',
        flex: 1,
      },
      {
        field: 'state',
        headerName: 'Статус',
        flex: 1,
      },
      {
        field: 'date',
        headerName: 'Дата',
        flex: 1,
      },
      {
        field: 'warehouse',
        headerName: 'Склад',
        flex: 1,
      },
      {
        field: 'quantity',
        headerName: 'Количество',
        flex: 1,
      },
      {
        field: 'sum',
        headerName: 'Сумма',
        flex: 1,
      },
      {
        field: 'actions',
        headerName: 'Действия',
        flex: 1,
        renderCell: ({ row }) => <Actions row={row} />,
      }
    ]
  } else {
    return [
      {
        field: 'image',
        headerName: 'Изображение',
        width: 90,
        renderCell: ({ row }) => (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={(row as any).image}
              alt={row.name}
              sx={{ width: 40, height: 40 }}
            />
          </Box>
        ),
      },
      {
        field: 'name',
        headerName: 'Название продукта',
        flex: 1,
      },
      {
        field: 'warehouse',
        headerName: 'Склад',
        flex: 1,
        renderCell: ({ row }) => (row as any).warehouse?.name
      },
      {
        field: 'category',
        headerName: 'Категория',
        flex: 1,
        renderCell: ({ row }) => (row as any).category?.name,
      },
      {
        field: 'subCategories',
        headerName: 'Подкатегории',
        flex: 1,
        width: 300,
        renderCell: ({ row }) => {
          const subCategories = (row as any).category?.sub_categories
            ?.map((subCategory: any) => subCategory.name)
            .join(', ') ?? ''
          return (
            <Tooltip title={subCategories}>
              <span>{subCategories}</span>
            </Tooltip>
          )
        },
      },
      {
        field: 'price',
        headerName: 'Цена',
        flex: 1,
        renderCell: ({ row }) => `${(row as any).price} с`,
      },
      {
        field: 'warehouse_quantity',
        headerName: 'Количество',
        flex: 1,
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
        flex: 1,
        renderCell: ({ row }) => <Actions row={row} />,
      },
    ]
  }
}
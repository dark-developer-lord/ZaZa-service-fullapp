import { FC } from 'react'
import { Avatar, Box } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'


import { Product } from './product'

interface Props {
  Actions?: FC<{ row: Product }>
  StatusToggle?: FC<{ row: Product }>
  PrioritySelect?: FC<{ row: Product }>
}

export const columns = (): GridColDef<Product>[] => {
  const columns: GridColDef<Product>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 90,
    },
    {
      field: 'image',
      headerName: 'Иконка',
      width: 90,
      renderCell: ({ row }) => (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={row.product_image}
            alt={row?.product_image}
            sx={{ width: 40, height: 40 }}
          />
        </Box>
      ),
    },
    {
      field: 'product_name',
      headerName: 'Название',
      flex: 1,
    },
    {
      field: 'quantity',
      headerName: 'Количество',
      width: 120,
    },
    {
      field: 'price',
      headerName: 'Цена продажи',
      width: 120,
      renderCell: ({ row }) => `${row.price} с`,
    },
    {
      field: 'product_purchase_price',
      headerName: 'Себестоимость',
      width: 150,
      renderCell: ({ row }) => `${row.product_purchase_price} с`,
    },
    {
      field: 'discount',
      headerName: 'Скидка',
      width: 120,
      renderCell: ({ row }) => `${row.discount} ${row.discount_type === "percent" ? "%" : "с"}`,
    },
  ]

  return columns
}

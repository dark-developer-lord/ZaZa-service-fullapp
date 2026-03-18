import { FC } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { Box, IconButton, TextField } from '@mui/material'

import { normalizeNumber } from '@shared/lib'
import EditIcon from '@icons/edit.svg?react'
import DeleteIcon from '@icons/delete.svg?react'

interface SelectedProduct {
  id: number
  product_name?: string
  name?: string
  quantity?: number
  selectedQuantity: number
  selectedVariation: any
  costPrice: number
  salePrice: number
}

interface Props {
  editingProductId: number | null
  editQuantity: string
  onEditProduct: (productId: number) => void
  onRemoveProduct: (productId: number) => void
  onQuantityChange: (value: string) => void
}

export const selectedProductsColumns = ({
  editingProductId,
  editQuantity,
  onEditProduct,
  onRemoveProduct,
  onQuantityChange,
}: Props): GridColDef<SelectedProduct>[] => [
  {
    field: 'name',
    headerName: 'Название продукта',
    flex: 1,
    minWidth: 150,
    renderCell: ({ row }) => row.product_name || row.name || '',
  },
  {
    field: 'variation',
    headerName: 'Вариация',
    flex: 1,
    minWidth: 100,
    renderCell: ({ row }) => row.selectedVariation?.variation_type || '-',
  },
  {
    field: 'costPrice',
    headerName: 'Себестоимость',
    width: 120,
    renderCell: ({ row }) => `${normalizeNumber(row.costPrice)} c.`,
  },
  {
    field: 'salePrice',
    headerName: 'Продажа',
    width: 100,
    renderCell: ({ row }) => `${normalizeNumber(row.salePrice)} c.`,
  },
  {
    field: 'quantity',
    headerName: 'Количество',
    width: 120,
    renderCell: ({ row }) => {
      const isEditing = editingProductId === row.id
      // Get max available quantity
      const maxQuantity = row.selectedVariation
        ? row.selectedVariation.quantity
        : (typeof row.quantity === 'string' ? parseFloat(row.quantity) : row.quantity)

      return isEditing ? (
        <TextField
          size="small"
          type="number"
          value={editQuantity}
          onChange={(e) => {
            const value = e.target.value
            // Allow empty input for user to type
            if (value === '') {
              onQuantityChange(value)
              return
            }

            const numValue = parseFloat(value)
            // Prevent values greater than max
            if (numValue > maxQuantity) {
              onQuantityChange(maxQuantity.toString())
            } else if (numValue < 1) {
              onQuantityChange('1')
            } else {
              onQuantityChange(value)
            }
          }}
          sx={{ width: 80 }}
          inputProps={{ min: 1, max: maxQuantity }}
          helperText={`Макс: ${maxQuantity}`}
        />
      ) : (
        row.selectedQuantity
      )
    },
  },
  {
    field: 'total',
    headerName: 'Итого',
    width: 100,
    renderCell: ({ row }) => {
      const total = row.salePrice * row.selectedQuantity
      return `${normalizeNumber(total)} c.`
    },
  },
  {
    field: 'actions',
    headerName: 'Редактировать',
    width: 140,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => (
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <IconButton
          size="small"
          onClick={() => onEditProduct(row.id)}
        >
          <EditIcon width={20} height={20} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onRemoveProduct(row.id)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon width={20} height={20} />
        </IconButton>
      </Box>
    ),
  },
]


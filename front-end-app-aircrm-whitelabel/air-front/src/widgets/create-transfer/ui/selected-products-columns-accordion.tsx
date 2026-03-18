import { FC } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { Box, IconButton, TextField, Typography } from '@mui/material'

import { normalizeNumber } from '@shared/lib'
import EditIcon from '@icons/edit.svg?react'
import DeleteIcon from '@icons/delete.svg?react'
import ChevronDownIcon from '@icons/chevron-down.svg?react'

interface SelectedProduct {
  id: number | string
  product_name?: string
  name?: string
  selectedQuantity: number
  selectedVariation: any
  costPrice: number
  salePrice: number
  variations?: any[]
  isVariationRow?: boolean
  variationData?: any
}

interface Props {
  editingProductId: number | string | null
  editQuantity: string
  editSalePrice: string
  onEditProduct: (productId: number | string) => void
  onRemoveProduct: (productId: number | string) => void
  onQuantityChange: (value: string) => void
  onSalePriceChange: (value: string) => void
  expandedRows: Set<number>
  onToggleRow: (rowId: number) => void
  editingVariationId: string | null
  editVariationQuantity: string
  editVariationSalePrice: string
  onEditVariation: (variationRowId: string) => void
  onRemoveVariation: (variationRowId: string) => void
  onVariationQuantityChange: (value: string) => void
  onVariationSalePriceChange: (value: string) => void
  // Map of variation_id -> warehouse stock quantity
  warehouseStockMap?: Map<number | string, number>
}

export const selectedProductsColumnsWithAccordion = ({
  editingProductId,
  editQuantity,
  editSalePrice,
  onEditProduct,
  onRemoveProduct,
  onQuantityChange,
  onSalePriceChange,
  expandedRows,
  onToggleRow,
  editingVariationId,
  editVariationQuantity,
  editVariationSalePrice,
  onEditVariation,
  onRemoveVariation,
  onVariationQuantityChange,
  onVariationSalePriceChange,
  warehouseStockMap,
}: Props): GridColDef<SelectedProduct>[] => [
  {
    field: 'chevron',
    headerName: '',
    width: 60,
    sortable: false,
    renderCell: ({ row }: any) => {
      // Don't show chevron for variation rows
      if (row.isVariationRow) return null

      const hasVariations = row.variations && row.variations.length > 0
      const isExpanded = expandedRows?.has(row.id) || false

      if (!hasVariations) return null

      return (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              onToggleRow?.(row.id)
            }}
            sx={{
              bgcolor: '#EAF1F1',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <ChevronDownIcon width={20} height={20} />
          </IconButton>
        </Box>
      )
    },
  },
  {
    field: 'name',
    headerName: 'Название продукта',
    flex: 1,
    minWidth: 150,
    renderCell: ({ row }: any) => {
      if (row.isVariationRow && row.variationData) {
        return (
          <Box sx={{ pl: 4, display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {row.variationData.variation_type || 'Вариация'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              - {row.variationData.attribute_value}
            </Typography>
          </Box>
        )
      }
      return row.product_name || row.name || ''
    },
  },
  {
    field: 'costPrice',
    headerName: 'Себестоимость',
    width: 120,
    renderCell: ({ row }: any) => {
      if (row.isVariationRow && row.variationData) {
        return `${normalizeNumber(row.variationData.cost_price)} c.`
      }
      // For main product row with variations, show "-"
      if (row.variations && row.variations.length > 0) {
        return '-'
      }
      return `${normalizeNumber(row.costPrice)} c.`
    },
  },
  {
    field: 'salePrice',
    headerName: 'Продажа',
    width: 140,
    renderCell: ({ row }: any) => {
      if (row.isVariationRow && row.variationData) {
        const rowIdStr = String(row.id)
        const isEditingVariation = editingVariationId === rowIdStr
        if (isEditingVariation) {
          return (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
              <TextField
                value={editVariationSalePrice}
                onChange={(e) => onVariationSalePriceChange(e.target.value)}
                size="small"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                sx={{ width: 100 }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onEditVariation(rowIdStr)
                  }
                }}
              />
            </Box>
          )
        }
        return `${normalizeNumber(row.variationData.sale_price)} c.`
      }
      // For main product row with variations, show "-"
      if (row.variations && row.variations.length > 0) {
        return '-'
      }

      // For products without variations, show editable sale price
      const isEditing = editingProductId === row.id

      if (isEditing) {
        return (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <TextField
              value={editSalePrice}
              onChange={(e) => onSalePriceChange(e.target.value)}
              size="small"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ width: 100 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onEditProduct(row.id)
                }
              }}
            />
          </Box>
        )
      }

      return `${normalizeNumber(row.salePrice)} c.`
    },
  },
  {
    field: 'quantity',
    headerName: 'Количество',
    width: 150,
    renderCell: ({ row }: any) => {
      if (row.isVariationRow && row.variationData) {
        const rowIdStr = String(row.id)
        const isEditingVariation = editingVariationId === rowIdStr
        if (isEditingVariation) {
          // Get max from warehouseStockMap using variation_id (string like "2kg_xxx")
          const variationId = row.variationData.variation_id
          const stockFromMap = warehouseStockMap?.get(variationId)
          // Use stock from warehouse (stockFromMap) as max, NOT the transfer quantity
          const maxQuantity = stockFromMap ?? 999999
          return (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
              <TextField
                value={editVariationQuantity}
                onChange={(e) => {
                  const value = e.target.value
                  // Allow empty input for user to type
                  if (value === '') {
                    onVariationQuantityChange(value)
                    return
                  }
                  const numValue = parseFloat(value)
                  // Use maxQuantity directly
                  if (numValue > maxQuantity) {
                    onVariationQuantityChange(maxQuantity.toString())
                  } else if (numValue < 1) {
                    onVariationQuantityChange('1')
                  } else {
                    onVariationQuantityChange(value)
                  }
                }}
                size="small"
                type="number"
                inputProps={{ min: 1, max: maxQuantity }}
                sx={{ width: 100 }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onEditVariation(rowIdStr)
                  }
                }}
                helperText={`Макс: ${maxQuantity}`}
              />
            </Box>
          )
        }
        return normalizeNumber(row.variationData.quantity)
      }

      // For main product row with variations, show total quantity
      if (row.variations && row.variations.length > 0) {
        const totalQuantity = row.variations.reduce((sum: number, v: any) => sum + (v.quantity || 0), 0)
        return normalizeNumber(totalQuantity)
      }

      // For products without variations, show editable quantity
      const isEditing = editingProductId === row.id
      // Use originalQuantity if available, fallback to quantity
      const maxQuantity = row.originalQuantity
        || (typeof row.quantity === 'string' ? parseFloat(row.quantity) : row.quantity)
        || 1

      if (isEditing) {
        return (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <TextField
              value={editQuantity}
              onChange={(e) => {
                const value = e.target.value
                // Allow empty input for user to type
                if (value === '') {
                  onQuantityChange(value)
                  return
                }
                const numValue = parseFloat(value)
                // Cap at max quantity
                if (numValue > maxQuantity) {
                  onQuantityChange(maxQuantity.toString())
                } else if (numValue < 1) {
                  onQuantityChange('1')
                } else {
                  onQuantityChange(value)
                }
              }}
              size="small"
              type="number"
              inputProps={{ min: 1, max: maxQuantity }}
              sx={{ width: 100 }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onEditProduct(row.id)
                }
              }}
              helperText={`Макс: ${maxQuantity}`}
            />
          </Box>
        )
      }

      return normalizeNumber(row.selectedQuantity)
    },
  },
  {
    field: 'total',
    headerName: 'Итого',
    width: 120,
    renderCell: ({ row }: any) => {
      if (row.isVariationRow && row.variationData) {
        return `${normalizeNumber(row.variationData.total_sale_price)} c.`
      }

      // For main product row with variations, show sum of all variation totals
      if (row.variations && row.variations.length > 0) {
        const totalPrice = row.variations.reduce((sum: number, v: any) => sum + (v.total_sale_price || 0), 0)
        return `${normalizeNumber(totalPrice)} c.`
      }

      return `${normalizeNumber(row.salePrice * row.selectedQuantity)} c.`
    },
  },
  {
    field: 'actions',
    headerName: 'Действия',
    width: 120,
    sortable: false,
    renderCell: ({ row }: any) => {
      // For variation rows, show edit/delete buttons
      if (row.isVariationRow) {
        const rowIdStr = String(row.id)
        const isEditingVariation = editingVariationId === rowIdStr
        return (
          <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'center' }}>
            <IconButton
              size="small"
              onClick={() => onEditVariation(rowIdStr)}
            >
              <EditIcon
                width={20}
                height={20}
                stroke={isEditingVariation ? '#0E9F6E' : '#0E9F6E'}
              />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onRemoveVariation(rowIdStr)}
            >
              <DeleteIcon
                width={20}
                height={20}
                stroke="#F05252"
              />
            </IconButton>
          </Box>
        )
      }

      // For products without variations, show edit button
      const showEditButton = !row.variations || row.variations.length === 0
      const isEditing = editingProductId === row.id

      return (
        <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'center' }}>
          {showEditButton && (
            <IconButton
              size="small"
              onClick={() => onEditProduct(row.id)}
            >
              <EditIcon
                width={20}
                height={20}
                stroke={isEditing ? '#0E9F6E' : '#0E9F6E'}
              />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={() => onRemoveProduct(row.id)}
          >
            <DeleteIcon
              width={20}
              height={20}
              stroke="#F05252"
            />
          </IconButton>
        </Box>
      )
    },
  },
]


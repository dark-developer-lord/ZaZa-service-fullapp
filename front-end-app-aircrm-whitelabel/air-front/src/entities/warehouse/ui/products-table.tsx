import { FC, useState, useCallback, useMemo } from 'react'

import { GridPaginationModel, GridRowParams } from '@mui/x-data-grid'

import { DataPagination } from '@shared/api'
import { TablePagination } from '@shared/ui'

import { columns } from '../model/columns'

import {
  ProductItem
} from '../model/warehouse'
import { useMediaQuery, useTheme } from '@mui/material'
import { ProductVariationsDetail } from './product-variations-detail'

// Extended type for rows that includes variation rows
type TableRow = ProductItem & {
  isVariationRow?: boolean
  parentProductId?: number
  variationData?: NonNullable<ProductItem['variations']>[number]
}

interface Props {
  data?: DataPagination<ProductItem>
  isFetching: boolean
  paginationModel: GridPaginationModel
  changePaginationModel: (model: GridPaginationModel) => void
  Actions: FC<{ row: ProductItem }>
  StatusToggle: FC<{ row: ProductItem }>
  error?: unknown,
}

export const Table = ({
  isFetching,
  data,
  paginationModel,
  changePaginationModel,
  Actions,
  StatusToggle,
  error,
}: Props) => {

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  const [expandedRowIds, setExpandedRowIds] = useState<number[]>([])

  // Toggle row expansion
  const handleToggleRow = (rowId: number) => {
    setExpandedRowIds((prev) => {
      const newIds = prev.includes(rowId)
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
      return newIds
    })
  }

  // Transform data to include variation rows
  const tableRows = useMemo(() => {
    if (!data?.data) return []

    const rows: TableRow[] = []

    data.data.forEach((product) => {
      // Add the main product row
      rows.push(product)

      // If expanded and has variations, add variation rows
      if (expandedRowIds.includes(product.id) && product.variations && product.variations.length > 0) {
        product.variations.forEach((variation, index) => {
          rows.push({
            ...product,
            id: `${product.id}_variation_${index}` as any, // Unique ID for variation row
            isVariationRow: true,
            parentProductId: product.id,
            variationData: variation,
          })
        })
      }
    })

    return rows
  }, [data?.data, expandedRowIds])

  return (
    <TablePagination
      columns={columns({
        Actions,
        StatusToggle,
        isMobile,
        expandedRows: new Set(expandedRowIds),
        onToggleRow: handleToggleRow,
      })}
      rows={tableRows}
      loading={isFetching}
      paginationModel={paginationModel}
      rowCount={data?.meta.total || 0}
      changePaginationModel={changePaginationModel}
      pageCount={data?.meta.last_page || 0}
      error={error}
      getRowId={(row) => row.id}
      getRowClassName={(params) => {
        return (params.row as TableRow).isVariationRow ? 'variation-row' : ''
      }}
    />
  )
}

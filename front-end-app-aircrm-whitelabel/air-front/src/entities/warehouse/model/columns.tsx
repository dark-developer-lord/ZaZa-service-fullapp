import { FC } from 'react'
import { Avatar, Box, Tooltip, Typography, IconButton, Chip, Stack } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'

import {
  ProductItem,
  ArrivalItem,
  SaleItem,
  TransferItem,
  InventoryItem
} from './warehouse'

// Format date from various formats to DD MMMM YYYY
const formatDisplayDate = (dateString: string): string => {
  if (!dateString) return '-'

  let date: Date

  // Check if it's DD.MM.YYYY format
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('.')
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  }
  // Check if it's YYYY-MM-DD format
  else if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
    date = new Date(dateString)
  }
  // Try parsing as-is
  else {
    date = new Date(dateString)
  }

  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}
import { useUpdateImageStore } from './update-image-store'
import ChevronDownIcon from '@icons/chevron-down.svg?react'

interface Props {
  Actions: FC<{ row: ProductItem}>
  StatusToggle: FC<{ row: ProductItem }>
  isMobile?: boolean
  expandedRows?: Set<number>
  onToggleRow?: (rowId: number) => void
}

export const columns = ({
  Actions,
  StatusToggle,
  isMobile,
  expandedRows,
  onToggleRow,
}: Props): GridColDef<ProductItem>[] => {
  const openModal = useUpdateImageStore((state) => state.openModal)

  const columnsDesktop: GridColDef<ProductItem>[] = [
      {
        field: 'variations',
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
        field: 'image',
        headerName: 'Изображение',
        width: 90,
        renderCell: ({ row }) => (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={row.image}
              alt={row.name}
              sx={{ width: 40, height: 40, cursor: 'pointer' }}
              onClick={() => openModal(row.id)}
            />
          </Box>
        ),
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
          return row.name
        },
      },
      {
        field: 'warehouse',
        headerName: 'Склад',
        flex: 1,
        minWidth: 120,
        renderCell: ({ row }) => row.warehouse?.name
      },
      {
        field: 'category',
        headerName: 'Категория',
        flex: 1,
        minWidth: 120,
        renderCell: ({ row }) => row.category?.name
      },
      {
        field: 'subCategories',
        headerName: 'Подкатегории',
        flex: 1,
        minWidth: 120,
        renderCell: ({ row }) => {
          const subCategories = row.category?.sub_categories
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
        width: 120,
        renderCell: ({ row }: any) => {
          if (row.isVariationRow && row.variationData) {
            return `${row.variationData.sale_price} с`
          }
          return `${row.price} с`
        },
      },
      {
        field: 'quantity',
        headerName: 'Количество',
        width: 100,
        renderCell: ({ row }: any) => {
          if (row.isVariationRow && row.variationData) {
            return row.variationData.quantity
          }
          return row.quantity
        },
      },
      {
        field: 'status',
        headerName: 'Статус',
        renderCell: ({ row }: any) => {
          // Don't show status toggle for variation rows
          if (row.isVariationRow) return null
          return <StatusToggle row={row} />
        },
        width: 90,
      },
      {
        field: 'actions',
        headerName: 'Действия',
        width: 110,
        renderCell: ({ row }: any) => {
          // Don't show actions for variation rows
          if (row.isVariationRow) return null
          return <Actions row={row} />
        },
      }
    ]

  const columnsMobile: GridColDef<ProductItem>[] = [
      {
        field: 'variations',
        headerName: '',
        width: 50,
        sortable: false,
        renderCell: ({ row }) => {
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
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <ChevronDownIcon width={18} height={18} />
              </IconButton>
            </Box>
          )
        },
      },
      {
        field: 'image',
        headerName: 'Фото',
        width: 55,
        renderCell: ({ row }) => (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={row.image}
              alt={row.name}
              sx={{ width: 40, height: 40, cursor: 'pointer' }}
              onClick={() => openModal(row.id)}
            />
          </Box>
        ),
      },
      {
        field: 'name',
        headerName: 'Название',
        flex: 1,
        minWidth: 78,
      },
      {
        field: 'status',
        headerName: 'Статус',
        renderCell: ({ row }) => <StatusToggle row={row} />,
        width: 70,
      },
      {
        field: 'actions',
        headerName: 'Действия',
        width: 110,
        renderCell: ({ row }) => <Actions row={row} />,
      }
    ]

    return isMobile ? columnsMobile : columnsDesktop
}


export const arrivalColumns = (Actions: FC<{ row: ArrivalItem}>): GridColDef<ArrivalItem>[] => [
  {
    field: 'id',
    headerName: '№',
    width: 60,
  },
  {
    field: 'name',
    headerName: 'Наименование',
    flex: 1,
    minWidth: 180,
  },
  {
    field: 'status',
    headerName: 'Статус',
    minWidth: 90,
    renderCell: ({ row: { status, is_refunded } }) => (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <Stack direction="column" spacing={0.5} alignItems="center">
          <Typography
            component='span'
            fontSize={14}
            fontWeight={600}
            color={status === 'pending'
                    ? '#9A9DA3'
                    : status === 'refunded'
                    ? '#F05252'
                    : '#0E9F6E'}
          >{status === 'pending'
            ? 'Черновик'
            : status === 'refunded'
            ? 'Отменен'
            : 'Проведен'}</Typography>
          {is_refunded && (
            <Chip
              label="Возвращен"
              size="small"
              color="error"
              sx={{
                fontSize: '11px',
                height: '20px',
              }}
            />
          )}
        </Stack>
      </Box>
    )
  },
  {
    field: 'date',
    headerName: 'Дата',
    width: 150,
    renderCell: ({ row }) => formatDisplayDate(row['created_at'])
  },
  {
    field: 'warehouse',
    headerName: 'Склад',
    flex: 1,
    minWidth: 120,
    renderCell: ({ row }) => row.warehouse?.name || '-'
  },
  {
    field: 'counterparty',
    headerName: 'Поставщик',
    flex: 1,
    minWidth: 120,
    renderCell: ({ row }) => row.counterparty?.name || '-'
  },
  {
    field: 'recipient_vendor',
    headerName: 'Получатель',
    flex: 1,
    minWidth: 120,
    renderCell: ({ row }) => row.recipient_vendor?.name || '-'
  },
  {
    field: 'total_amount',
    headerName: 'Сумма',
    width: 100,
    renderCell: ({ row }) => `${row?.total_amount || 0} c.`
  },
  {
    field: 'actions',
    headerName: 'Действие',
    width: 110,
    renderCell: ({ row }) => <Actions row={row} />,
  },
]


export const saleColumns = (Actions: FC<{ row: SaleItem}>): GridColDef<SaleItem>[] => [
  {
    field: 'sale_name',
    headerName: 'Наименование',
    flex: 1,
    minWidth: 180,
    renderCell: ({ row }) => {
      // Show transfer type prefix for transfer sales
      if (row.transfer_type === 'external') {
        return `Внеш. ${row.sale_name || row.name}`
      }
      if (row.transfer_type === 'internal') {
        return `Внутр. ${row.sale_name || row.name}`
      }
      return row.sale_name || row.name
    },
  },
  {
    field: 'order_number',
    headerName: 'ID сделки',
    width: 120,
    renderCell: ({ row }) => {
      const displayNumber = row.order_number || row.order_id;
      return Intl.NumberFormat().format(Number(displayNumber));
    },
  },
  {
    field: 'status',
    headerName: 'Статус',
    minWidth: 90,
    renderCell: ({ row: { status } }) => (
      <Typography
        component='span'
        fontSize={14}
        fontWeight={600}
        color={status === 'pending' 
                ? '#9A9DA3' 
                : status === 'refunded' 
                ? '#F05252' 
                : '#0E9F6E'}
      >{status === 'pending'
        ? 'Черновик'
        : status === 'refunded'
        ? 'Отменен'
        : 'Проведен'}</Typography>
    )
  },
  {
    field: 'date',
    headerName: 'Дата',
    width: 150,
    renderCell: ({ row }) => formatDisplayDate(row['created_at'])
  },
  {
    field: 'warehouse',
    headerName: 'Склад',
    flex: 1,
    minWidth: 120
  },
  {
    field: 'name',
    headerName: 'Клиент',
    flex: 1,
    minWidth: 120
  },
  {
    field: 'products_count',
    headerName: 'Количество',
    width: 100,
  },
  {
    field: 'total_price',
    headerName: 'Сумма',
    width: 100,
    renderCell: ({ row }) => `${row?.total_price} c.`
  },
  {
    field: 'actions',
    headerName: 'Действия',
    width: 110,
    renderCell: ({ row }) => <Actions row={row} />,
  },
]

export const transferColumns = (
  Actions: FC<{ row: TransferItem}>,
  StatusDropdown: FC<{ row: TransferItem}>,
  statusHeaderName: string = 'Статус'
): GridColDef<TransferItem>[] => [
  {
    field: 'id',
    headerName: '№',
    width: 60,
  },
  {
    field: 'name',
    headerName: 'Наименование',
    flex: 1,
    minWidth: 180,
  },
  {
    field: 'status',
    headerName: statusHeaderName,
    minWidth: 180,
    width: 180,
    renderCell: ({ row }) => (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <StatusDropdown row={row} />
      </Box>
    )
  },
  {
    field: 'date',
    headerName: 'Дата',
    width: 150,
    renderCell: ({ row }) => {
      console.log('[Transfer date] created_at:', row['created_at'], 'formatted:', formatDisplayDate(row['created_at']))
      return formatDisplayDate(row['created_at'])
    }
  },
  {
    field: 'from_warehouse',
    headerName: 'Склад-отправитель',
    flex: 1,
    minWidth: 150,
    renderCell: ({ row }) => row.from_warehouse?.name || '-'
  },
  {
    field: 'to_warehouse',
    headerName: 'Склад-получатель',
    flex: 1,
    minWidth: 150,
    renderCell: ({ row }) => {
      // For internal transfers, show warehouse name
      if (row.to_warehouse?.name) {
        return row.to_warehouse.name
      }
      // For external transfers, show vendor name
      if (row.to_vendor?.name) {
        return `Получатель: ${row.to_vendor.name}`
      }
      return '-'
    }
  },
  {
    field: 'total_quantity',
    headerName: 'Количество',
    width: 100,
  },
  {
    field: 'total_sale_price',
    headerName: 'Сумма',
    width: 100,
    renderCell: ({ row }) => `${row?.total_sale_price || 0} c.`
  },
  {
    field: 'actions',
    headerName: 'Действие',
    width: 110,
    renderCell: ({ row }) => <Actions row={row} />,
  },
]

export const inventoryColumns = (Actions: FC<{ row: InventoryItem}>): GridColDef<InventoryItem>[] => [
  {
    field: 'id',
    headerName: '№',
    width: 60,
  },
  {
    field: 'name',
    headerName: 'Наименование',
    flex: 1,
    minWidth: 180,
  },
  {
    field: 'status',
    headerName: 'Статус',
    minWidth: 90,
    renderCell: ({ row: { status } }) => (
      <Typography
        component='span'
        fontSize={14}
        fontWeight={600}
        color={status === 'pending' 
                ? '#9A9DA3' 
                : status === 'refunded' 
                ? '#F05252' 
                : '#0E9F6E'}
      >{status === 'pending'
        ? 'Черновик'
        : status === 'refunded'
        ? 'Отменен'
        : 'Проведен'}</Typography>
    )
  },
  {
    field: 'date',
    headerName: 'Дата',
    width: 150,
    renderCell: ({ row }) => formatDisplayDate(row['created_at'])
  },
  {
    field: 'warehouse',
    headerName: 'Склад',
    flex: 1,
    minWidth: 120,
    renderCell: ({ row }) => row.warehouse?.name || '-'
  },
  {
    field: 'quantity',
    headerName: 'Количество',
    width: 100,
  },
  {
    field: 'total_amount',
    headerName: 'Сумма',
    width: 100,
    renderCell: ({ row }) => `${row?.total_amount || 0} c.`
  },
  {
    field: 'actions',
    headerName: 'Действие',
    width: 110,
    renderCell: ({ row }) => <Actions row={row} />,
  },
]
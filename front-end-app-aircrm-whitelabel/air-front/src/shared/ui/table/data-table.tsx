/* eslint-disable prettier/prettier */
import { Box, lighten, Typography, useMediaQuery, useTheme } from '@mui/material'
import { DataGrid, DataGridProps, GridValidRowModel } from '@mui/x-data-grid'
import { AxiosError } from 'axios'

interface Props<Data extends GridValidRowModel>
  extends Partial<DataGridProps<Data>> {
  error?: unknown
  columns: DataGridProps<Data>['columns']
  rows: DataGridProps<Data>['rows']
  // DataGrid Pro props (optional)
  getDetailPanelHeight?: any
  detailPanelExpandedRowIds?: any
  onDetailPanelExpandedRowIdsChange?: any
}

export const DataTable = <Data extends GridValidRowModel>({
  error,
  getDetailPanelContent,
  getDetailPanelHeight,
  detailPanelExpandedRowIds,
  onDetailPanelExpandedRowIdsChange,
  ...props
}: Props<Data>) => {
  const { palette } = useTheme()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  // Disable autoHeight when using detail panels (it causes issues with expansion)
  const hasDetailPanel = Boolean(getDetailPanelContent)

  return (
    <DataGrid<Data>
      autoHeight={!hasDetailPanel}
      showCellVerticalBorder={false}
      showColumnVerticalBorder={false}
      sx={{
        border: 'none',
        // Set a minimum height when detail panels are used (autoHeight is disabled)
        ...(hasDetailPanel && { minHeight: 400 }),
        '& .MuiDataGrid-columnHeaderTitle': {
          fontSize: {xs: '11px', mobile: '14px'},
        },
        '& .MuiDataGrid-row': {
          '--rowBorderColor': 'none',
          bgcolor: 'secondary.main',
          borderRadius: '16px',
          fontWeight: 600,
          fontSize: {xs: '11px', mobile: '14px'},
          height: {xs: '44px !important', mobile: '64 !important'} ,
          padding: '0 6px',
          '&:hover': {
            bgcolor: lighten(palette.primary.main, 0.92),
          },
          '&.expandable-row': {
            bgcolor: 'secondary.main',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: lighten(palette.primary.main, 0.92),
            },
          },
          '&.variation-row': {
            bgcolor: 'secondary.main',
            marginTop: '0 !important',
            borderRadius: '0',
            borderLeft: `3px solid ${palette.primary.main}`,
            '&:last-of-type': {
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
              marginBottom: '12px !important',
            },
          },
        },
        '& .MuiDataGrid-bottomContainer': {
          border: 'none',
        },
        '& .MuiDataGrid-topContainer::after': {
          display: 'none',
        },
        '& .MuiDataGrid-topContainer': {
          borderRadius: '16px',
          mb: '12px',
        },
        '& .MuiDataGrid-footerContainer': {
          justifyContent: 'center',
          mt: '24px',
          border: 'none',
        },
        '& .MuiDataGrid-columnHeaders': {
          '--DataGrid-containerBackground': palette.secondary.main,
          borderBottom: 'none',
          '& > div': {
            borderRadius: '16px',
            padding: '0 6px',
          },
        },
        '& .MuiDataGrid-columnHeader': {
          color: 'text.secondary',
          borderBottom: 'none',
          '&:focus': {
            outline: 'none',
          },
          '&:focus-within': {
            outline: 'none',
          },
        },
        '& .MuiDataGrid-columnSeparator': {
          display: 'none',
        },
        '& .MuiDataGrid-columnHeadersInner': {
          borderBottom: 'none',
        },
        '& .MuiDataGrid-withBorderColor': {
          borderColor: 'transparent',
        },
        '& .MuiDataGrid-detailPanel': {
          bgcolor: 'background.default',
          marginBottom: '12px',
          borderRadius: '16px',
        },
        '& .MuiDataGrid-detailPanelToggleCell': {
          display: 'none', // Hide default toggle cell since we have custom icon
        },
        '& .MuiDataGrid-row--detailPanelExpanded': {
          marginBottom: '0 !important',
        },
        ...props.sx,
      }}
      slotProps={{
        ...props.slotProps,
        footer: {
          ...props.slotProps?.footer,
          sx: {
            border: 'none',
            ...props.slotProps?.footer?.sx,
          },
        },
      }}
      rowHeight={isMobile ? 44 : 64}
      rowSpacingType="margin"
      getRowSpacing={() => ({ bottom: 12 })}
      hideFooterSelectedRowCount
      disableAutosize
      disableColumnFilter
      disableColumnResize
      disableColumnMenu
      getDetailPanelContent={getDetailPanelContent}
      {...(getDetailPanelHeight !== undefined && { getDetailPanelHeight } as any)}
      {...(detailPanelExpandedRowIds !== undefined && { detailPanelExpandedRowIds } as any)}
      {...(onDetailPanelExpandedRowIdsChange !== undefined && { onDetailPanelExpandedRowIdsChange } as any)}
      slots={{
        noRowsOverlay: () => {
          let message = 'Нет записей'
          if (error instanceof AxiosError) {
            message = error.response?.data.message || 'Ошибка загрузки данных'
          }
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '100px 0',
              }}
            >
              <Typography>{message}</Typography>
            </Box>
          )
        },
        ...props.slots,
      }}
      {...props}
    />
  )
}

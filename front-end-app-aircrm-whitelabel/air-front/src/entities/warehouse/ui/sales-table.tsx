import { FC } from 'react'

import { Box, Typography } from '@mui/material'
import { GridPaginationModel } from '@mui/x-data-grid'

import { DataPagination } from '@shared/api'
import { TablePagination } from '@shared/ui'

import { saleColumns } from '../model/columns'

import { SaleItem } from '../model/warehouse'

interface Props {
  data?: DataPagination<SaleItem>
  isFetching: boolean
  paginationModel: GridPaginationModel
  changePaginationModel: (model: GridPaginationModel) => void
  Actions: FC<{ row: SaleItem }>
  error?: unknown,
}

export const Table = ({
  isFetching,
  data,
  paginationModel,
  changePaginationModel,
  Actions,
  error,
}: Props) => {

  return (
    <TablePagination
      columns={saleColumns(Actions)}
      rows={data?.data}
      loading={isFetching}
      paginationModel={paginationModel}
      rowCount={data?.meta.total || 0}
      changePaginationModel={changePaginationModel}
      pageCount={data?.meta.last_page || 0}
      error={error}
      slots={{
        noRowsOverlay: () => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '100px 0',
            }}
          >
            <Typography>Нет реализации</Typography>
          </Box>
        ),
      }}
    />
  )
}

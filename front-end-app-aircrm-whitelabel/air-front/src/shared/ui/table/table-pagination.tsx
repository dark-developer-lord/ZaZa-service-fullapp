/* eslint-disable prettier/prettier */
import { Pagination } from '@mui/material'
import {
  DataGridProps,
  GridPaginationModel,
  GridValidRowModel,
} from '@mui/x-data-grid'

import { DataTable } from './data-table'

interface Props<Data extends GridValidRowModel>
  extends Partial<DataGridProps<Data>> {
  columns: DataGridProps<Data>['columns']
  rows: DataGridProps<Data>['rows']
  pageCount: number
  changePaginationModel: (model: GridPaginationModel) => void
  error?: unknown
}

export const TablePagination = <Data extends GridValidRowModel>({
  rows,
  columns,
  paginationModel,
  changePaginationModel,
  pageCount,
  slots,
  ...props
}: Props<Data>) => {
  return (
    <DataTable<Data>
      columns={columns}
      rows={rows}
      pagination
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={() => {}} // Disable DataGrid's pagination handler to prevent conflicts
      {...props}
      slots={{
        ...slots,
        pagination: () => (
          <Pagination
            count={pageCount}
            showFirstButton
            showLastButton
            page={paginationModel!.page + 1}
            siblingCount={2}
            boundaryCount={2}
            onChange={(_, page) => {
              changePaginationModel({
                pageSize: paginationModel!.pageSize,
                page: page - 1,
              })
            }}
          />
        ),
      }}
    />
  )
}

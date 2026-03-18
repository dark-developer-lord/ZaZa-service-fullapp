import { Box } from '@mui/material'

import { ExportWarehouses, WarehouseActions, StatusToggle } from '@features/warehouses'
import { WarehousesTable } from '@entities/warehouses'
import { Board, Search } from '@shared/ui'

import { useGetWarehouses } from './api/get-restaurants'
import { useStore } from './model/store'

export const Ui = () => {
  const { data, isFetching, error } = useGetWarehouses()
  const {
    paginationModel,
    setPaginationModel,
    setSearchValue,
    searchValue,
  } = useStore()

  return (
    <Board>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          mb: '24px',
        }}
      >
        <Box sx={{ minWidth: '280px', flex: '1 1 auto' }}>
          <Search
            value={searchValue}
            onChange={setSearchValue}
          />
        </Box>
        <ExportWarehouses />
      </Box>
      <WarehousesTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        error={error}
        Actions={WarehouseActions}
        StatusToggle={StatusToggle}
      />
    </Board>
  )
}

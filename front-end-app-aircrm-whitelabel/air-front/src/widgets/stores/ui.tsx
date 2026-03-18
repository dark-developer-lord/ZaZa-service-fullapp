import { Box } from '@mui/material'

import { StoresActions, StatusToggle } from '@features/store'
import { StoresTable } from '@entities/stores'
import { Board, Search } from '@shared/ui'

import { useGetStores } from './api/get-stores'
import { useStore } from './model/store'

export const Ui = () => {
  const { data, isFetching, error } = useGetStores()
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
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: '24px',
        }}
      >
        <Search
          value={searchValue}
          onChange={setSearchValue}
        />
        {/* <ExportRestaurants /> */}
      </Box>
      <StoresTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        error={error}
        Actions={StoresActions}
        StatusToggle={StatusToggle}
      />
    </Board>
  )
}

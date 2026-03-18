import { Box } from '@mui/material'

import { CourierActions, ExportCouriers } from '@features/couriers'
import { CouriersTable } from '@entities/courier'
import { Board, Search } from '@shared/ui'

import { useGetCouriers } from './api/get-couriers'
import { useStore } from './model/store'

export const Ui = () => {
  const { data, isFetching, error } = useGetCouriers()
  const {
    paginationModel,
    setPaginationModel,
    // setSearchValue,
    // searchValue,
  } = useStore()

  return (
    <Board>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          // justifyContent: 'space-between',
          justifyContent: 'flex-end',
          mb: '24px',
        }}
      >
        {/* <Search
          value={searchValue}
          onChange={setSearchValue}
        /> */}
        <ExportCouriers />
      </Box>
      <CouriersTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        error={error}
        Actions={CourierActions}
      />
    </Board>
  )
}

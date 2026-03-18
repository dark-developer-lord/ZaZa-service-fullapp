import { Box } from '@mui/material'

import { AdminActions } from '@features/admins'
import { AdminsTable } from '@entities/admin'
import { Board, Search } from '@shared/ui'

import { useGetAdmins } from './api/get-admins'
import { useStore } from './model/store'

export const Ui = () => {
  const { data, isFetching, error } = useGetAdmins()
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
      </Box>
      <AdminsTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        Actions={AdminActions}
        error={error}
      />
    </Board>
  )
}

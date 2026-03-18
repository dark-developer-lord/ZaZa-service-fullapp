import { Box } from '@mui/material'

import { AddOnActions, AddOnStatusToggle } from '@features/add-ons'
import { AddOnsTable } from '@entities/add-on'
import { Board, Search } from '@shared/ui'

import { useGetAddOns } from '../api/get-add-ons'
import { useStore } from '../model/store'

export const Main = () => {
  const { data, isFetching, error } = useGetAddOns()
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
      <AddOnsTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        Actions={AddOnActions}
        StatusToggle={AddOnStatusToggle}
        error={error}
      />
    </Board>
  )
}

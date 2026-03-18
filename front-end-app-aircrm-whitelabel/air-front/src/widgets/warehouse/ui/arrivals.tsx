import { useEffect } from 'react'
import { Box, Typography } from '@mui/material'

import { ArrivalsTable} from '@entities/warehouse'
import { Board, Search } from '@shared/ui'

import { ArrivalActions } from '@features/warehouse'

import { useGetArrivals } from '../api/get-arrivals'
import { useStore } from '../model/store'

export const Ui = () => {
  const { data, isFetching, error } = useGetArrivals()
  const {
    paginationModel,
    setPaginationModel,
    clear,
    setSearchValue,
    searchValue,
  } = useStore()

  useEffect(() => {
    return clear
  }, [clear])

  return (
    <Board>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          mb: '24px',
        }}
      >
        <Typography component="h4"
            fontSize="20px"
            fontWeight="600"
            lineHeight="24px"
        >Приход</Typography>
        <Search
          value={searchValue}
          onChange={setSearchValue}
        />
      </Box>
      <ArrivalsTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        Actions={ArrivalActions}
        error={error}
      />
    </Board>
  )
}

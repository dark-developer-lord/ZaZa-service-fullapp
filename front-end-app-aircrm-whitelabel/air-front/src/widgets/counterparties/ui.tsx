import { Box } from '@mui/material'

import { CounterpartiesTable } from '@entities/counterparty'
import { Board, Search } from '@shared/ui'

import { useGetCounterparties } from './api/get-counterparties'
import { useStore } from './model/store'
import { CounterpartyActions } from '@features/counterparties'

export const Ui = () => {
  const { data, isFetching, error } = useGetCounterparties()
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
      </Box>
      <CounterpartiesTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        Actions={CounterpartyActions}
        error={error}
      />
    </Board>
  )
}


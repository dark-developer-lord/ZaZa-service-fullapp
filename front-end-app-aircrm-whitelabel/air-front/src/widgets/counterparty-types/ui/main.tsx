import { Box } from '@mui/material'

import { 
  CounterpartyTypesSearch,
  CounterpartyTypeActions,
} from '@features/counterparty-types'
import { CounterpartyTypesTable } from '@entities/counterparty-type'
import { Board } from '@shared/ui'

import { useGetCounterpartyTypes } from '../api/get-counterparty-types'
import { useStore } from '../model/store'

export const Main = () => {
  const { data, isFetching, error } = useGetCounterpartyTypes()
  const {
    paginationModel,
    setPaginationModel,
    search,
    searchValue,
  } = useStore((state) => ({
    paginationModel: state.paginationModel,
    setPaginationModel: state.setPaginationModel,
    searchValue: state.searchValue,
    search: state.setSearchValue,
  }))
  
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
        <CounterpartyTypesSearch
          value={searchValue}
          onChange={search}
        />
      </Box>
      <CounterpartyTypesTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        Actions={CounterpartyTypeActions}
        error={error}
      />
    </Board>
  )
}


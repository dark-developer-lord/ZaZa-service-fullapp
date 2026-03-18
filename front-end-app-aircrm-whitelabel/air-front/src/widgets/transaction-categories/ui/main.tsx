import { useEffect } from 'react'
import { Box } from '@mui/material'

import { 
  TransactionCategoriesSearch,
  TransactionCategoryActions,
} from '@features/transaction-categories'
import { TransactionCategoriesTable } from '@entities/transaction-category'
import { Board } from '@shared/ui'

import { useGetCategories } from '../api/get-categories'
import { useStore } from '../model/store'

export const Main = () => {
  const { data, isFetching, error } = useGetCategories()
  const {
    paginationModel,
    setPaginationModel,
    clearState,
    search,
    searchValue,
  } = useStore((state) => ({
    paginationModel: state.paginationModel,
    setPaginationModel: state.setPaginationModel,
    searchValue: state.searchValue,
    search: state.setSearchValue,
    clearState: state.clear,
  }))

  useEffect(() => {
    return clearState
  }, [clearState])
  
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
        <TransactionCategoriesSearch
          value={searchValue}
          onChange={search}
        />
      </Box>
      <TransactionCategoriesTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        Actions={TransactionCategoryActions}
        // PrioritySelect={PriorityCategorySelect}
        // StatusToggle={CategoryStatusToggle}
        error={error}
      />
    </Board>
  )
}

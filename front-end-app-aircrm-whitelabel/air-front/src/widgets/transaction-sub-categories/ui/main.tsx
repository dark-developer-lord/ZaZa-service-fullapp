import { useEffect } from 'react'
import { Box } from '@mui/material'

import { 
  TransactionSubCategoriesSearch, 
  TransactionSubCategoryActions 
} from '@features/transaction-sub-categories'
import { TransactionSubCategoriesTable } from '@entities/transaction-sub-categories'
import { Board } from '@shared/ui'

import { useGetSubCategories } from '../api/get-sub-categories'
import { useStore } from '../model/store'

export const Main = () => {
  const { data, isFetching, error } = useGetSubCategories()
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
        <TransactionSubCategoriesSearch
          value={searchValue}
          onChange={search}
        />
      </Box>
      <TransactionSubCategoriesTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        Actions={TransactionSubCategoryActions}
        error={error}
      />
    </Board>
  )
}

import { useEffect } from 'react'
import { Box } from '@mui/material'

import {
  CategoriesSearch,
  CategoryStatusToggle,
  PriorityCategorySelect,
} from '@features/categories'
import { SubCategoryActions } from '@features/sub-categories'
import { SubCategoriesTable } from '@entities/sub-category'
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
        <CategoriesSearch
          value={searchValue}
          onChange={search}
        />
        {/*<ExportCategories />*/}
      </Box>
      <SubCategoriesTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        Actions={SubCategoryActions}
        PrioritySelect={PriorityCategorySelect}
        StatusToggle={CategoryStatusToggle}
        error={error}
      />
    </Board>
  )
}

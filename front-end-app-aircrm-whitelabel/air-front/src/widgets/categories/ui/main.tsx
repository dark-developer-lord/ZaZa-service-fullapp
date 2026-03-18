/* eslint-disable prettier/prettier */
import { Box } from '@mui/material'

import {
  CategoriesSearch,
  CategoryActions,
  CategoryStatusToggle,
  PriorityCategorySelect,
} from '@features/categories'
import { CategoriesTable } from '@entities/category'
import { Board } from '@shared/ui'

import { useGetCategories } from '../api/get-categories'
import { useStore } from '../model/store'

export const Main = () => {
  const { data, isFetching, error } = useGetCategories()
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
        <CategoriesSearch
          value={searchValue}
          onChange={search}
        />
      </Box>
      <CategoriesTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        Actions={CategoryActions}
        PrioritySelect={PriorityCategorySelect}
        StatusToggle={CategoryStatusToggle}
        error={error}
      />
    </Board>
  )
}

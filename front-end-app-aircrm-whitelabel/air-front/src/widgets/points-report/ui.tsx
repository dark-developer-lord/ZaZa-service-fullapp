import { Box } from '@mui/material'

import { CategoriesSearch, ExportCategories } from '@features/categories'
import { PointsReportTable } from '@entities/points-report'
import { Board } from '@shared/ui'

import { useGetPointsReport } from './api/get-points-report'
import { useStore } from './model/store'

export const Ui = () => {
  const { data, isFetching, error } = useGetPointsReport()
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
        <CategoriesSearch
          value={searchValue}
          onChange={setSearchValue}
        />
        <ExportCategories />
      </Box>
      <PointsReportTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        error={error}
      />
    </Board>
  )
}

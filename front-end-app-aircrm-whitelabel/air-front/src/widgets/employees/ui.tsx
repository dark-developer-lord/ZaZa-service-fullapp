import { Box } from '@mui/material'

import { EmployeeActions } from '@features/employees'
import { EmployeesTable } from '@entities/employee'
import { Board, Search } from '@shared/ui'

import { useGetEmployees } from './api/get-employees'
import { useStore } from './model/store'

export const Ui = () => {
  const { data, isFetching, error } = useGetEmployees()
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
      <EmployeesTable
        data={data as any}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        Actions={EmployeeActions}
        error={error}
      />
    </Board>
  )
}

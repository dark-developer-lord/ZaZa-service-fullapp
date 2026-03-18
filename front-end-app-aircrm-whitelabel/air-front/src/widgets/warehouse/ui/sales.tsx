import { useEffect } from 'react'
import { Box, Stack, Typography } from '@mui/material'

import { CreateReportButton } from '@features/warehouse'
import { SaleActions } from '@features/sale'
import { SalesTable } from '@entities/warehouse'
import { Board, Search } from '@shared/ui'

import { useGetSales } from '../api/get-sales'
import { useSaleStore } from '../model/sales-store'

export const Ui = () => {
  const { data, isFetching, error } = useGetSales()
  const {
    paginationModel,
    setPaginationModel,
    clear,
    setSearchValue,
    searchValue,
  } = useSaleStore()

  useEffect(() => {
    return clear
  }, [clear])

  return (
    <Board>
        <Typography component="h4"
            fontSize="20px"
            fontWeight="600"
            lineHeight="24px"
            mb="24px"
            textAlign="center"
        >Реализация</Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          mb: '24px',
        }}
      >
        <Search
          value={searchValue}
          onChange={setSearchValue}
        />
        {/* <Stack
          flexDirection="row"
          gap={2}
        >
            <CreateReportButton path={''} />
        </Stack> */}
      </Box>
        <SalesTable
            data={data}
            isFetching={isFetching}
            paginationModel={paginationModel}
            changePaginationModel={setPaginationModel}
            Actions={SaleActions}
            error={error}
        />
    </Board>
  )
}

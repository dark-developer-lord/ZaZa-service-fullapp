import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, Stack } from '@mui/material'

import { CustomerActions, ExportCustomers } from '@features/customers'
import { ImportCustomers } from '@features/customers/import'
import { CustomerTemplateButton } from '@features/customers/export-template'
import { CustomersTable } from '@entities/customer'
import { Board, Search } from '@shared/ui'
import { useAIAdvisorStore } from '@features/ai-advisor'

import { useGetCustomers } from './api/get-customers'
import { useStore } from './model/store'

export const Ui = () => {
  const [searchParams] = useSearchParams()
  const activeActionUrl = useAIAdvisorStore((state) => state.activeActionUrl)
  const { data, isFetching, error } = useGetCustomers(activeActionUrl)
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

  const activeFilter = searchParams.get('filter')
  const viewType = activeFilter === 'call_results' ? 'call_results' : 'default'

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
        <Stack
          flexDirection="row"
          gap={2}
          sx={{ flexWrap: 'wrap' }}
        >
          <ImportCustomers />
          <CustomerTemplateButton />
          <ExportCustomers />
        </Stack>
      </Box>
      <CustomersTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        Actions={CustomerActions}
        error={error}
        viewType={viewType}
      />
    </Board>
  )
}

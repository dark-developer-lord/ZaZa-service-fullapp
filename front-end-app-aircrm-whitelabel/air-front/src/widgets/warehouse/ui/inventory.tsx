import { useEffect } from 'react'
import { Box, Typography } from '@mui/material'

import { CreateReportButton } from '@features/warehouse'
import { InventoryTable } from '@entities/warehouse'
import { Board, Search } from '@shared/ui'

import { useGetInventory } from '../api/get-inventory'
import { useInventoryStore } from '../model/inventory-store'

// Placeholder Actions component - replace with actual actions when ready
const InventoryActions = ({ row }: { row: any }) => {
  return <Box>Actions</Box>
}

export const Ui = () => {
  const { data, isFetching, error } = useGetInventory()
  const {
    paginationModel,
    setPaginationModel,
    clear,
    setSearchValue,
    searchValue,
  } = useInventoryStore()

  useEffect(() => {
    return clear
  }, [clear])

  return (
    <Board>
      <Typography 
        component="h4"
        fontSize="20px"
        fontWeight="600"
        lineHeight="24px"
        mb="24px"
        textAlign="center"
      >
        Списание
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '8px',
          mb: '24px',
        }}
      >
        <Search
          value={searchValue}
          onChange={setSearchValue}
        />
        <CreateReportButton path={''} text="Создать" />
      </Box>
      <InventoryTable
        data={data}
        isFetching={isFetching}
        paginationModel={paginationModel}
        changePaginationModel={setPaginationModel}
        Actions={InventoryActions}
        error={error}
      />
    </Board>
  )
}


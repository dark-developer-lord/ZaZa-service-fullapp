import { useState } from 'react'
import { Box } from '@mui/material'

import { AttributeActions } from '@features/attributes'
import { AttributesTable, useGetAttributes } from '@entities/attribute'
import { Board, Search } from '@shared/ui'

export const Ui = () => {
  const { data, isFetching, error } = useGetAttributes()
  const [searchValue, setSearchValue] = useState('')

  const filteredData = data?.data.filter((row) => {
    return row.name.toLowerCase().includes(searchValue.toLowerCase())
  })

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
      <AttributesTable
        loading={isFetching}
        rows={filteredData || []}
        Actions={AttributeActions}
        error={error}
      />
    </Board>
  )
}

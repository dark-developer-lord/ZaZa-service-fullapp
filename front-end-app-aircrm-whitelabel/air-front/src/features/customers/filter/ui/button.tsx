import { Box, Button, useTheme } from '@mui/material'

import FilterIcon from '@icons/filter.svg?react'

import { useCustomerFilterStore } from '../model/store'

export const FilterButton = () => {
  const { palette } = useTheme()
  const { openFilter, orderType } = useCustomerFilterStore()

  const isActive = orderType !== 'general'

  return (
    <Button
      color="secondary"
      size="medium"
      startIcon={
        <FilterIcon
          width={20}
          height={20}
          stroke={isActive ? palette.primary.main : palette.text.primary}
        />
      }
      endIcon={
        isActive && (
          <Box
            width={8}
            height={8}
            borderRadius="50%"
            bgcolor="primary.main"
            mr={0.5}
          />
        )
      }
      onClick={openFilter}
      sx={{
        color: isActive ? 'primary.main' : 'text.primary',
      }}
    >
      Фильтр
    </Button>
  )
}

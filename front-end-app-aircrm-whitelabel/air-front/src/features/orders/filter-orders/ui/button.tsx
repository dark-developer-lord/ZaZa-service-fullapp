import { Box, Button, useTheme } from '@mui/material'
import { Dayjs } from 'dayjs'

import FilterIcon from '@icons/filter.svg?react'

import { useOrdersFilterStore } from '../index'

export const ToggleButton = () => {
  const { palette } = useTheme()
  const state = useOrdersFilterStore()

  const isActive =
    Boolean(state.restaurantId) ||
    state.statuses.length > 0 ||
    (state.date[0] as Dayjs | null) ||
    (state.date[1] as Dayjs | null)

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
      onClick={state.openFilter}
      sx={{
        color: isActive ? 'primary.main' : 'text.primary',
      }}
    >
      Фильтр
    </Button>
  )
}

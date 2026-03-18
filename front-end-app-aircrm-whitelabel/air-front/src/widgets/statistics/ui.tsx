import { Box, Typography } from '@mui/material'

import { StatisticsDropdown } from '@features/statistics-dropdown'
import { StatisticList } from '@entities/statistics'
import { Board } from '@shared/ui'

export const Ui = () => {
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
        <Typography variant="h5">Статистика заказов</Typography>
        <StatisticsDropdown />
      </Box>
      <StatisticList />
    </Board>
  )
}

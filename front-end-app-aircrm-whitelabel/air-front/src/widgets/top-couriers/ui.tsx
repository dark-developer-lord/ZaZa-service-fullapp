import { Typography } from '@mui/material'

import { useStatisticStore } from '@features/statistics-dropdown'
import { TopCourierList } from '@entities/courier'
import { Board } from '@shared/ui'

export const Ui = () => {
  const activeKey = useStatisticStore((state) => state.activeKey)
  return (
    <Board sx={{ height: 'auto' }}>
      <Typography
        variant="h5"
        component="h2"
      >
        Топ курьеров
      </Typography>
      <TopCourierList
        activeKey={activeKey !== 'all_time' ? activeKey : undefined}
      />
    </Board>
  )
}

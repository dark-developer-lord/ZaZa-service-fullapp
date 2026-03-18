import { Typography } from '@mui/material'

import { useStatisticStore } from '@features/statistics-dropdown'
import { TopOperatorList } from '@entities/operator'
import { Board } from '@shared/ui'

export const Ui = () => {
  const activeKey = useStatisticStore((state) => state.activeKey)

  return (
    <Board sx={{ height: '100%' }}>
      <Typography
        variant="h5"
        component="h2"
      >
        Топ операторов
      </Typography>
      <TopOperatorList
        activeKey={activeKey !== 'all_time' ? activeKey : undefined}
      />
    </Board>
  )
}

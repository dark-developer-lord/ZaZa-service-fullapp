import { Link } from 'react-router-dom'
import { Box, IconButton, Typography, useTheme } from '@mui/material'

import { LastOrderList } from '@entities/orders'
import { Board } from '@shared/ui'
import ArrowLinkIcon from '@icons/arrow-link.svg?react'

export const Ui = () => {
  const { palette } = useTheme()

  return (
    <Board sx={{ height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h5"
          component="h2"
        >
          Последние заказы
        </Typography>
        <IconButton
          component={Link}
          to="/orders"
        >
          <ArrowLinkIcon
            width={24}
            height={24}
            stroke={palette.text.secondary}
          />
        </IconButton>
      </Box>
      <LastOrderList />
    </Board>
  )
}

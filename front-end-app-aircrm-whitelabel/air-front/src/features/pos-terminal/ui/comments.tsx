import { Box, Typography } from '@mui/material'

import { Board } from '@shared/ui'

import { InputComment } from './select-customer/input-comment'
import { InputCommentRestaurant } from './select-customer/input-comment-restaurant'

export const OrderComments = () => {
  return (
    <Board>
      <Typography
        variant="h6"
        sx={{ mb: '12px' }}
      >
        Коментарии
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gridGap: '12px',
        }}
      >
        <InputComment />
        <InputCommentRestaurant />
      </Box>
    </Board>
  )
}

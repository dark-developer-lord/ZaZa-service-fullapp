import { Link } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'

import { RouterPaths } from '@shared/lib'

export const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
      >
        404: Заказ не найден
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
      >
        К сожалению, мы не можем найти запрашиваемый заказ.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={RouterPaths.orders}
      >
        Вернуться к списку заказов
      </Button>
    </Box>
  )
}

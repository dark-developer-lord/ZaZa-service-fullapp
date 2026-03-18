import { RegisterForm } from '@features/auth/register'
import { Box, Button, Typography } from '@mui/material'

import { Link } from 'react-router-dom'
export const Ui = () => {
  return (
    <Box
      sx={{
        borderRadius: 2,
        padding: 3,
        bgcolor: '#fff'
      }}
      width={500}
    >
      <div style={{
        margin: '0 0 24px',
        textAlign: 'center',
      }}>
        <img
          src='/images/air-crm-logo.svg'
          alt='logo'
          width={180}
          style={{ verticalAlign: 'top' }}
        />
      </div>
      <Typography
        variant="h4"
        textAlign="center"
        mb={4}
      >
        Регистрация магазина
      </Typography>
      <RegisterForm/>
      <Button
        component={Link}
        to='/auth/login'
        variant='text'
        sx={{
          borderRadius: '8px',
          display: 'flex',
          width: 'fit-content',
          margin: '16px auto',
        }}
        >
        Назад
      </Button>
    </Box>
  )
}

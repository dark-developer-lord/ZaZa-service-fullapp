import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import { SaasRegisterForm } from '@features/auth/saas-register'

export const Page = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <Box
        sx={{
          borderRadius: 2,
          padding: 3,
          bgcolor: '#fff',
        }}
        width={500}
      >
        <div
          style={{
            margin: '0 0 24px',
            textAlign: 'center',
          }}
        >
          <img
            src="/images/air-crm-logo.svg"
            alt="logo"
            width={180}
            style={{ verticalAlign: 'top' }}
          />
        </div>

        <Typography variant="h4" textAlign="center" mb={4}>
          Регистрация SaaS аккаунта
        </Typography>

        <SaasRegisterForm />

        <Button
          component={Link}
          to="/auth/saas/login"
          variant="text"
          sx={{
            borderRadius: '8px',
            display: 'flex',
            width: 'fit-content',
            margin: '16px auto 4px',
          }}
        >
          Уже есть аккаунт? Войти
        </Button>
      </Box>
    </Box>
  )
}

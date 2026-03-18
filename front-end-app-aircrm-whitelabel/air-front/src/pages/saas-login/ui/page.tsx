import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import { SaasLoginForm } from '@features/auth/saas-login'

export const Page = () => {
  return (
    <Box
      sx={{
        height: '100vh',
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

        <Typography
          variant="h4"
          textAlign="center"
          mb={4}
        >
          SaaS вход
        </Typography>

        <SaasLoginForm />

        <Button
          component={Link}
          to="/auth/saas/register"
          variant="text"
          sx={{
            borderRadius: '8px',
            display: 'flex',
            width: 'fit-content',
            margin: '16px auto',
          }}
        >
          Самостоятельная регистрация
        </Button>

        <Button
          component={Link}
          to="/auth/login"
          variant="text"
          sx={{
            borderRadius: '8px',
            display: 'flex',
            width: 'fit-content',
            margin: '4px auto',
          }}
        >
          Вход для admin/vendor
        </Button>
      </Box>
    </Box>
  )
}

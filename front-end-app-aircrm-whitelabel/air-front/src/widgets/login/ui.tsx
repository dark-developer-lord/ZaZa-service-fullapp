import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from '@mui/material'

import { LoginForm } from '@features/auth'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import TelegramIcon from '@mui/icons-material/Telegram'
export const Ui = () => {
  const [openSupport, setOpenSupport] = useState(false)
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
        Вход в систему
      </Typography>
      <LoginForm/>
      <Button
        variant="text"
        onClick={() => setOpenSupport(true)}
        sx={{
          borderRadius: '8px',
          display: 'flex',
          width: 'fit-content',
          margin: '10px auto',
        }}
      >
        Связаться с поддержкой
      </Button>
      <Button
        component={Link}
        to='/auth/saas/login'
        variant='text'
        sx={{
          borderRadius: '8px',
          display: 'flex',
          width: 'fit-content',
          margin: '10px auto',
        }}
      >
        SaaS вход
      </Button>
      <Button
        component={Link}
        to='/auth/register'
        variant='text'
        sx={{
          borderRadius: '8px',
          display: 'flex',
          width: 'fit-content',
          margin: '10px auto',
        }}
      >
        Регистрация магазина
      </Button>
      <Button
        component={Link}
        to='/auth/delivery-man/login'
        variant='text'
        sx={{
          borderRadius: '8px',
          display: 'flex',
          width: 'fit-content',
          margin: '10px auto',
        }}
        >
        Вход для курьера
      </Button>
      <Button
        component={Link}
        to='/auth/employee/login'
        variant='text'
        sx={{
          borderRadius: '8px',
          display: 'flex',
          width: 'fit-content',
          margin: '10px auto',
        }}
      >
        Вход для сотрудников
      </Button>
      <Dialog open={openSupport} onClose={() => setOpenSupport(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Свяжитесь с нами</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<TelegramIcon />}
                onClick={() => window.open('https://t.me/airecosystems', '_blank')}
              >
                Telegram
              </Button>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSupport(false)} color="secondary">
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  )
}

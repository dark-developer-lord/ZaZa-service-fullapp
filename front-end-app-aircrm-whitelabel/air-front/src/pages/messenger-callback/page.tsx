import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Box, Button, CircularProgress, Typography, Stack } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

export const Page = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const status = searchParams.get('status')
  const message = searchParams.get('message')
  const isSuccess = status === 'success'

  // Auto-redirect to /chats?tab=channels after 3 s on success
  useEffect(() => {
    if (isSuccess) {
      const t = setTimeout(() => navigate('/chats?tab=channels', { replace: true }), 3000)
      return () => clearTimeout(t)
    }
  }, [isSuccess, navigate])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack spacing={3} alignItems="center" sx={{ maxWidth: 400, textAlign: 'center', p: 3 }}>
        {isSuccess ? (
          <CheckCircleOutlineIcon sx={{ fontSize: 72, color: 'success.main' }} />
        ) : status ? (
          <ErrorOutlineIcon sx={{ fontSize: 72, color: 'error.main' }} />
        ) : (
          <CircularProgress size={72} />
        )}

        <Typography variant="h5" fontWeight={700}>
          {isSuccess
            ? 'Успешно подключено!'
            : status
            ? 'Ошибка подключения'
            : 'Подключение...'}
        </Typography>

        {message && (
          <Typography color="text.secondary">{message}</Typography>
        )}

        {isSuccess && (
          <Typography variant="body2" color="text.secondary">
            Переход в раздел Каналы через несколько секунд…
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={() => navigate('/chats?tab=channels', { replace: true })}
        >
          Перейти в Каналы
        </Button>
      </Stack>
    </Box>
  )
}

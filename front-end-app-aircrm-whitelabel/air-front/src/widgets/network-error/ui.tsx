import { Button, Stack, Typography } from '@mui/material'

export const Ui = () => {
  return (
    <Stack
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100vh',
      }}
      rowGap={2}
    >
      <Typography variant="h1">Проблема подключение с интернетом</Typography>
      <Button
        size="large"
        onClick={() => window.location.reload()}
      >
        Обновить
      </Button>
    </Stack>
  )
}

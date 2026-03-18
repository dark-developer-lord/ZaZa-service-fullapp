import { Box, Typography } from '@mui/material'

export const Page = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Typography variant="h3">404</Typography>
      <Typography variant="h4">Страница не найдено</Typography>
    </Box>
  )
}

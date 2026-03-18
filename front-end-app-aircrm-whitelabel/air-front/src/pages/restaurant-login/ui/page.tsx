import { Box } from '@mui/material'

import { Login } from '@widgets/login'

export const Page = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Login />
    </Box>
  )
}

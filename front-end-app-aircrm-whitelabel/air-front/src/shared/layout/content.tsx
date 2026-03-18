import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

export const Content = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  // Reset scroll position to the top on every route change so the new
  // page always starts at the top — eliminates the "jerk" users see.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <Box
      ref={scrollRef}
      sx={{
        height: '100vh',
        overflow: 'auto',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '0 auto',
        padding: {
          xs: '24px 8px',
          mobile: '32px 32px 32px 0'
        },
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mb: '32px',
          width: '100%',
        }}
      >
        <Outlet />
      </Box>
      <Typography
        textAlign="center"
        mt="auto"
        mb="auto"
        color="gray"
      >
        &copy; Air {new Date().getFullYear()}
      </Typography>
    </Box>
  )
}


import { Box, CircularProgress } from '@mui/material'

/**
 * Shown by <Suspense> while a lazy chunk/data resolves.
 * Renders inline inside the content column (not as a fixed overlay)
 * so the sidebar stays visible and there's no full-screen flash.
 */
export const PageLoader = () => {
  return (
    <Box
      width="100%"
      minHeight="60vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress size={36} />
    </Box>
  )
}


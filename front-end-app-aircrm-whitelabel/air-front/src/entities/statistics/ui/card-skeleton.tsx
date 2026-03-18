import { Box, Paper, Skeleton } from '@mui/material'

export const CardSkeleton = () => {
  return (
    <Paper
      sx={{
        padding: '20px',
        bgcolor: 'grey.100',
        position: 'relative',
        borderRadius: '20px',
      }}
      elevation={0}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          mb: '16px',
        }}
      >
        <Skeleton
          variant="circular"
          width={44}
          height={44}
        />
      </Box>
      <Skeleton
        variant="text"
        width="70%"
        height={32}
      />
      <Skeleton
        variant="text"
        width="60%"
      />
    </Paper>
  )
}

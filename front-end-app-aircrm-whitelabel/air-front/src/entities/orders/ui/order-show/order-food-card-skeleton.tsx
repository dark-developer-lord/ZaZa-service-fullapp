import { Box, Skeleton, Stack } from '@mui/material'

export const OrderFoodCardSkeleton = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Skeleton
        variant="rectangular"
        width={112}
        height={112}
        sx={{ borderRadius: '12px', flexShrink: 0 }}
      />
      <Stack
        spacing="8px"
        sx={{ width: '100%', marginLeft: '12px', marginRight: '12px' }}
      >
        <Skeleton
          height={24}
          variant="rounded"
          width="60%"
        />
        <Skeleton
          variant="rounded"
          width="50%"
          height={20}
        />
        <Skeleton
          variant="rounded"
          width="40%"
          height={20}
        />
      </Stack>
      <Skeleton
        variant="rounded"
        width="40%"
        height={28}
      />
    </Box>
  )
}

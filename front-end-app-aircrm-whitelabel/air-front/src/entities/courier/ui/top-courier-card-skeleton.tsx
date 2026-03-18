import { Skeleton, Stack } from '@mui/material'

export const TopCourierCardSkeleton = () => {
  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      padding="10px 16px"
      width="100%"
      bgcolor="grey.100"
      borderRadius="16px"
    >
      <Skeleton
        variant="circular"
        width={44}
        height={44}
      />
      <Stack
        spacing={0.1}
        flex={2}
      >
        <Skeleton
          variant="text"
          width="80%"
        />
        <Skeleton
          variant="text"
          width="100%"
        />
      </Stack>
      <Stack
        spacing={0.5}
        alignItems="flex-end"
        width="40%"
      >
        <Skeleton
          variant="text"
          width="40%"
        />
        <Skeleton
          variant="text"
          width="70%"
        />
      </Stack>
    </Stack>
  )
}

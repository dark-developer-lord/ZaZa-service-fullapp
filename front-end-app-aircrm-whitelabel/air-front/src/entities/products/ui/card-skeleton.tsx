import {
  Card as MuiCard,
  CardActions,
  CardContent,
  Skeleton,
} from '@mui/material'

export const CardSkeleton = () => {
  return (
    <MuiCard>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={112}
        sx={{ borderRadius: '12px', mb: '8px' }}
      />
      <CardContent>
        <Skeleton
          variant="text"
          width="60%"
          height={20}
        />
        <Skeleton
          variant="text"
          width="35%"
          height={16}
        />
      </CardContent>
      <CardActions>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={32}
          sx={{ borderRadius: '12px' }}
        />
      </CardActions>
    </MuiCard>
  )
}

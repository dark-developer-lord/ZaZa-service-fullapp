import { Box, Chip, Skeleton, Typography } from '@mui/material'

interface Props {
  isLoading: boolean
  label: string
  value?: number
}

export const StatisticTotal = ({ isLoading, label, value }: Props) => {
  return (
    <Box
      sx={{
        bgcolor: 'grey.200',
        borderRadius: '12px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 16px',
        width: 'fit-content',
      }}
    >
      <Typography
        // variant="xs"
        fontWeight={600}
      >
        {label}
      </Typography>
      {isLoading ? (
        <Skeleton width={60} />
      ) : (
        <Chip
          label={`${Number(value).toFixed(2)} сомони`}
          sx={{ bgcolor: 'white' }}
          size="small"
        />
      )}
    </Box>
  )
}
